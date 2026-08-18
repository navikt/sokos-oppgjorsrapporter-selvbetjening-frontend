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
export type RapportType = z.infer<typeof RapportType>;

export const RapportId = z.int().positive();
export type RapportId = z.infer<typeof RapportId>;

export const REPORT_FORMAT_CSV = 'csv';
export const REPORT_FORMAT_PDF = 'pdf';
export const RapportFormat = z.enum([REPORT_FORMAT_CSV, REPORT_FORMAT_PDF]);

export const Nedlastingsinfo = z.object({
  sistLastetNed: z.string(),
  sistLastetNedAv: z.string(),
});

export const VariantMedNedlastningsinfo = z.object({
  format: RapportFormat,
  filnavn: z.string(),
  nedlastingsinfo: Nedlastingsinfo,
});
export type VariantMedNedlastningsinfo = z.infer<
  typeof VariantMedNedlastningsinfo
>;

export const RapportMetadata = z.object({
  id: RapportId,
  datoValutert: z.string(),
  varianterMedNedlastingsinfo: z.array(VariantMedNedlastningsinfo),
});
export type RapportMetadata = z.infer<typeof RapportMetadata>;

export const RapportMedNedlastningsinfo = z.object({
  forespurtRapportId: RapportId,
  orgnr: z.string(),
  orgNavn: z.string().nullish(),
  type: RapportType,
  rapporter: z.array(RapportMetadata),
});
export type RapportMedNedlastningsinfo = z.infer<
  typeof RapportMedNedlastningsinfo
>;
