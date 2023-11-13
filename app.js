import  express  from "express";
const app = express(); //tener una instancia de express para hacer uso de la libreria
import userRoutes from './src/routes/users.routes.js'
import roleRoutes from './src/routes/roles.routes.js'
import authRoutes from './src/routes/auth.routes.js'
import cookieParser from "cookie-parser";
import cors from 'cors'


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes)


export default app;