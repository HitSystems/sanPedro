export declare class DatosController {
    test(params: any): void;
    cargarTodo(data: any): Promise<{
        error: boolean;
        info: {
            articulos: any;
            menus: any[] | import("mssql").IRecordSet<any>;
            teclas: any[] | import("mssql").IRecordSet<any>;
            dependientas: any[] | import("mssql").IRecordSet<any>;
            familias: any[] | import("mssql").IRecordSet<any>;
            promociones: any;
            parametrosTicket: any[] | import("mssql").IRecordSet<any>;
            clientes: any[] | import("mssql").IRecordSet<any>;
        };
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }>;
}
