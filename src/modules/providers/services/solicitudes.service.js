const MOCK_SOLICITUDES = [
  { id: '1', afiliado: 'Gómez, María',     nro: 'SOC-2025-00012', tipo: 'Reintegro',    estado: 'Pendiente',   fecha: '10/06/2024' },
  { id: '2', afiliado: 'López, Roberto',   nro: 'AUT-2024-00221', tipo: 'Autorización', estado: 'En análisis', fecha: '08/05/2024' },
  { id: '3', afiliado: 'Fernández, Diego', nro: 'AUT-2024-00036', tipo: 'Receta',       estado: 'En análisis', fecha: '10/07/2023' },
  { id: '4', afiliado: 'Martínez, Ana',    nro: 'SOC-2024-00226', tipo: 'Reintegro',    estado: 'Observada',   fecha: '20/01/2023' },
  { id: '5', afiliado: 'Rodríguez, Juan',  nro: 'SOC-2024-00371', tipo: 'Autorización', estado: 'Observada',   fecha: '20/01/2023' },
  { id: '6', afiliado: 'Pérez, Laura',     nro: 'SOC-2024-00039', tipo: 'Receta',       estado: 'Aprobada',    fecha: '26/05/2023' },
  { id: '7', afiliado: 'Torres, Carlos',   nro: 'AUT-2024-00030', tipo: 'Autorización', estado: 'Rechazada',   fecha: '24/05/2023' },
  { id: '8', afiliado: 'Sánchez, Paula',   nro: 'SOC-2024-00411', tipo: 'Receta',       estado: 'Pendiente',   fecha: '15/04/2024' },
  { id: '9', afiliado: 'Herrera, Marcos',  nro: 'AUT-2024-00198', tipo: 'Autorización', estado: 'En análisis', fecha: '03/03/2024' },
  { id: '10',afiliado: 'Romero, Claudia',  nro: 'SOC-2024-00055', tipo: 'Reintegro',    estado: 'Aprobada',    fecha: '11/02/2024' },
];

/**
 * Obtener lista de solicitudes (con filtros opcionales en el futuro)
 */
async function getSolicitudes(cuitPrestador) {
  if (process.env.USE_MOCK === 'true') {
    return MOCK_SOLICITUDES;
  }
  
  // TODO: Database logic
  return [];
}

/**
 * Obtener detalle de una solicitud
 */
async function getSolicitudById(id) {
  if (process.env.USE_MOCK === 'true') {
    return MOCK_SOLICITUDES.find(s => s.id === id);
  }
  
  // TODO: Database logic
  return null;
}

/**
 * Cambiar estado de una solicitud
 */
async function updateEstadoSolicitud(id, nuevoEstado, cuitPrestador, motivo = null) {
  if (process.env.USE_MOCK === 'true') {
    const solicitud = MOCK_SOLICITUDES.find(s => s.id === id);
    if (solicitud) {
      solicitud.estado = nuevoEstado;
      return solicitud;
    }
    return null;
  }
  
  // TODO: Database logic
  // 1. Verificar si el usuario puede cambiar el estado (dueño del análisis)
  // 2. Insertar en HistorialEstadoSolicitud
  // 3. Actualizar estadoActual en Solicitud
  return null;
}

module.exports = {
  getSolicitudes,
  getSolicitudById,
  updateEstadoSolicitud
};
