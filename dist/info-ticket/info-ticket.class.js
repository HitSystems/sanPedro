"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoTicketInstance = exports.InfoTicketClass = void 0;
const mssql_1 = require("../conexion/mssql");
class InfoTicketClass {
    getInfoTicket(database, codigoCliente) {
        return (0, mssql_1.recHit)(database, `select Variable AS nombreDato, Valor AS valorDato from paramsTpv where CodiClient = ${codigoCliente} AND (Variable = 'Capselera_1' OR Variable = 'Capselera_2')`).then((res) => {
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
exports.InfoTicketClass = InfoTicketClass;
exports.infoTicketInstance = new InfoTicketClass();
//# sourceMappingURL=info-ticket.class.js.map