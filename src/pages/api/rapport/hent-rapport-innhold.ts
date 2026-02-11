import type { APIRoute } from 'astro';
import { oppgjorsrapporterApiUrl } from '@utils/server/urls.ts';
import logger from '@utils/logger.ts';
import { exchangeCitizenToken } from '@utils/server/token.ts';

export const GET: APIRoute = async ({ url, locals }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');

  const citizenToken = locals.token;
  if (!citizenToken) {
    return new Response(JSON.stringify({ error: 'Mangler borger token' }), {
      status: 401,
    });
  }

  const tokenXToken = await exchangeCitizenToken(citizenToken);

  if (!id || !type) {
    return new Response(
      JSON.stringify({ error: 'Mangler rapport id eller type' }),
      { status: 400 },
    );
  }

  if (type !== 'pdf' && type !== 'csv') {
    return new Response(JSON.stringify({ error: 'Ugyldig type' }), {
      status: 400,
    });
  }

  const backendUrl = `${oppgjorsrapporterApiUrl}/${id}/innhold`;
  const accept = type === 'pdf' ? 'application/pdf' : 'text/csv';

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Accept: accept,
        Authorization: `Bearer ${tokenXToken}`,
      },
    });

    if (!response.ok) {
      logger.error({
        msg: 'Failed to fetch rapport innhold',
        id,
        type,
        status: response.status,
        statusText: response.statusText,
        url: backendUrl,
      });

      return new Response(
        JSON.stringify({ error: 'Feil ved henting av rapport' }),
        {
          status: response.status,
        },
      );
    }

    const blob = await response.blob();
    return new Response(blob, {
      headers: { 'Content-Type': accept },
    });
  } catch (error) {
    logger.error({
      msg: 'Feil ved henting av rapport innhold',
      id,
      type,
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });

    return new Response(JSON.stringify({ error: 'Teknisk feil' }), {
      status: 500,
    });
  }
};
