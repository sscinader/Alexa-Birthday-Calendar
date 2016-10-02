const Alexa = require('alexa-sdk');
const logger = require('config').logger;

const states = require('./states');
const globalMode = require('./mode/global');
const setupMode = require('./mode/setup');
const entryMode = require('./mode/entry');
const queryMode = require('./mode/query');

const appId = 'amzn1.ask.skill.65751814-8f39-45ed-b452-e1d42a223d02';

// wrap the Alexa createStateHandler to tack on our global handlers
const createStateHandler = function createStateHandler(state, stateHandlers) {
  // the order of the assign assures that stateHandlers will not be overwritten by globalHandlers
  const handlers = Object.assign({}, globalMode.handlers, stateHandlers);
  return Alexa.CreateStateHandler(state, handlers);
};

const setupModeHandlers = createStateHandler(states.SETUPMODE, setupMode.handlers);
const entryModeHandlers = createStateHandler(states.ENTRYMODE, entryMode.handlers);
const queryModeHandlers = createStateHandler(states.QUERYMODE, queryMode.handlers);

const handler = (event, context, callback) => { // eslint-disable-line no-unused-vars
  logger.info('birthday request', { event, context });
  const alexa = Alexa.handler(event, context);
  alexa.appId = appId;
  alexa.dynamoDBTableName = 'BirthdayCalendar';
  alexa.registerHandlers(
    globalMode.handlers,
    setupModeHandlers,
    entryModeHandlers,
    queryModeHandlers
  );
  alexa.execute();
};

module.exports = {
  handler,
};
