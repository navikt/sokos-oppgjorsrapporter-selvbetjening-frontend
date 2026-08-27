import {
  type RapportType,
  type TilgangTilVirksomheter,
} from '@src/schemas/types.ts';
import { Search, VStack } from '@navikt/ds-react';
import { VirksomhetKort } from '@src/components/VirksomhetKort.tsx';
import { useMemo, useState } from 'react';

interface VirksomhetslisteProps {
  rapportType: RapportType;
  tilgangTilVirksomheter: TilgangTilVirksomheter[];
}

export const Virksomhetsliste = ({
  rapportType,
  tilgangTilVirksomheter,
}: VirksomhetslisteProps) => {
  const virksomheter = tilgangTilVirksomheter.find(
    (tilgangTilVirksomhet) =>
      tilgangTilVirksomhet.tilgang === rapportTypeTilTilgang[rapportType],
  )?.virksomheter;

  const [filter, setFilter] = useState<string>('');
  const filtrerteOrganisasjoner = useMemo(
    () =>
      virksomheter?.filter(
        (v) =>
          v.navn.toLowerCase().includes(filter.toLowerCase()) ||
          v.orgnr.includes(filter) ||
          // -- mulig vi bør gjøre noe rekursivt her?
          v.underenheter.some((u) => {
            return (
              u.navn.toLowerCase().includes(filter.toLowerCase()) ||
              u.orgnr.includes(filter)
            );
          }),
      ),
    [virksomheter, filter],
  );

  return (
    <VStack gap="space-16">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Search
          label="Søk eller velg i listen"
          hideLabel={false}
          variant="simple"
          onChange={(str) => setFilter(str)}
        />
      </form>
      {filtrerteOrganisasjoner &&
        filtrerteOrganisasjoner.map((virksomhet) => {
          return (
            <VirksomhetKort
              hovedenhet
              virksomhet={virksomhet}
              rapportType={rapportType}
              key={virksomhet.orgnr}
            />
          );
        })}
    </VStack>
  );
};

const rapportTypeTilTilgang = {
  'ref-arbg': 'nav_utbetaling_oppgjorsrapport-refusjon-arbeidsgiver',
  'trekk-kred': 'nav_utbetaling_oppgjorsrapport-trekkhendelser',
  'trekk-hend': 'nav_utbetaling_oppgjorsrapport-trekkoppgjor',
};
