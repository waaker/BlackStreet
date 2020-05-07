import { MatTableDataSource } from '@angular/material/table';
import { Entry } from './entry';

export interface FtpsServer {
    _id?: number;
    host: string;
    port: number;
    user: string;
    password: string;
    certificate_path?: string;
    account?: number;
    connected?: boolean;
    entries?: MatTableDataSource<Entry>;
}
