import express  from "express";
import { pool } from "../utils/db";
import bcrypt from 'bcrypt';

const router = express.Router();

router.post("/register", async (req,res) => {
    const { email, password, rut, name } = req.body

    let query = 'SELECT 1 FROM public."User" WHERE rut = $1'
    let values = [rut]

    try {
        const result = await pool.query(query, values)
        
        if(result.rowCount != 0) {
            res.json({
                message: "Rut ya existe en el sistema"
            });

            return;
        }

    } catch (error) {  
        console.log(error) 
        res.json({
            message: "Error de Petición"
        });
        return;
    }

    query = 'SELECT 1 FROM public."User" WHERE email = $1'
    values = [email]

    try {
        const result = await pool.query(query, values)
        
        if(result.rowCount != 0) {
            res.json({
                message: "Correo existente en el sistema"
            });

            return;
        }

    } catch (error) {  
        console.log(error) 
        res.json({
            message: "Error de Petición"
        });
        return;
    }

    query = 'INSERT INTO public."User" (rut, password, email, name, balance) VALUES ($1,$2,$3,$4,$5)'
    const hash = bcrypt.hashSync(password, 10)
    values = [rut, hash, email, name, 0]
        
    try {
        await pool.query(query,values)
        res.json({
            message: "Usuario creado con éxito"
        });
    } catch (error) {
        console.log(error)
        res.json({
            message: "No se ha podido crear el usuario"
        });
    }
});

router.put("/updateBalance", async (req,res) => {
    const {rut, balance} = req.body

    if(isNaN(balance)) {
        res.status(200).json({
            message: "El saldo debe ser un valor válido"
        });

        return;
    }

    if (parseFloat(balance) < 0 || parseFloat(balance) > 100000) {
        res.status(200).json({
            message: "El saldo debe estar entre 0 y 100.000"
        });

        return;
    }

    const query = 'UPDATE public."User" SET balance = $1 WHERE rut = $2';
    const values = [parseFloat(balance), rut];

    try {
        const result = await pool.query(query, values);

        if (result.rowCount == 0) {
           res.json({ message: "Usuario no encontrado" });
           return;
        }

        res.json({ 
            message: "Saldo actualizado con éxito", 
            balance: balance
        });

    } catch (error) {
        console.log(error);
        res.json({ message: "Error al actualizar el saldo" });
    }
});

router.post("/createCourt", async (req, res) => {
    const { rut, number, cost } = req.body;

    let query = 'SELECT role FROM public."User" WHERE rut = $1';
    let values = [rut];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            res.json({ message: "Usuario no encontrado" });
            return;
        }

        const role = result.rows[0].role;
        if (role !== 'admin') {
            res.json({ message: "No autorizado. Solo los administradores pueden crear canchas." });
            return;
        }

        const insertQuery = 'INSERT INTO public."Court" (number, cost) VALUES ($1, $2)';
        const insertValues = [number, cost];
        
        await pool.query(insertQuery, insertValues);

        res.json({ message: "Cancha creada exitosamente" });

    } catch (error) {
        console.log(error);
        res.json({ message: "Error al crear la cancha" });
    }
});

router.get("/courts", async (req, res) => {
    const { rut } = req.body;

    let query = 'SELECT role FROM public."User" WHERE rut = $1';
    let values = [rut];

    try {
        const userQuery = await pool.query(query, values);

        if (userQuery.rowCount === 0) {
            res.json({ message: "Usuario no encontrado" });
            return;
        }

        const role = userQuery.rows[0].role;

        if (role !== 'admin') {
            res.json({ message: "No autorizado. Solo los administradores pueden visualizar las canchas." });
            return;
        }

        const insertQuery = 'SELECT * FROM public."Court" ORDER BY id';
        const result = await pool.query(insertQuery);

        res.json({ courts: result.rows });

    } catch (error) {
        console.log(error);
        res.json({ message: "Error al obtener las canchas" });
    }
});

router.delete("/deleteCourt", async (req, res) => {
    const { rut, id } = req.body;

    const userQuery = 'SELECT role FROM public."User" WHERE rut = $1';
    try {
        const userResult = await pool.query(userQuery, [rut]);
        if (userResult.rowCount === 0) {
            res.json({ message: "Usuario no encontrado" });
            return;
        }
        if (userResult.rows[0].role !== 'admin') {
            res.json({ message: "No autorizado. Solo los administradores pueden eliminar canchas." });
            return;
        }

        const deleteQuery = 'DELETE FROM public."Court" WHERE id = $1';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            res.json({ message: "Cancha no encontrada" });
            return;
        }

        if (!id) {
            res.json({ message: "ID de la cancha requerido" });
            return;
        }

        res.json({ message: "Cancha eliminada exitosamente" });

    } catch (error) {
        console.log(error);
        res.json({ message: "Error al eliminar la cancha" });
    }
});


export default router;
