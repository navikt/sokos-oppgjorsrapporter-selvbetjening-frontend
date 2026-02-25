import { describe, expect, it, vi } from 'vitest';
import { hentRapportMetadataForPage } from '../hentRapportMetadata.ts';

describe('hentRapportMetadataForPage', () => {
  it('returnerer feil når rapportId mangler', async () => {
    const mockCallAction = vi.fn();

    const result = await hentRapportMetadataForPage(undefined, mockCallAction);

    expect(result.error).toBe('Mangler gyldig rapport id i URL');
    expect(mockCallAction).not.toHaveBeenCalled();
  });

  it('returnerer feil når action feiler', async () => {
    const mockCallAction = vi.fn().mockResolvedValue({
      error: { message: 'Noe gikk galt' },
    });

    const result = await hentRapportMetadataForPage(123, mockCallAction);

    expect(result.error).toBe('Noe gikk galt');
    expect(result.data).toBeNull();
  });

  it('returnerer data når alt er ok', async () => {
    const mockData = { id: '123', title: 'Test Rapport' };
    const mockCallAction = vi.fn().mockResolvedValue({ data: mockData });

    const result = await hentRapportMetadataForPage(123, mockCallAction);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });
});
