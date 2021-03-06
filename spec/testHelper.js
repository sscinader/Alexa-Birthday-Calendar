'use strict';

const states = require('../src/states');

const birthdayState = {
  attributes: {
    birthdays: {
      sophia: '2010-05-15',
      aurelia: '2014-07-05',
      sadie: '2007-05-26',
    },
  },
};

const getState = function getState() {
  return {
    attributes: {
      owner: 'Sadie',
    },
    handler: {
      state: states.QUERYMODE,
    },
    emit: () => { },
    emitWithState: (arg1, arg2, arg3) => {
      const args = [arg1, arg2, arg3].filter(e => e !== undefined);
      global.state.emit.apply(null, args);
    },
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
};

beforeEach(() => {
  global.state = getState();
  spyOn(global.state, 'emit');
});

module.exports = { birthdayState };
