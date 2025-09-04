import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import passport from 'passport';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const signJWT = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const signupEmail = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, authProvider: 'email' });

    // generate OTP and email it
    const code = (Math.floor(100000 + Math.random()*900000)).toString();
    const expiresAt = new Date(Date.now() + (Number(process.env.OTP_TTL_SECONDS || 300) * 1000));
    await OTP.create({ email, code, expiresAt });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your signup OTP',
      text: `Your OTP: ${code}. Expires in ${(process.env.OTP_TTL_SECONDS || 300)/60} minutes`
    });

    res.json({ message: 'User created. OTP sent to email.' });
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const record = await OTP.findOne({ email, code });
    if(!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    // remove OTP
    await OTP.deleteMany({ email });
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'User not found' });
    const token = signJWT(user);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};

export const loginEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user || !user.passwordHash) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signJWT(user);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) { next(err); }
};

export const googleAuth = passport.authenticate('google', { scope: ['profile','email'] });

export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_fail`);
    }

    // Create JWT including minimal info
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Redirect with token + user details
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`
    );
  })(req, res, next);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};