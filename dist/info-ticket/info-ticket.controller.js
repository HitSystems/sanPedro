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
exports.InfoTicketController = void 0;
const common_1 = require("@nestjs/common");
const info_ticket_class_1 = require("./info-ticket.class");
let InfoTicketController = class InfoTicketController {
    getInfoTicket(params) {
        if (params.database != undefined && params.idCliente != undefined) {
            return info_ticket_class_1.infoTicketInstance.getInfoTicket(params.database, params.idCliente).then((res) => {
                return { error: false, info: res };
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'SanPedro: Error en catch info-ticket/getInfoTicket' };
            });
        }
        else {
            return { error: true, mensaje: 'SanPedro: Faltan datos en info-ticket/getInfoTicket' };
        }
    }
};
__decorate([
    (0, common_1.Post)('getInfoTicket'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InfoTicketController.prototype, "getInfoTicket", null);
InfoTicketController = __decorate([
    (0, common_1.Controller)('info-ticket')
], InfoTicketController);
exports.InfoTicketController = InfoTicketController;
//# sourceMappingURL=info-ticket.controller.js.map