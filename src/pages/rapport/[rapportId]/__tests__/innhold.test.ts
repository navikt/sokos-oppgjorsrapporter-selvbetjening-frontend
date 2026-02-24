import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../innhold';
import { exchangeCitizenToken } from '@utils/server/token.ts';

vi.mock('@utils/server/urls.ts', () => ({
  oppgjorsrapporterApiUrl: 'http://mock-api.com/rapporter',
}));

vi.mock('@utils/logger.ts', () => ({
  default: {
    error: vi.fn(),
  },
}));

vi.mock('@utils/server/token.ts', () => ({
  exchangeCitizenToken: vi.fn(),
}));

const createMockContext = (overrides: {
  rapportId?: string;
  type?: string | null;
  token?: string | null;
}) => {
  const url = new URL('http://localhost/rapport/123/innhold');
  if (overrides.type) {
    url.searchParams.set('type', overrides.type);
  }

  return {
    url,
    params: { rapportId: overrides.rapportId },
    locals: { token: overrides.token ?? null },
  } as any;
};

describe('GET /rapport/[rapportId]/innhold', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(exchangeCitizenToken).mockResolvedValue('mocked-tokenx-token');
  });

  it('returnerer 401 når citizen token mangler', async () => {
    const ctx = createMockContext({
      rapportId: '123',
      type: 'pdf',
      token: null,
    });

    const response = await GET(ctx);

    expect(response.status).toBe(401);
  });

  it('returnerer 400 når rapportId mangler', async () => {
    const ctx = createMockContext({
      rapportId: undefined,
      type: 'pdf',
      token: 'token',
    });

    const response = await GET(ctx);

    expect(response.status).toBe(400);
  });

  it('returnerer 400 når type mangler', async () => {
    const ctx = createMockContext({
      rapportId: '123',
      type: null,
      token: 'token',
    });

    const response = await GET(ctx);

    expect(response.status).toBe(400);
  });

  it('returnerer 400 når type er ugyldig', async () => {
    const ctx = createMockContext({
      rapportId: '123',
      type: 'xml',
      token: 'token',
    });

    const response = await GET(ctx);

    expect(response.status).toBe(400);
  });

  it('henter PDF med korrekt header oppsett', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const ctx = createMockContext({
      rapportId: '123',
      type: 'pdf',
      token: 'citizen-token',
    });

    const response = await GET(ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(fetch).toHaveBeenCalledWith(
      'http://mock-api.com/rapporter/123/innhold',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/pdf' }),
      }),
    );
  });

  it('henter CSV med korrekt header oppsett', async () => {
    const mockBlob = new Blob(['csv,content'], { type: 'text/csv' });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const ctx = createMockContext({
      rapportId: '123',
      type: 'csv',
      token: 'citizen-token',
    });

    const response = await GET(ctx);

    expect(response.headers.get('Content-Type')).toBe('text/csv');
  });

  it('returnerer 404 når fetch feiler', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const ctx = createMockContext({
      rapportId: '123',
      type: 'pdf',
      token: 'token',
    });

    const response = await GET(ctx);

    expect(response.status).toBe(404);
  });

  it('returner 500 ved nettverk feil', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const ctx = createMockContext({
      rapportId: '123',
      type: 'pdf',
      token: 'token',
    });

    const response = await GET(ctx);

    expect(response.status).toBe(500);
  });
});
