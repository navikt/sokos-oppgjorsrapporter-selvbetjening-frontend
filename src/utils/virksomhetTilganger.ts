import type {
  RapportType,
  TilgangTilVirksomheter,
} from '@src/schemas/types.ts';

const rapportTypeTilTilgang = {
  'ref-arbg': 'nav_utbetaling_oppgjorsrapport-refusjon-arbeidsgiver',
  'trekk-kred': 'nav_utbetaling_oppgjorsrapport-trekkhendelser',
  'trekk-hend': 'nav_utbetaling_oppgjorsrapport-trekkoppgjor',
};

export const virksomhetermedTilgangTilType = (
  tilganger: TilgangTilVirksomheter[],
  type: RapportType,
) =>
  tilganger.find((t) => t.tilgang === rapportTypeTilTilgang[type])
    ?.virksomheter ?? [];
