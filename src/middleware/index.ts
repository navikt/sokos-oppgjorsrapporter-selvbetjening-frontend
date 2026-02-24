import { defineMiddleware } from 'astro/middleware';
import { loginUrl } from './urls';
import { isInternal } from './utils';
import { isLocal } from '@src/utils/server/urls';
import { getToken, validateToken } from '@navikt/oasis';
import { localToken } from '@src/utils/server/token';
import logger from '@utils/logger.ts';

const basePath = '/oppgjorsrapporter';

export const onRequest = defineMiddleware(async (context, next) => {
  let path = context.url.pathname + context.url.search;

  // Fjerner base path for å unngå duplikat i redirect URL
  if (path.startsWith(basePath)) {
    path = path.slice(basePath.length) || '/';
  }

  const redirectPath = encodeURIComponent(path);

  if (isLocal) {
    context.locals.token = await localToken({ pid: '12345678912' });
    return next();
  }

  if (isInternal(context)) {
    return next();
  }

  const token = getToken(context.request.headers);
  if (!token) {
    logger.info(
      'Kunne ikke finne noen bearer token i requesten. Ruter til innlogging',
    );
    return context.redirect(`${loginUrl}${redirectPath}`);
  }

  const validation = await validateToken(token);

  if (!validation.ok) {
    logger.error(
      `Fant ugylidg JWT token (cause: ${validation.errorType} ${validation.error}, ruter til innlogging.`,
    );
    return context.redirect(`${loginUrl}${redirectPath}`);
  }

  context.locals.token = token;

  return next();
});
