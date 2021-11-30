"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.familiasInstance = exports.FamiliasClass = void 0;
const mssql_1 = require("../conexion/mssql");
class FamiliasClass {
    getFamilias(database) {
        return (0, mssql_1.recHit)(database, 'SELECT Nom as nombre, Pare as padre FROM Families WHERE Nivell > 0').then((res) => {
            if (res) {
                if (res.recordset.length) {
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
exports.FamiliasClass = FamiliasClass;
exports.familiasInstance = new FamiliasClass();
//# sourceMappingURL=familias.class.js.map