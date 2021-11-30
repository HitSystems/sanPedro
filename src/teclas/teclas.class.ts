import { IResult } from 'mssql';
import { recHit } from '../conexion/mssql';

export class TeclasClass {
    /* TODAS LAS TECLAS, de TODOS los TECLADOS de una tienda en concreto */
    getTeclas(database: string, licencia: number) {
        return recHit(database, `SELECT Data, Ambient as nomMenu, (select EsSumable from articles where codi = article) as esSumable, (select nom from articles where codi = article) as nombreArticulo, article as idArticle, pos, color FROM TeclatsTpv WHERE Llicencia = ${licencia} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${licencia} )`).then((res: IResult<any>) => {
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
export const teclasInstance = new TeclasClass();