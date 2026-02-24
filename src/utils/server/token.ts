import { requestTokenxOboToken } from '@navikt/oasis';
import { isLocal } from '@src/utils/server/environment.ts';
import { generateKeyPair, SignJWT } from 'jose';
import logger from '@utils/logger.ts';

const targetApp = 'sokos-oppgjorsrapporter';
const audience = `${process.env.SOKOS_OPPGJORSRAPPORTER_TOKEN_AUDIENCE}`;

export const exchangeCitizenToken = async (token: string): Promise<string> => {
  if (isLocal) {
    return 'Uekte obo token for lokal utvikling';
  }

  logger.info(
    `Forsøker å hente tokenX obo token for ${targetApp} med audience ${audience}`,
  );
  const tokenxOboTokenResult = await requestTokenxOboToken(token, audience);

  if (!tokenxOboTokenResult.ok) {
    logger.error('Feil ved henting av token: ' + tokenxOboTokenResult.error);
    throw new Error(
      `Henting av oboToken for ${targetApp} feilet: ${tokenxOboTokenResult.error.message}`,
    );
  }

  return tokenxOboTokenResult.token;
};

const alg = 'RS256';

const cachedKeyPair = generateKeyPair(alg);
const privateKey = async () => (await cachedKeyPair).privateKey;

export const localToken = async ({
  audience = 'default_audience',
  issuer = 'default_issuer',
  algorithm = alg,
  exp = Math.round(Date.now() / 1000) + 1000,
  ...payload
}: {
  audience?: string;
  issuer?: string;
  algorithm?: string;
  exp?: number | string;
} & Record<string, unknown> = {}) =>
  new SignJWT(payload)
    .setExpirationTime(exp)
    .setProtectedHeader({ alg: algorithm })
    .setAudience([audience, 'https://nav.no'])
    .setIssuer(issuer)
    .setJti(`${Math.random()}`)
    .sign(await privateKey());
