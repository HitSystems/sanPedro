import { IResult } from 'mssql';
import { recHit } from '../conexion/mssql';

export class DependientasClass {
    getDependientas(database: string) {
        return recHit(database, 'select Codi as idTrabajador, Codi as _id, nom as nombre, memo as nombreCorto from dependentes').then((res: IResult<any>) => {
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
export const dependientasInstance = new DependientasClass();
