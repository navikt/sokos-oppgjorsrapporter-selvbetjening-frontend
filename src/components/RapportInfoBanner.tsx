import type { RapportType } from '@src/schemas/types.ts';
import { BodyLong, Link } from '@navikt/ds-react';
import { rapportKortform } from '@src/language/text.ts';

interface RapportInfoBannerProps {
  rapportType: RapportType;
}

export const RapportInfoBanner = ({ rapportType }: RapportInfoBannerProps) => {
  const rapportNavn = rapportKortform(rapportType).toLocaleLowerCase();
  const lenke = rapportTypeTilLenke(rapportType);

  return (
    <BodyLong size="small">
      Nedlastingssiden på nav.no fungerer nå som et arkiv for alle rapportene
      dine. Du kan logge inn på på nav.no og trenger ikke lenger å laste ned
      rapportene via meldinger i Altinn. Du vil fortsatt motta varsel i Altinn
      når en ny rapport er tilgjengelig.
      <br />
      Les mer om {rapportNavn} og tilganger på <Link href={lenke}>{lenke}</Link>
    </BodyLong>
  );
};

const rapportTypeTilLenke = (rapportType: RapportType) => {
  switch (rapportType) {
    case 'ref-arbg':
      return 'https://www.nav.no/arbeidsgiver/oppgjorsrapport.';
    case 'trekk-kred':
      return 'https://www.nav.no/samarbeidspartner/trekkoppgjorsrapport';
    case 'trekk-hend':
      return 'https://www.nav.no/samarbeidspartner/manglende-trekk';
  }
};
