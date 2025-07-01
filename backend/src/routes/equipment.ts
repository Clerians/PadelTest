//equipament.ts
import express from "express";
import { pool } from "../utils/db";
const router = express.Router();

router.post('/create', async (req, res) => {
    const { name, stock, type, cost } = req.body;

    if (!name || !stock || !type || !cost) {
        res.status(400).json({
            message: "Faltan valores para crear el equipamiento."
        })
        return
    }

    await pool.query(`
        INSERT INTO public."Equipment" (name, stock, type, cost)
        VALUES ($1, $2, $3, $4); 
    `, [name, stock, type, cost])

    res.status(201).json({
        message: "Equipamiento creado correctamente."
    })

    return
})

router.get('/all', async (req, res) => {
    const result = await pool.query(`
        SELECT * FROM public."Equipment";    
    `)

    res.status(200).json(result.rows)
    return
})

router.put('/update', async (req, res) => {
    const { id, name, stock, type, cost } = req.body;
    if (!id || !name || !stock || !type || !cost) {
        res.status(400).json({
            message: "Faltan valores para crear el equipamiento."
        })
        return
    }

    await pool.query(`
        UPDATE public."Equipment"
        SET 
            name = $1,
            stock = $2, 
            type = $3,
            cost = $4
        WHERE id = $5 
    `, [name, stock, type, cost, id])
    res.status(200).json({
        message: 'Equipamiento actualizado correctamente.'
    })

    return
})

router.delete('/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query(`
            DELETE FROM public."Equipment" WHERE id = $1;
        `, [id])
        
        res.status(200).json({
            message: "Equipamiento eliminado correctamente."
        })
        return
    } catch (error) {
        res.status(400).json({
            message: "No se ha podido eliminar el equipamiento."
        })
    }
})

export default router;