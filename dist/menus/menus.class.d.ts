export declare class MenusClass {
    getMenus(database: string, codigoCliente: number): Promise<any[] | import("mssql").IRecordSet<any>>;
}
export declare const menusInstance: MenusClass;
