'use strict';

const globalMode = require('../src/mode/global');
const states = require('../src/states');
const testHelper = require('./testHelper');

let state;

describe('GlobalMode', () => {
  beforeEach(() => {
    state = global.state;
  });

  it('should fail if there is no owner', () => {
    // whack the owner....
    delete state.attributes.owner;
    globalMode.enterBirthdateIntent.bind(state)();
    expect(state.emit).toHaveBeenCalledWith(':ask',
      'oh my, this is embarrassing, but I don\'t know who you are yet.  Please say your name',
      'say your name or quit to exit');
    expect(state.handler.state).toBe(states.SETUPMODE);
  });

  it('it should fail if we do not have a name in already', () => {
    globalMode.enterBirthdateIntent.bind(state)();
    expect(state.emit).toHaveBeenCalledWith(':ask',
      'Hm, I got something wrong here, please say the name and birthday again',
      'Please say the name and birthday you are trying to add.');
  });

  it('should fail if no year is added to the date', () => {
    // what alexa returns for date if you don't add a year
    state.attributes.currentlyAdding = {
      name: 'Sadie',
    };
    state.event.request.intent.slots = {
      EnteredBirthdate: {
        name: 'EnteredBirthdate',
        value: '2017-05-26',
      },
    };

    globalMode.enterBirthdateIntent.bind(state)();
    expect(state.emit).toHaveBeenCalledWith(':ask', 'You need to include the year you were born.', 'Say your birthday including the year');
  });

  it('should work if name is already known and birthdate is spoken', () => {
    const name = 'Sadie';
    const birthdate = '2007-05-26';

    state.attributes.currentlyAdding = {
      name,
    };
    state.event.request.intent.slots = {
      EnteredBirthdate: {
        name: 'EnteredBirthdate',
        value: birthdate,
      },
    };

    globalMode.enterBirthdateIntent.bind(state)();
    expect(state.emit).toHaveBeenCalledWith(':ask', 'Ok, ' +
      'I heard  <say-as interpret-as="date" format="mdy">5/26/2007</say-as>, is that correct?',
      'Say yes if the date <say-as interpret-as="date" format="mdy">5/26/2007</say-as> is ' +
      'correct, or say the birthdate again so I can correct it.');
  });

  it('should work if name and date are spoken', () => {
    const name = 'Sadie';
    const birthdate = '2007-05-26';

    state.event.request.intent.slots = {
      EnteredBirthdate: {
        name: 'EnteredBirthdate',
        value: birthdate,
      },
      EnteredName: {
        name: 'EnteredName',
        value: name,
      },
    };

    globalMode.enterBirthdateIntent.bind(state)();
    expect(state.emit).toHaveBeenCalledWith(':ask', 'Ok, ' +
      `I heard that ${name} was born on <say-as interpret-as="date" format="mdy">` +
      '5/26/2007</say-as>, is that correct?',
      `Say yes if ${name} was born on <say-as interpret-as="date" format="mdy">` +
      '5/26/2007</say-as> or say the name and birthday again so I can correct it.');
  });

  it('should change to queryMode', () => {
    const state = global.state;
    state.handler.state = '';
    globalMode.queryModeIntent.bind(state)();
    expect(state.handler.state).toBe(states.QUERYMODE);
  });

  it('should change to entryMode', () => {
    const state = global.state;
    state.handler.state = '';
    globalMode.entryModeIntent.bind(state)();
    expect(state.handler.state).toBe(states.ENTRYMODE);
  });

  it('should add name to currentlyAdding', () => {
    const state = global.state;
    state.event.request.intent.slots.EnteredName = {
      value: 'Aurelia',
    }
    globalMode.enterNameIntent.bind(state)();
    expect(state.attributes.currentlyAdding.name)
      .toBe('Aurelia');
  });

  describe('Global handlers', () => {
    it('new session will require setup', () => {
      const state = global.state;
      delete state.attributes.owner;
      const handlers = globalMode.handlers;
      handlers.NewSession.bind(state)();
      expect(state.emit).toHaveBeenCalledWith(':ask', 'Welcome to your Birthday Calendar. Let\'s start by setting you up. First, what is your name?',
        'Say your name or quit to exit.');
    });

    it('new session will call add name if setup already and there\'s an intent', () => {
      const state = global.state;
      state.attributes.birthdays = { Sadie: '2010-05-26' };
      state.event.request.intent = { name: 'TESTING'}
      const handlers = globalMode.handlers;
      handlers.NewSession.bind(state)();
      expect(state.emit).toHaveBeenCalledWith('TESTING');
    });

    it('new session will call welcome intent if it has no intent', () => {
      const state = global.state;
      state.attributes.birthdays = { Sadie: '2010-05-26' };
      delete state.event.request.intent
      const handlers = globalMode.handlers;
      handlers.NewSession.bind(state)();
      expect(state.emit).toHaveBeenCalledWith('WelcomeIntent');
    });

    it('session end will increment ended sessions', () => {
      const state = global.state;
      state.attributes.endedSessionCount = 0;
      const sessionEnd = globalMode.handlers.SessionEndedRequest.bind(state);
      sessionEnd();
      expect(state.attributes.endedSessionCount).toBe(1);
    });

    it('unhandled will say something', () => {
      const state = global.state;
      const unhandled = globalMode.handlers.Unhandled.bind(state);
      unhandled();
      expect(state.emit).toHaveBeenCalledWith(':ask',
        'hmm.  Well, you can say ask to ask me birthday questions or add to add more names ' +
        'to your calendar.',
        'Can you tell me what to do?  You want to ask questions or add names?');
    });

    it('stop will respond', () => {
      const state = global.state;
      const stop = globalMode.handlers['AMAZON.StopIntent'].bind(state);
      stop();
      expect(state.emit).toHaveBeenCalledWith(':tell', 'Thanks for using the Birthday Calendar.  Good Bye');
    });

    it('cancel will call stop', () => {
      const state = global.state;
      const cancel = globalMode.handlers['AMAZON.CancelIntent'].bind(state);
      cancel();
      expect(state.emit).toHaveBeenCalledWith('AMAZON.StopIntent');
    });

    it('start over will call welcome', () => {
      const state = global.state;
      const startOver = globalMode.handlers['AMAZON.StartOverIntent'].bind(state);
      startOver();
      expect(state.emit).toHaveBeenCalledWith('WelcomeIntent');
    });
  });

  describe('Stateless Handlers', () => {
    it('welcome intent should say something', () => {
      const state = global.state;
      const welcome = globalMode.statelessHandlers.WelcomeIntent.bind(state);
      welcome();
      expect(state.emit).toHaveBeenCalledWith(':ask', `Welcome to ${state.attributes.owner}'s Birthday Calendar.  ` +
      'Say \'ask\' to lookup birthdays or \'enter\' to add people to your calendar',
      'Say \'ask\' to lookup birthdays or \'enter\' to add people to your calendar')
    });
  })
});
