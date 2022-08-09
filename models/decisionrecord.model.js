export class DecisionRecord {
	// user: User;
	// triggerId: string;
	// record: Object;
	// providedTimestamp: Date;
	// generatedTimestamp: Date;

	constructor(user, triggerId, record, timestamp) {
		this.user = user;
		this.triggerId = triggerId;
		this.record = record;
		this.providedTimestamp = timestamp;
		this.generatedTimestamp = new Date();
	}
}
