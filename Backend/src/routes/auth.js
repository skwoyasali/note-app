import express from 'express';
import { signupEmail, verifyOTP, loginEmail, googleAuth, googleAuthCallback, getMe } from '../controllers/authController.js';
import {requireAuth} from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/signup', signupEmail); // create user + send OTP
router.post('/verify-otp', verifyOTP); // verify OTP and return JWT
router.post('/login', loginEmail); // email/password login
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get("/me", requireAuth, getMe);

export default router;
