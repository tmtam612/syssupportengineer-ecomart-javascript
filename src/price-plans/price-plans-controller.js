const { pricePlans } = require('./price-plans');
const { usageForAllPricePlans } = require('../usage/usage');
const logger = require('../utils/logger');
/**
 * Show Recommend Price plan controller
 * @param {Function} getReadings
 * @param {Request} req
 * @returns {Array<import('../usage/usage').PricePlan>}
 */
const recommend = (getReadings, req) => {
    try {
        const meter = req.params.smartMeterId ? req.params.smartMeterId : null;
        const pricePlanComparisons = usageForAllPricePlans(
            pricePlans,
            getReadings(meter)
        ).sort((a, b) => extractCost(a) - extractCost(b));
        if (req.query.limit) {
            return pricePlanComparisons.slice(0, req.query.limit);
        }
        return pricePlanComparisons;
    } catch (err) {
        logger(`error recommend controller: ${err}`);
    }
    return [];
};

/**
 * get Cost of price plan
 * @param {Object} cost
 * @returns {Number}
 */
const extractCost = (cost) => {
    try {
        const [, value] = Object.entries(cost).find(
            ([key]) => key in pricePlans
        );
        return value;
    } catch (err) {
        logger(`error extractCost controller: ${err}`);
        return 0;
    }
};

/**
 * Compare price plan controller
 * @param {Function} getReadings
 * @param {Request} req
 * @returns {Object {
 *      smartMeterId: String,
 *      pricePlanComparisons: Array<import('../usage/usage').PricePlan>
 * }}
 */
const compare = (getReadings, req) => {
    const meter = req.params.smartMeterId ? req.params.smartMeterId : null;
    try {
        const pricePlanComparisons = usageForAllPricePlans(
            pricePlans,
            getReadings(meter)
        );
        return {
            smartMeterId: meter,
            pricePlanComparisons,
        };
    } catch (err) {
        logger(`error compare controller: ${err}`);
        return {
            smartMeterId: meter,
            pricePlanComparisons: [],
        };
    }
};

module.exports = { recommend, compare };
