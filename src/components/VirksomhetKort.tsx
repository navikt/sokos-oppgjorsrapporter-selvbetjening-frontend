import type { RapportType, Virksomhet } from '@src/schemas/types.ts';
import { LinkCard, VStack } from '@navikt/ds-react';
import { Buildings2Icon, Buildings3Icon } from '@navikt/aksel-icons';

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
            <Buildings3Icon fontSize="2rem" />
          ) : (
            <Buildings2Icon fontSize="2rem" />
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
