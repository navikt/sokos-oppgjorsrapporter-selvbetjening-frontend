import * as z from 'zod/v4';

z.config(z.locales.no());

export const RapportMetadata = z.object({
  id: z.number(),
  orgnr: z.string(),
  orgNavn: z.string().optional(),
  type: z.string(),
  datoValutert: z.string(),
  bankkonto: z.string().optional(),
  opprettet: z.string(),
  arkivert: z.boolean(),
});

export type RapportMetadata = z.infer<typeof RapportMetadata>;
