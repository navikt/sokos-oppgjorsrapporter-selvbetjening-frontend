import type { APIRoute } from 'astro';
import { oppgjorsrapporterApiUrl } from '@src/utils/server/urls';
import logger from '@utils/logger.ts';
import { getOboToken } from '@utils/server/token.ts';

export const GET: APIRoute = async ({ url, locals }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');

  const token = locals.token;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const oboToken = await getOboToken(token);

  if (!id || !type) {
    return new Response(
      JSON.stringify({ error: 'Mangler rapport id eller type' }),
      {
        status: 400,
      },
    );
  }

  try {
    let content: Blob;
    if (type === 'pdf') {
      content = await hentRapportPdf(Number(id), oboToken);
    } else if (type === 'csv') {
      content = await hentRapportCsv(Number(id), oboToken);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid type' }), {
        status: 400,
      });
    }

    const headers = new Headers();
    if (type === 'pdf') {
      headers.set('Content-Type', 'application/pdf');
    } else if (type === 'csv') {
      headers.set('Content-Type', 'text/csv');
    }
    return new Response(content, { headers });
  } catch (error) {
    logger.error('Failed to fetch rapport innhold');
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
    });
  }
};

async function hentRapportPdf(id: number, token: string): Promise<Blob> {
  const response = await fetch(`${oppgjorsrapporterApiUrl}/${id}/innhold`, {
    method: 'GET',
    headers: {
      Accept: 'application/pdf',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch PDF');
  return await response.blob();
}

async function hentRapportCsv(id: number, token: string): Promise<Blob> {
  const response = await fetch(`${oppgjorsrapporterApiUrl}/${id}/innhold`, {
    method: 'GET',
    headers: {
      Accept: 'text/csv',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch CSV');
  return await response.blob();
}
