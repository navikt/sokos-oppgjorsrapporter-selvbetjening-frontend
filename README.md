# sokos-oppgjorsrapporter-selvbetjening-frontend

Dette er en AstroJS frontend template med IdPorten autentisering for
- arbeidsgivere som skal hente oppgjørsrapporter
- samhandlere og kreditorrer som skal hente trekkoppgjørsrapporter

Løsningen bruker et eget API-endepunkt i [sokos-oppgjorsrapporter](https://github.com/navikt/sokos-oppgjorsrapporter).

#  Kjøre appen lokalt
1. Installere [Node.js](https://nodejs.dev/en/) (f.eks. med `brew install node`)
2. Installer [pnpm](https://pnpm.io/) (med `brew install pnpm`)
3. Installer avhengigheter: `pnpm i`
4. Bygge sokos-oppgjorsrapporter-selvbetjening-frontend: `pnpm run build`
5. Start hono mockserver: `pnpm run mock`
6. Med mockserver kjørende i egen terminal, start appen: `pnpm run dev`
7. Appen nås på http://localhost:4321/oppgjorsrapporter

8. Kjør unit-tester: `pnpm test`
9. Kjør [Playwright](https://playwright.dev/)-tester:
    - Be Playwright om å hente aktuelle browsere etc.: `pnpm exec playwright install`
    - Kjør testene: `pnpm playwright test`

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #utbetaling.
