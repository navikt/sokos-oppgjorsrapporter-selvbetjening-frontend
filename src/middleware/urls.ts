import { getEnvironment } from '@src/utils/server/urls.ts';

const REDIRECT_ORIGIN = {
  local: 'http://localhost:4321',
  development: 'https://www.ekstern.dev.nav.no',
  production: 'https://www.nav.no',
};

export const redirectOrigin = REDIRECT_ORIGIN[getEnvironment()];
export const loginUrl = `/oppgjorsrapporter/oauth2/login?redirect=${redirectOrigin}/oppgjorsrapporter`;
