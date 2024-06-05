const logger = require('./logger');
const registerExitHandler = () => {
    const exit = (signal) => {
        logger(`Received exit Signal ${signal}`);
        process.exit(0);
    };
    /**
     * register the exit handler
     */
    process.on('SIGINT', exit);
    process.on('SIGTERM', exit);
    process.on('SIGTABRT', exit);
    process.on('SIGHUP', exit);
    process.on('SIGQUIT', exit);
};
module.exports = {
    registerExitHandler,
};
