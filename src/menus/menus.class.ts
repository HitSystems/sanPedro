import { IResult } from 'mssql';
import { recHit } from '../conexion/mssql';

export class MenusClass {
    getMenus(database: string, codigoCliente: number) {
        return recHit(database, `SELECT DISTINCT Ambient as nomMenu FROM TeclatsTpv WHERE Llicencia = ${codigoCliente} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${codigoCliente} )`).then((res: IResult<any>) => {
            if (res) {
                if (res.recordset.length > 0) {
                    return res.recordset;
                }
            }
            return [];
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }
}
export const menusInstance = new MenusClass();