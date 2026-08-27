import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import example from './data/utvidet-rapport-meta-data.json';
import organisasjoner from './data/tilgang-til-virksomheter.json';

const api = new Hono();

// Enable CORS for all routes
api.use(
  '/*',
  cors({
    origin: 'http://localhost:4321',
    credentials: true,
  }),
);

api.get('/api/rapport/v1/organisasjoner', (c) => {
  return c.json(organisasjoner);
});

api.get('/api/rapport/v1/:rapportId/utvidet', (c) => {
  return c.json({
    ...example,
    forespurtRapportId: Number(c.req.param('rapportId')),
  });
});

serve(api);
