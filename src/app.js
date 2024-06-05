const express = require('express');
const { readings } = require('./readings/readings');
const { readingsData } = require('./readings/readings.data');
const { read, store } = require('./readings/readings-controller');
const { recommend, compare } = require('./price-plans/price-plans-controller');
const { registerExitHandler } = require('./utils/exit-handler');
const { authen } = require('./utils/middleware');
const cors = require('cors');
const logger = require('./utils/logger');
const app = express();
app.use(express.json());

const { getReadings, setReadings } = readings(readingsData);

//receive exit handler
registerExitHandler();
//parse body
const bodyParser = express.json();
app.use(bodyParser);

// Apply CORS middleware
app.use(
    cors({
        origin: '*',
    })
);
/**
 * Get the Stored Reading data by Smart MeterID
 * @param {Request} req
 * Parameters:
 * - in: header
 *   name: smartMeterId
 *   schema:
 *   type: string
 *   required: true
 * @param {Response} res
 * @return {Array<import('./readings/readings.data').Reading>}
 */
app.get('/readings/read/:smartMeterId?', authen, (req, res) => {
    try {
        logger(
            `Get the Stored Reading data by Smart MeterID: ${req.params.smartMeterId}`
        );
        res.status(200).send(read(getReadings, req));
    } catch (err) {
        logger(`Error getting Stored Reading data: ${err}`);
        res.status(400).send('Error Happened');
    }
});

/**
 * Store the Reading(kw) at specific time(Epoch Timestamp) by smartMeterID
 * @param {Request} req
 * Parameters:
 * RequestBody: Object{
 *      smartMeterId: String
 *      electricityReadings: Array<Object{
 *          time: String
 *          reading: String
 *      }>
 * }
 * @param {Response} res
 * @return {Array<import('./readings/readings.data').Reading>}
 */
app.post('/readings/store', authen, (req, res) => {
    try {
        logger(`Create Reading Data: ${JSON.stringify(req.body)}`);
        res.status(200).send(store(setReadings, req));
    } catch (err) {
        logger(`Error Create Reading Data: ${err}`);
        res.status(400).send('Error Happened');
    }
});

/**
 * View Recommended Price Plans for Usage
 * @param {Request} req
 * Parameters:
 * - in: header
 *   name: smartMeterId
 *   schema:
 *      type: string
 *      required: true
 * - in: header
 *   name: limit
 *   schema:
 *      type: number
 *      required: false
 * @param {Response} res
 * @return {Array<import('./usage/usage').PricePlan>}
 */
app.get('/price-plans/recommend/:smartMeterId', authen, (req, res) => {
    try {
        logger(
            `Recommend Price Plans for Usage, MeterId: ${
                req.params.smartMeterId
            }, ${req.params.limit ? `limit: ${req.params.limit}` : ''}`
        );
        res.status(200).send(recommend(getReadings, req));
    } catch (err) {
        logger(`Error Recommend Price Plans for Usage: ${err}`);
        res.status(400).send('Error Happened');
    }
});

/**
 * View Current Price Plan and Compare Usage Cost Against all Price Plans
 * @param {Request} req
 * Parameters:
 * - in: header
 *   name: smartMeterId
 *   schema:
 *      type: string
 *      required: true
 * @param {Response} res
 * @return {
 *      smartMeterId: String
 *      pricePlanComparisons: Array<import('./usage/usage').PricePlan>
 * }
 */
app.get('/price-plans/compare-all/:smartMeterId', authen, (req, res) => {
    try {
        logger(
            `View Current Price Plan and Compare Usage Cost Against all Price Plans, MeterId: ${req.params.smartMeterId}`
        );
        res.status(200).send(compare(getReadings, req));
    } catch (err) {
        logger(
            `Error View Current Price Plan and Compare Usage Cost Against all Price Plans: ${err}`
        );
        res.status(400).send('Error Happened');
    }
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`🚀 app listening on port ${port}`);
