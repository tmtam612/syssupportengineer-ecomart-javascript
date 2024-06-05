const logger = require('../utils/logger');
const moment = require('moment');
/**
 * @typedef {Object} PricePlan
 * @property {Number} pricePlanId
 */
/**
 * calculate average Reading
 * @param {Arary<import("../readings/readings.data").Reading>} readings
 * @returns {Number}
 */
const average = (readings) => {
    try {
        return (
            readings.reduce((prev, next) => prev + next.reading, 0) /
            readings.length
        );
    } catch (err) {
        logger(`error average function: ${err}`);
        return 0;
    }
};

/**
 * calculate hour that Reading has been used
 * @param {Arary<import("../readings/readings.data").Reading>} readings
 * @returns {Number}
 */
const timeElapsedInHours = (readings) => {
    try {
        readings.sort((a, b) => a.time - b.time);
        const seconds = readings[readings.length - 1].time - readings[0].time;
        const hours = Math.floor(seconds / 3600);
        return hours;
    } catch (err) {
        logger(`error timeElapsedInHours function: ${err}`);
        return 0;
    }
};

/**
 * calculate usage by take average Reading divide to hour that Reading has been used
 * @param {Arary<import("../readings/readings.data").Reading>} readings
 * @returns {Number}
 */
const usage = (readings) => {
    try {
        return average(readings) / timeElapsedInHours(readings);
    } catch (err) {
        logger(`error usage function: ${err}`);
        return 0;
    }
};

/**
 * calculate cost
 * @param {Arary<import("../readings/readings.data").Reading>} readings
 * @param {Number} rate
 * @returns {Number}
 */
const usageCost = (readings, rate) => {
    try {
        return usage(readings) * rate;
    } catch (err) {
        logger(`error usageCost function: ${err}`);
        return 0;
    }
};

/**
 * calculate cost for all price plans
 * @param {Object} pricePlans
 * @param {Array<import("../readings/readings.data").Reading>} readings
 * @returns {Array<PricePlan>}
 */
const usageForAllPricePlans = (pricePlans, readings) => {
    if (!pricePlans) return [];
    try {
        return Object.entries(pricePlans).map(([key, value]) => {
            return {
                [key]: usageCost(readings, value.rate),
            };
        });
    } catch (err) {
        logger(`error usageForAllPricePlans function: ${err}`);
        return [];
    }
};
// const energeyConsumedKWh = (pricePlan, readings) => {
//     if (!pricePlan) return 'No Price Plan';
//     if (!readings || readings.length === 0) return 0;

//     const startTime = moment().subtract(1, 'weeks').startOf('week');
//     const endTime = moment().subtract(1, 'weeks').startOf('week');
//     const averageCost = averageCost(readings, startTime, endTime);
//     const duration = (endTime - startTime) / 3600;
//     const energeyConsumed = averageCost * duration;
//     return pricePlan.rate * energeyConsumed;
// };

// const averageCost = (readings, startTime, endTime) => {
//     try {
//         const filterMatchCost = readings.filter(
//             (item) => item.time >= startTime && item.time <= endTime
//         );
//         return average(filterMatchCost);
//     } catch (err) {
//         logger(`error average function: ${err}`);
//         return 0;
//     }
// };

module.exports = {
    average,
    timeElapsedInHours,
    usage,
    usageCost,
    usageForAllPricePlans,
};
