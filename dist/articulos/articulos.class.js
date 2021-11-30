"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articulosInstance = exports.ArticulosClass = void 0;
const mssql_1 = require("../conexion/mssql");
class ArticulosClass {
    getArticulos(database) {
        return (0, mssql_1.recHit)(database, 'SELECT Codi as _id, NOM as nombre, PREU as precioConIva, TipoIva as tipoIva, EsSumable as esSumable, Familia as familia, ISNULL(PreuMajor, 0) as precioBase FROM Articles').then((res) => {
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
    getTarifaEspecial(database, codigoCliente) {
        return (0, mssql_1.recHit)(database, `SELECT Codi as id, PREU as precioConIva FROM TarifesEspecials WHERE TarifaCodi = (select [Desconte 5] from clients where Codi = ${codigoCliente}) AND TarifaCodi <> 0`).then((res) => {
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
    async acoplarAtributos(database, arrayArticulos) {
        (0, mssql_1.recHit)(database, "SELECT CodiArticle as idAtributo, Valor as idDestino FROM ArticlesPropietats WHERE Variable = 'ES_SUPLEMENT'").then((res) => {
        }).catch((err) => {
            console.log(err);
        });
    }
    fusionarArticulosConTarifasEspeciales(articulos, arrayTarifasEspeciales) {
        if (arrayTarifasEspeciales.length > 0) {
            for (let i = 0; i < arrayTarifasEspeciales.length; i++) {
                for (let j = 0; j < articulos.length; j++) {
                    if (articulos[j]._id === arrayTarifasEspeciales[i].id) {
                        articulos[j].precioConIva = arrayTarifasEspeciales[i].precioConIva;
                        break;
                    }
                }
            }
        }
        return articulos;
    }
    async getArticulosConTarifasEspeciales(database, idCliente) {
        try {
            const articulos = await exports.articulosInstance.getArticulos(database);
            const tarifaEspecial = await exports.articulosInstance.getTarifaEspecial(database, idCliente);
            return { error: false, info: this.fusionarArticulosConTarifasEspeciales(articulos, tarifaEspecial) };
        }
        catch (error) {
            return { error: true, mensaje: 'SanPedro: Error en CATCH getArticulosConTarifasEspeciales' };
        }
    }
}
exports.ArticulosClass = ArticulosClass;
exports.articulosInstance = new ArticulosClass();
//# sourceMappingURL=articulos.class.js.map