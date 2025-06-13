import express, { Request, Response } from "express";
import { pool } from "../utils/db";

const router = express.Router();

// Crear nuevo equipamiento (solo admins deberían poder usar esto idealmente)
router.post("/add", async (req: Request, res: Response): Promise<void> => {
  console.log("POST /equipment/add recibido con body:", req.body);
  const { name, stock, type, cost } = req.body;

  if (!name || isNaN(Number(stock)) || !type || isNaN(Number(cost))) {
    res.status(400).json({ message: "Datos inválidos" });
    return;
  }

  try {
    // Paso 1: Verificar si ya existe un equipamiento con ese nombre
    const checkQuery = 'SELECT stock FROM "Equipment" WHERE name = $1';
    const checkResult = await pool.query(checkQuery, [name]);

    if (checkResult.rowCount! > 0) {
      // Ya existe, actualizar stock
      const existingStock = checkResult.rows[0].stock;
      const newStock = existingStock + Number(stock);

      const updateQuery = 'UPDATE "Equipment" SET stock = $1 WHERE name = $2';
      await pool.query(updateQuery, [newStock, name]);

      res.json({ message: "Stock actualizado con éxito", stock: newStock });
    } else {
      // No existe, insertar nuevo equipamiento
      const insertQuery =
        'INSERT INTO "Equipment" (name, stock, type, cost) VALUES ($1, $2, $3, $4)';
      await pool.query(insertQuery, [name, Number(stock), type, Number(cost)]);

      res.json({ message: "Equipamiento agregado con éxito" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar o actualizar el equipamiento" });
  }
});
// Listar todos los equipamientos
router.get("/all", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = 'SELECT * FROM "Equipment" ORDER BY name ASC';
    const result = await pool.query(query);

    res.json({
      message: "Lista de equipamientos",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error al listar equipamientos:", error);
    res.status(500).json({ message: "Error al obtener los equipamientos" });
  }
});


export default router;