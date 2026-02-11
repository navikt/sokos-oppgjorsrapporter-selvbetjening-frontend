import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { RapportDTO } from '@src/schemas/types.ts';
import { oppgjorsrapporterApiUrl } from '@utils/server/urls.ts';
import logger from '@utils/logger.ts';
import { exchangeCitizenToken } from '@utils/server/token.ts';

export const server = {
  getRapportMetadata: defineAction({
    input: z.object({
      id: z.union([z.string(), z.number()]),
    }),
    handler: async ({ id }, context) => {
      const citizenToken = context.locals.token;

      if (!citizenToken) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Mangler borger token',
        });
      }

      const tokenXToken = await exchangeCitizenToken(citizenToken);
      const url = `${oppgjorsrapporterApiUrl}/${id}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${tokenXToken}`,
        },
      });

      if (!response.ok) {
        logger.error({
          msg: 'Failed to fetch rapport metadata',
          id,
          status: response.status,
          statusText: response.statusText,
          url,
        });

        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Klarte ikke å hente rapportmetadata for id=${id}`,
        });
      }

      const data = await response.json();
      return RapportDTO.parse(data);
    },
  }),
};
