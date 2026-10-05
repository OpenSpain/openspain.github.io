import { ipc } from './program.js';

const censusURL = 'https://www.ine.es/prensa/censo_2021_jun.pdf';
const crimeURL = 'https://estadisticasdecriminalidad.ses.mir.es/sec/jaxiPx/Tabla.htm?path=/Datos11//l0/&file=11002.px&type=pcaxis&L=0';
const energyURL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sdg_07_50?lang=EN&geo=ES&sinceTimePeriod=2019';
const budgetURL = 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-22128';
const procurementURL = 'https://www.hacienda.gob.es/rsc/oirescon/informe-anual-supervision-2026/ias2026-modulo1.pdf';

function ineFigure(title, labels, values, unit, page, note, ceiling) {
  return {
    title, labels, values, unit, note, ceiling,
    source: `INE · España en cifras 2026 · página ${page} del PDF · fechas indicadas en el gráfico`,
    url: `https://www.ine.es/prodyser/espa_cifras/EEC_2026_PUBLICACION_COMPLETA.pdf#page=${page}`,
  };
}

export const observedCharts = {
  1: [{
    title: 'Percepción de corrupción: España',
    labels: ['2024', '2025'], values: [56, 55], unit: 'puntos / 100', ceiling: 100,
    source: 'Transparency International España · CPI 2025 · publicado en febrero de 2026',
    url: 'https://transparencia.org.es/actualidad/indice-de-percepcion-de-la-corrupcion-2025/',
    note: 'Más puntuación significa menor percepción de corrupción. No mide dinero robado, porcentaje de corrupción ni condenas. No es una evaluación del programa.',
  }],
  2: [{
    title: 'Viviendas en España: parque, uso y límites',
    labels: ['Totales', 'Principales', 'Vacías'],
    values: [26623708, 18536616, 3837328], unit: 'viviendas',
    source: 'INE · Censo 2021 · publicado el 30 de junio de 2023', url: censusURL,
    note: 'Dato histórico, no stock de 2026. Principales y vacías son subconjuntos del total, no categorías que deban sumarse. Vacía se clasifica por consumo eléctrico; no implica disponibilidad o habitabilidad.',
  }, {
    title: 'Dónde están las viviendas clasificadas como vacías',
    labels: ['Hasta 1.000 hab.', '1.001–10.000', '10.001–50.000', '50.001–250.000', 'Más de 250.000'],
    values: [551377, 1173031, 995782, 714065, 403073], unit: 'viviendas',
    source: 'INE · Censo 2021 · distribución por tamaño de municipio', url: censusURL,
    note: 'El 45 % estaba en municipios de menos de 10.000 habitantes. La existencia de viviendas vacías no demuestra que estén donde se necesita vivienda ni que puedan movilizarse inmediatamente.',
  }, {
    title: 'Precios de compra: variación anual',
    labels: ['2024 T3', '2024 T4', '2025 T1', '2025 T2', '2025 T3', '2025 T4', '2026 T1', '2026 T2'],
    values: [8.1, 11.3, 12.2, 12.7, 12.8, 12.9, 12.9, 12.2], unit: '%', ceiling: 15,
    source: 'INE · IPV · segundo trimestre de 2026',
    url: 'https://www.ine.es/dyngs/Prensa/IPV2T26.htm',
    note: 'Mide precios de compra, no alquileres ni número de personas que necesitan vivienda. Una tasa positiva menor sigue significando aumento de precios.',
  }, {
    title: 'Allanamiento y usurpación: hechos conocidos',
    labels: ['2023', '2024', '2025'], values: [15289, 16426, 14875], unit: 'hechos conocidos',
    source: 'Ministerio del Interior · serie nacional anual', url: crimeURL,
    note: 'No son viviendas únicas ocupadas ni condenas. Incluye distintos delitos e inmuebles; no se presenta como dato de 2026.',
  }],
  4: [{
    title: 'Empleo: personas ocupadas',
    labels: ['2024 T4', '2026 T2'], values: [21857900, 22779000], unit: 'personas',
    source: 'INE · EPA · cuarto trimestre 2024 y segundo trimestre 2026',
    url: 'https://www.ine.es/dyngs/Prensa/EPA2T26.htm',
    note: 'Son trimestres distintos: hay estacionalidad y cambios de población. No demuestra mejora salarial ni efecto de las propuestas. Paro del segundo trimestre de 2026: 9,87 %.',
  }],
  16: [{
    title: 'Precios: IPC general definitivo de 2026',
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    values: ipc[2026], unit: '%', ceiling: 7,
    source: 'INE · IPC agosto 2026 · publicado el 15 de septiembre',
    url: 'https://www.ine.es/dyngs/Prensa/IPC0826.htm',
    note: 'Contexto del poder adquisitivo, no indicador de carga fiscal ni efecto de una rebaja. Septiembre sigue siendo un adelanto y no está en esta serie.',
  }],
  3: [
    ineFigure('Plazas en alojamientos turísticos: media de 2025',
      ['Hoteles', 'Apartamentos', 'Campings', 'Turismo rural', 'Albergues'],
      [1585944, 512745, 507218, 161849, 63791], 'plazas', 50,
      'Datos provisionales y medias anuales estimadas. Apartamentos turísticos de esta encuesta no equivalen a todas las viviendas anunciadas en plataformas. Capacidad no demuestra precio accesible ni disponibilidad en una fecha concreta.'),
    ineFigure('Ocupación turística en 2025: capacidades distintas',
      ['Hoteles', 'Apartamentos', 'Campings', 'Turismo rural', 'Albergues'],
      [61.55, 38.70, 45.85, 21.60, 31.85], '%', 50,
      'Media anual provisional: por plazas salvo campings, que mide parcelas. No comparar como si fueran denominadores idénticos ni interpretar capacidad no ocupada como alojamiento disponible, barato o habitable todo el año.', 100),
  ],
  5: [
    ineFigure('Uso empresarial de tecnología: primer trimestre de 2025',
      ['IA', 'Nube de pago', 'Sitio web'], [21.2, 44.3, 84.5], '%', 38,
      'Empresas de 10 o más empleados con conexión a Internet, según la publicación. Categorías solapadas: no sumar. Uso declarado no demuestra productividad, calidad o ahorro y no describe todas las microempresas.', 100),
    ineFigure('Uso de IA generativa por edad: 2025',
      ['16–24 años', '25–34', '35–44', '45–54', '55–64', '65–74'],
      [75.6, 57.2, 43.8, 32.6, 19.2, 7.4], '%', 26,
      'Porcentaje dentro de cada grupo de edad. No mide competencias, empleos perdidos ni necesidad de una renta básica; muestra brechas de uso.', 100),
  ],
  6: [ineFigure('Asalariados por sector: media anual de 2025',
    ['Sector público', 'Sector privado'], [3548.8, 15387.4], 'miles de personas', 28,
    'Población ocupada asalariada de la EPA. El tamaño del empleo público no prueba duplicidad, ineficiencia o exceso de plantilla. Faltan plazos y calidad por procedimiento para el diagnóstico de gestión.')],
  7: [ineFigure('Ocupados de nacionalidad extranjera: residencia en 2025',
    ['Menos de 1 año', '1 año', '2 años', '3 años', '4–6 años', '7 años o más'],
    [63.7, 209.9, 282.7, 285.4, 524.4, 2122.6], 'miles de personas', 28,
    'Media anual de ocupados con nacionalidad extranjera, no todos los nacidos fuera de España ni permisos de nómadas. No mide talento, irregularidad o delincuencia. Las cifras redondeadas pueden no coincidir exactamente con el total.')],
  8: [ineFigure('Destino de las exportaciones de bienes: 2025',
    ['Unión Europea', 'América', 'Asia', 'África', 'Oceanía'],
    [61.8, 9.9, 8.1, 5.8, 0.6], '%', 34,
    'Datos provisionales por valor de bienes; no incluye servicios. América no equivale a Estados Unidos y la UE es parte de Europa. Se omiten otros destinos europeos: no sumar estas barras como el total mundial.', 100)],
  9: [ineFigure('Abandono temprano de educación-formación',
    ['2024 · total', '2025 · total', '2025 · hombres', '2025 · mujeres'],
    [13.0, 12.8, 15.9, 9.5], '%', 15,
    'Población de 18–24 años sin secundaria de segunda etapa y sin formación en curso. Totales y subgrupos no se suman. No mide inglés, habilidades cotidianas ni resultados de los cursos propuestos.', 20)],
  10: [ineFigure('Distribución del PIB cultural: 2023',
    ['Audiovisual', 'Libros y prensa', 'Artes plásticas', 'Artes escénicas', 'Patrimonio', 'Interdisciplinar'],
    [29.1, 24.3, 22.7, 9.4, 7.5, 6.8], '% del PIB cultural', 18,
    'Cuenta Satélite de la Cultura: 33.204 millones de euros, 2,2 % del PIB total. Componentes redondeados. No es ingreso de artistas, salario ni estabilidad contractual; esos datos siguen pendientes.', 100)],
  11: [ineFigure('Empresas innovadoras en la encuesta',
    ['2020–2022', '2022–2024'], [23.9, 27.3], '%', 37,
    'Ventanas de tres años con 2022 en común, no observaciones anuales independientes. No identifica startups, inversión de venture capital o éxito exportador y no permite atribuir el cambio al programa.', 100)],
  12: [{
    title: 'Concurrencia en lotes y contratos adjudicados: 2025',
    labels: ['Un licitador', 'Más de uno'], values: [41.93, 58.07], unit: '%', ceiling: 100,
    source: 'OIReScon · IAS 2026, módulo I · tabla 74', url: procurementURL,
    note: '225.695 lotes/contratos analizados, excluyendo negociados sin publicidad: 94.639 con un licitador. Porcentaje por número, no por euros. Un único licitador no prueba fraude; categorías y reglas explican parte de la concurrencia.',
  }, {
    title: 'Adjudicaciones con un licitador por nivel: 2025',
    labels: ['Estatal', 'Autonómico', 'Local'], values: [45.76, 45.49, 37.31], unit: '%', ceiling: 100,
    source: 'OIReScon · IAS 2026, módulo I · tabla 77', url: procurementURL,
    note: 'Mismo alcance sin negociados sin publicidad; porcentaje dentro de cada sector por número de lotes/contratos. Distintas compras impiden interpretar directamente la diferencia como corrupción o calidad de gestión.',
  }],
  13: [{
    title: 'Espera quirúrgica media en el SNS: diciembre de 2025',
    labels: ['Total SNS', 'Dermatología', 'Cirugía cardíaca', 'Neurocirugía', 'Cirugía plástica'],
    values: [121, 64, 77, 172, 269], unit: 'días',
    source: 'Ministerio de Sanidad · SISLE-SNS · corte 31 de diciembre de 2025',
    url: 'https://www.sanidad.gob.es/estadEstudios/estadisticas/inforRecopilaciones/docs/Nota_Resumen_SISLE__dic25.pdf',
    note: '853.509 pacientes pendientes de cirugía electiva; 21,6 % llevaba más de seis meses. Medias, no medianas: no son la línea base de los pilotos. Mezcla de procesos y prioridades distinta; no mide por sí sola eficiencia o superioridad pública/privada.',
  }],
  14: [ineFigure('Empresas sin asalariados: 1 de enero de 2025',
    ['Sin asalariados', 'Con asalariados'], [54.4, 45.6], '%', 36,
    'DIRCE: 3.310.824 empresas del universo del directorio. Segunda barra calculada como complemento del 54,4 %. Stock empresarial, no altas anuales, tiempo de apertura o trabajadores afiliados al RETA.', 100)],
  15: [ineFigure('Trabajo por cuenta propia: media de 2025',
    ['Empleadores', 'Sin asalariados', 'Cooperativistas', 'Ayuda familiar'],
    [954.1, 2231.5, 23.7, 68.2], 'miles de personas', 28,
    'Categorías profesionales de la EPA; ayuda familiar incluye trabajo sin remuneración. No equivale a afiliación al RETA ni informa cuotas, ingresos disponibles o viabilidad de cada actividad.')],
  17: [{
    title: 'Dependencia energética exterior de España',
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    values: [75.034, 67.892, 69.38, 74.202, 68.261, 68.871], unit: '%', ceiling: 100,
    source: 'Eurostat · sdg_07_50 · total de productos energéticos', url: energyURL,
    note: 'Importaciones netas sobre energía bruta disponible. No es dependencia de un país concreto ni una cuota de electricidad. Cambios de demanda y existencias afectan el indicador; no prueba ahorro o autosuficiencia causada por una medida.',
  }],
  18: [{
    title: 'Contribución española a la ESA comunicada por el Ministerio',
    labels: ['2018', '2025'], values: [202, 300], unit: 'millones de euros anuales', kind: 'announced',
    source: 'Ministerio de Ciencia · comunicación de noviembre de 2025',
    url: 'https://www.ciencia.gob.es/Noticias/2025/noviembre/espana-cuarta-potencia-esa.html',
    note: 'Cifras de contribución citadas en la comunicación, no ejecución auditada aquí. No se incluyen como gasto realizado los compromisos 2026–2030. No mide retorno industrial, empleo, lanzamientos o calidad de mapas.',
  }],
  19: [{
    title: 'Publicidad institucional estatal: gasto de 2024',
    labels: ['Agricultura', 'Interior', 'Igualdad', 'Cultura', 'Otros órganos'],
    values: [12508275, 10324836, 9789231.01, 7525712, 30282549.99], unit: 'euros',
    source: 'Comisión de Publicidad y Comunicación Institucional · Informe 2024 · cuadro 2.1',
    url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/cpci/Documents/Informe-2024.pdf',
    note: '70.430.604 euros y 108 campañas institucionales de AGE y sector público estatal. Excluye otros territorios y campañas comerciales tratadas aparte. Otros órganos es el resto calculado. No muestra reparto por medio ni prueba favoritismo, censura o afinidad editorial.',
  }],
  20: [{
    title: 'Confianza en otras personas: España, 16 años o más',
    labels: ['2021', '2022', '2023', '2024', '2025'], values: [6.3, 6.3, 6.3, 6.2, 6.2], unit: 'media / 10', ceiling: 10,
    source: 'Eurostat · ilc_pw03 · sexo y educación: total, edad 16+',
    url: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/ilc_pw03?lang=EN&geo=ES&sex=T&age=Y_GE16&isced11=TOTAL',
    note: 'Valoración subjetiva media de confianza interpersonal, no en un partido ni adhesión a símbolos. Se evita la ruptura de serie señalada para 2018. El cambio no se atribuye a una causa ni demuestra efecto de proyectos de convivencia.',
  }],
  21: [{
    title: 'Créditos presupuestarios de dos programas: 2023',
    labels: ['Jefatura Estado', 'Apoyo a gestión'], values: [8431.15, 7775.83], unit: 'miles de euros', kind: 'normative',
    source: 'Ley 31/2022 · anexo I · programas 911M y 911Q', url: budgetURL,
    note: 'Créditos aprobados de dos programas, no gasto ejecutado ni coste completo de la monarquía. No incluye automáticamente seguridad u otros servicios. No se compara con una presidencia republicana ni se presenta como presupuesto de 2026.',
  }],
  22: [{
    title: 'Elecciones al Congreso: participación definitiva de 2023',
    labels: ['Votaron', 'No votaron'], values: [24952447, 12517011], unit: 'electores',
    source: 'Junta Electoral Central · BOE-A-2023-18907 · cuadro I',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2023-18907',
    note: 'Censo total de 37.469.458, incluidos residentes ausentes y certificaciones. No votaron es la diferencia censo-votantes; no confundir con avances sin voto exterior. Participar no mide comprensión o calidad de deliberación y no determina el valor del voto.',
  }],
  23: [{
    title: 'Retribución normativa inicial de altos cargos: 2023',
    labels: ['Presidente', 'Vicepresidente', 'Ministro'], values: [90010.20, 84600.72, 79415.16], unit: 'euros anuales', kind: 'normative',
    source: 'Ley 31/2022 · artículo 20 · tabla para 2023', url: budgetURL,
    note: 'Doce mensualidades sin pagas extraordinarias, sin antigüedad ni posteriores actualizaciones. No es nómina verificada de 2026, ingreso privado, pensión o bono. La remuneración no mide por sí sola integridad o buen desempeño.',
  }],
  24: [ineFigure('Dificultad para llegar a fin de mes: 2024',
    ['España', 'Unión Europea'], [21.9, 17.4], '% de población', 25,
    'Eurostat: personas en hogares que llegan con dificultad o mucha dificultad. Contexto económico, no medida de esfuerzo, mentalidad o libertad financiera. No demuestra que emprender sea la solución adecuada para todas ellas.', 100)],
  25: [
    ineFigure('Empresas que permiten teletrabajo',
      ['2023', '2024', '2025'], [34.2, 37.5, 37.4], '%', 38,
      'Encuesta de empresas de 10 o más empleados; no porcentaje de personas teletrabajando ni de empleos totalmente remotos. No identifica acceso rural o permisos internacionales.', 100),
    ineFigure('Acceso digital en hogares: 2025',
      ['Internet', 'Ordenador'], [97.4, 83.8], '% de viviendas', 26,
      'Hogares con al menos una persona de 16–74 años. Acceso no garantiza velocidad, asequibilidad o continuidad; disponer de ordenador e Internet son categorías solapadas.', 100),
    {
      title: 'Autorizaciones estatales de turismo: septiembre de 2026',
      labels: ['Taxi · VT-N', 'VTC · VTC-N'], values: [60074, 27107], unit: 'autorizaciones',
      source: 'Ministerio de Transportes · distribución por comunidad y clase · 1 de septiembre de 2026',
      url: 'https://cdn.transportes.gob.es/portal-web-transportes/transporte-terrestre/estadisticas-tt/webturi.pdf',
      note: 'Tabla estatal consultada el 4 de octubre de 2026; el enlace se actualiza. No son conductores, viajes, vehículos activos ni todas las licencias municipales de taxi. Una autorización de ámbito nacional no acredita habilitación para cualquier servicio urbano. No estima ingreso o efecto de abrir el mercado.',
    },
  ],
  26: [ineFigure('Destino de ventas de la industria: 2023',
    ['España', 'Unión Europea', 'Resto del mundo'], [68.4, 20.6, 11.0], '% de ventas', 41,
    'Conjunto industrial de la encuesta, no solo vehículos, robots o startups. Contexto de mercado y capacidad exportadora; no prueba viabilidad de una fábrica o una inversión concreta.', 100)],
  27: [ineFigure('Estructura por edad de la población: enero de 2025',
    ['65 años o más', 'Menos de 65'], [20.7, 79.3], '% de población', 10,
    'Censo de población: segunda barra es complemento de la proporción mayor de 64 años. No son pensionistas y cotizantes; no predice solvencia. Hay que incorporar ingresos, gasto, carreras y escenarios actuariales.', 100)],
  28: [ineFigure('Protección de ingresos: ECV 2025',
    ['Riesgo pobreza', 'AROPE', 'Privación severa'], [19.5, 25.7, 8.1], '% de población', 25,
    'Riesgo de pobreza: ingresos de 2024; otros componentes según ECV 2025. AROPE combina riesgo de pobreza o exclusión; privación material y social severa es un componente. Categorías solapadas: no sumar. No predice efectos de una renta universal.', 100)],
  29: [{
    title: 'Exposición energética exterior por producto: 2024',
    labels: ['Total energía', 'Petróleo', 'Gas natural'], values: [68.871, 100.274, 97.391], unit: '%',
    source: 'Eurostat · sdg_07_50 · TOTAL, O4000XBIO y G3000', url: energyURL,
    note: 'Importaciones netas sobre energía bruta disponible de cada producto. Puede superar 100 % por balances y existencias; no sumar productos y total. No mide reservas, dependencia de Rusia/Irán o probabilidad de guerra: indica exposición energética.',
  }],
  30: [{
    title: 'Constitución Española: estructura del texto',
    labels: ['Artículos', 'Adicionales', 'Transitorias', 'Derogatoria', 'Final'],
    values: [169, 4, 9, 1, 1], unit: 'artículos o disposiciones', kind: 'normative',
    source: 'BOE · Constitución Española · texto consultado el 5 de octubre de 2026',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229',
    note: 'Recuento de artículos y disposiciones, sin preámbulo, títulos ni rúbricas. Las unidades tienen distinta extensión y función: no sumar como índice de complejidad. No mide comprensión, ambigüedad, litigios o calidad, ni demuestra que deba reformarse la Constitución.',
  }],
  31: [{
    title: 'Duración media estimada de asuntos civiles terminados: 2025',
    labels: ['Ordinarios', 'Demás verbales'], values: [15.5, 11.1], unit: 'meses', kind: 'estimated',
    source: 'CGPJ · primera instancia civil · España · hojas Ordinarios y Demas verbales · tabla de 16 de abril de 2026',
    url: 'https://www.poderjudicial.es/stfls/ESTADISTICA/FICHEROS/Duraciones/20260416%20Juzgados%20de%20Primera%20Instancia%20%20y%20Primera%20Instancia%20e%20Instruccion%20-%20Civil%20-%20Duraciones.xlsx',
    note: 'Modelo sobre asuntos ingresados, resueltos y pendientes; fila España, 2025, redondeada a una décima. No es una medición directa, mediana, duración de recursos o ejecución, ni predicción para un caso. Demás verbales excluye categorías desglosadas en otras hojas. No prueba corrupción ni sirve como línea base del piloto de gestión.',
  }],
};

