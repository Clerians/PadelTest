//booking.ts
import express  from "express";
import { pool } from "../utils/db";
import bcrypt from 'bcrypt';
import { isAdmin, getUserRoleByRut } from "./auth";
import user from "./user"

const router = express.Router();

router.post("/add", async (req, res) => {
    const { rut, date, start_time } = req.body;

    if (!rut || !date || !start_time) {
        res.status(200).json({ message: "Faltan datos. Debes enviar rut, fecha y hora de inicio." });
        return;
    }

    // Construir fechas
    const start = new Date(`${date} ${start_time}`);
    const end = new Date(start.getTime() + 90 * 60000);

    const startHour = start.getHours();
    const endHour = end.getHours();

    //Validar que la reserva sea dentro del horario permitido.
    if (startHour < 8 || endHour > 20) {
        res.status(400).json({ 
            message: "Horario fuera del rango permitido (8:00 a 20:00)"
        });

        return;
    }
    //Validar que la reserva sea entre lunes y viernes.
    const dayOfWeek = start.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        res.status(400).json({ 
            message: "Solo se permiten reservas de lunes a viernes"
        });

        return;
    }

    const now = new Date();
    const diffDays = (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 7) {
        res.status(400).json({ 
            message: "Las reservas deben hacerse con al menos 1 semana de anticipación"
        });
        return;
    }

    const startStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}:00`;
    const endStr = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}:00`;

    try {
        // Buscar usuario
        const userQuery = await pool.query(`SELECT id, balance FROM public."User" WHERE rut = $1`, [rut]);

        if (userQuery.rowCount === 0) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        }

        const userInfo = userQuery.rows[0];

        // Revisar reservas del mismo día
        const userBookings = await pool.query(`SELECT start_time, finish_time FROM public."Booking" WHERE user_id = $1 AND date = $2`, [userInfo.id, date]);

        let totalMinutes = 0;

        for (const row of userBookings.rows) {
            const resStart = new Date(`${date} ${row.start_time}`);
            const resEnd = new Date(`${date} ${row.finish_time}`);
            totalMinutes += (resEnd.getTime() - resStart.getTime()) / 60000;

            if (
                (start >= resStart && start < resEnd) ||
                (end > resStart && end <= resEnd) ||
                (start.getTime() === resEnd.getTime()) ||
                (resStart.getTime() === end.getTime())
            ) {
                res.status(400).json({ 
                    message: "No puedes tener reservas seguidas o que se solapen el mismo día"
                });

                return;
            }
        }

        if (totalMinutes + 90 > 180) {
            res.status(200).json({ 
                message: "Excede el máximo de 180 minutos diarios (2 reservas de 90 min)"
            });

            return;
        }

        // Verificar saldo
        const reservationCost = 100;
        if (userInfo.balance < reservationCost) {
            const faltante = reservationCost - userInfo.balance;
            res.status(200).json({ 
                message: `Saldo insuficiente. Necesitas al menos ${reservationCost}, te faltan ${faltante}.`
            });

            return;
        }
        // Buscar primera cancha disponible
        const courts = await pool.query('SELECT id FROM public."Court" ORDER BY id');

        for (const court of courts.rows) {
            const overlaps = await pool.query(`SELECT 1 FROM public."Booking" WHERE court_id = $1 AND date = $2 AND (start_time < $4 AND finish_time > $3)`, [court.id, date, startStr, endStr]);

            if (overlaps.rowCount === 0) {
                // Descontar saldo
                await pool.query('UPDATE public."User" SET balance = balance - $1 WHERE id = $2', [reservationCost, userInfo.id]);

                // Guardar reserva con equipamiento y boleta
                await pool.query(`INSERT INTO public."Booking" (court_id, date, start_time, finish_time, user_id, total_cost) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        court.id,
                        date,
                        startStr,
                        endStr,
                        userInfo.id,
                        reservationCost

                    ]
                );

                res.status(200).json({
                    message: `Reserva exitosa en cancha ${court.id} el ${date} de ${startStr.slice(0,5)} a ${endStr.slice(0,5)}`
                });

                return;
            }
        }

        res.status(200).json({
            message: "No hay canchas disponibles en el horario solicitado"
        });

        return;

    } catch (error) {
        console.error(error);
        res.json({ message: "Error al procesar la reserva." });
    }
});

router.get("/getAllBookings", async (req, res) => {
    const { rut } = req.body;

    if (!rut) {
        res.json({ message: "Debes enviar el rut del usuario." });
        return;
    }

    try {
        const esAdmin = await isAdmin(rut);

        if (!esAdmin) {
            res.json({ message: "No autorizado. Solo el administrador puede ver el historial." });
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(200).json({ message: "Error al verificar el rol del usuario." });
        return;
    }

    try {
        const result = await pool.query(`SELECT b.id, b.date, b.start_time, b.finish_time, b.total_cost, c.number AS court_number, u.name AS usuario, u.rut FROM public."Booking" b JOIN public."User" u ON b.user_id = u.id JOIN public."Court" c ON b.court_id = c.id ORDER BY b.date DESC, b.start_time DESC;`);
        res.json({ history: result.rows });

    } catch (error) {
        console.log(error);
        res.status(200).json({ message: "Error al obtener el historial de reservas." });
    }
});;

router.get("/myBookings", async (req, res) => {
    const { rut } = req.body;

    if (!rut) {
        res.status(200).json({ message: "RUT requerido" });
        return;
    }

    try {
        const userQuery = await pool.query('SELECT id FROM public."User" WHERE rut = $1', [rut]);
        if (userQuery.rowCount === 0) {
            res.status(200).json({ message: "Usuario no encontrado" });
            return;
        }

        const userId = userQuery.rows[0].id;

        const bookings = await pool.query(`SELECT b.id, c.number AS court_number, b.date, b.start_time, b.finish_time, b.total_cost FROM public."Booking" b JOIN public."Court" c ON b.court_id = c.id WHERE b.user_id = $1 ORDER BY b.date, b.start_time`, [userId]);

        res.json({ bookings: bookings.rows });

    } catch (error) {
        console.error(error);
        res.status(200).json({ message: "Error al obtener tus reservas" });
    }
});

router.delete("/deleteBooking/:id", async (req, res) => {
    const { rut } = req.body;
    const bookingId = req.params.id;

    if (!rut || !bookingId) {
        res.status(200).json({ message: "Debes enviar tu RUT y el ID de la reserva" });
        return;
    }

    try {
        const userQuery = await pool.query('SELECT id FROM public."User" WHERE rut = $1', [rut]);
        if (userQuery.rowCount === 0) {
            res.status(200).json({ message: "Usuario no encontrado" });
            return;
        }

        const userId = userQuery.rows[0].id;

        // obtener reserva
        const bookingQuery = await pool.query(`SELECT date, start_time FROM public."Booking" WHERE id = $1 AND user_id = $2`, [bookingId, userId]);

        if (bookingQuery.rowCount === 0) {
            res.status(200).json({ message: "Reserva no encontrada o no pertenece al usuario" });
            return;
        }

        const { date, start_time } = bookingQuery.rows[0];
        const bookingDateTime = new Date(`${date} ${start_time}`);

        const now = new Date();
        const diffDays = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays < 7) {
            res.status(200).json({
                message: "Solo puedes cancelar reservas con al menos 1 semana de anticipación"
            });
            return;
        }

        // eliminar la reserva
        await pool.query('DELETE FROM public."Booking" WHERE id = $1 AND user_id = $2', [bookingId, userId]);

        res.json({ message: "Reserva cancelada con éxito. (Sin devolución de dinero)" });

    } catch (error) {
        console.error(error);
        res.json({ message: "Error al cancelar la reserva" });
    }
});

export default router;