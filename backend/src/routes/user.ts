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

    query = 'INSERT INTO public."User" (rut, password, email, name) VALUES ($1,$2,$3,$4)'
    const hash = bcrypt.hashSync(password, 10)
    values = [rut, hash, email, name]
        
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


export default router;