observedCharts[2].push(ineFigure('Sobrecarga de gasto en vivienda: 2024',
  ['Total población', 'Alquiler mercado'], [7.8, 28.1], '% de población', 24,
  'Personas en hogares con costes de vivienda superiores al 40 % de ingresos, netos de ayudas. Cada barra usa su propio colectivo: total frente a alquiler de mercado. No sumar ni convertirlo en número de hogares sin metodología.', 100));
observedCharts[4].push(ineFigure('Sueldos y salarios medios anuales por sector: 2024',
  ['Industria', 'Construcción', 'Servicios'], [31708.4, 25561.0, 27010.2], 'euros por trabajador', 29,
  'Encuesta Anual de Coste Laboral. Son medias y salarios antes de impuestos, no renta neta, mediana real por hora o mejora de la cohorte propuesta. Comparar jornada y composición antes de explicar diferencias.'));
observedCharts[16].push({
  title: 'Ingresos tributarios nacionales, sin cotizaciones sociales',
  labels: ['2023', '2024'], values: [23.7, 23.9], unit: '% del PIB', ceiling: 40,
  source: 'Eurostat · gov_10a_taxag · S13, D2_D5_D91, PC_GDP',
  url: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_taxag?lang=EN&geo=ES&sinceTimePeriod=2023&unit=PC_GDP&sector=S13&na_item=D2_D5_D91',
  note: 'Total de ingresos por impuestos del agregado indicado: excluye cotizaciones sociales. No es presión fiscal completa ni tipo efectivo de una persona con 100.000 euros. El año 2025 sin valor publicado no se representa como cero.',
});
observedCharts[3].push({
  title: 'Precio hotelero: ADR de diciembre de 2025',
  labels: ['Total hoteles', '5 estrellas', '4 estrellas', '3 estrellas'],
  values: [120.3, 277.5, 126.0, 93.9], unit: 'euros por habitación ocupada',
  source: 'INE · Coyuntura Turística Hotelera · diciembre de 2025',
  url: 'https://www.ine.es/dyngs/Prensa/CTH1225.htm',
  note: 'ADR es facturación media diaria por habitación ocupada, no precio final de una oferta ni alquiler de viviendas. Total y categorías no se suman. Diciembre no es media anual: esta fue 127,7 euros en 2025. No prueba asequibilidad para todos los visitantes.',
});

