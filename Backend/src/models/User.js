import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: String, // optional for google users
  googleId: String,
  authProvider: { type: String, default: 'email' } // 'email' or 'google'
}, { timestamps: true });
export default mongoose.model('User', userSchema);
