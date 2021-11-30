"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependientasInstance = exports.DependientasClass = void 0;
const mssql_1 = require("../conexion/mssql");
class DependientasClass {
    getDependientas(database) {
        return (0, mssql_1.recHit)(database, 'select Codi as idTrabajador, Codi as _id, nom as nombre, memo as nombreCorto from dependentes').then((res) => {
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
exports.DependientasClass = DependientasClass;
exports.dependientasInstance = new DependientasClass();
//# sourceMappingURL=dependientas.class.js.map