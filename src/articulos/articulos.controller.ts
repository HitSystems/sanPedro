import { Controller, Post, Body } from '@nestjs/common';
import { articulosInstance } from './articulos.class';

@Controller('articulos')
export class ArticulosController {
    @Post('descargarArticulosEspeciales')
    async descargarArticulosEspeciales(@Body() params) {
        if (params.database != undefined && params.codigoCliente != undefined) {
            try {
                const articulos = await articulosInstance.getArticulos(params.database);
                const tarifaEspecial = await articulosInstance.getTarifaEspecial(params.database, params.codigoCliente);                
                return { error: false, info: articulosInstance.fusionarArticulosConTarifasEspeciales(articulos, tarifaEspecial) };            
            } catch(err) {
                console.log(err);
                return { error: true, mensaje: 'SanPedro: Error en CATCH articulos/descargarArticulosEspeciales' };
            }
        } else {
            return { error: true, mensaje: 'SanPedro: Error, faltan datos en articulos/descargarArticulosEspeciales' };
        }
    }
}
