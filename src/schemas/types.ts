import * as z from 'zod/v4';

z.config(z.locales.no());

export const REPORT_TYPE_REF_ARBG = 'ref-arbg';
export const REPORT_TYPE_TREKK_KRED = 'trekk-kred';
export const REPORT_TYPE_TREKK_HEND = 'trekk-hend';

export const RapportType = z.enum([
  REPORT_TYPE_REF_ARBG,
  REPORT_TYPE_TREKK_KRED,
  REPORT_TYPE_TREKK_HEND,
]);

export const RapportId = z.int().positive();
export type RapportId = z.infer<typeof RapportId>;

export const RapportMetadata = z.object({
  id: RapportId,
  orgnr: z.string(),
  orgNavn: z.string().optional(),
  type: RapportType,
  datoValutert: z.string(),
  bankkonto: z.string().optional(),
  opprettet: z.string(),
  arkivert: z.boolean(),
});

export type RapportMetadata = z.infer<typeof RapportMetadata>;

export const REPORT_FORMAT_CSV = 'csv';
export const REPORT_FORMAT_PDF = 'pdf';
export const RapportFormat = z.enum([REPORT_FORMAT_CSV, REPORT_FORMAT_PDF]);
export type RapportFormat = z.infer<typeof RapportFormat>;
