import * as z from 'zod/v4';

z.config(z.locales.no());

export const REPORT_TYPE_REF_ARBG = 'ref-arbg';
export const REPORT_TYPE_TREKK_KRED = 'trekk-kred';

export const RapportType = z.enum([
  REPORT_TYPE_REF_ARBG,
  REPORT_TYPE_TREKK_KRED,
]);
export const RapportTyper = z.array(RapportType);
export type RapportTyper = z.infer<typeof RapportTyper>;
export const RapportDTO = z.object({
  id: z.number(),
  orgnr: z.string(),
  orgNavn: z.string().optional(),
  type: z.string(),
  datoValutert: z.string(),
  bankkonto: z.string().optional(),
  opprettet: z.string(),
  arkivert: z.boolean(),
});

export interface TilgjengeligFormat {
  format: string;
  filNavn: string;
  id: string;
}

export type RapportDTO = z.infer<typeof RapportDTO>;
