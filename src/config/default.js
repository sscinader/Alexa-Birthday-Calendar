const winston = require('winston');
const WFirehose = require('winston-firehose');

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
};
