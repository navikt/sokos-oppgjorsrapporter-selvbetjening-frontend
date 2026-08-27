import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import {
  RapportMedNedlastingsinfo,
  type TilgangTilVirksomheter,
} from '@src/schemas/types.ts';
import { oppgjorsrapporterApiUrl } from '@utils/server/urls.ts';
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
};

const fetchOrganisasjoner = async (
  citizenToken: string,
): Promise<TilgangTilVirksomheter[] | null> => {
  const url = `${oppgjorsrapporterApiUrl}/organisasjoner`;
  logger.info(`Forsøker henting av organisasjoner fra ${url}`);
  return await fetchFraBackend(url, citizenToken);
};

const fetchRapportMedNedlastningsinfo = async (
  id: string | number,
  citizenToken: string,
): Promise<RapportMedNedlastingsinfo> => {
  const url = `${oppgjorsrapporterApiUrl}/${id}/utvidet`;
  logger.info(`Forsøker henting av rapport metadata for id=${id} fra ${url}`);
  return await fetchFraBackend(url, citizenToken);
};

const fetchFraBackend = async (url: string, citizenToken: string) => {
  const tokenXToken = await exchangeCitizenToken(citizenToken);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${tokenXToken}`,
    },
  });

  if (!response.ok) {
    logger.error(
      `Http feil med status ${response.status} ved henting av data fra ${url}`,
    );
    throw new Error();
  }

  return await response.json();
};
