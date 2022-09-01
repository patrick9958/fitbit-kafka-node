import { config } from '../config/config.js';
import axios from 'axios';
import { updateAllFitbitTokens } from '../db/updateState.service.js';
const basicToken = config.fitbit.basicToken;
const myAuthCode = '7a2efc33816060be9edf2e2e2ab9003d720c5277';
const redirectUri = config.fitbit.nextFitbitAuthUrl;
// const redirectUri = 'http%3A%2F%2Flocalhost%3A9090%2Ffitbit%2Fsuccess';
// const redirectUri = 'http://localhost:9090/fitbit/success';

export default class FitbitHelper {
	static async getAuthorizationInformation(authCode) {
		return axios({
			method: 'post',
			url: 'https://api.fitbit.com/oauth2/token',
			// `headers` are custom headers to be sent
			headers: {
				Authorization: `Basic ${basicToken}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			params: {
				clientId: '238H5F',
				grant_type: 'authorization_code',
				redirect_uri: `${redirectUri}`,
				code: authCode
			}
		}).then((response) => {
			//console.log(response.data);
			console.log(response.status);
			console.log(response.statusText);
			//console.log(response.headers);
			//console.log(response.config);

			let data = response.data;
			return data;
		});
	}

	// TODO: IMPLEMENT WITH USERID
	static async updateAllTokens(userID, fitbitID, accessToken, refreshToken) {
		let success = await updateAllFitbitTokens('Patrick Neggie', fitbitID, accessToken, refreshToken);
		if (success) {
			console.log('Successfully updated all Fitbit tokens!');
		} else {
			console.log('Error updating all Fitbit tokens!');
		}
	}

	static async updateFitbitUserCredentials(authCode) {
		const authResult = await FitbitHelper.getAuthorizationInformation(authCode)
			.then((responseData) => {
				console.log(`FitbitHelper.getAuthorizationInformation: ${JSON.stringify(responseData)}`);
				const accessToken = responseData.access_token;
				const refreshToken = responseData.refresh_token;
				const fitbitID = responseData.user_id;
				// TODO: IMPLEMENT WITH USERID
				FitbitHelper.updateAllTokens('', fitbitID, accessToken, refreshToken);
				return { value: 'success', stage: 'authentication' };
			})
			.catch((error) => {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					console.log(`Data: ${error.response.data}`);
					console.log(`Status: ${error.response.status}`);
					console.log(`StatusText: ${error.response.statusText}`);
					console.log(`Headers: ${error.response.headers}`);

					console.log(`Error response`);
					// which means, authentication falil
				} else if (error.request) {
					// The request was made but no response was received
					// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
					// http.ClientRequest in node.js
					console.log(error.request);

					console.log(`Error request`);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', error.message);
					console.log('Error else');
				}
			});
	}
}
