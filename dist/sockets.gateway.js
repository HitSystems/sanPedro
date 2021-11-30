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
exports.SocketsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const cajas_class_1 = require("./cajas/cajas.class");
const tickets_class_1 = require("./tickets/tickets.class");
let SocketsGateway = class SocketsGateway {
    async sincronizarTickets(params) {
        if (params != undefined) {
            if (params.arrayTickets != undefined && params.arrayTickets != null && params.parametros != undefined && params.parametros != null) {
                tickets_class_1.ticketsInstance.insertarTickets(params.arrayTickets, params.parametros, this.server);
            }
            else {
                this.server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: arrayTickets o parametros indefinidos o null' });
            }
        }
        else {
            this.server.emit('resSincroTickets', { error: true, mensaje: 'SanPedro: Error en sockets > sincroTickets. ¡Faltan datos!' });
        }
    }
    async insertarCajas(params) {
        if (params != undefined) {
            if (params.infoCaja != undefined && params.infoCaja != null && params.parametros != undefined && params.parametros != null) {
                cajas_class_1.cajasInstance.insertarCajas(params.parametros, params.infoCaja, this.server);
            }
            else {
                this.server.emit('resCajas', { error: true, mensaje: 'SanPedro: infoCaja o parametros indefinidos o null' });
            }
        }
        else {
            this.server.emit('resCajas', { error: true, mensaje: 'SanPedro: Error en sockets > sincroCajas. ¡Faltan datos!' });
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], SocketsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sincroTickets'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "sincronizarTickets", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sincroCajas'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "insertarCajas", null);
SocketsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true,
            transports: ['websocket', 'polling'],
        },
        allowEIO3: true
    })
], SocketsGateway);
exports.SocketsGateway = SocketsGateway;
//# sourceMappingURL=sockets.gateway.js.map