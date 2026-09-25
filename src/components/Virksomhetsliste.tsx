import { type RapportType, type Virksomhet } from '@src/schemas/types.ts';
import { Search, VStack } from '@navikt/ds-react';
import { VirksomhetKort } from '@src/components/VirksomhetKort.tsx';
import { useMemo, useState } from 'react';

interface VirksomhetslisteProps {
  rapportType: RapportType;
  virksomheter: Virksomhet[];
}

export const Virksomhetsliste = ({
  rapportType,
  virksomheter,
}: VirksomhetslisteProps) => {
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
    <VStack gap="space-8">
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
