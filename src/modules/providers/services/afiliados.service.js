const MOCK_AFILIADOS = [
  { id: '1', nombre: 'Juan Suarez',   nroAfil: 'SOC-2024-00812', telefono: '1153014567', medico: 'Paula García',   estado: 'Activo' },
  { id: '2', nombre: 'María Sáez',    nroAfil: 'SOC-2023-00445', telefono: '1154223891', medico: 'Carlos López',   estado: 'Activo' },
  { id: '3', nombre: 'Luclá Suarez',  nroAfil: 'SOC-2023-00389', telefono: '1158765432', medico: 'Ana Martínez',   estado: 'Activo' },
  { id: '4', nombre: 'Lucia Suarez',  nroAfil: 'SOC-2022-00201', telefono: '1152345678', medico: 'Roberto Díaz',   estado: 'Activo' },
  { id: '5', nombre: 'Pedro Suarez',  nroAfil: 'SOC-2023-00527', telefono: '1153879421', medico: 'Paula García',   estado: 'Finalizado' },
  { id: '6', nombre: 'Romina Suarez', nroAfil: 'SOC-2022-00361', telefono: '1129586032', medico: 'Lorenda García', estado: '' },
];

async function searchAfiliados(query) {
  if (process.env.USE_MOCK === 'true') {
    if (!query) return [];
    const lowerQ = query.toLowerCase();
    return MOCK_AFILIADOS.filter(a => 
      a.nombre.toLowerCase().includes(lowerQ) || 
      a.nroAfil.toLowerCase().includes(lowerQ) ||
      a.telefono.includes(lowerQ)
    );
  }
  
  // TODO: Database logic
  return [];
}

module.exports = {
  searchAfiliados
};
