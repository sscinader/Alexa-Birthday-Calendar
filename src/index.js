const Alexa = require('alexa-sdk');
const moment = require('moment');

const appId = 'amzn1.ask.skill.65751814-8f39-45ed-b452-e1d42a223d02';

const imageObj = {
  smallImageUrl: 'https://imgs.xkcd.com/comics/standards.png',
  largeImageUrl: 'https://imgs.xkcd.com/comics/standards.png',
};

const states = {
  SETUPMODE: '_SETUPMODE', // Add your name & birthday
  QUERYMODE: '_QUERYMODE', // Ask about birthdays
  ENTRYMODE: '_ENTRYMODE',  // Enter Birthdays
};

const addBirthday = function addBirthday() {
  if (!this.attributes.birthdays) {
    this.attributes.birthdays = {};
  }
  const currentlyAdding = this.attributes.currentlyAdding;
  const name = currentlyAdding.name;
  const birthdate = currentlyAdding.birthdate;

  delete this.attributes.currentlyAdding;

  this.attributes.birthdays[name] = birthdate;
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
      'oh my, this is embarassing, but I don\'t know who you are yet.  Please say your name',
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

const queryModeIntent = function queryModeIntent() {
  this.handler.state = states.QUERYMODE;
  this.emit(':ask',
    'What would you like to ask your birthday calendar?',
    // add randome name function of known names
    'You can ask, how old someone is, when is a birthday for a person, or whose birthday is next'
  );
};

const entryModeIntent = function entryModeIntent() {
  this.handler.state = states.ENTRYMODE;
  this.emit(':ask',
    'Say the name of the person whose birthday you would like to add',
    'Say a name or say quit to exit');
};

const globalHandlers = {
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
  SessionEnededRequest() {
    delete this.attributes.currentlyAdding;
    this.attributes.endedSessionCount += 1;
    this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
  },
  Unhandled() {
    this.emit(':ask', 'this is the generic unhandled', 'there should be thre re-ask...');
  },
};

const createStateHandler = function createStateHandler(state, stateHandlers) {
  // the order of the assign assures that stateHandlers will not be overwritten by globalHandlers
  const handlers = Object.assign({}, globalHandlers, stateHandlers);
  return Alexa.CreateStateHandler(state, handlers);
};

const setupModeHandlers = createStateHandler(states.SETUPMODE, {
  AddNameIntent: enterNameIntent,
  AddBirthdateIntent: enterBirthdateIntent,
  QueryModeIntent: queryModeIntent,
  EntryModeIntent: entryModeIntent,

  'AMAZON.NoIntent': function () {
    if (!this.attributes.currentlyAdding) {
            // TODO: this shouldn't happen and is an error.
            // what to do with an erro?
            // should ask to enter owner name....
    }

    if (this.attributes.currentlyAdding.birthdate) {
            // if we have a birthday in the currently adding object,
            // and we're in the no intent, then we know that the user
            // said no when we asked them to verify the birthday.
      delete this.attributes.currentlyAdding.birthdate;
      this.emit(':ask', `Ok, ${this.attributes.owner}, what is your birthday?`, 'Please say your birthday, or exit to quit');
    } else {
            // if we don't have a birthday, we should have the name but
            // since we're in the no block, they said that we got it wrong.
            // so ask them to say it again.
      delete this.attributes.currentlyAdding;
      this.emit(':ask', 'Ok, please say your name again.', 'Please say your name, or exit to quit');
    }
  },

  'AMAZON.YesIntent': function () {
    if (!this.attributes.currentlyAdding) {
      // TODO: this shouldn't happen and is an error.
      // what to do with an erro?
      // should ask to enter owner name....
    }
    if (!this.attributes.currentlyAdding.birthdate) {
      // ok, we have the name right!  Add it to the attributes
      const name = this.attributes.currentlyAdding.name;
      // add the owner to the attributes so we'll always no whose calendar it is!
      this.attributes.owner = name;
      // I don't think this intent will actually have a card, but just adding as a sample
      this.emit(
        ':askWithCard',
        `Ok, hi ${name}.  What is your birthday?`,
        'Say your birthday including year',
        'This is the card title',
        'This is what the card says (the content)',
        imageObj);
    } else {
      // this is so lame.  Creating a bound function and calling it.
      // this is the way to bind "this".  I'd rather just send this
      // as an argument, but eslint airbnb style doesn't like it.
      addBirthday.bind(this)();
      this.state = '';
      this.emit(
        ':ask',
        `Ok, ${this.attributes.owner}, would you like to look up birthdays, or add more names?`,
        'Say look up to look up birthdays, or say add to add more names to the calendar.');
    }
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', 'I am thinking of a number between zero and one hundred, try to guess and I will tell you' +
      ' if it is higher or lower.', 'Try saying a number.');
  },

  // TODO: write a mode specific unhandled handler
});

