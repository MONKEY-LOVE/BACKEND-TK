import express from 'express';
import userRoutes from './src/routes/users.routes.js';
import roleRoutes from './src/routes/roles.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);

app.get('/', (req, res) => {
    // Establecer una cookie con SameSite=Lax
    res.cookie('miCookie', 'miValor', { sameSite: 'Lax' });
    res.send('Cookie establecida correctamente');
});

export default app;
