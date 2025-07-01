//court.ts
import express  from "express";
import { pool } from "../utils/db";
import bcrypt from 'bcrypt';
import user from "./user"

const router = express.Router();

router.post("/createCourt", async (req, res) => {
    const { rut, number, cost, max_players } = req.body;

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

        const insertQuery = 'INSERT INTO public."Court" (number, cost, max_players) VALUES ($1, $2, $3)';
        const insertValues = [number, cost, max_players];
        
        await pool.query(insertQuery, insertValues);

        res.json({ message: "Cancha creada exitosamente" });

    } catch (error) {
        console.log(error);
        res.json({ message: "Error al crear la cancha" });
    }
});

router.get("/getCourts", async (req, res) => {
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