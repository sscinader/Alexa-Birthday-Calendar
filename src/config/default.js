const winston = require('winston');
const WFirehose = require('winston-firehose');
const moment = require('moment-timezone');

// no way to get the timezone of the user so
// Going to (try) to nail all to Pacific Time.
// If it has to just be one timezone, may as well
// use ours!
moment.tz.setDefault('US/Pacific');

// register the transport
const logger = new (winston.Logger)({
  transports: [
    new WFirehose({
      streamName: 'birthday-calendar',
      firehoseOptions: {
        region: 'us-east-1',
      },
    }),
  ],
});

module.exports = {
  dateFormat: 'YYYY-MM-DD',
  logger,
  moment,
};
