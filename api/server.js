// TODO: test next(), didn't import NextFunction from 'express'
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import initializePassport from './passport-config.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import { config } from '../config/config.js';
import FitbitHelper from '../lib/FitbitHelper.js';
import Logging from '../lib/Logging.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import {
	getUserByEmail,
	getUserById,
	addUser,
	createNewUser
} from '../db/user.service.js';
// TODO: unistall 'passport-oauth2' package

const router = express();

// TODO: connect to DB

initializePassport(
	passport,
	(email) => getUserByEmail(email),
	(id) => getUserById(id)
);

// connect to mongodb
mongoose
	.connect(config.mongo.url)
	.then(() => {
		Logging.info('connected to mongodb!');
		StartServer();
	})
	.catch((err) => {
		Logging.error('unable to connect to mongodb!');
		Logging.error(err);
	});

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
	/** Log the request */
	router.use((req, res, next) => {
		/** Log the req */
		Logging.info(
			`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
		);

		res.on('finish', () => {
			/** Log the res */
			Logging.info(
				`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
			);
		});

		next();
	});

	router.use(express.urlencoded({ extended: false }));
	router.use(express.json());
	router.use(flash());
	router.use(
		session({
			secret: config.server.SESSION_SECRET,
			resave: true,
			saveUninitialized: true
		})
	);
	router.use(passport.initialize());
	router.use(passport.session());
	router.use(methodOverride('_method'));

	/** Rules of our API */
	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		);

		if (req.method == 'OPTIONS') {
			res.header(
				'Access-Control-Allow-Methods',
				'PUT, POST, PATCH, DELETE, GET'
			);
			return res.status(200).json({});
		}

		next();
	});

	router.set('view-engine', 'ejs');
	// setting path to /api/views to find .ejs view files
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	router.set('views', path.join(__dirname, 'views'));

	/** Routes */
	router.get('/', checkAuthenticated, (req, res) => {
		res.render('index.ejs', { name: req.user.name });
	});

	router.get('/login', checkNotAuthenticated, (req, res) => {
		res.render('login.ejs');
	});

	router.post(
		'/login',
		checkNotAuthenticated,
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		})
	);

	router.get('/register', checkNotAuthenticated, (req, res) => {
		res.render('register.ejs');
	});

	router.post('/register', checkNotAuthenticated, async (req, res) => {
		try {
			const hashedPass = await bcrypt.hash(req.body.password, 10);
			await addUser(
				createNewUser(req.body.name, req.body.email, hashedPass)
			).catch((error) => {
				Logging.error('ERROR: registering new user failed');
				Logging.error(`${error.name}: ${error.message}`);
			});
			res.redirect('/login');
		} catch {
			res.redirect('/register');
		}
	});

	router.delete('/logout', (req, res, next) => {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	});

	function checkAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	}

	function checkNotAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return res.redirect('/');
		}
		next();
	}

	const authLink =
		'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=238H5F&redirect_uri=http%3A%2F%2Flocalhost%3A9090%2Ffitbit%2Fsuccess&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight%20oxygen_saturation%20respiratory_rate%20temperature&expires_in=604800';
	router.get('/fitbit/auth', (req, res) => {
		res.redirect(authLink);
	});

	router.get('/fitbit/success', (req, res) => {
		// console.log('params: ' + JSON.stringify(req.params));
		// console.log('query: ' + JSON.stringify(req.query));
		// console.log('query code: ' + req.query.code);
		FitbitHelper.updateFitbitUserCredentials(req.query.code);
		res.status(201).redirect('/');
	});
	// router.use('/users', userRoutes);

	/** Healthcheck */
	router.get('/ping', (req, res, next) =>
		res.status(200).json({ message: 'pong' })
	);

	/** Error handling */
	router.use((req, res, next) => {
		const error = new Error('Not found');

		Logging.error(error);

		res.status(404).json({
			message: error.message
		});
	});

	http.createServer(router).listen(config.server.port, () =>
		Logging.info(`Server is running on port ${config.server.port}`)
	);
};
