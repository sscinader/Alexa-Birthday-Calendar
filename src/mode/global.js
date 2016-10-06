const moment = require('moment-timezone');
const config = require('config');

const logger = config.logger;

moment.tz.setDefault('US/Pacific');

const states = require('../states');
const nameHelper = require('../helper/name');

const queryModeIntent = function queryModeIntent() {
  this.handler.state = states.QUERYMODE;
  this.emit(':ask',
    'What would you like to ask your birthday calendar?',
    `You can ask, how old ${nameHelper.randomName.bind(this)()} is, when is a birthday for a person, or whose birthday is next`
  );
};

const entryModeIntent = function entryModeIntent() {
  this.handler.state = states.ENTRYMODE;
  this.emit(':ask',
    'Say the name of the person whose birthday you would like to add',
    'Say a name or say quit to exit');
};

const enterNameIntent = function enterNameIntent() {
  this.handler.state = states.ENTRYMODE;
  const name = this.event.request.intent.slots.EnteredName.value;
  this.attributes.currentlyAdding = { name };
  this.emit(':ask', `Ok, I heard ${name}, is that correct?`, `Say yes if the name, ${name} is correct, or no to reenter.`);
};

const enterBirthdateIntent = function enterBirthdateIntent() {
  if (!this.attributes.owner) {
    this.handler.state = states.SETUPMODE;
    this.emit(':ask',
      'oh my, this is embarrassing, but I don\'t know who you are yet.  Please say your name',
      'say your name or quit to exit');
    return;
  }

  this.handler.state = states.ENTRYMODE;
  if (!this.event.request.intent.slots.EnteredName &&
      !(this.attributes.currentlyAdding &&
      this.attributes.currentlyAdding.name)) {
    this.emit(':ask', 'Hm, I got something wrong here, please say the name and birthday again',
      'Please say the name and birthday you are trying to add.');
    return;
  }

  // the name will either come from attributes or a slot (depending on if this bday is being
  // added in one step or two).  So handle both scenarios.
  const nameSlot = this.event.request.intent.slots.EnteredName
    ? this.event.request.intent.slots.EnteredName.value
    : undefined;
  if (nameSlot) {
    this.attributes.currentlyAdding = { name: nameSlot };
  }
  const name = this.attributes.currentlyAdding.name;

  const birthdateString = this.event.request.intent.slots.EnteredBirthdate.value;
  const birthdate = moment(birthdateString, config.dateFormat);
  const now = moment();

  if (birthdate.year() >= now.year()) {
    this.emit(':ask', 'You need to include the year you were born.', 'Say your birthday including the year');
  } else {
    this.attributes.currentlyAdding.birthdate = birthdateString;
    if (this.event.request.intent.slots.EnteredName) {
      // adding name and date at the same time.
      this.emit(':ask', 'Ok, ' +
        `I heard that ${name} was born on <say-as interpret-as="date" format="mdy">${birthdate.format('M/D/Y')}</say-as>, is that correct?`,
        `Say yes if ${name} was born on <say-as interpret-as="date" format="mdy">${birthdate.format('M/D/Y')}</say-as> or say the name and birthday again so I can correct it.`);
    } else {
      this.emit(':ask', 'Ok, I heard  <say-as interpret-as="date" format="mdy">' +
        `${birthdate.format('M/D/Y')}</say-as>, is that correct?`,
        'Say yes if the date <say-as interpret-as="date" format="mdy">' +
        `${birthdate.format('M/D/Y')}</say-as> is correct, or say the birthdate again so I can correct it.`);
    }
  }
};

// Handlers that will be included with each state
const handlers = {
  NewSession() {
    logger.debug('new session', this.event.sessionId);
    const requiresSetup =
      // is there any stored state?
      Object.keys(this.attributes).length === 0
      // is there an owner?
      || !this.attributes.owner
      // are there any birthdays?
      || !this.attributes.birthdays
      // is there a birthday for the owner?
      || !this.attributes.birthdays[this.attributes.owner];

    if (requiresSetup) { // Check if it's the first time the skill has been invoked
      this.attributes.endedSessionCount = 0;
      this.handler.state = states.SETUPMODE;
      this.emit(':ask', 'Welcome to your Birthday Calendar. Let\'s start by setting you up. First, what is your name?',
        'Say your name or quit to exit.');
    } else if (this.event.request.intent) {
      // Go right into query mode
      this.handler.state = states.QUERYMODE;
      this.emitWithState(this.event.request.intent.name);
    } else {
      this.emit('WelcomeIntent');
    }
  },
  SessionEndedRequest() {
    delete this.attributes.currentlyAdding;
    this.attributes.endedSessionCount += 1;
    this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
  },
  AddNameIntent: enterNameIntent,
  AddBirthdateIntent: enterBirthdateIntent,
  QueryModeIntent: queryModeIntent,
  EntryModeIntent: entryModeIntent,
  Unhandled() {
    this.emit(':ask',
      'hmm.  Well, you can say ask to ask me birthday questions or add to add more names ' +
      'to your calendar.',
      'Can you tell me what to do?  You want to ask questions or add names?');
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Thanks for using the Birthday Calendar.  Good Bye');
  },
  'AMAZON.CancelIntent': function () {
    this.emit('AMAZON.StopIntent');
  },
  'AMAZON.StartOverIntent': function () {
    this.handler.state = '';
    this.emitWithState('WelcomeIntent');
  },
};

// Handlers that are only available when state is not set.
const statelessHandlers = {
  // this isn't a real intent in that there are not utterances to invoke it
  // directly.  It is used by session start and StartOverIntent.
  WelcomeIntent() {
    this.emit(':ask', `Welcome to ${this.attributes.owner}'s Birthday Calendar.  ` +
      'Say \'ask\' to lookup birthdays or \'enter\' to add people to your calendar',
      'Say \'ask\' to lookup birthdays or \'enter\' to add people to your calendar');
  },
};

module.exports = {
  handlers,
  queryModeIntent,
  entryModeIntent,
  enterNameIntent,
  enterBirthdateIntent,
  statelessHandlers,
};
