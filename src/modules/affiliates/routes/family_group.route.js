const express = require("express");
const router = express.Router();

const affiliatesService = require('../services/affiliates.service');


/**
 * @swagger
 * /family_group/{id}:
 *   delete:
 *     summary: Elimina un grupo familiar
 *     tags: [Affiliates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grupo familiar eliminado correctamente
 */
router.delete("/:id", authorize('AFIADO'), affiliatesService.deleteFamilyGroup);

/**
 * @swagger
 * /family_group/{id}:
 *   get:
 *     summary: Obtiene un grupo familiar por ID
 *     tags: [Affiliates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grupo familiar obtenido correctamente
 */
router.get("/:id", authorize('AFIADO'), affiliatesService.getFamilyGroupById)

module.exports = router;