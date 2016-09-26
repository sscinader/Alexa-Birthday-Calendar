const moment = require('moment-timezone');

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
  const name = this.event.request.intent.slots.EnteredName.value;
  this.attributes.currentlyAdding = { name };
  this.emit(':ask', `Ok, I heard ${name}, is that correct?`, `Say yes if the name, ${name} is correct, or no to reenter.`);
};

const enterBirthdateIntent = function enterBirthdateIntent() {
  const birthdateString = this.event.request.intent.slots.EnteredBirthdate.value;
  const birthdate = moment(birthdateString);
  const now = moment();
  if (!this.attributes.owner) {
    this.handler.state = states.SETUPMODE;
    this.emit(':ask',
      'oh my, this is embarrassing, but I don\'t know who you are yet.  Please say your name',
      'say your name or quit to exit');
  }

  if (birthdate.year() >= now.year()) {
    this.emit(':ask', 'You need to include the year you were born.', 'Say your birthday including the year');
  } else {
    this.attributes.currentlyAdding.birthdate = birthdateString;
    this.emit(':ask', `Ok, ${this.attributes.owner}, ` +
      `I heard  <say-as interpret-as="date" format="mdy">${birthdate.format('M/D/Y')}</say-as>, is that correct?`,
      `Say yes if the date <say-as interpret-as="date" format="mdy">${birthdate.format('M/D/Y')}</say-as> is correct, or no to reenter your birthday`);
  }
};

const handlers = {
  // This will short-cut any incoming intent or launch requests and route them to this handler.
  NewSession() {
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
    } else {
      this.handler.state = states.SETUPMODE;
      this.emit(':ask', `Welcome to ${this.attributes.owner}'s Birthday Calendar.  ` +
        'Say \'ask\' to lookup birthdays or \'enter\' to add people to your calendar',
        'Say \'ask\' to lookup birthdays or \'enter\' to add people to your calendar');
    }
  },
  SessionEndedRequest() {
    delete this.attributes.currentlyAdding;
    this.attributes.endedSessionCount += 1;
    this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
  },
  QueryModeIntent() {
    this.handler.state = states.QUERYMODE;
    this.emit(':ask', 'What would you like to ask the calendar?  Some things you can try.');
  },
  Unhandled() {
    this.emit(':ask', 'this is the generic unhandled', 'repeat generic unhandled');
  },
};

module.exports = {
  handlers,
  queryModeIntent,
  entryModeIntent,
  enterNameIntent,
  enterBirthdateIntent,
};