const entryModeHandlers = createStateHandler(states.ENTRYMODE, {
  // TODO: add delete entry....
  AddNameIntent: enterNameIntent,
  AddBirthdateIntent: enterBirthdateIntent,
  'AMAZON.NoIntent': function () {
    if (!this.attributes.currentlyAdding) {
      // TODO: this shouldn't happen and is an error.
      // what to do with an erro?
      // should ask to enter owner name....
    }

    if (this.attributes.currentlyAdding.birthdate) {
      // if we have a birthday in the currently adding object,
      // and we're in the no intent, then we know that the user
      // said no when we asked them to verify the birthday.
      delete this.attributes.currentlyAdding.birthdate;
      this.emit(':ask', `Ok, ${this.attributes.owner}, what is your birthday?`, 'Please say your birthday, or exit to quit');
    } else {
      // if we don't have a birthday, we should have the name but
      // since we're in the no block, they said that we got it wrong.
      // so ask them to say it again.
      delete this.attributes.currentlyAdding;
      this.emit(':ask', 'Ok, please say your name again.', 'Please say your name, or exit to quit');
    }
  },
  'AMAZON.YesIntent': function () {
    if (!this.attributes.currentlyAdding) {
      // TODO: this shouldn't happen and is an error.
      // what to do with an erro?
      // should ask to enter owner name....
    }

    const name = this.attributes.currentlyAdding.name;
    if (!this.attributes.currentlyAdding.birthdate) {
      // ok, we have the name right!  Add it to the attributes
      this.emit(
        ':ask',
        `Ok, What is ${name}'s birthday?`,
        `Say ${name}'s birthday including year`
      );
    } else {
      addBirthday.bind(this)();
      this.emit(
        ':ask',
        `Ok, ${this.attributes.owner}, I have added ${name}'s birthday.  ` +
        'you can say another name to add another birthday or you can say \'ask\' to ask the birthday questions?',
        'Say look up to look up birthdays, or say a name to add more names to the calendar.');
    }
  },
});

const queryModeHandlers = createStateHandler(states.QUERYMODE, {
  HowOldIntent() {
    const name = this.event.request.intent.slots.EnteredName.value;
    if (!this.attributes.birthdays[name]) {
      this.emit(':ask',
        `I can\'t find ${name}.  Say enter to enter a new name or say "how old is" again if i got it wrong`,
        'Say \'how old is\' to get someones age');
    }

    const birthday = this.attributes.birthdays[name];

    // add fractions....
    const age = moment().diff(moment(birthday), 'years');
    this.emit(':ask', `${name} is ${age} years old, say how old is, to get another age`);
  },
});


exports.handler = (event, context, callback) => { // eslint-disable-line no-unused-vars
  const alexa = Alexa.handler(event, context);
  alexa.appId = appId;
  alexa.dynamoDBTableName = 'BirthdayCalendar';
  alexa.registerHandlers(
    globalHandlers,
    setupModeHandlers,
    entryModeHandlers,
    queryModeHandlers
  );
  alexa.execute();
};
