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
exports.ArticulosController = void 0;
const common_1 = require("@nestjs/common");
const articulos_class_1 = require("./articulos.class");
let ArticulosController = class ArticulosController {
    async descargarArticulosEspeciales(params) {
        if (params.database != undefined && params.codigoCliente != undefined) {
            try {
                const articulos = await articulos_class_1.articulosInstance.getArticulos(params.database);
                const tarifaEspecial = await articulos_class_1.articulosInstance.getTarifaEspecial(params.database, params.codigoCliente);
                return { error: false, info: articulos_class_1.articulosInstance.fusionarArticulosConTarifasEspeciales(articulos, tarifaEspecial) };
            }
            catch (err) {
                console.log(err);
                return { error: true, mensaje: 'SanPedro: Error en CATCH articulos/descargarArticulosEspeciales' };
            }
        }
        else {
            return { error: true, mensaje: 'SanPedro: Error, faltan datos en articulos/descargarArticulosEspeciales' };
        }
    }
};
__decorate([
    (0, common_1.Post)('descargarArticulosEspeciales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticulosController.prototype, "descargarArticulosEspeciales", null);
ArticulosController = __decorate([
    (0, common_1.Controller)('articulos')
], ArticulosController);
exports.ArticulosController = ArticulosController;
//# sourceMappingURL=articulos.controller.js.map