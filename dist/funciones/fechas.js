"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fechaParaSqlServer = void 0;
function fechaParaSqlServer(fecha) {
    let year = `${fecha.getFullYear()}`;
    let month = `${fecha.getMonth() + 1}`;
    let day = `${fecha.getDate()}`;
    let hours = `${fecha.getHours()}`;
    let minutes = `${fecha.getMinutes()}`;
    let seconds = `${fecha.getSeconds()}`;
    if (month.length === 1) {
        month = '0' + month;
    }
    if (day.length === 1) {
        day = '0' + day;
    }
    if (hours.length === 1) {
        hours = '0' + hours;
    }
    if (minutes.length === 1) {
        minutes = '0' + minutes;
    }
    if (seconds.length === 1) {
        seconds = '0' + seconds;
    }
    return { year, month, day, hours, minutes, seconds };
}
exports.fechaParaSqlServer = fechaParaSqlServer;
//# sourceMappingURL=fechas.js.map