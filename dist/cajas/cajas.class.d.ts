import { ParametrosInterface } from "../parametros/parametros.interface";
import { CajaInterface } from "./cajas.interface";
declare class CajasClass {
    insertarCajas(parametros: ParametrosInterface, infoCaja: CajaInterface, server: any): Promise<void>;
}
declare const cajasInstance: CajasClass;
export { cajasInstance };
