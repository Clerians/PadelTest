import express  from "express";
import { pool } from "../utils/db";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt";

const router = express.Router();

router.post("/login", async (req,res) => {
    console.log(req.body);
    const { email, password } = req.body

    const query = 'SELECT password, name, role, id, email FROM public."User" WHERE email = $1'
    const values = [email]

    try {
        const result = await pool.query(query, values)
        
        if(result.rowCount == 0){
            res.status(404).json({
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
                "name": result.rows[0].name,
                "id": result.rows[0].id,
                "role":result.rows[0].role,
                "email": result.rows[0].email
            });
            return 
        }

        res.status(400).json({
            message: "Credenciales Inválidas"
        });
        return

    } catch (error) {  
        console.log(error) 
        res.status(500).json({
            message: "Error de Petición"
        });
        return;
    }

});


export default router;

