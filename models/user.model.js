import { ObjectId } from 'mongodb';
import { isNull } from 'util';

export class User {
	// private email: string;
	// private password: string;
	// private name: string;
	// private id: string;
	// private studyParams: Object | undefined;
	// private prefs: Object | undefined;
	// private state: Object | undefined;

	constructor(name, email, password, id, params, prefs, state) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.studyParams = params;
		this.id = id;
		this.prefs = prefs;
		this.state = state;
	}

	// TODO: FIX OR DELETE FUNCTION
	// BUG: matches incorrect key to value in doc
	static fromMongoDoc(mongoDoc) {
		if (mongoDoc === null) return null;

		let id = mongoDoc['_id'].toString();
		return new User(
			mongoDoc['email'],
			mongoDoc['password'],
			mongoDoc['name'],
			id,
			mongoDoc['studyParams'],
			mongoDoc['prefs'],
			mongoDoc['state']
		);
	}

	getName() {
		return this.name;
	}

	getId() {
		return this.id;
	}

	getEmail() {
		return this.email;
	}

	getStudyParams() {
		return this.studyParams;
	}

	getPrefs(key = '') {
		if (this.prefs) {
			if (key && key !== '') {
				return this.prefs[key];
			} else {
				return this.prefs;
			}
		} else {
			return undefined;
		}
	}

	getState() {
		return this.state;
	}
}
