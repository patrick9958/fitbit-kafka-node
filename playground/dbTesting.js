import * as userService from '../db/user.service.js';
import { User } from '../models/user.model.js';
import { loadTestUsers } from '../tests/loadUsers.test.js';
import { updateStepsDB } from '../db/updateState.service.js';

// userService.clearUsers();

// let users = await userService.getAllUsers();

// for (let u in users) {
// 	console.log(u.name);
// }
async function printTestUsers() {
	console.log('calling loadTestUsers()');
	let users = await loadTestUsers();
	console.log('done loading test users');
	console.log('test users: ', users);
}

// printTestUsers();

updateStepsDB('Patrick Neggie', 50);
