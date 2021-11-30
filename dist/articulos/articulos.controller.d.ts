export declare class ArticulosController {
    descargarArticulosEspeciales(params: any): Promise<{
        error: boolean;
        info: any;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }>;
}
