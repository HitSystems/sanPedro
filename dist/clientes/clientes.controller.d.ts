export declare class ClientesController {
    comprobarVIP(params: any): Promise<any> | {
        error: boolean;
        mensaje: string;
    };
    getClientesFinales(params: any): Promise<{
        error: boolean;
        info: any[] | import("mssql").IRecordSet<any>;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }>;
    resetPuntosCliente(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
    getPuntosCliente(params: any): Promise<{
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
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
}
