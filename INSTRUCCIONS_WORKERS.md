# La Dissident · Correcció desplegament Cloudflare Workers

## Què canvia
- `wrangler.jsonc`: fixa el mateix Worker que ja tens (`web-ladissident`), l'entrada pròpia, els assets del `dist` i el binding `DB` a `la-dissident-db`.
- `worker/index.ts`: publica `POST /api/financing` utilitzant la validació ja existent de `functions/api/financing.ts`. `GET` i altres mètodes reben 405.
- Astro queda en mode estàtic. No es canvien els components ni els estils.
- `.gitignore`: protegeix secrets i fitxers generats.

## 1. Abans de pujar
- Confirma que el Worker de producció es diu `web-ladissident` (segons el log que has adjuntat).
- Confirma que la base D1 és `la-dissident-db` (ja confirmat).
- No executes de nou `0002_financing_requests.sql`: la taula ja existeix.
- `TURNSTILE_SECRET_KEY` continua com a **secret runtime**, configurat al panell Cloudflare. **No** l'afegisques al repositori.
- `PUBLIC_TURNSTILE_SITE_KEY` continua com a **variable de build** del projecte Cloudflare; no cal afegir-la al codi.

## 2. Comprova localment
Des de l'arrel del projecte:

```sh
npm ci
npm run build
```

Aquesta compilació comprova Astro, però no prova les peticions de Worker ni el D1 remot.
Per provar el Worker localment, instal·la/usa Wrangler i crea **només en local** `.dev.vars` amb `TURNSTILE_SECRET_KEY=...` (mai Git). Fes `npx wrangler dev` i utilitza les claus de prova oficials de Turnstile o un widget habilitat per al hostname local. D1 serà local per defecte; caldria aplicar la migració a la base local abans de provar una inserció.

## 3. Desplegament
El projecte de Cloudflare ja té configurada l'ordre de desplegament `npx wrangler deploy`, així que un push de GitHub hauria de fer `npm run build` i, després, desplegar el Worker. `wrangler.jsonc` evita que l'eina improvise una configuració que retire `DB`.

**Al log nou**, revisa que apareguen els bindings `env.ASSETS` **i** `env.DB`. Si no apareix `env.DB`, no envies dades i contacta amb qui administre el desplegament.

Comprova també al panell que `TURNSTILE_SECRET_KEY` continua existint com a secret runtime després del deploy. Si cal, configura'l novament i redeploya.

## 4. Comprovació segura
1. Obri la web de producció. Amb la pestanya Network oberta, envia una única sol·licitud de prova amb dades fictícies i Turnstile completat.
2. Espera resposta HTTP **201** i un codi `LD-...`. Si 503/403, inspecciona solament el **Status** i la **Response** (mai publiques Payload o token de Turnstile).
3. En D1 Console:
```sql
SELECT code, created_at, mode, amount_eur, status
FROM financing_requests ORDER BY created_at DESC LIMIT 10;
```
4. `GET /api/financing` ha de respondre **405**, sense mostrar registres.

## Límits d'aquesta entrega
L'arxiu rebut **no conté les funcions d'API d'administració**. `src/pages/admin/index.astro` diu expressament que és una demostració que guarda dades en `localStorage`, sense autenticació ni D1. No hem creat endpoints de consulta de dades personals. Caldrà protegir qualsevol API futura d'administració amb Cloudflare Access i comprovar l'autorització al servidor.

**Abans de llançar el formulari al públic:** revisar text de privacitat, retenció i límits de peticions de `/api/financing`; Turnstile no substitueix el rate limiting.
