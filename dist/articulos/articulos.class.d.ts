export declare class ArticulosClass {
    getArticulos(database: string): Promise<any[] | import("mssql").IRecordSet<any>>;
    getTarifaEspecial(database: any, codigoCliente: number): Promise<any[] | import("mssql").IRecordSet<any>>;
    private acoplarAtributos;
    fusionarArticulosConTarifasEspeciales(articulos: any, arrayTarifasEspeciales: any): any;
    getArticulosConTarifasEspeciales(database: string, idCliente: number): Promise<{
        error: boolean;
        info: any;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }>;
}
export declare const articulosInstance: ArticulosClass;
