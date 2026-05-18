export enum Status {
    Idle = 'idle',
    Initialising = 'initialising', 
    Initialised = 'initialised'
}

export interface Fetch {
    status: Status;
}