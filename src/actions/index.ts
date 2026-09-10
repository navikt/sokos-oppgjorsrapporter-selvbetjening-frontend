import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import {
  RapportMedNedlastingsinfo,
  RapportType,
  type TilgangTilVirksomheter,
} from '@src/schemas/types.ts';
import {
  eksternApiUrl,
  oppgjorsrapporterApiUrl,
  organisasjonerApiUrl,
} from '@utils/server/urls.ts';
import logger from '@utils/logger.ts';
import { exchangeCitizenToken } from '@utils/server/token.ts';

export const server = {
  hentRapportMetadata: defineAction({
    input: z.object({
      id: z.number(),
    }),
    handler: async ({ id }, context) => {
      const citizenToken = context.locals.token;

      if (!citizenToken) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Mangler borger token',
        });
      }

      try {
        return await fetchRapportMedNedlastningsinfo(id, citizenToken);
      } catch (error: any) {
        logger.warn(error, `Feil ved henting av rapportmetadata for id=${id}`);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Feil ved henting av rapportmetadata for id=${id}`,
        });
      }
    },
  }),
  hentOrganisasjoner: defineAction({
    handler: async (_, context) => {
      const citizenToken = context.locals.token;

      if (!citizenToken) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Mangler borger token',
        });
      }

      try {
        return await fetchOrganisasjoner(citizenToken);
      } catch (error: any) {
        logger.warn(error, `Feil ved henting av organisasjoner`);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Feil ved henting av organisasjoner`,
        });
      }
    },
  }),
  hentRapporterForVirksomhet: defineAction({
    input: z.object({
      orgnr: z.string(),
      rapportType: z.string(),
    }),
    handler: async ({ orgnr, rapportType }, context) => {
      const citizenToken = context.locals.token;

      if (!citizenToken) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Mangler borger token',
        });
      }

      const type = RapportType.safeParse(rapportType);
      if (!type.success) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: `Feil rapporttype: ${rapportType}`,
        });
      }

      try {
        return await fetchRapporterForVirksomhet(
          orgnr,
          type.data,
          citizenToken,
        );
      } catch (error: any) {
        logger.warn(error, `Feil ved henting av rapporter for orgnr=${orgnr}`);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Feil ved henting av rapporter for orgnr=${orgnr}`,
        });
      }
    },
  }),
};

const fetchOrganisasjoner = async (
  citizenToken: string,
): Promise<TilgangTilVirksomheter[] | null> => {
  const url = `${organisasjonerApiUrl}`;
  logger.info(`Forsøker henting av organisasjoner fra ${url}`);
  return await getFraBackend(url, citizenToken);
};

const fetchRapporterForVirksomhet = async (
  orgnr: string,
  rapportType: RapportType,
  citizenToken: string,
): Promise<RapportMedNedlastingsinfo> => {
  const url = `${eksternApiUrl}`;
  logger.info(`Forsøker henting av rapporter for orgnr=${orgnr} fra ${url}`);
  return await postTilBackend(url, citizenToken, { orgnr, rapportType });
};

const fetchRapportMedNedlastningsinfo = async (
  id: string | number,
  citizenToken: string,
): Promise<RapportMedNedlastingsinfo> => {
  const url = `${oppgjorsrapporterApiUrl}/${id}/utvidet`;
  logger.info(`Forsøker henting av rapport metadata for id=${id} fra ${url}`);
  return await getFraBackend(url, citizenToken);
};

const getFraBackend = async (url: string, citizenToken: string) =>
  fetchFraBackend('GET', url, citizenToken);
const postTilBackend = async (url: string, citizenToken: string, body: any) =>
  fetchFraBackend('POST', url, citizenToken, body);

const fetchFraBackend = async (
  method: string,
  url: string,
  citizenToken: string,
  body?: any,
) => {
  const tokenXToken = await exchangeCitizenToken(citizenToken);
  const response = await fetch(url, {
    method: method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${tokenXToken}`,
      ...(body && { 'Content-Type': 'application/json' }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    logger.error(
      `Http feil med status ${response.status} ved henting av data fra ${url}`,
    );
    throw new Error();
  }

  return await response.json();
};
