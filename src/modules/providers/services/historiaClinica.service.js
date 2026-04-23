const MOCK_HISTORIA = {
  '1': [
    { id: 'h1', fecha: '16/04/2026', doctor: 'Dr. Carlos Méndez',  especialidad: 'Clínica médica',  modalidad: 'Turno presencial', iniciales: 'CM', color: 'bg-rose-100 text-rose-700',    nota: 'Paciente refiere mejora en episodios de disnea. TA 130/85. Se ajusta dosis de enalapril a 10mg.', mia: true },
    { id: 'h2', fecha: '10/03/2026', doctor: 'Dra. Ana Rivas',     especialidad: 'Cardiología',     modalidad: 'Turno presencial', iniciales: 'AR', color: 'bg-amber-100 text-amber-700',  nota: 'Ecocardiograma. FE 58%, sin alteraciones estructurales significativas.', mia: false },
    { id: 'h3', fecha: '22/01/2026', doctor: 'Dr. Martín Suárez',  especialidad: 'Clínica médica',  modalidad: 'Turno presencial', iniciales: 'MS', color: 'bg-teal-100 text-teal-700',    nota: 'Control rutinario. Presión arterial 120/80. Se indica continuar tratamiento actual.', mia: false },
  ],
  '2': [
    { id: 'h4', fecha: '14/04/2026', doctor: 'Dr. Carlos Méndez',  especialidad: 'Clínica médica',  modalidad: 'Turno presencial', iniciales: 'CM', color: 'bg-rose-100 text-rose-700',    nota: 'Paciente con cuadro gripal. Se indica reposo y antitérmicos.', mia: true },
    { id: 'h5', fecha: '05/02/2026', doctor: 'Dra. Laura Pereyra', especialidad: 'Traumatología',   modalidad: 'Turno presencial', iniciales: 'LP', color: 'bg-indigo-100 text-indigo-700', nota: 'Rx de rodilla derecha. Sin fracturas evidentes. Se indica fisioterapia.', mia: false },
  ]
};

async function getHistoriaByAfiliado(dniAfiliado, cuitPrestador) {
  if (process.env.USE_MOCK === 'true') {
    // Si la DB existiera, el `mia=true` se determina viendo si id_usuario == req.user.id
    return MOCK_HISTORIA[dniAfiliado] || [];
  }
  // TODO: Database logic
  return [];
}

module.exports = {
  getHistoriaByAfiliado
};
