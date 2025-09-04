import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    let user = await User.findOne({ googleId });
    if(!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        googleId,
        authProvider: 'google'
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
