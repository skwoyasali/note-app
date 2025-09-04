import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import { errorHandler } from './middleware/errorhandler.js';
import './config/passport.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('Mongo connected')).catch(err => console.error(err));

app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

app.use(errorHandler);
export default app;
