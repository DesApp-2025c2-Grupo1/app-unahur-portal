let MOCK_SITUACIONES = {
  '1': [
    { id: 'st1', tipo: 'Tratamiento psicológico',      fechaInicio: '02/01/2024', fechaFin: '01/06/2024', activa: true },
    { id: 'st2', tipo: 'Rehabilitación post-operatoria', fechaInicio: '20/03/2023', fechaFin: '10/07/2023', activa: false },
  ],
  '2': [
    { id: 'st3', tipo: 'Terapia de pareja', fechaInicio: '05/02/2024', fechaFin: '31/03/2024', activa: false },
  ],
  '3': [
    { id: 'st4', tipo: 'Kinesiología',    fechaInicio: '10/01/2024', fechaFin: '10/04/2024', activa: true },
  ],
  '4': [],
  '5': [
    { id: 'st5', tipo: 'Control crónico', fechaInicio: '01/06/2023', fechaFin: '01/12/2023', activa: false },
  ],
  '6': [],
};

const SITUACION_OPCIONES = [
  { id: 1, nombre: 'Tratamiento psicológico' },
  { id: 2, nombre: 'Rehabilitación post-operatoria' },
  { id: 3, nombre: 'Terapia de pareja' },
  { id: 4, nombre: 'Control crónico' },
  { id: 5, nombre: 'Seguimiento oncológico' },
  { id: 6, nombre: 'Medicación prolongada' },
  { id: 7, nombre: 'Kinesiología' },
];

async function getSituacionesByAfiliado(idAfiliado) {
  if (process.env.USE_MOCK === 'true') {
    return MOCK_SITUACIONES[idAfiliado] || [];
  }
  // TODO: Database logic
  return [];
}

async function getTiposSituacion() {
  if (process.env.USE_MOCK === 'true') {
    return SITUACION_OPCIONES;
  }
  // TODO: Database logic
  return [];
}

async function createSituacion(idAfiliado, data) {
  if (process.env.USE_MOCK === 'true') {
    const newId = `st_${Date.now()}`;
    const situacion = { id: newId, ...data };
    if (!MOCK_SITUACIONES[idAfiliado]) MOCK_SITUACIONES[idAfiliado] = [];
    MOCK_SITUACIONES[idAfiliado].push(situacion);
    return situacion;
  }
  // TODO: Database logic
  return null;
}

async function updateSituacion(idAfiliado, idSituacion, data) {
  if (process.env.USE_MOCK === 'true') {
    const list = MOCK_SITUACIONES[idAfiliado] || [];
    const index = list.findIndex(s => s.id === idSituacion);
    if (index >= 0) {
      list[index] = { ...list[index], ...data };
      return list[index];
    }
    return null;
  }
  // TODO: Database logic
  return null;
}

module.exports = {
  getSituacionesByAfiliado,
  getTiposSituacion,
  createSituacion,
  updateSituacion
};
