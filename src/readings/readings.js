const logger = require('../utils/logger');
/**
 *
 * @param {Object{
 *      [meterId:String]: Array<import("./readings.data").Reading>
 * }} data
 */
const readings = (data) => ({
    /**
     * get the Reading Data (KW) by meterId
     * @param {String} meterId Id of User
     * @returns {Array<import("./readings.data").Reading>}
     */
    getReadings: (meterId) => {
        //bug, it should be data[meterId]
        // if (data[meterId]) return data["smart-meter-2"]
        if (!meterId) return [];
        try {
            if (data && data[meterId]) return data[meterId];
        } catch (err) {
            logger(`error getReadings function: ${err}`);
        }
        return [];
    },
    /**
     * setting Reading data for meterId
     * @param {String} meterId
     * @param {Array<import("./readings.data").Reading>} readings
     * @returns {Array<import("./readings.data").Reading>}
     */
    setReadings: (meterId, readings) => {
        if (!meterId) return [];
        try {
            //always need to check data for the current meterId exist
            const currentReadings = data && data[meterId] ? data[meterId] : [];
            data[meterId] = [...currentReadings, ...readings];
            return data[meterId].sort((a, b) => b.time - a.time);
        } catch (err) {
            logger(`error setReadings function: ${err}`);
        }
        return [];
    },
});
module.exports = {
    readings,
};
