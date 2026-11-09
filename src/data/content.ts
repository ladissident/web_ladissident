/** Continguts visibles. Mantén les claus de CA i ES equivalents. */
export const campaign = { goal: 115000, deadline: '2027-01-31', demoRaised: 49450, demoUpdated: '2026-11-04' };
export const bankDetails = { owner: '', iban: '' }; // Completar només quan la cooperativa valide el titular i IBAN.
/** Deixa buit el valor fins que tingues l'ID numèric de cada vídeo de Vimeo. */
export const vimeoVideos: Record<'ca' | 'es', string> = {
  ca: 'https://player.vimeo.com/video/1244181209?badge=0&autopause=0&title=0&byline=0&portrait=0&fullscreen=1&playsinline=1',
  es: 'https://player.vimeo.com/video/1244160201?h=bb26ba305d&title=0&byline=0&portrait=0&fullscreen=1&playsinline=1'
};

export const content = {
  ca: {
    navAbout:'Sobre el projecte', navFaq:'Preguntes', participate:'Participa', watch:'Veure el vídeo',
    headline:'Traure una casa del mercat. Posar-la al servei de la comunitat. ',
    subtitle:'Objectiu: aconseguir 115.000 € abans del 31 de gener de 2027',
    achieved:'aconseguits', missing:'pendents', updated:'Actualitzat el',
    videoHeading:'Coneix La Dissident', aboutTitle:'La Dissident ja existeix',
    about:'La Dissident és una cooperativa valenciana d’habitatge en cessió d’ús i un espai per al pensament crític, la llibertat i la dissidència. Ja vivim, cultivem, organitzem activitats i construïm comunitat. Ara volem consolidar la casa i obrir-la a més persones.',
    videoPlaceholder:'Vídeo en pendent de configurar',
    objectivesTitle:'Objectius del projecte',
    goalTitle:'Què volem fer', goalCopy:'Necessitem reunir 115.000 euros per fer la compra inicial. Volem que els recursos es convertisquen en habitacions, cultius, tallers, autonomia i vida en comú, no en interessos bancaris.',
    conceptTitle:'Cessió d’ús: habitar sense posseir', concept:'La casa serà de la cooperativa. Les persones podran habitar-la, cuidar-la i transformar-la, però ningú podrà vendre una part, especular-hi o convertir-la en herència privada.',
    communityTitle:'Comunitat relacional', community:'Volem qüestionar la propietat de la casa i també la possessió dels afectes. La Dissident vol construir vincles basats en la llibertat, l’autonomia, la responsabilitat, l’amistat, el suport mutu i la cura.',
    choicesTitle:'Tres maneres de participar', donation:'Aportació a fons perdut', donationDesc:'Sense mínim ni màxim. A partir de 50 €, tassa opcional.',
    loan:'Préstec personal', loanDesc:'Demana informació. La gestió es farà personalment amb la cooperativa.',
    diffusion:'Difusió', diffusionDesc:'Compartir també és una manera de fer possible el projecte.',
    donationAction:'Aportar a fons perdut', loanAction:'Demanar informació', share:'Compartir',
    formsHeading:'Formularis', formsIntro:'Tria la modalitat que t’interesse i desplega el formulari.',
    formTitle:'Formulari d’aportació a fons perdut', loanTitle:'Formulari per al préstec personal',
    name:'Nom', surname:'Cognoms', email:'Correu electrònic', phone:'Telèfon (opcional)', amount:'Quantitat (€)', other:'Altra quantitat',
    cupHint:'A partir de 50 € pots demanar una tassa de regal.', cupTitle:'Tassa de regal (aportacions de 50 € o més)',
    cupYes:'Vull rebre la tassa de regal', cupNo:'Renuncie a la tassa i destine tota l’aportació al projecte',
    deliveryTitle:'Com vols rebre la tassa?', pickup:'Recollida', shipping:'Enviament a una adreça',
    address:'Adreça de lliurament', addressPlaceholder:'Carrer, número, pis, porta…', postalCode:'Codi postal', city:'Localitat', province:'Província',
    modality:'Modalitat', undecided:'Encara no ho sé', comment:'Comentari (opcional)', minLoan:'L’import mínim orientatiu del préstec és de 3.000 €.',
    privacy:'He llegit la política de privacitat i accepte el tractament de les meues dades per a gestionar la consulta.',
    news:'Vull rebre novetats de La Dissident (opcional).',
    send:'Enviar formulari', donationNext:'Rebràs un correu amb les instruccions per a fer la transferència. Enviar el formulari no equival a efectuar una aportació.',
    demoSuccess:'Prova completada. No s’ha enviat res. Quan s’active, rebràs un correu amb el pas següent.',
    loanSuccess:'Prova completada. No s’ha enviat res. Quan s’active, la cooperativa rebrà la consulta i et contactarà personalment.',
    loanWarning:'Aquest formulari és una sol·licitud d’informació: la cooperativa gestionarà el contacte personalment. El préstec es formalitzarà fora del web; La Dissident no és prestatària ni garant.',
    faq:'Preguntes freqüents', faqItems:[
      ['Com puc aportar?','Pots fer una transferència directa amb les dades bancàries que publicarà la cooperativa una vegada validades.'],
      ['Puc demanar una tassa?','Sí, si has aportat almenys 50 €, pots sol·licitar-la per correu amb el justificant de la transferència.'],
      ['Com funciona el finançament?','Pots sol·licitar informació sobre un préstec personal a V. Andrés Bertí o una aportació al capital social com a persona associada. No es formalitza res per la web.']
    ],
    shareTitle:'Ajuda’ns a difondre', shareCopy:'Encara que no pugues aportar diners, compartir aquesta campanya ens ajuda molt.', copied:'Enllaç copiat!',
    legal:'Avís legal', privacyLink:'Privacitat', cookies:'Cookies',
    footer:'La revolució no sempre esclata. De vegades, es cultiva.'
  },
  es: {
    navAbout:'Sobre el proyecto', navFaq:'Preguntas', participate:'Participa', watch:'Ver el vídeo',
    headline:'Sacar una casa del mercado. Ponerla al servicio de la comunidad.',
    subtitle:'Objetivo: conseguir 115.000 € antes del 31 de enero de 2027',
    achieved:'recaudados', missing:'pendientes', updated:'Actualizado el',
    videoHeading:'Conoce La Dissident', aboutTitle:'La Dissident ya existe',
    about:'La Dissident es una cooperativa valenciana de vivienda en cesión de uso y un espacio para el pensamiento crítico, la libertad y la disidencia. Ya vivimos, cultivamos, organizamos actividades y construimos comunidad. Ahora queremos consolidar la casa y abrirla a más personas.',
    videoPlaceholder:'Vídeo pendiente de configurar',
    objectivesTitle:'Objetivos del proyecto',
    goalTitle:'Qué queremos hacer', goalCopy:'Necesitamos reunir 115.000 euros para realizar la compra inicial. Queremos que los recursos se conviertan en habitaciones, cultivos, talleres, autonomía y vida en común, no en intereses bancarios.',
    conceptTitle:'Cesión de uso: habitar sin poseer', concept:'La casa será de la cooperativa. Las personas podrán habitarla, cuidarla y transformarla, pero nadie podrá vender una parte, especular con ella o convertirla en herencia privada.',
    communityTitle:'Comunidad relacional', community:'Queremos cuestionar la propiedad de la casa y también la posesión de los afectos. La Dissident quiere construir vínculos basados en la libertad, la autonomía, la responsabilidad, la amistad, el apoyo mutuo y los cuidados.',
    choicesTitle:'Tres maneras de participar', donation:'Aportación a fondo perdido', donationDesc:'Sin mínimo ni máximo. A partir de 50 €, taza opcional.',
    loan:'Préstamo personal', loanDesc:'Solicita información. La gestión se hará personalmente con la cooperativa.',
    diffusion:'Difusión', diffusionDesc:'Compartir también es una forma de hacer posible el proyecto.',
    donationAction:'Aportar a fondo perdido', loanAction:'Solicitar información', share:'Compartir',
    formsHeading:'Formularios', formsIntro:'Elige la modalidad que te interese y despliega el formulario.',
    formTitle:'Formulario de aportación a fondo perdido', loanTitle:'Formulario para el préstamo personal',
    name:'Nombre', surname:'Apellidos', email:'Correo electrónico', phone:'Teléfono (opcional)', amount:'Cantidad (€)', other:'Otra cantidad',
    cupHint:'A partir de 50 € puedes solicitar una taza de regalo.', cupTitle:'Taza de regalo (aportaciones de 50 € o más)',
    cupYes:'Quiero recibir la taza de regalo', cupNo:'Renuncio a la taza y destino toda la aportación al proyecto',
    deliveryTitle:'¿Cómo quieres recibir la taza?', pickup:'Recogida', shipping:'Envío a una dirección',
    address:'Dirección de entrega', addressPlaceholder:'Calle, número, piso, puerta…', postalCode:'Código postal', city:'Localidad', province:'Provincia',
    modality:'Modalidad', undecided:'Todavía no lo sé', comment:'Comentario (opcional)', minLoan:'El importe mínimo orientativo del préstamo es de 3.000 €.',
    privacy:'He leído la política de privacidad y acepto el tratamiento de mis datos para gestionar la consulta.',
    news:'Quiero recibir novedades de La Dissident (opcional).',
    send:'Enviar formulario', donationNext:'Recibirás un correo con las instrucciones para hacer la transferencia. Enviar el formulario no equivale a realizar una aportación.',
    demoSuccess:'Prueba completada. No se ha enviado nada. Cuando se active, recibirás un correo con el siguiente paso.',
    loanSuccess:'Prueba completada. No se ha enviado nada. Cuando se active, la cooperativa recibirá la consulta y contactará contigo personalmente.',
    loanWarning:'Este formulario es una solicitud de información: la cooperativa gestionará el contacto personalmente. El préstamo se formalizará fuera de la web; La Dissident no es prestataria ni garante.',
    faq:'Preguntas frecuentes', faqItems:[
      ['¿Cómo puedo aportar?','Puedes hacer una transferencia directa con los datos bancarios que publicará la cooperativa una vez validados.'],
      ['¿Puedo solicitar una taza?','Sí, si has aportado al menos 50 €, puedes solicitarla por correo con el justificante de la transferencia.'],
      ['¿Cómo funciona la financiación?','Puedes solicitar información sobre un préstamo personal a V. Andrés Bertí o una aportación al capital social como persona asociada. Nada se formaliza en la web.']
    ],
    shareTitle:'Ayúdanos a difundir', shareCopy:'Aunque no puedas aportar dinero, compartir esta campaña nos ayuda mucho.', copied:'¡Enlace copiado!',
    legal:'Aviso legal', privacyLink:'Privacidad', cookies:'Cookies',
    footer:'La revolución no siempre estalla. A veces, se cultiva.'
  }
} as const;
