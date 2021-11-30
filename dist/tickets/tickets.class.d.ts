import { ParametrosInterface } from "src/parametros/parametros.interface";
import { TicketsInterface } from "./tickets.interface";
declare class TicketsClass {
    datosCorrectosTicket(ticket: TicketsInterface): {
        error: boolean;
        mensaje: string;
    };
    datosCorrectosParametros(parametros: ParametrosInterface): {
        error: boolean;
        mensaje: string;
    };
    insertarTickets(arrayTickets: TicketsInterface[], parametros: ParametrosInterface, server: any): Promise<void>;
}
declare const ticketsInstance: TicketsClass;
export { ticketsInstance };
