# sokos-oppgjorsrapporter-selvbetjening-frontend

Dette er en AstroJS frontend template med IdPorten autentisering for
- arbeidsgivere som skal hente oppgjørsrapporter
- samhandlere og kreditorrer som skal hente trekkoppgjørsrapporter

Løsningen bruker et eget API-endepunkt i [sokos-oppgjorsrapporter](https://github.com/navikt/sokos-oppgjorsrapporter).

#  Kjøre appen lokalt

1. Installer avhengigheter: `npm i`
2. Bygge sokos-oppgjorsrapporter-selvbetjening-frontend: `npm run build`
3. Start hono mockserver: `npm run mock`
4. Med mockserver kjørende i egen terminal, start appen: `npm run dev`
4. Appen nås på http://localhost:4321/oppgjorsrapporter

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #utbetaling.
