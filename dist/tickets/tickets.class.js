"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsInstance = void 0;
const mssql_1 = require("../conexion/mssql");
const fechas_1 = require("../funciones/fechas");
const parametros_interface_1 = require("../parametros/parametros.interface");
class TicketsClass {
    datosCorrectosTicket(ticket) {
        let error = false;
        let mensaje = '';
        if (ticket != undefined && ticket != null) {
            if (ticket.lista == undefined || ticket.lista == null) {
                error = true;
                mensaje += 'lista es undefined o null\n';
            }
            else if (ticket.lista.length == 0) {
                error = true;
                mensaje += 'lista está vacía\n';
            }
            if (ticket.idTrabajador == undefined || ticket.idTrabajador == null) {
                error = true;
                mensaje += 'idTrabajador es undefined o null\n';
            }
            else if (typeof ticket.idTrabajador != "number") {
                error = true;
                mensaje += 'idTrabajador no es tipo number\n';
            }
            if (ticket.tipoPago == undefined || ticket.tipoPago == null) {
                error = true;
                mensaje += 'tipoPago es undefined o null\n';
            }
            else if (ticket.tipoPago == "TICKET_RESTAURANT") {
                if (ticket.cantidadTkrs == undefined || ticket.cantidadTkrs == null) {
                    error = true;
                    mensaje += 'cantidadTkrs es undefined o null\n';
                }
                else if (typeof ticket.cantidadTkrs != "number") {
                    error = true;
                    mensaje += 'cantidadTkrs no es tipo number\n';
                }
            }
            if (ticket.cliente === undefined) {
                error = true;
                mensaje += 'cliente no es valido\n';
            }
            if (ticket._id == undefined || ticket._id == null) {
                error = true;
                mensaje += '_id es undefined o null\n';
            }
            else if (typeof ticket._id != "number") {
                error = true;
                mensaje += '_id no es number\n';
            }
        }
        else {
            error = true;
            mensaje += 'El propio ticket está null o undefined\n';
        }
        return { error, mensaje };
    }
    datosCorrectosParametros(parametros) {
        let error = false;
        let mensaje = '';
        if (parametros != undefined && parametros != null) {
            if (parametros.database == null || parametros.database == undefined) {
                error = true;
                mensaje += 'database es null o undefined\n';
            }
            else if (typeof parametros.database != "string") {
                error = true;
                mensaje += 'database no es tipo string\n';
            }
            else if (parametros.database.length == 0) {
                error = true;
                mensaje += 'database está vacío\n';
            }
            if (parametros.codigoTienda == null || parametros.codigoTienda == undefined) {
                error = true;
                mensaje += 'codigoTienda es null o undefined\n';
            }
            if (parametros.licencia == null || parametros.licencia == undefined) {
                error = true;
                mensaje += 'licencia es null o undefined\n';
            }
            if (parametros.nombreTienda == null || parametros.nombreTienda == undefined) {
                error = true;
                mensaje += 'nombreTienda es null o undefined\n';
            }
        }
        else {
            error = true;
            mensaje += 'parametros en si no está definido o nulo\n';
        }
        return { error, mensaje };
    }
    async insertarTickets(arrayTickets, parametros, server) {
        let error = false;
        let mensaje = '';
        if (this.datosCorrectosParametros(parametros).error == false) {
            for (let i = 0; i < arrayTickets.length; i++) {
                if (this.datosCorrectosTicket(arrayTickets[i]).error == false) {
                    arrayTickets[i].enTransito = false;
                    arrayTickets[i].comentario = '';
                    let sql = '';
                    let campoOtros = '';
                    const infoTime = (0, fechas_1.fechaParaSqlServer)(new Date(arrayTickets[i].timestamp));
                    let nombreTabla = `[V_Venut_${infoTime.year}-${infoTime.month}]`;
                    for (let j = 0; j < arrayTickets[i].lista.length; j++) {
                        if (typeof arrayTickets[i].lista[j] == 'object') {
                            if (arrayTickets[i].tipoPago == 'TARJETA') {
                                campoOtros = '[Visa]';
                            }
                            if (arrayTickets[i].tipoPago == 'TICKET_RESTAURANT') {
                                campoOtros = `[TkRs:${arrayTickets[i].cantidadTkrs}]`;
                            }
                            if (arrayTickets[i].cliente !== undefined && arrayTickets[i].cliente != '' && arrayTickets[i].cliente !== null) {
                                campoOtros += `[Id:${arrayTickets[i].cliente}]`;
                            }
                            let idFinalTrabajadorAux = null;
                            let idFinalTrabajador = null;
                            if (arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") {
                                try {
                                    idFinalTrabajadorAux = await (0, mssql_1.recHit)(parametros.database, `SELECT valor FROM dependentesExtes WHERE id = ${arrayTickets[i].idTrabajador} AND nom = 'CODICFINAL'`);
                                    idFinalTrabajador = `[Id:${idFinalTrabajadorAux.recordset[0].valor}]`;
                                }
                                catch (err) {
                                    console.log(err);
                                    arrayTickets[i].comentario = 'ERROR EN LA CONSULTA CONSUMO_PERSONAL > idTrabajador a CODIFINAL';
                                }
                            }
                            let idArticulo = null;
                            if (arrayTickets[i].lista[j].promocion != undefined && arrayTickets[i].lista[j].promocion != null) {
                                if (typeof arrayTickets[i].lista[j]._id == "number") {
                                    if (typeof arrayTickets[i].lista[j].promocion.esPromo == 'boolean') {
                                        if (arrayTickets[i].lista[j].promocion.esPromo == false) {
                                            idArticulo = arrayTickets[i].lista[j]._id;
                                            sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${idArticulo}, ${arrayTickets[i].lista[j].unidades}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0 : arrayTickets[i].lista[j].subtotal}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? (idFinalTrabajador) : campoOtros}');`;
                                        }
                                        else {
                                            if (typeof arrayTickets[i].lista[j].promocion.infoPromo == 'object') {
                                                if (typeof arrayTickets[i].lista[j].promocion.infoPromo.tipoPromo == 'string') {
                                                    if (arrayTickets[i].lista[j].promocion.infoPromo.tipoPromo == 'COMBO') {
                                                        if (arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal != 0 && arrayTickets[i].lista[j].promocion.infoPromo.idSecundario != 0 && typeof arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal == 'number' && typeof arrayTickets[i].lista[j].promocion.infoPromo.idSecundario == 'number') {
                                                            const importePrincipal = arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal * arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta * arrayTickets[i].lista[j].promocion.infoPromo.precioRealPrincipal;
                                                            const importeSecundario = arrayTickets[i].lista[j].promocion.infoPromo.cantidadSecundario * arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta * arrayTickets[i].lista[j].promocion.infoPromo.precioRealSecundario;
                                                            sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal * arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0 : importePrincipal.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? idFinalTrabajador : campoOtros}');`;
                                                            sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idSecundario}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadSecundario * arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0 : importeSecundario.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? idFinalTrabajador : campoOtros}');`;
                                                        }
                                                        else {
                                                            arrayTickets[i].comentario = 'ERROR, idPrincipal o idSecundario NO ES NUMBER o bien ALGUNO DE LOS DOS IDS ES 0';
                                                        }
                                                    }
                                                    else if (arrayTickets[i].lista[j].promocion.infoPromo.tipoPromo == 'INDIVIDUAL') {
                                                        if (typeof arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal == 'number' && arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal != 0) {
                                                            sql += ` INSERT  INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal * arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0 : arrayTickets[i].lista[j].promocion.infoPromo.precioRealPrincipal.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? idFinalTrabajador : campoOtros}');`;
                                                        }
                                                        else {
                                                            arrayTickets[i].comentario = 'ERROR, idPrincipal NO ES NUMBER o ES 0';
                                                        }
                                                    }
                                                    else {
                                                        arrayTickets[i].comentario = "ERROR, infoPromo.tipoPromo NO ES 'COMBO' NI 'INDIVIDUAL'";
                                                    }
                                                }
                                                else {
                                                    arrayTickets[i].comentario = 'ERROR, infoPromo.tipoPromo NO ES STRING';
                                                }
                                            }
                                            else {
                                                arrayTickets[i].comentario = 'ERROR, promocion.infoPromos NO ES OBJECT';
                                            }
                                        }
                                    }
                                    else {
                                        arrayTickets[i].comentario = 'ERROR, EL OBJETO promocion.esPromo NO ES UN BOOLEAN';
                                    }
                                }
                                else {
                                    arrayTickets[i].comentario = 'ERROR, EL _ID DE LA LISTA NO ES UN NUMBER';
                                }
                            }
                            else {
                                arrayTickets[i].comentario = 'ERROR, EL OBJETO PROMOCIÓN ES NULL O UNDEFINED';
                            }
                        }
                        else {
                            arrayTickets[i].comentario = 'ERROR, LA POSICIÓN DE LA LISTA NO ES UN OBJETO';
                        }
                    }
                    if (arrayTickets[i].comentario != '') {
                        error = true;
                        break;
                    }
                    sql = `
                        IF NOT EXISTS (SELECT * FROM ${nombreTabla} WHERE botiga = ${parametros.codigoTienda} AND Num_tick = ${arrayTickets[i]._id})
                            BEGIN
                                ${sql}
                                SELECT 'OK' as resultado;
                            END
                        ELSE
                            BEGIN
                                SELECT 'YA_EXISTE' as resultado;
                            END
                    `;
                    try {
                        arrayTickets[i].intentos += 1;
                        const res = await (0, mssql_1.recHit)(parametros.database, sql);
                        if (res.recordset.length > 0) {
                            if (res.recordset[0].resultado == 'YA_EXISTE') {
                                arrayTickets[i]["intentaRepetir"] = 'YES';
                                arrayTickets[i].enviado = true;
                                arrayTickets[i].comentario = 'Se ha vuelto a enviar. OK';
                            }
                            else if (res.recordset[0].resultado == 'OK') {
                                arrayTickets[i].enviado = true;
                                let sql2 = `IF EXISTS (SELECT * FROM tocGameInfo WHERE licencia = ${parametros.licencia}) 
                                                BEGIN
                                                    IF ((SELECT ultimoIdTicket FROM tocGameInfo WHERE licencia = ${parametros.licencia}) < ${arrayTickets[i]._id})
                                                        BEGIN
                                                            UPDATE tocGameInfo SET ultimoIdTicket = ${arrayTickets[i]._id}, ultimaConexion = ${Date.now()}, nombreTienda = '${parametros.nombreTienda}' WHERE licencia = ${parametros.licencia}
                                                        END
                                                    END
                                            ELSE
                                                BEGIN
                                                    INSERT INTO tocGameInfo (licencia, bbdd, ultimoIdTicket, codigoInternoTienda, nombreTienda, token, version, ultimaConexion) 
                                                        VALUES (${parametros.licencia}, '${parametros.database}', ${arrayTickets[i]._id}, ${parametros.codigoTienda}, '${parametros.nombreTienda}', NEWID(), '2.0.0', ${Date.now()})
                                                END`;
                                (0, mssql_1.recHit)('Hit', sql2).then((res2) => {
                                    arrayTickets[i].enviado = true;
                                }).catch((err) => {
                                    console.log(err);
                                    arrayTickets[i].comentario = 'Genera error SQL';
                                    error = true;
                                    mensaje = 'SanPedro: Error, sql2 falla. Mirar en log.';
                                });
                                if (error) {
                                    break;
                                }
                            }
                            else {
                                arrayTickets[i].comentario = 'Respuesta SQL incontrolada';
                                server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: Error, caso incontrolado. Respuesta desconocida.', arrayTickets, idTicketProblematico: arrayTickets[i]._id });
                                break;
                            }
                        }
                        else {
                            arrayTickets[i].comentario = 'Caso no controlado de repuesta SQL';
                            server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: ERROR en recHit 1. recordset.length = 0', idTicketProblematico: arrayTickets[i]._id });
                            break;
                        }
                    }
                    catch (err) {
                        console.log(err);
                        arrayTickets[i].comentario = 'Error en try catch';
                        server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: SQL ERROR 1. Mirar log', arrayTickets, idTicketProblematico: arrayTickets[i]._id });
                        break;
                    }
                }
                else {
                    error = true;
                    mensaje = 'SanPedro: Error general de datos del ticket';
                    console.log(this.datosCorrectosTicket(arrayTickets[i]).mensaje, "ID: ", arrayTickets[i]._id);
                    if (arrayTickets[i] != undefined) {
                        arrayTickets[i]["comentario"] = mensaje;
                    }
                    break;
                }
            }
            if (error) {
                server.emit('resSincroTickets', { error: true, arrayTickets, mensaje });
            }
            else {
                server.emit('resSincroTickets', { error: false, arrayTickets });
            }
        }
        else {
            server.emit('resSincroTickets', { error: true, arrayTickets, mensaje: 'SanPedro: Error, parámetros incorrectos' });
        }
    }
}
const ticketsInstance = new TicketsClass();
exports.ticketsInstance = ticketsInstance;
//# sourceMappingURL=tickets.class.js.map