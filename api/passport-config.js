import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
// import { getUserById } from '../db/user.service';

// TODO: did not export getUserByEmail, might be unusable outside of this file
export default function initialize(passport, getUserByEmail, getUserById) {
	const authenticateUser = async (email, password, done) => {
		const user = getUserByEmail(email);
		if (user == null) {
			// 1st param: error, 2nd param: user we found, 3rd param: error msg
			return done(null, false, { message: 'No user with that email' });
		}

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Password incorrect' });
			}
		} catch (err) {
			return done(err);
		}
	};
	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done) => done(null, getUserById(id)));
}
