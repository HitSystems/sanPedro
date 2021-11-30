"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientesInstance = exports.Clientes = void 0;
const mssql_1 = require("../conexion/mssql");
class Clientes {
    comprobarVIP(database, idClienteFinal) {
        let objEnviar = {
            esVip: false,
            pagaEnTienda: true,
            datosCliente: null,
            idCliente: null,
            puntos: 0
        };
        const sql = `
            DECLARE @idCliente int;
            IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'CFINAL' AND Valor = '${idClienteFinal}')
                BEGIN
                    SELECT @idCliente = Codi FROM ConstantsClient WHERE Variable = 'CFINAL' AND Valor = '${idClienteFinal}'
                    IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'EsClient' AND Valor = 'EsClient' AND Codi = @idCliente)
                        BEGIN
                            IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'NoPagaEnTienda' AND Valor = 'NoPagaEnTienda' AND Codi = @idCliente)
                                SELECT 1 as esVIP, 0 as pagaEnTienda, @idCliente as idCliente
                            ELSE
                                SELECT 1 as esVIP, 1 as pagaEnTienda, @idCliente as idCliente 	
                        END
                    ELSE
                        BEGIN
                            IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'NoPagaEnTienda' AND Valor = 'NoPagaEnTienda' AND Codi = @idCliente)
                                SELECT 0 as esVIP, 0 as pagaEnTienda, @idCliente as idCliente, Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'
                            ELSE
                                SELECT 0 as esVIP, 1 as pagaEnTienda, @idCliente as idCliente, Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'
                        END
                END
            ELSE
                SELECT 0 as esVIP, 1 as pagaEnTienda, Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'
        `;
        return (0, mssql_1.recHit)(database, sql).then((res) => {
            const recordset = res.recordset;
            if (recordset.length == 0) {
                return { error: true, mensaje: 'SanPedro: No existe el cliente: ' + idClienteFinal };
            }
            if (recordset[0].idCliente != undefined) {
                if (recordset[0].idCliente == 0 || recordset[0].idCliente == '0') {
                    recordset[0].pagaEnTienda = 1;
                    recordset[0].esVip = 0;
                }
            }
            if (recordset[0].esVIP == 0) {
                objEnviar.esVip = false;
                objEnviar.puntos = recordset[0].puntos;
                if (recordset[0].pagaEnTienda == 0) {
                    objEnviar.pagaEnTienda = false;
                }
                return { error: false, info: objEnviar };
            }
            else {
                if (recordset[0].esVIP == 1) {
                    objEnviar.esVip = true;
                    return (0, mssql_1.recHit)(database, `SELECT Nom as nombre, Nif as nif, Adresa as direccion, Ciutat as ciudad, Cp as cp FROM Clients WHERE Codi = (SELECT TOP 1 Codi FROM ConstantsClient WHERE Valor = '${idClienteFinal}' AND Variable = 'CFINAL')`).then((res2) => {
                        objEnviar.datosCliente = res2.recordset[0];
                        objEnviar.idCliente = recordset[0].idCliente;
                        if (recordset[0].pagaEnTienda == 0) {
                            objEnviar.pagaEnTienda = false;
                        }
                        return { error: false, info: objEnviar };
                    }).catch((err) => {
                        console.log(err);
                        return { error: true, mensaje: 'Error 3: clientes/comprobarVIP' };
                    });
                }
            }
            return { error: true, mensaje: 'Error 2: clientes/comprobarVIP' };
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error 1: clientes/comprobarVIP' };
        });
    }
    getClientes(database) {
        return (0, mssql_1.recHit)(database, "select Id as id, Nom as nombre, IdExterna as tarjetaCliente from ClientsFinals WHERE Id IS NOT NULL AND Id <> ''").then((res) => {
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
    resetPuntosCliente(database, idClienteFinal) {
        return (0, mssql_1.recHit)(database, `UPDATE Punts SET Punts = 0 WHERE idClient = '${idClienteFinal}'`).then((res) => {
            return (res.rowsAffected.length > 0) ? (true) : (false);
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    getPuntosClienteFinal(database, idClienteFinal) {
        return (0, mssql_1.recHit)(database, `SELECT Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'`).then((res) => {
            if (res.recordset.length == 1) {
                return { error: false, info: res.recordset[0].puntos };
            }
            else {
                return { error: true, mensaje: 'SanPedro: Error, no se encuentra el cliente en la tabla de puntos' };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'SanPedro: Error en catch getPuntosClienteFinal (clientes.class)' };
        });
    }
}
exports.Clientes = Clientes;
exports.clientesInstance = new Clientes();
//# sourceMappingURL=clientes.class.js.map