import type { RapportType, Virksomhet } from '@src/schemas/types.ts';
import { LinkCard, VStack } from '@navikt/ds-react';
import Buildings3 from 'node_modules/@navikt/aksel-icons/dist/react/esm/Buildings3';
import Buildings2 from 'node_modules/@navikt/aksel-icons/dist/react/esm/Buildings2';

interface VirksomhetKortProps {
  hovedenhet: boolean;
  virksomhet: Virksomhet;
  rapportType: RapportType;
}

export const VirksomhetKort = ({
  hovedenhet,
  virksomhet,
  rapportType,
}: VirksomhetKortProps) => {
  return (
    <VStack gap="space-8">
      <LinkCard style={{ backgroundColor: 'var(--ax-bg-accent-soft)' }}>
        <LinkCard.Icon>
          {hovedenhet ? (
            <Buildings3 fontSize="2rem" />
          ) : (
            <Buildings2 fontSize="2rem" />
          )}
        </LinkCard.Icon>
        <LinkCard.Title>
          <LinkCard.Anchor
            href={`/oppgjorsrapporter/${rapportType}/${virksomhet.orgnr}`}
          >
            {virksomhet.navn}
          </LinkCard.Anchor>
        </LinkCard.Title>
        <LinkCard.Description>
          Organisasjonsnummer: {virksomhet.orgnr}
        </LinkCard.Description>
      </LinkCard>
      <VStack marginInline="space-32 space-0">
        {virksomhet.underenheter.map((underenhet) => {
          return (
            <VirksomhetKort
              hovedenhet={false}
              virksomhet={underenhet}
              rapportType={rapportType}
              key={underenhet.orgnr}
            />
          );
        })}
      </VStack>
    </VStack>
  );
};
