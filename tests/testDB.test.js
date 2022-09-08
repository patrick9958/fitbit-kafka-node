import { getUserCollection, clearUsers, addUser, getUserById, getAllUsers } from '../db/user.service.js';
import { getDB } from '../db/db.service.js';

let db = await getDB();
// console.log(db);

const userColl = await getUserCollection();
// console.log(userColl);

const users = await getAllUsers();
console.log(users);

let uColl = await getUserCollection();
let res;
try {
	res = await uColl.deleteMany({});
} catch (error) {
	console.log('ERROR: ');
	console.log(error);
}
console.log(res);
// console.log(users);

process.exit(0);
