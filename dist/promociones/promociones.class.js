"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promocionesInstance = exports.PromocionesClass = void 0;
const mssql_1 = require("../conexion/mssql");
class PromocionesClass {
    getPromocionesUgly(database, codigoCliente) {
        return (0, mssql_1.recHit)(database, `SELECT Id as _id, Di as fechaInicio, Df as fechaFinal, D_Producte as principal, D_Quantitat as cantidadPrincipal, S_Producte as secundario, S_Quantitat as cantidadSecundario, S_Preu as precioFinal FROM ProductesPromocionats WHERE Client = ${codigoCliente}`).then((res) => {
            if (res) {
                if (res.recordset.length > 0) {
                    return res.recordset;
                }
            }
            return [];
        }).catch((res) => {
            console.log(res);
            return [];
        });
    }
    async getPromociones(database, codigoCliente) {
        let objPrincipal = null;
        let objSecundario = null;
        let promociones = null;
        try {
            promociones = await this.getPromocionesUgly(database, codigoCliente);
        }
        catch (err) {
            console.log(err);
            return [];
        }
        for (let i = 0; i < promociones.length; i++) {
            if (promociones[i].principal.startsWith('F_')) {
                objPrincipal = await (0, mssql_1.recHit)(database, `select Codi as _id from articles where familia = '${promociones[i].principal.substring(2)}'`);
                promociones[i].principal = objPrincipal.recordset;
            }
            else {
                promociones[i].principal = [{ _id: Number(promociones[i].principal) }];
            }
            if (promociones[i].secundario.startsWith('F_')) {
                objSecundario = await (0, mssql_1.recHit)(database, `select Codi as _id from articles where familia = '${promociones[i].secundario.substring(2)}'`);
                promociones[i].secundario = objSecundario.recordset;
            }
            else {
                promociones[i].secundario = [{ _id: Number(promociones[i].secundario) }];
            }
            objPrincipal = null;
            objSecundario = null;
        }
        return promociones;
    }
}
exports.PromocionesClass = PromocionesClass;
exports.promocionesInstance = new PromocionesClass();
//# sourceMappingURL=promociones.class.js.map