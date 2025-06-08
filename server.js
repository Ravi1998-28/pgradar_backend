import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import pgRoutes from './routes/pgRoutes.js';
// import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/db.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/pgs', pgRoutes);
app.use('/api/users', userRoutes);

//app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
