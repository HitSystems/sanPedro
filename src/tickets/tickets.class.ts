import { recHit } from "src/conexion/mssql";
import { fechaParaSqlServer } from "src/funciones/fechas";
import { ParametrosInterface } from "src/parametros/parametros.interface";
import { TicketsInterface } from "./tickets.interface";

class TicketsClass {
    /* Comprueba que estén todos los datos necesarios del ticket */
    datosCorrectosTicket(ticket: TicketsInterface) {
        let error = false;
        let mensaje = '';

        if (ticket != undefined && ticket != null) {
            /* Comprobación de la lista */
            if (ticket.lista == undefined || ticket.lista == null) {
                error = true;
                mensaje += 'lista es undefined o null\n';
            } else if (ticket.lista.length == 0) {
                error = true;
                mensaje += 'lista está vacía\n';
            }

            /* Comprobación del idTrabajador */
            if (ticket.idTrabajador == undefined || ticket.idTrabajador == null) {
                error = true;
                mensaje += 'idTrabajador es undefined o null\n';
            } else if (typeof ticket.idTrabajador != "number") {
                error = true;
                mensaje += 'idTrabajador no es tipo number\n';
            }

            /* Comprobación tipoPago */
            if (ticket.tipoPago == undefined || ticket.tipoPago == null) {
                error = true;
                mensaje += 'tipoPago es undefined o null\n';
            } else if (ticket.tipoPago == "TICKET_RESTAURANT") {
                if (ticket.cantidadTkrs == undefined || ticket.cantidadTkrs == null) {
                    error = true;
                    mensaje += 'cantidadTkrs es undefined o null\n';
                } else if (typeof ticket.cantidadTkrs != "number") {
                    error = true;
                    mensaje += 'cantidadTkrs no es tipo number\n';
                }
            }

            /* Comprobación cliente */
            if (ticket.cliente === undefined) {
                error = true;
                mensaje += 'cliente no es valido\n';
            }

            /* Comprobación de id */
            if (ticket._id == undefined || ticket._id == null) {
                error = true;
                mensaje += '_id es undefined o null\n';
            } else if (typeof ticket._id != "number") {
                error = true;
                mensaje += '_id no es number\n';
            }
        } else {
            error = true;
            mensaje += 'El propio ticket está null o undefined\n';
        }

        return { error, mensaje };
    }

    datosCorrectosParametros(parametros: ParametrosInterface) {
        let error = false;
        let mensaje = '';

        if (parametros != undefined && parametros != null) {
            /* Comprobación database */
            if (parametros.database == null || parametros.database == undefined) {
                error = true;
                mensaje += 'database es null o undefined\n';
            } else if (typeof parametros.database != "string") {
                error = true;
                mensaje += 'database no es tipo string\n';
            } else if (parametros.database.length == 0) {
                error = true;
                mensaje += 'database está vacío\n';
            }

            /* Comprobación codigoTienda */
            if (parametros.codigoTienda == null || parametros.codigoTienda == undefined) {
                error = true;
                mensaje += 'codigoTienda es null o undefined\n';
            }

            /* Comprobación licencia */
            if (parametros.licencia == null || parametros.licencia == undefined) {
                error = true;
                mensaje += 'licencia es null o undefined\n';
            }
            /* Comprobación nombreTienda */
            if (parametros.nombreTienda == null || parametros.nombreTienda == undefined) {
                error = true;
                mensaje += 'nombreTienda es null o undefined\n';
            }
        } else {
            error = true;
            mensaje += 'parametros en si no está definido o nulo\n';
        }

        return { error, mensaje };
    }

