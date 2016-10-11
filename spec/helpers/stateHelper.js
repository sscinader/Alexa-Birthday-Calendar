const states = require('../../src/states');

global.helperState = {};

beforeEach(() => {
  global.helperState = {
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

  spyOn(global.helperState, 'emit');
});
