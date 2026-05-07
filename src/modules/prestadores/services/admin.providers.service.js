const db = require('../../../database/db');
const bcrypt = require('bcryptjs');

const serializePrestador = async (p) => {
  // get places
  const places = await db('lugares_atencion').where('prestador_id', p.id);
  // get specialties
  const specialties = await db('prestador_especialidades')
    .join('especialidades', 'prestador_especialidades.especialidad_id', 'especialidades.id')
    .where('prestador_especialidades.prestador_id', p.id)
    .select('especialidades.id', 'especialidades.nombre');

  return {
    cuitCuil: p.cuit,
    nombreCompleto: `${p.first_name} ${p.last_name}`.trim(),
    tipoPrestador: p.tipo_prestador || 'profesional',
    telefonos: p.telefonos || [],
    mails: p.mails || [],
    especialidades: specialties,
    lugaresAtencion: places.map(lugar => ({
      idLugar: lugar.id,
      calle: lugar.calle,
      localidad: lugar.localidad,
      provincia: lugar.provincia,
      cp: lugar.cp,
      horarios: lugar.horarios || []
    })),
    centroMedicoId: p.centro_medico_id ? String(p.centro_medico_id) : null
  };
};

const getAll = async (req, res) => {
  try {
    const prestadores = await db('prestadores').select('*');
    const promises = prestadores.map(serializePrestador);
    const result = await Promise.all(promises);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getAll providers:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getByCuit = async (req, res) => {
  try {
    const { cuit } = req.params;
    const p = await db('prestadores').where('cuit', cuit).first();
    if (!p) return res.status(404).json({ error: 'Provider not found' });
    
    const result = await serializePrestador(p);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getByCuit:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const create = async (req, res) => {
  try {
    const {
      cuitCuil, nombreCompleto, tipoPrestador, telefonos, mails, 
      especialidades, lugaresAtencion, centroMedicoId
    } = req.body;

    const parts = nombreCompleto ? nombreCompleto.split(' ') : [''];
    const first_name = parts[0];
    const last_name = parts.slice(1).join(' ');

    // Create user account for the provider (password = CUIT without dashes)
    const cleanCuit = cuitCuil.replace(/-/g, '');
    let user = await db('users').where('email', (mails && mails[0]) || `${cleanCuit}@test.com`).first();
    let isNewUser = false;
    if (!user) {
      const hash = await bcrypt.hash(cleanCuit, 10);
      const [newUserId] = await db('users').insert({
        email: (mails && mails[0]) || `${cleanCuit}@test.com`,
        password: hash,
        must_change_password: true
      }).returning('id');
      user = { id: newUserId.id || newUserId };
      isNewUser = true;
    }

    const userId = user.id || user;

    // Assign PRESTADOR role (role_id = 3) if user is new
    if (isNewUser) {
      const existingRole = await db('user_roles').where({ user_id: userId, role_id: 3 }).first();
      if (!existingRole) {
        await db('user_roles').insert({ user_id: userId, role_id: 3 });
      }
    }

    const [newPrestadorId] = await db('prestadores').insert({
      user_id: userId,
      cuit: cleanCuit,
      first_name,
      last_name,
      document_number: cleanCuit.substring(2, cleanCuit.length - 1),
      email: mails && mails[0] ? mails[0] : '',
      phone: telefonos && telefonos[0] ? telefonos[0] : '',
      tipo_prestador: tipoPrestador || 'profesional',
      centro_medico_id: centroMedicoId || null,
      telefonos: JSON.stringify(telefonos || []),
      mails: JSON.stringify(mails || []),
      specialty: '',
      status: true
    }).returning('id');

    const pId = newPrestadorId.id || newPrestadorId;

    if (especialidades && especialidades.length) {
      const inserts = especialidades.map(e => ({
        prestador_id: pId,
        especialidad_id: typeof e === 'object' ? e.id : e
      }));
      await db('prestador_especialidades').insert(inserts);
    }

    if (lugaresAtencion && lugaresAtencion.length) {
      const inserts = lugaresAtencion.map(l => ({
        prestador_id: pId,
        calle: l.calle || '',
        localidad: l.localidad || '',
        provincia: l.provincia || '',
        cp: l.cp || '',
        horarios: JSON.stringify(l.horarios || [])
      }));
      await db('lugares_atencion').insert(inserts);
    }

    const created = await db('prestadores').where('id', pId).first();
    const result = await serializePrestador(created);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error create:', error);
    return res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { cuit } = req.params;
    const p = await db('prestadores').where('cuit', cuit).first();
    if (!p) return res.status(404).json({ error: 'Provider not found' });

    const {
      cuitCuil, nombreCompleto, tipoPrestador, telefonos, mails, 
      especialidades, lugaresAtencion, centroMedicoId
    } = req.body;

    const parts = nombreCompleto ? nombreCompleto.split(' ') : null;
    const first_name = parts ? parts[0] : undefined;
    const last_name = parts ? parts.slice(1).join(' ') : undefined;

    const updateData = {};
    if (cuitCuil !== undefined) updateData.cuit = cuitCuil;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (tipoPrestador !== undefined) updateData.tipo_prestador = tipoPrestador;
    if (centroMedicoId !== undefined) updateData.centro_medico_id = centroMedicoId;
    if (telefonos !== undefined) {
      updateData.telefonos = JSON.stringify(telefonos);
      updateData.phone = telefonos[0] || '';
    }
    if (mails !== undefined) {
      updateData.mails = JSON.stringify(mails);
      updateData.email = mails[0] || '';
    }

    if (Object.keys(updateData).length > 0) {
      await db('prestadores').where('id', p.id).update(updateData);
    }

    if (especialidades !== undefined) {
      await db('prestador_especialidades').where('prestador_id', p.id).del();
      if (especialidades.length) {
         const inserts = especialidades.map(e => ({
          prestador_id: p.id,
          especialidad_id: e.id
        }));
        await db('prestador_especialidades').insert(inserts);
      }
    }

    if (lugaresAtencion !== undefined) {
      await db('lugares_atencion').where('prestador_id', p.id).del();
      if (lugaresAtencion.length) {
        const inserts = lugaresAtencion.map(l => ({
          prestador_id: p.id,
          calle: l.calle || '',
          localidad: l.localidad || '',
          provincia: l.provincia || '',
          cp: l.cp || '',
          horarios: JSON.stringify(l.horarios || [])
        }));
        await db('lugares_atencion').insert(inserts);
      }
    }

    const updated = await db('prestadores').where('id', p.id).first();
    const result = await serializePrestador(updated);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error update:', error);
    return res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { cuit } = req.params;
    const p = await db('prestadores').where('cuit', cuit).first();
    if (!p) return res.status(404).json({ error: 'Provider not found' });
    
    await db('prestadores').where('id', p.id).del();
    return res.status(204).send();
  } catch (error) {
    console.error('Error remove:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getAgendasBySpecialty = async (req, res) => {
  try {
    const { cuit } = req.params;
    const { specialtyId } = req.query;
    const p = await db('prestadores').where('cuit', cuit).first();
    if (!p) return res.status(404).json({ error: 'Provider not found' });
    
    const agendas = await db('agendas')
      .where('prestador_id', p.id)
      .andWhere('especialidad_id', specialtyId);
    
    return res.status(200).json({ agendas, count: agendas.length });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};

const getAgendasByPlaces = async (req, res) => {
  try {
    const { cuit } = req.params;
    const p = await db('prestadores').where('cuit', cuit).first();
    if (!p) return res.status(404).json({ error: 'Provider not found' });
    
    const agendas = await db('agendas').where('prestador_id', p.id);
    return res.status(200).json({ agendas, count: agendas.length });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getAll, getByCuit, create, update, remove, getAgendasBySpecialty, getAgendasByPlaces
};
