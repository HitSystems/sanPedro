export declare class InfoTicketController {
    getInfoTicket(params: any): Promise<{
        error: boolean;
        info: any[] | import("mssql").IRecordSet<any>;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
}
