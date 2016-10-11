'use strict';
const entry = require('../src/mode/entry');

let state;
let noIntent;
let yesIntent

describe('EnterMode', () => {
  beforeEach(() => {
    state = global.state;
    noIntent = entry.handlers['AMAZON.NoIntent'].bind(state);
    yesIntent = entry.handlers['AMAZON.YesIntent'].bind(state);
  });

  describe('NoIntent', () => {
    it('should handle without currently adding error', () => {
      noIntent();
      expect(state.emit).toHaveBeenCalledWith(':ask', 'Ok, please say the name again',
        'Please say the name, or exit to quit');
    });

    it('should handle when we have a currently adding', () => {
      state.attributes.currentlyAdding = {
        birthdate: '2010-05-15',
        name: 'Sophia',
      };
      noIntent();
      expect(state.emit).toHaveBeenCalledWith(':ask', `Ok, what is ${state.attributes.currentlyAdding.name}'s  birthday?`, `Please say ${state.attributes.currentlyAdding.name}'s birthday, or exit to quit`);
    });

    it('should handle when we have only currently adding name', () => {
      state.attributes.currentlyAdding = {
        name: 'Sophia',
      };
      noIntent();
      expect(state.attributes).not.toBe(undefined);
      expect(state.attributes.currentlyAdding).toBe(undefined);
    });
  });

  describe('YesIntent', () => {
    it('should handle without currently adding error', () => {
      yesIntent();
      expect(state.emit).toHaveBeenCalledWith(':ask',
        'Hm, I lost your input.  Sorry.  Please say your name and birthday again.',
        'Please say your name and birthday again'
      );
    });

    it('should handle when we have a currently adding', () => {
      state.attributes.currentlyAdding = {
        birthdate: '2010-05-15',
        name: 'Sophia',
      };
      yesIntent();
      expect(state.attributes.birthdays.Sophia).toBe('2010-05-15');
    });

    it('should handle when we have only currently adding name', () => {
      state.attributes.currentlyAdding = {
        name: 'Sophia',
      };
      yesIntent();
      const name = 'Sophia';
      expect(state.emit).toHaveBeenCalledWith(':ask',
        `Ok, What is ${name}'s birthday?`,
        `Say ${name}'s birthday including year`);
    });
  });
});