// These are proposed programme milestones, not observed data or forecasts.
export const targetCharts = [
  ['Documentos exigibles publicados en plazo', null, 90, 95, '%', 'El inicio aún no está medido. Catálogo de documentos y entidades del piloto.'],
  ['Plazo de licencia: índice de referencia', 100, 80, 65, 'índice', 'Referencia matemática = 100, no plazo observado. Meta del piloto municipal, no de toda España.'],
  ['Anuncios de la muestra contrastados', null, 90, 95, '%', 'Muestra y alcance cambian solo con metodología publicada; no es reducción del alquiler.'],
  ['Salario real por hora: índice de referencia', 100, 103, 108, 'índice', 'Referencia matemática = 100. Metas de la cohorte inicial, no previsión salarial nacional.'],
  ['Tiempo por tarea: índice de referencia', 100, 80, 80, 'índice', 'Referencia matemática = 100. Mantener calidad y contabilizar supervisión y mantenimiento.'],
  ['Plazo de trámite: índice de referencia', 100, 80, 65, 'índice', 'Referencia matemática = 100. Medir pendientes y no excluir casos complejos.'],
  ['Plazo de permisos: índice de referencia', 100, 80, 65, 'índice', 'Referencia matemática = 100. Comparar categorías iguales y preservar garantías.'],
  ['Evaluaciones europeas publicadas: acumuladas', null, 1, 4, 'publicaciones', 'Una evaluación inicial y tres actualizaciones anuales. Indicador de entrega, no resultado comercial. Un estudio no garantiza un acuerdo internacional.'],
  ['Mejora de competencias frente al inicio', 0, 10, 10, 'puntos / 100', 'Cero significa ausencia de mejora al inicio, no puntuación inicial del alumnado. El año 4 incluye seguimiento.'],
  ['Facturas exigibles pagadas en plazo', null, 90, 95, '%', 'Meta de encargos públicos incluidos en el piloto, no de todas las facturas culturales.'],
  ['Proyectos con inversión privada desembolsada', null, 10, 30, 'proyectos', 'Sobre la cohorte de 50 proyectos. No contar anuncios o capital público como inversión privada.'],
  ['Contratos con ciclo trazable', null, 100, 1000, 'contratos', 'Indicador de despliegue. No mide por sí solo corrupción evitada o ahorro.'],
  ['Espera sanitaria: índice de referencia', 100, 85, 75, 'índice', 'Referencia matemática = 100. Procesos y prioridades del piloto; mantener seguridad clínica.'],
  ['Tiempo hasta operar: índice de referencia', 100, 75, 60, 'índice', 'Referencia matemática = 100. No confundir constituir una sociedad con poder abrir la actividad.'],
  ['Horas de gestión: índice de referencia', 100, 80, 65, 'índice', 'Referencia matemática = 100. La simplificación no es una rebaja de cuotas aprobada.'],
  ['Horas de cumplimiento: índice de referencia', 100, 85, 70, 'índice', 'Referencia matemática = 100. No representa tipo de IRPF, renta disponible o ahorro nacional.'],
  ['Consumo fósil: índice de referencia', 100, 85, 70, 'índice', 'Referencia matemática = 100. Ajustar clima y actividad, incluir electricidad y coste total.'],
  ['Tiempo de mapas: índice de referencia', 100, 80, 75, 'índice', 'Referencia matemática = 100. El alcance pasa de pilotos a servicios; comparar tareas equivalentes.'],
  ['Entidades con publicidad institucional trazable', null, 5, 20, 'entidades', 'Indicador de despliegue, no clasificación de medios ni medida de neutralidad editorial.'],
  ['Proyectos de cooperación completados', null, 10, 40, 'proyectos', 'Indicador de entrega. Cooperación sostenida y confianza requieren seguimiento separado.'],
  ['Modelos de jefatura del Estado comparados', null, 3, 3, 'modelos', 'Comparación actualizada anualmente. No representa cambio de régimen ni legitimidad medida.'],
  ['Deliberaciones ciudadanas completadas', null, 3, 12, 'procesos', 'Indicador de entrega. Medir además comprensión, accesibilidad y respuesta institucional.'],
  ['Plazo del servicio: índice de referencia', 100, 90, 90, 'índice', 'Referencia matemática = 100. Solo pilotos legales; publicar coste del incentivo y calidad.'],
  ['Participantes acompañados', null, 500, 3000, 'personas', 'Indicador de alcance, no libertad financiera conseguida. Medir proyectos, continuidad y riesgos.'],
  ['Hogares o negocios conectados en el piloto', null, 500, 3000, 'conexiones', 'No es cobertura nacional. Verificar velocidad, precio, latencia y continuidad.'],
  ['Pilotos de robótica o IA completados', null, 5, 30, 'pilotos', 'No implica fábricas, empleos o precios más bajos: esos resultados se verifican por separado.'],
  ['Plazo de reconocimiento: índice de referencia', 100, 85, 75, 'índice', 'Referencia matemática = 100. Gestión de prestaciones, no prueba de solvencia a largo plazo.'],
  ['Participantes en un piloto de protección de ingresos', null, null, 1000, 'personas', 'M12 no fija una meta de participantes: exige tres diseños comparados y un protocolo. En M48, al menos 1.000 participantes solo si se autoriza y financia; sin ello se informa del bloqueo. No representa pagos aprobados ni pobreza reducida.'],
  ['Entidades con planificación de contingencia evaluada', null, 10, 30, 'entidades', 'Indicador de alcance, no servicios preparados o daños evitados. Verificar alternativas, ejercicios, continuidad y correcciones; un plan redactado no cuenta como capacidad ensayada.'],
  ['Artículos con ficha revisada y prueba de comprensión', null, 12, 40, 'artículos', 'Entregas documentales propuestas, no artículos reformados. Exigir texto oficial, explicación, revisión jurídica independiente y prueba; medir comprensión y errores aparte. Sin equipo y financiación, informar del bloqueo.'],
  ['Espera en actuaciones de gestión: índice de referencia', 100, 85, 75, 'índice', 'Referencia matemática = 100, no espera observada. Meta de actuaciones seleccionadas en las unidades participantes, no de todos los juicios. Comparar por tipo y complejidad, incluir pendientes y preservar defensa, calidad e independencia.'],
];

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function makeFigure(series, target = false) {
  const figure = element('figure', undefined, `evidence-figure${target ? ' target-figure' : ''}`);
  const maximum = series.ceiling ?? Math.max(1, ...series.values.filter(value => value !== null));
  const label = target ? 'META PROPUESTA · NO PREVISIÓN'
    : series.kind === 'normative' ? 'CIFRA NORMATIVA · NO RESULTADO OBSERVADO'
    : series.kind === 'estimated' ? 'ESTIMACIÓN ESTADÍSTICA · NO PLAZO DE UN CASO'
    : series.kind === 'announced' ? 'CONTRIBUCIÓN COMUNICADA · ALCANCE LIMITADO'
    : 'DATO OBSERVADO · FECHA Y ALCANCE';
  figure.append(element('p', label, 'evidence-label'), element('figcaption', series.title),
    element('p', `Unidad: ${series.unit} · escala de barras: 0–${maximum.toLocaleString('es-ES')}`, 'evidence-unit'));
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 620 ${series.values.length * 34 + 10}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${series.title}. ${series.labels.map((label, i) => `${label}: ${series.values[i] === null ? 'dato no disponible' : series.values[i].toLocaleString('es-ES')}`).join('; ')}. ${series.unit}.`);
  const make = (tag, attributes, text) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== undefined) node.textContent = text;
    svg.append(node);
  };
  series.values.forEach((value, index) => {
    const y = index * 34 + 8;
    make('text', { x: 0, y: y + 15, fill: '#394b66', 'font-size': 15 }, series.labels[index]);
    make('rect', { x: 148, y, width: 335, height: 22, rx: 3, fill: '#edf1f8' });
    if (value !== null) make('rect', {
      x: 148, y, width: value / maximum * 335, height: 22, rx: 3,
      fill: target ? (index === 0 ? '#8795ae' : '#d2ac4e') : '#2459df',
    });
    make('text', { x: 610, y: y + 16, fill: '#15243e', 'font-size': 15, 'text-anchor': 'end' },
      value === null ? 'N/D' : value.toLocaleString('es-ES', { maximumFractionDigits: 2 }));
  });
  figure.append(svg);
  const tableDetails = element('details', undefined, 'evidence-table');
  tableDetails.append(element('summary', 'Ver valores y unidades'));
  const table = element('table');
  const caption = element('caption', `${series.title} · ${series.unit}`);
  const head = element('thead');
  const heading = element('tr');
  for (const title of ['Periodo o categoría', `Valor (${series.unit})`]) {
    const th = element('th', title);
    th.scope = 'col';
    heading.append(th);
  }
  head.append(heading);
  const body = element('tbody');
  series.values.forEach((value, index) => {
    const row = element('tr');
    const th = element('th', series.labels[index]);
    th.scope = 'row';
    row.append(th, element('td', value === null ? 'No disponible' : value.toLocaleString('es-ES')));
    body.append(row);
  });
  table.append(caption, head, body);
  tableDetails.append(table);
  figure.append(tableDetails);
  const source = element('p', undefined, 'evidence-source');
  if (series.url) {
    const link = element('a', series.source);
    link.href = series.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    source.append(link);
  } else source.textContent = series.source;
  figure.append(source, element('p', series.note, 'evidence-note'));
  return figure;
}

export function createPolicyEvidence(axisId) {
  const metrics = targetCharts[axisId - 1];
  if (!metrics) throw new Error(`Falta el gráfico de metas del eje ${axisId}.`);
  const container = element('div', undefined, 'policy-evidence');
  container.dataset.axisEvidence = axisId;
  const observed = observedCharts[axisId] ?? [];
  if (observed.length) observed.forEach(series => container.append(makeFigure(series)));
  else container.append(element('p', 'Diagnóstico cuantitativo pendiente: este eje aún no tiene una serie específica verificada incorporada. Su indicador principal define qué datos deben obtenerse. El gráfico siguiente muestra metas, no datos reales.', 'evidence-gap'));
  const [title, initial, yearOne, yearFour, unit, note] = metrics;
  container.append(makeFigure({
    title, labels: ['Referencia', 'Año 1 · M12', 'Año 4 · M48'], values: [initial, yearOne, yearFour], unit,
    source: 'Metas del programa · horizonte de referencia octubre 2026–2030',
    note: `${note} No es una predicción: requiere línea base, recursos, acuerdos y evaluación.`,
  }, true));
  return container;
}
