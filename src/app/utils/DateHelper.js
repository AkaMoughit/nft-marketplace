'use strict'

module.exports = function getDeltaInDHMS(dateEnd, dateBegin) {
    let deltaInSeconds = Math.abs(dateEnd.getTime() - dateBegin.getTime()) / 1000;

    let days = Math.floor(deltaInSeconds / 86400);
    deltaInSeconds -= days * 86400;

    let hours = Math.floor(deltaInSeconds / 3600) % 24;
    deltaInSeconds -= hours * 3600;

    let minutes = Math.floor(deltaInSeconds / 60) % 60;
    deltaInSeconds -= minutes * 60;

    let seconds = deltaInSeconds % 60;  // in theory the modulus is not required

    return {
        timeEnd: dateEnd,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: Math.round(seconds)
    }
}