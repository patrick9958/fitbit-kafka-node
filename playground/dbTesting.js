import * as userService from '../db/user.service.js';
import { User } from '../models/user.model.js';

let users = await userService.getAllUsers();

for (u in users) {
	console.log(u.name);
}
