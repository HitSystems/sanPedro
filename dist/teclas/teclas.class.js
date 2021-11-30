"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teclasInstance = exports.TeclasClass = void 0;
const mssql_1 = require("../conexion/mssql");
class TeclasClass {
    getTeclas(database, licencia) {
        return (0, mssql_1.recHit)(database, `SELECT Data, Ambient as nomMenu, (select EsSumable from articles where codi = article) as esSumable, (select nom from articles where codi = article) as nombreArticulo, article as idArticle, pos, color FROM TeclatsTpv WHERE Llicencia = ${licencia} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${licencia} )`).then((res) => {
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
exports.TeclasClass = TeclasClass;
exports.teclasInstance = new TeclasClass();
//# sourceMappingURL=teclas.class.js.map