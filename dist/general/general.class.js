"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalInstance = exports.General = void 0;
const mssql_1 = require("../conexion/mssql");
class General {
    getCodigoTiendaFromLicencia(database, licencia) {
        return (0, mssql_1.recHit)(database, `SELECT Valor1 as codigoCliente FROM ParamsHw WHERE Codi = ${licencia}`).then((res) => {
            if (res) {
                if (res.recordset.length > 0) {
                    return res.recordset[0].codigoCliente;
                }
                else {
                    return false;
                }
            }
            return false;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}
exports.General = General;
exports.generalInstance = new General();
//# sourceMappingURL=general.class.js.map