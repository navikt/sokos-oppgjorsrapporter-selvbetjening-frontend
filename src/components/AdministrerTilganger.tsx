import { LinkCard } from '@navikt/ds-react';

export const AdministrerTilganger = () => {
  return (
    <LinkCard>
      <LinkCard.Title>
        <LinkCard.Anchor href="https://www.altinn.no">
          Administrer tilgang til organisasjoner
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>
        Gå til Altinn for å søke om tilgang til disse rapportene, eller for å
        delegere din egen tilgang til andre.
      </LinkCard.Description>
    </LinkCard>
  );
};
