import {
	getUserCollection,
	clearUsers,
	addUser,
	getUserById,
	getAllUsers,
	getUserByEmail
} from '../db/user.service.js';
import { getDB } from '../db/db.service.js';

let db = await getDB();
// console.log(db);

const userColl = await getUserCollection();
// console.log(userColl);

// const users = await getAllUsers();
// console.log(users);

// let uColl = await getUserCollection();
// let res;
// try {
// 	res = await uColl.deleteMany({});
// } catch (error) {
// 	console.log('ERROR: ');
// 	console.log(error);
// }
// console.log(res);
// console.log(users);

// let user = await getUserByEmail('patrick.neggie@gmail.com');
// let user1 = await getUserByEmail('patmn@umich.edu');

let user = getUserById('631a292aade400b7a66bfb55');
console.log(user);
// console.log(user1);

process.exit(0);
