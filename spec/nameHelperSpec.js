'use strict';

const nameHelper = require('../src/helper/name');
const testHelper = require('./testHelper');

describe('Names', () => {
  describe('Random', () => {
    it('should get random name when there are no names', () => {
      const state = {
        attributes: {},
      };
      const name = nameHelper.randomName.bind(state)();
      expect(name).toBe('Sophia');
    });

    it('should get the sole name when there is one name', () => {
      const state = {
        attributes: {
          birthdays: {
            Sadie: '5-26-2007',
          },
        },
      };

      const name = nameHelper.randomName.bind(state)();
      expect(name).toBe('Sadie');
    });

    it('should get random name when there is more than one name', () => {
      const name = nameHelper.randomName.bind(testHelper.birthdayState)();
      const names = Object.keys(testHelper.birthdayState.attributes.birthdays);
      expect(names).toContain(name);
    });
  });

  describe('Working with strings', () => {
    it('should make good strings from arrays', () => {
      const oneName = ['sadie'];
      const result1 = nameHelper.makeStringFromArray(oneName);
      expect(result1).toBe('sadie');

      const twoNames = ['sadie', 'sophia'];
      const result2 = nameHelper.makeStringFromArray(twoNames);
      expect(result2).toBe('sadie and sophia');

      const threeNames = ['sadie', 'sophia', 'aurelia'];
      const result3 = nameHelper.makeStringFromArray(threeNames);
      expect(result3).toBe('sadie, sophia, and aurelia');
    });

    it('should error if we try to deposes a non string', () => {
      const state = global.state;
      let name;

      nameHelper.dePossessiveName.bind(state)(name);
      expect(state.emit).toHaveBeenCalledWith('Unhandled');
    });
  });
});
