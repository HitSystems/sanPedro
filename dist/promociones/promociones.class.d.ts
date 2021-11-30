export declare class PromocionesClass {
    getPromocionesUgly(database: string, codigoCliente: number): Promise<any[] | import("mssql").IRecordSet<any>>;
    getPromociones(database: string, codigoCliente: number): Promise<any>;
}
export declare const promocionesInstance: PromocionesClass;
