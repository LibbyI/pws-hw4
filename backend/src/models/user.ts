

export interface IUser {
    username: string;
    password: string;
    permission: string;
    eventIds: String[];
    nearestEvent: Object;
}

export interface scrabedIUser {
  id: string ;
  username: string | null;
  eventIds: String[] | null;
  token: string | null;
  nextEvent: Object | null;
  permission: string;
}


export enum permissionValidTypes {
  Admin = "A",
  Manager = 'M',
  Worker = 'W',
  User = 'None'
};