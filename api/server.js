// TODO: test next(), didn't import NextFunction from 'express'
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from '../config/config.js';
import FitbitHelper from '../lib/FitbitHelper.js';
import Logging from '../lib/Logging.js';
// TODO: unistall 'passport-oauth2' package

const router = express();

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
		Logging.info(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

		res.on('finish', () => {
			/** Log the res */
			Logging.info(
				`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
			);
		});

		next();
	});

	router.use(express.urlencoded({ extended: true }));
	router.use(express.json());

	/** Rules of our API */
	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}

		next();
	});

	/** Routes */
	// router.get('/', (req, res) => {
	// 	res.send('<a href="/auth/fitbit">Authenticate with fitbit</a>');
	// });

	const authLink =
		'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=238H5F&redirect_uri=http%3A%2F%2Flocalhost%3A9090%2Ffitbit%2Fsuccess&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight%20oxygen_saturation%20respiratory_rate%20temperature&expires_in=604800';
	router.get('/', (req, res) => {
		// res.send(`<a href="${authLink}">Authenticate with fitbit</a>`);
		res.redirect(authLink);
	});

	router.get('/fitbit/success', (req, res) => {
		console.log('params: ' + JSON.stringify(req.params));
		console.log('query: ' + JSON.stringify(req.query));
		console.log('query code: ' + req.query.code);
		FitbitHelper.updateFitbitUserCredentials(req.query.code);
		res.status(201).send(`<h1>${req.query.code}</h1>`);
	});
	// router.use('/users', userRoutes);

	/** Healthcheck */
	router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

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
