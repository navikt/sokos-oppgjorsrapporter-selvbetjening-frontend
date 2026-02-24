import type { RapportMetadata } from '@src/schemas/types.ts';

type HentRapportMetadataResult =
  | { data: RapportMetadata; error: null }
  | { data: null; error: string };

export async function hentRapportMetadataForPage(
  rapportId: string | undefined,
  callAction: (params: {
    id: string;
  }) => Promise<{ data?: RapportMetadata; error?: { message: string } }>,
): Promise<HentRapportMetadataResult> {
  if (!rapportId) {
    return { data: null, error: 'Mangler rapport rapportId i URL' };
  }

  const result = await callAction({ id: rapportId });

  if (result.error) {
    return { data: null, error: result.error.message };
  }

  return { data: result.data!, error: null };
}
