import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { RapportMetadata } from '@src/schemas/types.ts';
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
        const data = await fetchRapportMetadata(id, citizenToken);
        return RapportMetadata.parse(data);
      } catch (error: any) {
        console.warn(
          `Feil ved henting av rapportmetadata for id=${id}: ${error}`,
        );
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Feil ved henting av rapportmetadata for id=${id}`,
        });
      }
    },
  }),
};

const fetchRapportMetadata = async (
  id: string | number,
  citizenToken: string,
): Promise<RapportMetadata> => {
  const tokenXToken = await exchangeCitizenToken(citizenToken);
  const url = `${oppgjorsrapporterApiUrl}/${id}`;

  logger.info(`Forsøker henting av rapport metadata for id=${id} fra ${url}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${tokenXToken}`,
    },
  });

  if (!response.ok) {
    logger.error(
      `Http feil med status ${response.status} ved henting av rapportmetadata for id=${id}`,
    );
    throw new Error();
  }

  return await response.json();
};
