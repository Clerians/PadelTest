import express  from "express";
import { pool } from "../utils/db";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt";

const router = express.Router();

router.post("/login", async (req,res) => {
    console.log(req.body);
    const { email, password } = req.body

    const query = 'SELECT password FROM public."User" WHERE email = $1'
    const values = [email]

    try {
        const result = await pool.query(query, values)
        
        if(result.rowCount == 0){
            res.json({
                message: "Usuario no existente"
            });
            return;
        }

        const dbPassword = result.rows[0].password

        if(bcrypt.compareSync(password, dbPassword)) {
            
            const token = generateToken({ email });
            
            res.cookie('auth', token, {
                maxAge: 3600000,  
            });
            
            res.json({
                message: "Login Exitoso"
            });
            return 
        }

        res.json({
            message: "Credenciales Inválidas"
        });
        return

    } catch (error) {  
        console.log(error) 
        res.json({
            message: "Error de Petición"
        });
        return;
    }

});


export default router;

