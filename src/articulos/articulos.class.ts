import { IResult } from 'mssql';
import { recHit } from '../conexion/mssql';

export class ArticulosClass {
    getArticulos(database: string) {
        return recHit(database, 'SELECT Codi as _id, NOM as nombre, PREU as precioConIva, TipoIva as tipoIva, EsSumable as esSumable, Familia as familia, ISNULL(PreuMajor, 0) as precioBase FROM Articles').then((res: IResult<any>) => {
            if (res) {
                if (res.recordset.length > 0) {
                    return res.recordset;
                }
            }
            return [];
        }).catch((err) =>  {
            console.log(err);
            return [];
        });
    }

    getTarifaEspecial(database, codigoCliente: number) {
        return recHit(database, `SELECT Codi as id, PREU as precioConIva FROM TarifesEspecials WHERE TarifaCodi = (select [Desconte 5] from clients where Codi = ${codigoCliente}) AND TarifaCodi <> 0`).then((res: IResult<any>) => {
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

    private async acoplarAtributos(database: string, arrayArticulos: any[]) {
        recHit(database, "SELECT CodiArticle as idAtributo, Valor as idDestino FROM ArticlesPropietats WHERE Variable = 'ES_SUPLEMENT'").then((res) => {
            
        }).catch((err) => {
            console.log(err);

        });
    }

    fusionarArticulosConTarifasEspeciales(articulos, arrayTarifasEspeciales) {
        if (arrayTarifasEspeciales.length > 0) /* APLICAR TARIFAS ESPECIALES */ {
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
    /* Función completa, solo devolver a la colección articulosTarifaEspecial*/
    async getArticulosConTarifasEspeciales(database: string, idCliente: number) {
        try {
            const articulos = await articulosInstance.getArticulos(database);
            const tarifaEspecial = await articulosInstance.getTarifaEspecial(database, idCliente);
            return { error: false, info: this.fusionarArticulosConTarifasEspeciales(articulos, tarifaEspecial) };
        } catch(error) {
            return { error: true, mensaje: 'SanPedro: Error en CATCH getArticulosConTarifasEspeciales' };
        }
    }
}
export const articulosInstance = new ArticulosClass();