    async insertarTickets(arrayTickets: TicketsInterface[], parametros: ParametrosInterface, server: any) {
        let error = false;
        let mensaje = '';

        if (this.datosCorrectosParametros(parametros).error == false) {

            /* ----- Recorro array de tickets ----- */
            for (let i = 0; i < arrayTickets.length; i++) {

                if (this.datosCorrectosTicket(arrayTickets[i]).error == false) {

                    arrayTickets[i].enTransito = false;
                    arrayTickets[i].comentario = '';
                    let sql = '';
                    let campoOtros = '';

                    /* Construcción objeto de tiempo */
                    const infoTime = fechaParaSqlServer(new Date(arrayTickets[i].timestamp));

                    /* Construcción nombre de la tabla destino del ticket indidivual */
                    let nombreTabla = `[V_Venut_${infoTime.year}-${infoTime.month}]`;

                    /* Recorro la cesta del ticket */
                    for (let j = 0; j < arrayTickets[i].lista.length; j++) {
                        if (typeof arrayTickets[i].lista[j] == 'object') {
                            /* Tipo tarjeta (tanto 3G como ClearONE) */
                            if (arrayTickets[i].tipoPago == 'TARJETA') {
                                campoOtros = '[Visa]';
                            }

                            /* Tipo ticket restaurante */
                            if(arrayTickets[i].tipoPago == 'TICKET_RESTAURANT') {
                                campoOtros = `[TkRs:${arrayTickets[i].cantidadTkrs}]`;
                            }

                            /* Tipo cliente seleccionado */
                            if(arrayTickets[i].cliente !== undefined && arrayTickets[i].cliente != '' && arrayTickets[i].cliente !== null) {
                                campoOtros += `[Id:${arrayTickets[i].cliente}]`;
                            }

                            /* Tipo consumo personal */
                            let idFinalTrabajadorAux = null;
                            let idFinalTrabajador = null;

                            if(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") {
                                try {
                                    idFinalTrabajadorAux = await recHit(parametros.database, `SELECT valor FROM dependentesExtes WHERE id = ${arrayTickets[i].idTrabajador} AND nom = 'CODICFINAL'`);
                                    idFinalTrabajador = `[Id:${idFinalTrabajadorAux.recordset[0].valor}]`;
                                } catch(err) {
                                    console.log(err);
                                    arrayTickets[i].comentario = 'ERROR EN LA CONSULTA CONSUMO_PERSONAL > idTrabajador a CODIFINAL';
                                }
                            }

                            /* Obtener el ID a insertar, si es tipo promocion combo, habrá dos inserts. El campo es 'plu' */
                            let idArticulo = null;

                            /* Tipo es promoción */
                            if (arrayTickets[i].lista[j].promocion != undefined && arrayTickets[i].lista[j].promocion != null) {
                                if (typeof arrayTickets[i].lista[j]._id == "number") {
                                    if (typeof arrayTickets[i].lista[j].promocion.esPromo == 'boolean') {
                                        if (arrayTickets[i].lista[j].promocion.esPromo == false) {
                                            /* CASO NO ES PROMO (ARTICULO NORMAL) */
                                            idArticulo = arrayTickets[i].lista[j]._id;
                                            sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${idArticulo}, ${arrayTickets[i].lista[j].unidades}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0 : arrayTickets[i].lista[j].subtotal}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? (idFinalTrabajador) : campoOtros}');`;
                                        } else {
                                            /* CASO ES PROMO */
                                            if (typeof arrayTickets[i].lista[j].promocion.infoPromo == 'object') {
                                                if (typeof arrayTickets[i].lista[j].promocion.infoPromo.tipoPromo == 'string') {
                                                    if (arrayTickets[i].lista[j].promocion.infoPromo.tipoPromo == 'COMBO') {
                                                        if (arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal != 0 && arrayTickets[i].lista[j].promocion.infoPromo.idSecundario != 0 && typeof arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal == 'number' && typeof arrayTickets[i].lista[j].promocion.infoPromo.idSecundario == 'number') {
                                                            const importePrincipal = arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta*arrayTickets[i].lista[j].promocion.infoPromo.precioRealPrincipal;
                                                            const importeSecundario = arrayTickets[i].lista[j].promocion.infoPromo.cantidadSecundario*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta*arrayTickets[i].lista[j].promocion.infoPromo.precioRealSecundario;
                                                            sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0: importePrincipal.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? idFinalTrabajador : campoOtros}');`; 
                                                            sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idSecundario}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadSecundario*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0: importeSecundario.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? idFinalTrabajador : campoOtros}');`; 
                                                        } else {
                                                            arrayTickets[i].comentario = 'ERROR, idPrincipal o idSecundario NO ES NUMBER o bien ALGUNO DE LOS DOS IDS ES 0';
                                                        }
                                                    } else if (arrayTickets[i].lista[j].promocion.infoPromo.tipoPromo == 'INDIVIDUAL') {
                                                        if (typeof arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal == 'number' && arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal != 0) {
                                                            sql += ` INSERT  INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0: arrayTickets[i].lista[j].promocion.infoPromo.precioRealPrincipal.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? idFinalTrabajador : campoOtros}');`;
                                                        } else {
                                                            arrayTickets[i].comentario = 'ERROR, idPrincipal NO ES NUMBER o ES 0';
                                                        }
                                                    } else {
                                                        arrayTickets[i].comentario = "ERROR, infoPromo.tipoPromo NO ES 'COMBO' NI 'INDIVIDUAL'";
                                                    }
                                                } else {
                                                    arrayTickets[i].comentario = 'ERROR, infoPromo.tipoPromo NO ES STRING';
                                                }
                                            } else {
                                                arrayTickets[i].comentario = 'ERROR, promocion.infoPromos NO ES OBJECT';
                                            }
                                        }
                                    } else {
                                        arrayTickets[i].comentario = 'ERROR, EL OBJETO promocion.esPromo NO ES UN BOOLEAN';
                                    }
                                } else {
                                    arrayTickets[i].comentario = 'ERROR, EL _ID DE LA LISTA NO ES UN NUMBER';
                                }
                            } else {
                                arrayTickets[i].comentario = 'ERROR, EL OBJETO PROMOCIÓN ES NULL O UNDEFINED';
                            }
                        } else {
                            arrayTickets[i].comentario = 'ERROR, LA POSICIÓN DE LA LISTA NO ES UN OBJETO';
                        }
                    } // Final for j

                    /* Si hay algún comentario es que hay error */
                    if (arrayTickets[i].comentario != '') {
                        error = true;
                        break; // Rompe bucle i
                    }
                    // server.emit('resSincroTickets', { error: false, arrayTickets });
                    // console.log("NO HAY NINGÚN ERROR");
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
                        const res = await recHit(parametros.database, sql);
                        if (res.recordset.length > 0) {
                            if (res.recordset[0].resultado == 'YA_EXISTE') {
                                arrayTickets[i]["intentaRepetir"] = 'YES';
                                arrayTickets[i].enviado = true;
                                arrayTickets[i].comentario = 'Se ha vuelto a enviar. OK';
                                
                            } else if (res.recordset[0].resultado == 'OK') {
                                arrayTickets[i].enviado = true;                     
                                /* Esta consulta es obligatoria. Actualiza la tabla tocGameInfo */
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
                                
                                recHit('Hit', sql2).then((res2) => {
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
                            } else {
                                arrayTickets[i].comentario = 'Respuesta SQL incontrolada';
                                server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: Error, caso incontrolado. Respuesta desconocida.', arrayTickets, idTicketProblematico: arrayTickets[i]._id });
                                break;
                            }
                        } else {
                            arrayTickets[i].comentario = 'Caso no controlado de repuesta SQL';
                            server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: ERROR en recHit 1. recordset.length = 0', idTicketProblematico: arrayTickets[i]._id });
                            break;
                        }
                    } catch(err) {
                        console.log(err);
                        arrayTickets[i].comentario = 'Error en try catch';
                        server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: SQL ERROR 1. Mirar log', arrayTickets, idTicketProblematico: arrayTickets[i]._id });
                        break;
                    }

                } else { // Error general de datos del ticket
                    error = true;
                    mensaje = 'SanPedro: Error general de datos del ticket';
                    console.log(this.datosCorrectosTicket(arrayTickets[i]).mensaje, "ID: ", arrayTickets[i]._id);
                    if (arrayTickets[i] != undefined) {
                        arrayTickets[i]["comentario"] = mensaje;
                    }
                    break;
                }
            } // Final for i
            if (error) { // Solo para las primeras comprobaciones
                server.emit('resSincroTickets', { error: true, arrayTickets, mensaje });
            } else {
                server.emit('resSincroTickets', { error: false, arrayTickets });
            }
        } else {
            // DEVOLVER TAL CUAL EL ARRAY DE TICKETS PORQUE NO SE HA MODIFICADO NADA DEBIDO A UN ERROR
            server.emit('resSincroTickets', { error: true, arrayTickets, mensaje: 'SanPedro: Error, parámetros incorrectos' });
        }
    }

    // async insertarTickets(arrayTickets: TicketsInterface[], parametros: ParametrosInterface, server: any) {
    //     try {
    //         for(let i = 0; i < arrayTickets.length; i++) {
    //             let sql = '';
    //             let campoOtros = '';
    //             /* Comprobación de ticket individual tiene algo válido */
    //             if (arrayTickets[i] == undefined || arrayTickets[i] == null) {
    //                 throw Error("Error, arrayTickets[i] está undefined o null");
    //             }

    //             /* Construcción objeto de tiempo */
    //             const infoTime = fechaParaSqlServer(new Date(arrayTickets[i].timestamp));

    //             /* Construcción nombre de la tabla destino del ticket indidivual */
    //             let nombreTabla = `[V_Venut_${infoTime.year}-${infoTime.month}]`;

    //             /* Recorro la cesta del ticket */
    //             for (let j = 0; j < arrayTickets[i].lista.length; j++) {  
    //                 // Esto es chapuza, arreglarlo!!!
    //                 if (arrayTickets[i].idTrabajador == undefined) {
    //                     arrayTickets[i].idTrabajador = 975;
    //                 }

    //                 if (arrayTickets[i].tipoPago == 'TARJETA')
    //                 {
    //                     campoOtros = '[Visa]';
    //                 } else {
    //                     campoOtros = '';
    //                 }

    //                 if(arrayTickets[i].tipoPago == 'TICKET_RESTAURANT') {
    //                     campoOtros = `[TkRs:${arrayTickets[i].cantidadTkrs}]`;
    //                 }

    //                 if(arrayTickets[i].cliente !== null && arrayTickets[i].cliente !== undefined) {
    //                     campoOtros += `[Id:${arrayTickets[i].cliente}]`;
    //                 }
                    
    //                 if(typeof arrayTickets[i].lista[j]._id === "object") {
    //                     var idLista = arrayTickets[i].lista[j]._id;
    //                 }

    //                 if(typeof arrayTickets[i].lista[j]._id === "undefined") {
    //                     var idLista = arrayTickets[i].lista[j]._id;
    //                 }
                    
    //                 if(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") {                
    //                     var idFinalTrabajadorAux = await recHit(parametros.database, `SELECT valor FROM dependentesExtes WHERE id = ${arrayTickets[i].idTrabajador} AND nom = 'CODICFINAL'`);//await recHit(parametros.database, `SELECT valor FROM dependentesExtes WHERE id = ${arrayTickets[i].idTrabajador} AND nom = 'CODICFINAL'`).recordset[0].valor;
    //                     var idFinalTrabajador = `[Id:${idFinalTrabajadorAux.recordset[0].valor}]`;
    //                 }                
                    
    //                 if(arrayTickets[i].lista[j].promocion.esPromo) {
    //                     if(arrayTickets[i].lista[j].promocion.infoPromo.idSecundario != 0) { //OFERTA COMBO
    //                         sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0: arrayTickets[i].lista[j].promocion.infoPromo.precioRealPrincipal.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? idFinalTrabajador : campoOtros}');`; 
    //                         sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idSecundario}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadSecundario*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0: arrayTickets[i].lista[j].promocion.infoPromo.precioRealSecundario.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? idFinalTrabajador : campoOtros}');`; 
    //                     } else { //OFERTA INDIVIDUAL
    //                         sql += ` INSERT  INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${arrayTickets[i].lista[j].promocion.infoPromo.idPrincipal}, ${arrayTickets[i].lista[j].promocion.infoPromo.cantidadPrincipal*arrayTickets[i].lista[j].promocion.infoPromo.unidadesOferta}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0: arrayTickets[i].lista[j].promocion.infoPromo.precioRealPrincipal.toFixed(2)}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? idFinalTrabajador : campoOtros}');`; 
    //                     }
    //                 } else {
    //                     sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${arrayTickets[i].idTrabajador}, ${arrayTickets[i]._id}, '', ${idLista}, ${arrayTickets[i].lista[j].unidades}, ${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL") ? 0 : arrayTickets[i].lista[j].subtotal}, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? "Desc_100" : "V"}', 0, '${(arrayTickets[i].tipoPago === "CONSUMO_PERSONAL")? idFinalTrabajador : campoOtros}');`;
    //                 }
    //             }

    //             sql = `
    //                 IF NOT EXISTS (SELECT * FROM ${nombreTabla} WHERE botiga = ${parametros.codigoTienda} AND Num_tick = ${arrayTickets[i]._id})
    //                     BEGIN
    //                         ${sql}
    //                         SELECT 'OK' as resultado;
    //                     END
    //                 ELSE
    //                     BEGIN
    //                         SELECT 'YA_EXISTE' as resultado;
    //                     END
    //             `

    //             recHit(parametros.database, sql).then((res) => {
    //                 if (res.recordset[0].resultado == 'YA_EXISTE') {
    //                     socket.emit('confirmarEnvioTicket', {
    //                         idTicket: arrayTickets[i]._id
    //                     });
    //                 } else {
    //                     if(res.rowsAffected.length > 0 && res.recordset[0].resultado == 'OK') {
    //                         socket.emit('confirmarEnvioTicket', {
    //                             idTicket: arrayTickets[i]._id
    //                         });
    //                         let sql2 = `IF EXISTS (SELECT * FROM tocGameInfo WHERE licencia = ${parametros.licencia}) 
    //                                         BEGIN
    //                                             IF ((SELECT ultimoIdTicket FROM tocGameInfo WHERE licencia = ${parametros.licencia}) < ${arrayTickets[i]._id})
    //                                                 BEGIN
    //                                                     UPDATE tocGameInfo SET ultimoIdTicket = ${arrayTickets[i]._id}, ultimaConexion = ${Date.now()}, nombreTienda = '${parametros.nombreTienda}' WHERE licencia = ${parametros.licencia}
    //                                                 END
    //                                             END
    //                                     ELSE
    //                                         BEGIN
    //                                             INSERT INTO tocGameInfo (licencia, bbdd, ultimoIdTicket, codigoInternoTienda, nombreTienda, token, version, ultimaConexion) 
    //                                                 VALUES (${parametros.licencia}, '${parametros.database}', ${arrayTickets[i]._id}, ${parametros.codigoTienda}, '${parametros.nombreTienda}', NEWID(), '2.0.0', ${Date.now()})
    //                                         END`;
                            
    //                         recHit('Hit', sql2);
    //                     } else {
    //                         console.log("Caso sin importancia");
    //                     }
    //                 }                        
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         }
    //     } catch(err) {
    //         console.log("Error al pasar");
    //     }
    // }
}
const ticketsInstance = new TicketsClass();
export { ticketsInstance };