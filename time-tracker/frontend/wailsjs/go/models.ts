export namespace entities {
	
	export class Customer {
	    id: number;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Customer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	    }
	}
	export class TrackedTime {
	    id: number;
	    customer_id: number;
	    startTime: string;
	    endTime: string;
	    comment: string;
	    deleted: boolean;
	
	    static createFrom(source: any = {}) {
	        return new TrackedTime(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.customer_id = source["customer_id"];
	        this.startTime = source["startTime"];
	        this.endTime = source["endTime"];
	        this.comment = source["comment"];
	        this.deleted = source["deleted"];
	    }
	}

}

export namespace time {
	
	export class Time {
	
	
	    static createFrom(source: any = {}) {
	        return new Time(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

