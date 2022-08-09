import { DecisionRecord } from './decisionrecord.model';

export class NoActionDecisionRecord extends DecisionRecord {
	// user: User;
	// triggerId: string;
	// record: Object;
	// timestamp: Date;

	constructor(user, triggerId, timestamp) {
		super(user, triggerId, { action: 'No Action' }, timestamp);
	}
}
