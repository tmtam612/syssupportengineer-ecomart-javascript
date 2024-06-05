const { meters } = require('../meters/meters');
const logger = require('../utils/logger');
/**
 * @typedef {Object} Reading
 * @property {Number} time
 * @property {Number} reading
 */
/**
 *  generate Singple Reading Data
 * @returns {Array<Reading>}
 */
const generateSingle = () => {
    const startTime = 1607686125; // Friday, 11 December 2020 11:28:45 GMT+00:00
    const hour = 3600;
    const readingsLength = Math.ceil(Math.random() * 20);

    return [...new Array(readingsLength)].map((reading, index) => ({
        time: startTime - index * hour,
        reading: Math.random() * 2,
    }));
};

/**
 * generate Reading Data for all meter
 * @returns {Object{
 *      [meterID: String]: Array<Reading>
 * }}
 */
const generateAllMeters = () => {
    const readings = {};
    if (!meters) return readings;
    try {
        for (const key in meters) {
            if (meters.hasOwnProperty(key)) {
                readings[meters[key]] = generateSingle();
            }
        }
    } catch (err) {
        logger(`error generateAllMeters function: ${err}`);
    }
    return readings;
};

const readingsData = generateAllMeters();

module.exports = { readingsData };
