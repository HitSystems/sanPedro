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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const articulos_class_1 = require("../articulos/articulos.class");
const clientes_class_1 = require("./clientes.class");
let ClientesController = class ClientesController {
    comprobarVIP(params) {
        if (params.database != undefined && params.idClienteFinal != undefined) {
            return clientes_class_1.clientesInstance.comprobarVIP(params.database, params.idClienteFinal).then((res) => {
                if (res.info != undefined) {
                    if (res.info.idCliente != undefined && res.error == false) {
                        return articulos_class_1.articulosInstance.getArticulosConTarifasEspeciales(params.database, res.info.idCliente).then((articulosEspeciales) => {
                            if (articulosEspeciales.error == false) {
                                return { error: false, articulosEspeciales: articulosEspeciales.info, info: res.info };
                            }
                            return { error: true, mensaje: articulosEspeciales.mensaje };
                        }).catch((err) => {
                            console.log(err);
                            return { error: true, mensaje: 'SanPedro: Error en catch clientes/comprobarVIP getArticulosConTarifasEspeciales' };
                        });
                    }
                }
                return res;
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'SanPedro: Error en clientes/comprobarVIP catch' };
            });
        }
        return { error: true, mensaje: 'SanPedro: Faltan datos en clientes/comprobarVIP' };
    }
    async getClientesFinales(params) {
        if (params.database != undefined) {
            const clientes = await clientes_class_1.clientesInstance.getClientes(params.database);
            return { error: false, info: clientes };
        }
        else {
            return { error: true, mensaje: 'SanPedro: Faltan datos en clientes/getClientesFinales' };
        }
    }
    resetPuntosCliente(params) {
        if (params.idClienteFinal != undefined && params.database != undefined) {
            return clientes_class_1.clientesInstance.resetPuntosCliente(params.database, params.idClienteFinal).then((res) => {
                if (res) {
                    return { error: false };
                }
                else {
                    return { error: true, mensaje: 'SanPedro: Error, en clientes/resetPuntosCliente > resetPuntosCliente()' };
                }
            }).catch((err) => {
                return { error: true, mensaje: 'SanPedro: Error, en clientes/resetPuntosCliente > resetPuntosCliente() CATCH' };
            });
        }
        else {
            return { error: true, mensaje: 'SanPedro: Error, faltan datos en clientes/resetPuntosCliente' };
        }
    }
    getPuntosCliente(params) {
        if (params.idClienteFinal != undefined && params.database != undefined) {
            return clientes_class_1.clientesInstance.getPuntosClienteFinal(params.database, params.idClienteFinal).then((res) => {
                return res;
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'SanPedro: Error en clientes/getPuntosCliente > getPuntosClienteFinal' };
            });
        }
        else {
            return { error: true, mensaje: 'SanPedro: Error, faltan datos en clientes/getPuntosCliente' };
        }
    }
};
__decorate([
    (0, common_1.Post)('comprobarVIP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "comprobarVIP", null);
__decorate([
    (0, common_1.Post)('getClientesFinales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "getClientesFinales", null);
__decorate([
    (0, common_1.Post)('resetPuntosCliente'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "resetPuntosCliente", null);
__decorate([
    (0, common_1.Post)('getPuntosCliente'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "getPuntosCliente", null);
ClientesController = __decorate([
    (0, common_1.Controller)('clientes')
], ClientesController);
exports.ClientesController = ClientesController;
//# sourceMappingURL=clientes.controller.js.map