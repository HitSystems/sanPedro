import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { cajasInstance } from './cajas/cajas.class';
import { ticketsInstance } from './tickets/tickets.class';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
    transports: ['websocket', 'polling'],
    },
    allowEIO3: true
  })
export class SocketsGateway {
  @WebSocketServer()
  server;
  
  /* Controlador de sincronizar los tickets */
  @SubscribeMessage('sincroTickets')
  async sincronizarTickets(@MessageBody() params) {
    if (params != undefined) {
      if (params.arrayTickets != undefined && params.arrayTickets != null && params.parametros != undefined && params.parametros != null) {
        ticketsInstance.insertarTickets(params.arrayTickets, params.parametros, this.server);
      } else {
        this.server.emit('resSincroTickets', { error: true, mensaje:  'SanPedro: arrayTickets o parametros indefinidos o null'});
      }
    } else {
      this.server.emit('resSincroTickets', { error: true, mensaje:  'SanPedro: Error en sockets > sincroTickets. ¡Faltan datos!'});
    }
  }

  /* Controlador de sincronizar las cajas */
  @SubscribeMessage('sincroCajas')
  async insertarCajas(@MessageBody() params) {
    if (params != undefined) {
      if (params.infoCaja != undefined && params.infoCaja != null && params.parametros != undefined && params.parametros != null) {
        cajasInstance.insertarCajas(params.parametros, params.infoCaja, this.server);
      } else {
        this.server.emit('resCajas', { error: true, mensaje:  'SanPedro: infoCaja o parametros indefinidos o null'});
      }
    } else {
      this.server.emit('resCajas', { error: true, mensaje:  'SanPedro: Error en sockets > sincroCajas. ¡Faltan datos!'});
    }
  }
}
