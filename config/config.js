import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.zes5n.mongodb.net/?retryWrites=true&w=majority`;
const MY_DB_NAME = process.env.MY_DB_NAME || '';

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 2022;
const SESSION_SECRET = process.env.SESSION_SECRET || '';

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';

// valid token until August 25th
const FITBIT_ACCESS_TOKEN = process.env.FITBIT_ACCESS_TOKEN || '';
const FITBIT_BASIC_TOKEN = process.env.FITBIT_BASIC_TOKEN || '';
const NEXT_FITBIT_AUTH_URL = process.env.NEXT_FITBIT_AUTH_URL || '';

// MARK'S ENV FILE VARS
const DB_CONN_STRING = process.env.DB_CONN_STRING || '';
const DB_NAME = process.env.DB_NAME || '';
const USERS_COLLECTION_NAME = process.env.USERS_COLLECTION_NAME || '';
const JUSTIN_CORE_PATH = process.env.JUSTIN_CORE_PATH || '';
const JUSTIN_APP_PATH = process.env.JUSTIN_APP_PATH || '';
const CONFIG_COLLECTION_NAME = process.env.CONFIG_COLLECTION_NAME || '';
const DECISIONRECORD_COLLECTION_NAME = process.env.DECISIONRECORD_COLLECTION_NAME || '';

export const config = {
	mongo: {
		username: MONGO_USERNAME,
		password: MONGO_PASSWORD,
		url: MONGO_URL,
		dbName: MY_DB_NAME
	},
	server: {
		port: SERVER_PORT,
		SESSION_SECRET: SESSION_SECRET
	},
	sms: {
		authToken: TWILIO_AUTH_TOKEN,
		accountSid: TWILIO_ACCOUNT_SID
	},
	fitbit: {
		basicToken: FITBIT_BASIC_TOKEN,
		accessToken: FITBIT_ACCESS_TOKEN,
		nextFitbitAuthUrl: NEXT_FITBIT_AUTH_URL
	},
	db: {
		DB_CONN_STRING: DB_CONN_STRING,
		DB_NAME: DB_NAME,
		USERS_COLLECTION_NAME: USERS_COLLECTION_NAME,
		CONFIG_COLLECTION_NAME: CONFIG_COLLECTION_NAME,
		DECISIONRECORD_COLLECTION_NAME: DECISIONRECORD_COLLECTION_NAME
	},
	core: {
		JUSTIN_CORE_PATH: JUSTIN_CORE_PATH,
		JUSTIN_APP_PATH: JUSTIN_APP_PATH
	}
};
