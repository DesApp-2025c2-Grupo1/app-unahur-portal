/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('users')
    .where({ id: 3 })
    .update({ must_change_password: false });

  await knex('prestador_clinical_history').del();
  await knex('prestador_affiliate_situations').del();
  await knex('prestador_situation_types').del();
  await knex('prestador_appointments').del();
  await knex('prestador_requests').del();
  await knex('prestadores').del();

  const [prestador] = await knex('prestadores')
    .insert({
      id: 1,
      user_id: 3,
      cuit: '20304050607',
      first_name: 'Hernan',
      last_name: 'Gomez',
      document_number: '30405060',
      email: 'prestador@test.com',
      phone: '11 4567 8900',
      specialty: 'Clinica medica',
      status: true,
    })
    .returning('*');

  await knex('prestador_situation_types').insert([
    { id: 1, name: 'Tratamiento psicologico' },
    { id: 2, name: 'Rehabilitacion post-operatoria' },
    { id: 3, name: 'Control nutricional' },
    { id: 4, name: 'Kinesiologia respiratoria' },
    { id: 5, name: 'Diabetes tipo II' },
  ]);

  await knex('prestador_requests').insert([
    {
      id: 1,
      prestador_id: prestador.id,
      affiliate_id: 1,
      request_number: 'SOL-0001',
      affiliate_name: 'Juan Perez',
      type: 'Autorización',
      status: 'Pendiente',
      request_date: '2026-04-13',
      description: 'Autorizacion para practica medica programada.',
    },
    {
      id: 2,
      prestador_id: prestador.id,
      affiliate_id: 1,
      request_number: 'SOL-0002',
      affiliate_name: 'Juan Perez',
      type: 'Reintegro',
      status: 'En análisis',
      request_date: '2026-04-12',
      description: 'Reintegro por consulta con especialista.',
    },
    {
      id: 3,
      prestador_id: prestador.id,
      affiliate_id: 1,
      request_number: 'SOL-0003',
      affiliate_name: 'Juan Perez',
      type: 'Receta',
      status: 'Observada',
      request_date: '2026-04-11',
      description: 'Cobertura de medicacion cronica.',
    },
    {
      id: 4,
      prestador_id: prestador.id,
      affiliate_id: 1,
      request_number: 'SOL-0004',
      affiliate_name: 'Juan Perez',
      type: 'Autorización',
      status: 'Aprobada',
      request_date: '2026-04-10',
      description: 'Practica autorizada.',
    },
  ]);

  await knex('prestador_appointments').insert([
    {
      id: 1,
      prestador_id: prestador.id,
      affiliate_id: 1,
      affiliate_name: 'Juan Perez',
      appointment_date: '2026-05-05',
      start_time: '09:00',
      end_time: '09:30',
      reason: 'Control clinico',
      note: 'Traer estudios previos.',
    },
    {
      id: 2,
      prestador_id: prestador.id,
      affiliate_id: 1,
      affiliate_name: 'Juan Perez',
      appointment_date: '2026-05-05',
      start_time: '11:00',
      end_time: '11:30',
      reason: 'Seguimiento de tratamiento',
    },
  ]);

  await knex('prestador_affiliate_situations').insert([
    {
      id: 1,
      affiliate_id: 1,
      situation_type_id: 1,
      type: 'Tratamiento psicologico',
      start_date: '2024-02-01',
      end_date: '2024-06-01',
      active: true,
    },
    {
      id: 2,
      affiliate_id: 1,
      situation_type_id: 3,
      type: 'Control nutricional',
      start_date: '2024-04-12',
      end_date: '2024-09-12',
      active: true,
    },
  ]);

  await knex('prestador_clinical_history').insert([
    {
      id: 1,
      affiliate_id: 1,
      prestador_id: prestador.id,
      entry_date: '2026-04-12',
      doctor: 'Dr. Hernan Gomez',
      specialty: 'Clinica medica',
      modality: 'Presencial',
      note: 'Paciente estable. Se indica continuar controles mensuales.',
      own_note: true,
    },
    {
      id: 2,
      affiliate_id: 1,
      prestador_id: prestador.id,
      entry_date: '2026-03-20',
      doctor: 'Dra. Laura Medina',
      specialty: 'Cardiologia',
      modality: 'Presencial',
      note: 'Control cardiologico sin hallazgos de alarma.',
      own_note: false,
    },
  ]);

  // Reset PostgreSQL sequences after seeding with explicit IDs
  const tables = [
    'prestadores', 'prestador_requests', 'prestador_appointments',
    'prestador_situation_types', 'prestador_affiliate_situations',
    'prestador_clinical_history'
  ];
  for (const table of tables) {
    await knex.raw(`SELECT setval('${table}_id_seq', (SELECT COALESCE(MAX(id),0) FROM ${table}) + 1)`);
  }
};
