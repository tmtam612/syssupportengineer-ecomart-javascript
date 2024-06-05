/**
 * get Reading data controller
 * @param {Function} getReadings
 * @param {Request} req
 * @returns {Array<import("./readings.data").Reading>}
 */
const read = (getReadings, req) => {
    const meter = req.params.smartMeterId ? req.params.smartMeterId : null;
    return getReadings(meter);
};

/**
 * store Reading data controller
 * @param {Function} setReadings
 * @param {Request} req
 * @returns {Array<import("./readings.data").Reading>}
 */
const store = (setReadings, req) => {
    const data = req.body;
    const meterId = data.smartMeterId ? data.smartMeterId : null;
    const electricityReadings = data.electricityReadings
        ? data.electricityReadings
        : [];
    return setReadings(meterId, electricityReadings);
};

module.exports = { read, store };
