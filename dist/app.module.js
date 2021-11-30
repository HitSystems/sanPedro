"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const clientes_controller_1 = require("./clientes/clientes.controller");
const parametros_controller_1 = require("./parametros/parametros.controller");
const datos_controller_1 = require("./general/datos.controller");
const articulos_controller_1 = require("./articulos/articulos.controller");
const menus_controller_1 = require("./menus/menus.controller");
const teclas_controller_1 = require("./teclas/teclas.controller");
const dependientas_controller_1 = require("./dependientas/dependientas.controller");
const familias_controller_1 = require("./familias/familias.controller");
const promociones_controller_1 = require("./promociones/promociones.controller");
const info_ticket_controller_1 = require("./info-ticket/info-ticket.controller");
const sockets_gateway_1 = require("./sockets.gateway");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController, clientes_controller_1.ClientesController, parametros_controller_1.ParametrosController, datos_controller_1.DatosController, articulos_controller_1.ArticulosController, menus_controller_1.MenusController, teclas_controller_1.TeclasController, dependientas_controller_1.DependientasController, familias_controller_1.FamiliasController, promociones_controller_1.PromocionesController, info_ticket_controller_1.InfoTicketController],
        providers: [app_service_1.AppService, sockets_gateway_1.SocketsGateway],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map