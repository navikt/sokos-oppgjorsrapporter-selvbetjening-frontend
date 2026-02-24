import type { APIRoute } from 'astro';
import { oppgjorsrapporterApiUrl } from '@utils/server/urls.ts';
import logger from '@utils/logger.ts';
import { exchangeCitizenToken } from '@utils/server/token.ts';

export const GET: APIRoute = async ({ url, params, locals }) => {
  const id = params.rapportId;
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
      JSON.stringify({ error: 'Mangler rapport rapportId eller type' }),
      { status: 400 },
    );
  }

  if (type !== 'pdf' && type !== 'csv') {
    return new Response(JSON.stringify({ error: 'Ugyldig rapport type' }), {
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
      logger.error(
        `Http feil med status ${response.status} ved henting av rapport innhold for id=${id} og type=${type}`,
      );

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
  } catch (error: any) {
    logger.error(
      `Feil ved henting av rapport innhold for id=${id} og type=${type}: ${error.message}`,
      error,
    );
    return new Response(JSON.stringify({ error: 'Teknisk feil' }), {
      status: 500,
    });
  }
};
