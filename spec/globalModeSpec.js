'use strict';

const globalMode = require('../src/mode/global');
const states = require('../src/states');

describe('GlobalMode', () => {
  let state;

  beforeEach(() => {
    state = {
      attributes: {
        owner: 'Sadie',
      },
      handler: {
        state: states.QUERYMODE,
      },
      emit: () => { },
      event: {
        request: {
          intent: {
            slots: {
              // slots need to be empty to mimic how it works.
              // Only set what you want to test in the test itself.
              // But here's what fully populated slots look like
              // EnteredName: {
              //   name: 'EnteredName',
              //   value: 'Sadie',
              // },
              // EnteredBirthdate: {
              //   name: 'EnteredBirthdate',
              //   value: '2007-05-26',
              // },
            },
          },
        },
      },
    };

    spyOn(state, 'emit');
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
});
