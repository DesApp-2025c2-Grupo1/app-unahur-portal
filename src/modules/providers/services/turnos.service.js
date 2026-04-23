let MOCK_TURNOS = {
  '2026-04-16': [
    { id: '1', hora: '09:00', horaFin: '09:30', nombre: 'López, Roberto',  motivo: 'Control cardiovascular', iniciales: 'LR', color: 'bg-indigo-100 text-indigo-700' },
    { id: '2', hora: '10:00', horaFin: '10:30', nombre: 'Martínez, Paula', motivo: 'Primera consulta',        iniciales: 'MP', color: 'bg-emerald-100 text-emerald-700' },
  ],
  '2026-04-17': [
    { id: '3', hora: '08:30', horaFin: '09:00', nombre: 'Gómez, María',    motivo: 'Seguimiento crónico',    iniciales: 'GM', color: 'bg-pink-100 text-pink-700' },
  ],
  '2026-04-20': [
    { id: '6', hora: '09:30', horaFin: '10:00', nombre: 'Rodríguez, Ana',  motivo: 'Control de presión',     iniciales: 'RA', color: 'bg-rose-100 text-rose-700' },
  ]
};

async function getTurnosByDate(cuitPrestador, dateStr) {
  if (process.env.USE_MOCK === 'true') {
    return MOCK_TURNOS[dateStr] || [];
  }
  // TODO: Database logic
  return [];
}

async function addNotaToTurno(idTurno, notaRaw) {
  if (process.env.USE_MOCK === 'true') {
    // Para el mock, actualizamos la nota en el front, 
    // en la BD real se crearía una NotaClinica asociada al idTurno
    return { success: true, nota: notaRaw.nota };
  }
  // TODO: Database logic
  return { success: true };
}

async function createTurno(data) {
  if (process.env.USE_MOCK === 'true') {
    // Formato mock fecha "DD/MM/YYYY" a YYYY-MM-DD
    const { fecha, afiliado, horaIni, horaFin, motivo } = data;
    const parts = fecha.split('/');
    const dateStr = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : fecha;
    
    if (!MOCK_TURNOS[dateStr]) MOCK_TURNOS[dateStr] = [];
    
    // Generar iniciales básicas para el mock
    const iniciales = afiliado.substring(0, 2).toUpperCase();
    
    const newId = `t_${Date.now()}`;
    const nuevoTurno = { id: newId, hora: horaIni, horaFin, nombre: afiliado, motivo, iniciales, color: 'bg-teal-100 text-teal-700' };
    MOCK_TURNOS[dateStr].push(nuevoTurno);
    
    return nuevoTurno;
  }
  return null;
}

module.exports = {
  getTurnosByDate,
  addNotaToTurno,
  createTurno
};
