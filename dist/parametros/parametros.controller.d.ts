export declare class ParametrosController {
    instaladorLicencia(data: any): Promise<{
        info: {
            licencia: number;
            nombreEmpresa: any;
            database: any;
            nombreTienda: any;
            codigoTienda: any;
            ultimoTicket: any;
            botonesConPrecios: any;
            prohibirBuscarArticulos: any;
            token: any;
        };
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }>;
}
