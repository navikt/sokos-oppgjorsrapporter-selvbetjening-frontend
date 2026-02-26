import type { APIRoute } from 'astro';
import { oppgjorsrapporterApiUrl } from '@utils/server/urls.ts';
import logger from '@utils/logger.ts';
import { exchangeCitizenToken } from '@utils/server/token.ts';
import { RapportFormat, RapportId } from '@src/schemas/types';

const formatMimeType: Record<RapportFormat, string> = {
  csv: 'text/csv',
  pdf: 'application/pdf',
};

export const GET: APIRoute = async ({ url, params, locals }) => {
  const paramId = params.rapportId;
  const paramType = url.searchParams.get('type');

  if (paramId === undefined || paramType === null) {
    return new Response(
      JSON.stringify({ error: 'Mangler rapport rapportId eller type' }),
      { status: 400 },
    );
  }

  const parsedId = RapportId.safeParse(paramId);
  const parsedType = RapportFormat.safeParse(paramType);

  if (!(parsedId.success && parsedType.success)) {
    return new Response(
      JSON.stringify({ error: 'Ugyldig rapportId eller type' }),
      {
        status: 400,
      },
    );
  }

  const id = parsedId.data;
  const type = parsedType.data;

  const citizenToken = locals.token;
  if (!citizenToken) {
    return new Response(JSON.stringify({ error: 'Mangler borger token' }), {
      status: 401,
    });
  }

  const tokenXToken = await exchangeCitizenToken(citizenToken);

  const backendUrl = `${oppgjorsrapporterApiUrl}/${id}/innhold`;
  const accept = formatMimeType[type];

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
    const cdValue = response.headers?.get('Content-Disposition');
    const cdHeaders: { 'Content-Disposition'?: string } =
      cdValue === null ? {} : { 'Content-Disposition': cdValue };
    return new Response(blob, {
      headers: {
        'Content-Type': accept,
        ...cdHeaders,
      },
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
