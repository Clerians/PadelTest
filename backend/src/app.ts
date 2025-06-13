import express from 'express';
import equipment from './routes/equipment';
import auth from './routes/auth';
import user from './routes/user';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Especifica explícitamente el origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

//app.use("/auth", auth);
app.use("/equipment", equipment); 
//app.use("/user", user);


console.log("✅ Middleware equipment montado");

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start API`)
    console.error(`${err}`)
    return;
  }
  console.log(`API listening on port ${PORT}`);
});

