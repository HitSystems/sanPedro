export declare class Clientes {
    comprobarVIP(database: string, idClienteFinal: string): Promise<{
        error: boolean;
        info: {
            esVip: boolean;
            pagaEnTienda: boolean;
            datosCliente: any;
            idCliente: any;
            puntos: number;
        };
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    getClientes(database: string): Promise<any[] | import("mssql").IRecordSet<any>>;
    resetPuntosCliente(database: string, idClienteFinal: string): Promise<boolean>;
    getPuntosClienteFinal(database: string, idClienteFinal: string): Promise<{
        error: boolean;
        info: any;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }>;
}
export declare const clientesInstance: Clientes;
