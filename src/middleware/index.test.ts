import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { APIContext } from 'astro';
import { onRequest } from './index';
import { getToken, validateToken } from '@navikt/oasis';
import { isInternal } from './utils';

vi.mock('@navikt/oasis', () => ({
  getToken: vi.fn(),
  validateToken: vi.fn(),
}));

vi.mock('@src/utils/server/urls', () => ({
  isLocal: false,
}));

vi.mock('@src/utils/server/token', () => ({
  localToken: vi.fn(),
}));

vi.mock('@utils/logger.ts', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('./urls', () => ({
  loginUrl: '/oppgjorsrapporter/oauth2/login?redirect=',
}));

vi.mock('./utils', () => ({
  isInternal: vi.fn(() => false),
}));

describe('middleware', () => {
  const mockNext = vi.fn(() => Promise.resolve(new Response()));
  const mockRedirect = vi.fn(
    (url: string) =>
      new Response(null, { status: 302, headers: { Location: url } }),
  );

  const createMockContext = (
    pathname: string,
    search: string = '',
  ): APIContext =>
    ({
      url: new URL(`https://example.com${pathname}${search}`),
      request: { headers: new Headers() } as Request,
      locals: {} as any,
      redirect: mockRedirect,
    }) as unknown as APIContext;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skal bevare full sti i redirect når token ikke finnes', async () => {
    vi.mocked(getToken).mockReturnValue(null);

    const context = createMockContext('/rapport/57309');
    await onRequest(context, mockNext);

    expect(mockRedirect).toHaveBeenCalledWith(
      '/oppgjorsrapporter/oauth2/login?redirect=%2Frapport%2F57309',
    );
  });

  it('skal bevare sti og query-parametre i redirect', async () => {
    vi.mocked(getToken).mockReturnValue(null);

    const context = createMockContext('/rapport/57309', '?foo=bar');
    await onRequest(context, mockNext);

    expect(mockRedirect).toHaveBeenCalledWith(
      '/oppgjorsrapporter/oauth2/login?redirect=%2Frapport%2F57309%3Ffoo%3Dbar',
    );
  });

  it('skal omdirigere ved ugyldig token', async () => {
    vi.mocked(getToken).mockReturnValue('invalid-token');
    vi.mocked(validateToken).mockResolvedValue({
      ok: false,
      errorType: 'token expired',
      error: new Error('Invalid token'),
    });

    const context = createMockContext('/oppgjorsrapporter/rapport/57309');
    await onRequest(context, mockNext);

    expect(mockRedirect).toHaveBeenCalledWith(
      '/oppgjorsrapporter/oauth2/login?redirect=%2Frapport%2F57309',
    );
  });

  it('skal kalle next() med gyldig token', async () => {
    vi.mocked(getToken).mockReturnValue('valid-token');
    vi.mocked(validateToken).mockResolvedValue({ ok: true, payload: {} });

    const context = createMockContext('/rapport/57309');
    await onRequest(context, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(context.locals.token).toBe('valid-token');
  });

  it('skal hoppe over autentisering for interne ruter', async () => {
    vi.mocked(isInternal).mockReturnValue(true);

    const context = createMockContext('/internal/health');
    await onRequest(context, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(getToken).not.toHaveBeenCalled();
  });

  it('skal ikke duplisere base-sti i redirect URL', async () => {
    vi.mocked(getToken).mockReturnValue(null);
    vi.mocked(isInternal).mockReturnValue(false);

    const context = createMockContext('/oppgjorsrapporter/rapport/57309');
    await onRequest(context, mockNext);

    const redirectCall = mockRedirect.mock.calls[0][0] as string;
    const decodedRedirect = decodeURIComponent(redirectCall);

    expect(decodedRedirect).not.toMatch(/oppgjorsrapporter.*oppgjorsrapporter/);
  });
});
