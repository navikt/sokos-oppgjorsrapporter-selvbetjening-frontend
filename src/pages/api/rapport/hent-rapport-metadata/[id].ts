import type { APIRoute } from 'astro';
import { oppgjorsrapporterApiUrl } from '@utils/server/urls.ts';
import logger from '@utils/logger.ts';
import { exchangeCitizenToken } from '@utils/server/token.ts';
import type { RapportDTO } from '@src/schemas/types.ts';

export const GET: APIRoute = async ({ params, locals }) => {
  const id = params.id;

  const citizenToken = locals.token;
  if (!citizenToken) {
    return new Response(JSON.stringify({ error: 'Mangler borger token' }), {
      status: 401,
    });
  }

  const tokenXToken = await exchangeCitizenToken(citizenToken);

  if (!id) {
    return new Response(JSON.stringify({ error: 'Mangler rapport id' }), {
      status: 400,
    });
  }
  try {
    const metadata = await hentRapportMetadata(Number(id), tokenXToken);
    return new Response(JSON.stringify(metadata), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Feil ved henting av rapport metadata for rapport id: ' + id);
    return new Response(JSON.stringify({ error: 'Feil ved henting' }), {
      status: 500,
    });
  }
};

async function hentRapportMetadata(
  id: number,
  token: string,
): Promise<RapportDTO> {
  const response = await fetch(`${oppgjorsrapporterApiUrl}/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Feil ved henting av rapport metadata');
  return await response.json();
}
