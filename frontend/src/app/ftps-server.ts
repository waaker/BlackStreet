import { Account } from './account';

export interface FtpsServer {
    _id?: number;
    host: string;
    port: number;
    user: string;
    password: string;
    certificate_path?: string;
    account: number;
    connected?: boolean;
}
