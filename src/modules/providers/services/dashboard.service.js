async function getDashboardStats(cuitPrestador) {
  if (process.env.USE_MOCK === 'true') {
    return {
      pendientes: 28,
      observadas: 6,
      estadisticas: {
        Labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
        Pendientes: [12, 19, 3, 5, 2],
        Resueltas: [2, 3, 20, 5, 1],
      },
      actividadReciente: [
        { id: '1', texto: 'Reintegro de Gómez, María', tipo: 'Pendiente', color: 'bg-amber-100 text-amber-700', tiempo: 'Hace 5m' },
        { id: '2', texto: 'Autorización de López, Roberto', tipo: 'En análisis', color: 'bg-indigo-100 text-indigo-700', tiempo: 'Hace 2h' },
        { id: '3', texto: 'Receta de Martínez, Ana', tipo: 'Observada', color: 'bg-violet-100 text-violet-700', tiempo: 'Ayer 20:15' },
        { id: '4', texto: 'Autorización de Gómez, María', tipo: 'Aprobada', color: 'bg-emerald-100 text-emerald-700', tiempo: 'Hace 2d' }
      ]
    };
  }
  
  // TODO: Database logic
  return {
    pendientes: 0,
    observadas: 0,
    estadisticas: {},
    actividadReciente: []
  };
}

module.exports = {
  getDashboardStats
};
