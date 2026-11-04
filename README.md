# La Dissident — base Astro (revisió 3)

Prototip local bilingüe, adaptat a les indicacions de novembre de 2026. **No és una web de producció:** els formularis no envien dades ni correus, els imports de progrés són inventats per demostrar el disseny i `/admin/` és una maqueta sense autenticació. No publiques aquest panell ni tractes dades reals amb aquesta versió.

## Arrancar

Node.js 20.19+ (recomanat Node 22). Descomprimeix l'arxiu i obri un terminal dins de la carpeta del projecte:

```bash
npm install
npm run dev
```

Obri `http://localhost:4321/ca/` o `http://localhost:4321/es/`.

## On es modifica cada cosa?

| Necessite modificar... | Fitxer | Instrucció |
|---|---|---|
| **Logo** | `public/logo-la-dissident.png` | Substitueix-lo pel PNG oficial, mantenint el mateix nom. El PNG inclòs és **un marcador provisional**, NO el logotip oficial. |
| Grandària del logo | `src/styles/global.css` | Busca `.brand img` al final de l'arxiu. |
| Header, hero, seccions | `src/components/Home.astro` | Ací estan l'ordre i l'estructura de la pàgina. |
| **Textos CA i ES** | `src/data/content.ts` | Edita la clau en els blocs `ca` i `es`. |
| Barra de progrés de prova | `src/data/content.ts` | Edita `campaign.demoRaised`, `campaign.goal` i `campaign.demoUpdated`. |
| **Vídeos de Vimeo** | `src/data/content.ts` | Ompli `vimeoVideos.ca` i `vimeoVideos.es` amb els **IDs numèrics**, per exemple `123456789`, sense URL. Per a vídeos privats que utilitzen el paràmetre `h`, cal adaptar el reproductor. |
| Aspecte visual | `src/styles/global.css` | Els estils de la revisió 3 estan al final; colors, marges, mides i responsive. |
| Formularis | `src/components/Home.astro` | Cerca `data-demo-form="donation"` i `data-demo-form="loan"`. El codi interactiu està dins de `<script>` al final. |
| Panell de demostració | `src/pages/admin/index.astro` | Encara no té base de dades ni control d'accés. |
| Metadades HTML | `src/layouts/Base.astro` | Títol, idioma, canonical, Open Graph. |

### Canvis incorporats

- Header: logo, «Sobre el projecte», «Preguntes», idiomes i botó «Participa».
- Hero compacte: sense etiqueta de campanya ni gran logo lateral; objectiu, botons i barra més amunt.
- Secció «Objectius del projecte» en una sola columna, amb «Què volem fer», «Cessió d’ús» i «Comunitat relacional».
- Tres vies de participació, amb enllaços que obrin els formularis corresponents.
- Formularis **apilats i plegats per defecte** (acordions); es poden obrir manualment.
- Tassa opcional des de 50 €: missatge discret per davall del llindar i opció de recollida o enviament amb adreça quan correspon.
- Préstec: import `min="3000"` i avís discret; contacte personal amb la cooperativa.
- Eliminada la secció independent de transparència; es manté la barra al hero.
- Correus: s'explica abans d'enviar què passarà quan el sistema estiga activat; confirmació de DEMO després de provar el formulari.

### Pendents abans de publicar

1. Posar el **logotip real** i els vídeos finals; comprovar formats de Vimeo, privacitat i subtítols.
2. Revisar els textos legals i les condicions de les tasses (costos d'enviament, enviament físic i tractament de l'adreça). La condició de 50 € és la instrucció actual i substitueix la de 25 € del brief original.
3. Integrar Cloudflare D1, autenticació del panell, emmagatzematge de fotos, Resend, antispam i controls de seguretat. Els formularis no envien dades en aquesta revisió.
4. Crear pàgines legals i enllaços funcionals, validar consentiments i fer proves de correu i accessibilitat.
5. Reemplaçar les xifres de mostra per dades confirmades. No comptar formularis com a aportacions.
6. Configurar el desplegament a Cloudflare, GitHub de la cooperativa, DNS i correu.

### Sobre la comprovació tècnica

En l'entorn de creació no s'ha pogut completar `npm install` per un temps d'espera del registre de paquets; per això **no s'ha verificat una compilació Astro**. Executa `npm install && npm run build` en local per comprovar-la.

### Canvis de la revisió 3

- Eliminada la franja de desenvolupament i la nota del peu a les pàgines públiques.
- Header i hero tenen un únic fons `#FFF9F0`; la línia del header només es mostra després de fer scroll.
- Menú hamburguesa responsive per a «Sobre el projecte» i «Preguntes»; logo, menú, idiomes i «Participa» comparteixen una fila.
- «Objectius del projecte» es presenta com l'etiqueta xicoteta de color argila i els subtítols tenen la mateixa jerarquia que «La Dissident ja existeix».
- El títol dels formularis i les preguntes freqüents estan alineats amb la resta de seccions.
- El hero té tipografia més reduïda als mòbils.

**Recordatori tècnic:** la retirada de les advertències visuals no activa els formularis. Les xifres de progrés són de mostra. L'administració no està protegida: no desplegues aquesta revisió a un domini públic sense integrar les funcionalitats i la seguretat.
