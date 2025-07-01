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

router.put("/updateBalance", async (req, res) => {
    const { rut, balance } = req.body;

    if (isNaN(balance)) {
        res.status(400).json({
            message: "El monto debe ser un número válido"
        });
        return;
    }

    const newAmount = parseFloat(balance);

    if (newAmount <= 0) {
        res.status(400).json({
            message: "Debes ingresar un monto mayor a 0"
        });

        return;
    }

    try {
        const userResult = await pool.query(`SELECT balance FROM public."User" WHERE rut = $1`,[rut]);

        if (userResult.rowCount === 0) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        const currentBalance = parseFloat(userResult.rows[0].balance);
        const finalBalance = currentBalance + newAmount;

        console.log(`DEBUG - actual: ${currentBalance}, nuevo: ${newAmount}, final: ${finalBalance}`);

        if (finalBalance > 100000) {
            res.status(400).json({
                message: `No se puede añadir ${newAmount}. El saldo final (${finalBalance}) excede el máximo permitido de 100.000.`
            });
            return;
        }

        await pool.query(`UPDATE public."User" SET balance = $1 WHERE rut = $2`,[finalBalance, rut]);

        res.status(200).json({
            message: "Saldo actualizado con éxito",
            balance: finalBalance
        });

    } catch (error) {
        console.error(error);
        res.json({ message: "Error al actualizar el saldo" });
    }
});

export default router;
