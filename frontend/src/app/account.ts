import { FtpsServer } from './ftps-server';

export interface Account {
    _id?: number;
    accountName: string;
    password?: string;
    hash?: string;
    role: string;
    ftpsServers?: number[];
}
