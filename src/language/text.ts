import {
  type RapportType,
  REPORT_TYPE_REF_ARBG,
  REPORT_TYPE_TREKK_HEND,
  REPORT_TYPE_TREKK_KRED,
} from '@src/schemas/types.ts';

export const text = {
  title: 'Oppgjørsrapporter',
  orgNrLabel: 'Org.nummer',
};

export const rapportKortform = (rapportType: RapportType) => {
  switch (rapportType) {
    case REPORT_TYPE_REF_ARBG:
      return `Oppgjørsrapporter refusjon`;
    case REPORT_TYPE_TREKK_HEND:
      return 'Trekkhendelser';
    case REPORT_TYPE_TREKK_KRED:
      return 'Trekkoppgjør';
  }
};

export const rapportNavn = (rapportType: RapportType) => {
  switch (rapportType) {
    case REPORT_TYPE_REF_ARBG:
      return `Oppgjørsrapport arbeidsgiver – refusjoner fra Nav`;
    case REPORT_TYPE_TREKK_HEND:
      return 'Trekkhendelser - tilbakemelding fra Nav';
    case REPORT_TYPE_TREKK_KRED:
      return 'Trekkoppgjør fra Nav';
  }
};
