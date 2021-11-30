"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametrosController = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("../conexion/mssql");
let ParametrosController = class ParametrosController {
    async instaladorLicencia(data) {
        if (data.password == 'LOperas93786') {
            const sqlParaImprimir = `SELECT ll.Llicencia, ll.Empresa, ll.LastAccess, we.Db, ISNULL(ti.ultimoIdTicket, 0) as ultimoIdTicket, ti.token FROM llicencies ll LEFT JOIN Web_Empreses we ON ll.Empresa = we.Nom LEFT JOIN tocGameInfo ti ON ti.licencia = ${data.numLlicencia} WHERE ll.Llicencia = ${data.numLlicencia}`;
            const res1 = await (0, mssql_1.recHit)('Hit', sqlParaImprimir);
            const sqlParaImprimir2 = `SELECT Nom, Codi as codigoTienda FROM clients WHERE Codi = (SELECT Valor1 FROM ParamsHw WHERE Codi = ${res1.recordset[0].Llicencia})`;
            const data2 = await (0, mssql_1.recHit)(res1.recordset[0].Db, sqlParaImprimir2);
            if (res1.recordset.length === 1) {
                const dataF = await (0, mssql_1.recHit)(res1.recordset[0].Db, `SELECT Valor FROM paramstpv WHERE CodiClient = ${res1.recordset[0].Llicencia} AND (Variable = 'BotonsPreu' OR Variable = 'ProhibirCercaArticles')`);
                return {
                    info: {
                        licencia: parseInt(res1.recordset[0].Llicencia),
                        nombreEmpresa: res1.recordset[0].Empresa,
                        database: res1.recordset[0].Db,
                        nombreTienda: data2.recordset[0].Nom,
                        codigoTienda: data2.recordset[0].codigoTienda,
                        ultimoTicket: res1.recordset[0].ultimoIdTicket,
                        botonesConPrecios: dataF.recordset[0] ? dataF.recordset[0].Valor : 'No',
                        prohibirBuscarArticulos: dataF.recordset[1] ? dataF.recordset[1].Valor : 'Si',
                        token: res1.recordset[0].token
                    },
                    error: false
                };
            }
            return {
                error: true,
                mensaje: "No hay UN resultado con estos datos"
            };
        }
        return {
            error: true,
            mensaje: "Contraseña incorrecta"
        };
    }
};
__decorate([
    (0, common_1.Post)('instaladorLicencia'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "instaladorLicencia", null);
ParametrosController = __decorate([
    (0, common_1.Controller)('parametros')
], ParametrosController);
exports.ParametrosController = ParametrosController;
//# sourceMappingURL=parametros.controller.js.map