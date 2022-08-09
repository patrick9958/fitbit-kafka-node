// TODO: test next(), didn't import NextFunction from 'express'
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config.js';
import Logging from './lib/Logging.js';
// TODO: unistall 'passport-oauth2' package

const router = express();

// connect to mongodb
mongoose
	.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
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
		Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

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
