# Backend de formularis — La Dissident

## Què incorpora

- `functions/api/financing.ts`: POST `/api/financing`, verifica Turnstile al servidor, valida modalitat i preferències i guarda en D1.
- `migrations/0002_financing_requests.sql`: taula privada `financing_requests` i índexs.
- `src/components/Financing.astro`: envia el formulari amb `fetch`, mostra la referència, evita enviar si no hi ha Turnstile.
- `src/components/Home.astro`: evita que el listener de demostració interferisca.

**No s'envien correus. No s'accepten transferències en aquest formulari.** Cap sol·licitud es compta com a recaptació.

## Configuració

1. Guarda una còpia del projecte i integra els fitxers indicats (sobretot si has fet canvis posteriors).
2. Ja has de tindre el binding D1 `DB` configurat a Cloudflare Pages. Mantín el que utilitzes per al panell.
3. En local, no executes la migració remota fins a decidir-ho: `npx wrangler d1 execute la-dissident-db --local --file=./migrations/0002_financing_requests.sql`.
4. Per al servei real, amb la BD correcta: `npx wrangler d1 execute la-dissident-db --remote --file=./migrations/0002_financing_requests.sql`.
5. Crea un widget de **Cloudflare Turnstile** (mode managed o invisible), afegeix `PUBLIC_TURNSTILE_SITE_KEY` a variables de **build** d'Astro i `TURNSTILE_SECRET_KEY` com a **secret de runtime** a Cloudflare Pages; desplega de nou. No poses mai la clau secreta en Git ni en una variable `PUBLIC_`.
6. Per a proves locals, compila `npm run build` i executa `npx wrangler pages dev dist --d1 DB=<DATABASE_ID>` amb un `.dev.vars` local que continga `TURNSTILE_SECRET_KEY`; usa claus de prova oficials de Turnstile o el widget que corresponga al teu domini local. `npm run dev` d'Astro a soles NO executa Pages Functions ni D1, per tant el formulari retornarà 404 si proves d'enviar des d'Astro dev.
7. Configura **Access** per a la futura ruta `/api/admin/financing` abans de permetre consultar o canviar estats. Aquesta entrega NO crea cap endpoint de lectura pública de dades personals.

## Comprovar

- Mode loan: opcions 0%, IPC, carència, calendari -> guarda totes les preferències en JSON.
- Mode member: import màxim 50.000, sense IPC.
- Mode undecided: dades comuns + quatre preguntes compartides.
- Enviar sense token Turnstile / sense caselles obligatòries / amb import menor a 3.000 -> rebutjat.
- Intentar `GET /api/financing` -> 405, no mostra registres.
- Revisar registres amb D1 des de consola autoritzada: `SELECT code,created_at,mode,amount_eur,status FROM financing_requests ORDER BY created_at DESC LIMIT 10;`.
- `newsletter_consent` està separat; no implica subscripció automàtica.

## Important abans de fer-ho públic

- Repassar informació legal i política de privacitat definitiva; contractes de tractament de dades, conservació i permisos.
- Turnstile redueix el spam però no substitueix el rate limiting al servidor. Afegir regles de limitació de peticions en Cloudflare per a `/api/financing` abans de llançar.
- Programar una política de retenció, supressió i còpies privades. No enregistrar el cos complet del formulari en logs ni eines analítiques.
- Encara no hi ha notificacions automàtiques ni llista de sol·licituds al panell. Això es farà després de validar el format dels correus.
