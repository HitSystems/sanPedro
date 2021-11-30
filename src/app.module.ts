import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesController } from './clientes/clientes.controller';
import { ParametrosController } from './parametros/parametros.controller';
import { DatosController } from './general/datos.controller';
import { ArticulosController } from './articulos/articulos.controller';
import { MenusController } from './menus/menus.controller';
import { TeclasController } from './teclas/teclas.controller';
import { DependientasController } from './dependientas/dependientas.controller';
import { FamiliasController } from './familias/familias.controller';
import { PromocionesController } from './promociones/promociones.controller';
import { InfoTicketController } from './info-ticket/info-ticket.controller';
import { SocketsGateway } from './sockets.gateway';

@Module({
  imports: [],
  controllers: [AppController, ClientesController, ParametrosController, DatosController, ArticulosController, MenusController, TeclasController, DependientasController, FamiliasController, PromocionesController, InfoTicketController],
  providers: [AppService, SocketsGateway],
})
export class AppModule {}
