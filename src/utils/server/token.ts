import { requestOboToken } from '@navikt/oasis';
import { isLocal } from '@src/utils/server/environment.ts';
import { generateKeyPair, SignJWT } from 'jose';

const targetApp = 'sokos-oppgjorsrapporter';
const audience = `${process.env.NAIS_CLUSTER_NAME}:okonomi:${targetApp}`;

export const exchangeCitizenToken = async (token: string): Promise<string> => {
  const oboResult = await requestOboToken(token, audience);

  if (isLocal) {
    return 'Uekte obo token for lokal utvikling';
  }

  if (!oboResult.ok) {
    console.error('Feil ved henting av token: ' + oboResult.error);
    throw new Error(
      `Henting av oboToken for ${targetApp} feilet: ${oboResult.error.message}`,
    );
  }

  return oboResult.token;
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
