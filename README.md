# sokos-oppgjorsrapporter-selvbetjening-frontend

Dette er en AstroJS frontend med IdPorten autentisering for
- arbeidsgivere som skal hente oppgjørsrapporter
- samhandlere og kreditorrer som skal hente trekkoppgjørsrapporter

Løsningen bruker API-endepunkter i [sokos-oppgjorsrapporter](https://github.com/navikt/sokos-oppgjorsrapporter) for å hente rapport metadata og rapport innhold.

# Personal access token
Pass på at du har et PAT-token i filen `~/.npmrc`. Filen bør se ut som dette:
```
//npm.pkg.github.com/:_authToken=TOKEN
@navikt:registry=https://npm.pkg.github.com
```

Tokenet kan genereres på https://github.com/settings/tokens. For mer info se: https://github.com/navikt/frontend#installere-pakker-lokalt

#  Kjøre appen lokalt
1. Installere [Node.js](https://nodejs.dev/en/) (f.eks. med `brew install node`)
2. Installer [pnpm](https://pnpm.io/) (med `brew install pnpm`)
3. Installer avhengigheter: `pnpm i`
4. Bygge sokos-oppgjorsrapporter-selvbetjening-frontend: `pnpm build`
5. Start hono mockserver: `pnpm mock`
6. Med mockserver kjørende i egen terminal, start appen: `pnpm dev`
7. Appen nås på http://localhost:4321/oppgjorsrapporter/rapport/1

8. Kjør unit-tester: `pnpm test`
9. Kjør [Playwright](https://playwright.dev/)-tester:
    - Be Playwright om å hente aktuelle browsere etc.: `pnpm playwright install`
    - Kjør testene: `pnpm pwtest`

## Testing i dev

Under finnes (syntetiske) fnr man kan bruke for å teste mot gitte URLer i dev:

| URL                                                                       | fnr         | Kommentar       |
|---------------------------------------------------------------------------|-------------|-----------------|
| [Rapport](https://www.ekstern.dev.nav.no/oppgjorsrapporter/rapport/57309) | 10926899126 | Skal ha tilgang |

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #utbetaling.
