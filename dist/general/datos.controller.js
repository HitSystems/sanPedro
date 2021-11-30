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
exports.DatosController = void 0;
const common_1 = require("@nestjs/common");
const menus_class_1 = require("../menus/menus.class");
const articulos_class_1 = require("../articulos/articulos.class");
const general_class_1 = require("./general.class");
const teclas_class_1 = require("../teclas/teclas.class");
const dependientas_class_1 = require("../dependientas/dependientas.class");
const familias_class_1 = require("../familias/familias.class");
const promociones_class_1 = require("../promociones/promociones.class");
const info_ticket_class_1 = require("../info-ticket/info-ticket.class");
const clientes_class_1 = require("../clientes/clientes.class");
let DatosController = class DatosController {
    test(params) {
        general_class_1.generalInstance.getCodigoTiendaFromLicencia('Fac_Tena', 842).then((res) => {
            console.log(res);
        });
    }
    async cargarTodo(data) {
        if (data.database != undefined && data.codigoTienda != undefined && data.licencia != undefined) {
            const database = data.database;
            const licencia = data.licencia;
            const codigoTienda = data.codigoTienda;
            try {
                let articulosAux = await articulos_class_1.articulosInstance.getArticulos(database);
                let tarifasEspeciales = await articulos_class_1.articulosInstance.getTarifaEspecial(database, codigoTienda);
                const articulos = articulos_class_1.articulosInstance.fusionarArticulosConTarifasEspeciales(articulosAux, tarifasEspeciales);
                const menus = await menus_class_1.menusInstance.getMenus(database, codigoTienda);
                const teclas = await teclas_class_1.teclasInstance.getTeclas(database, licencia);
                const dependientas = await dependientas_class_1.dependientasInstance.getDependientas(database);
                const familias = await familias_class_1.familiasInstance.getFamilias(database);
                const promociones = await promociones_class_1.promocionesInstance.getPromociones(database, codigoTienda);
                const parametrosTicket = await info_ticket_class_1.infoTicketInstance.getInfoTicket(database, codigoTienda);
                const clientes = await clientes_class_1.clientesInstance.getClientes(database);
                return {
                    error: false,
                    info: {
                        articulos,
                        menus,
                        teclas,
                        dependientas,
                        familias,
                        promociones,
                        parametrosTicket,
                        clientes
                    }
                };
            }
            catch (err) {
                console.log(err);
                return { error: true, mensaje: 'SanPedro: TryCatch datos/cargarTodo: mirar log' };
            }
        }
        else {
            return { error: true, mensaje: 'SanPedro: Faltan datos en datos/cargarTodo' };
        }
    }
};
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DatosController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('cargarTodo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatosController.prototype, "cargarTodo", null);
DatosController = __decorate([
    (0, common_1.Controller)('datos')
], DatosController);
exports.DatosController = DatosController;
//# sourceMappingURL=datos.controller.js.map