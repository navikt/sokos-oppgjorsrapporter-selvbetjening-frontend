import { getEnvironment } from '@src/utils/server/urls.ts';

const REDIRECT_URI = {
  local: 'http://localhost:4321/oppgjorsrapporter',
  development: 'https://www.ansatt.dev.nav.no/oppgjorsrapporter',
  production: 'https://www.nav.no/minside/oppgjorsrapporter',
};

export const redirectUri = REDIRECT_URI[getEnvironment()];
export const loginUrl = `/oppgjorsrapporter/oauth2/login?redirect=${redirectUri}`;
