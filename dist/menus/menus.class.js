"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menusInstance = exports.MenusClass = void 0;
const mssql_1 = require("../conexion/mssql");
class MenusClass {
    getMenus(database, codigoCliente) {
        return (0, mssql_1.recHit)(database, `SELECT DISTINCT Ambient as nomMenu FROM TeclatsTpv WHERE Llicencia = ${codigoCliente} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${codigoCliente} )`).then((res) => {
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
exports.MenusClass = MenusClass;
exports.menusInstance = new MenusClass();
//# sourceMappingURL=menus.class.js.map