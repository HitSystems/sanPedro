export declare class InfoTicketClass {
    getInfoTicket(database: string, codigoCliente: number): Promise<any[] | import("mssql").IRecordSet<any>>;
}
export declare const infoTicketInstance: InfoTicketClass;
