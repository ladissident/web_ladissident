# Revisió dels formularis — 9 novembre 2026

## Què ha canviat

- Les tres targetes ara són: aportació a fons perdut, préstec a V. Andrés Bertí i persona associada. Difusió es manté amb un enllaç propi.
- La via a fons perdut ja no demana un formulari previ: mostra informació de transferència, amb IBAN i titular desactivats fins a validació.
- La tassa (50 € o més) es demana per correu electrònic, adjuntant el justificant manualment.
- El formulari de finançament es comparteix entre les modalitats de préstec, persona associada i dubtes. Preguntes condicionals, comparació i textos de riscos.
- Persona associada: 0 %, sense IPC, import 3.000–50.000 €, mínim un any sense reembossament.
- Préstec: dos mesos inicials de carència, preferències sobre termini, periodicitat i carència voluntària.
- Caselles de comprensió obligatòries i butlletí opcional. Informació bàsica de privacitat sense acceptació genèrica.

## On modificar

- `src/components/Financing.astro`: textos explicatius, formulari i lògica condicional.
- `src/components/Home.astro`: targetes, transferència i sol·licitud de tassa.
- `src/data/content.ts`: `bankDetails.owner` i `bankDetails.iban` **només quan estiguen validats**.
- `src/styles/global.css`: estils afegits al final, sota «Finançament 2026».

## Límits d'aquesta versió

**Encara no s'envien dades:** els formularis són de demostració i mostren un missatge en enviar-los. No existeix integració amb D1 o Resend.

La secció explicativa inclou una adaptació resumida i bilingüe del text llarg rebut, no una transcripció íntegra. Caldrà revisar conjuntament el text definitiu i la seua validació jurídica, especialment en valencià. La comparació és simplificada per facilitar-ne la lectura en mòbil.

Abans de publicar, cal preparar el tractament de dades, comprovar les pàgines legals, definir enviament de correus i validar les condicions jurídiques i bancàries.

## Provar en local

`npm install` i `npm run dev`.

Proves: obrir cada targeta, canviar la modalitat, comprovar camps condicionals, revisar `CA/ES`, confirmar que el formulari no envia dades, provar la sol·licitud de tassa, comprovar visualització mòbil.
