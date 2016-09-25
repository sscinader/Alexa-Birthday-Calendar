const skill = require('../src/');

const birthdayState = {
  attributes: {
    birthdays: {
      sophia: '5-15-2010',
      aurelia: '7-5-2014',
      sadie: '7-26-2007',
    },
  },
};

describe('Calendar Skills', () => {
  describe('Names', () => {
    it('should get random name when there are no names', () => {
      const state = {
        attributes: {},
      };
      const name = skill.randomName.bind(state)();
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

      const name = skill.randomName.bind(state)();
      expect(name).toBe('Sadie');
    });

    it('should get random name when there is more than one name', () => {

      const name = skill.randomName.bind(birthdayState)();
      const names = Object.keys(birthdayState.attributes.birthdays);
      expect(names).toContain(name);
    });
  });

  describe('Working with birthdays', () => {
    it('should list oldest to youngest', () => {
      const sorted = skill.youngestToOldest.bind(birthdayState)();
      expect(sorted[0]).toBe('aurelia');
      expect(sorted[1]).toBe('sophia');
      expect(sorted[2]).toBe('sadie');
    });
  });

  describe('Working with strings', () => {
    it('should make good strings from arrays', () => {
      const oneName = ['sadie'];
      const result1 = skill.makeStringFromArray(oneName);
      expect(result1).toBe('sadie');

      const twoNames = ['sadie', 'sophia'];
      const result2 = skill.makeStringFromArray(twoNames);
      expect(result2).toBe('sadie and sophia');

      const threeNames = ['sadie', 'sophia', 'aurelia'];
      const result3 = skill.makeStringFromArray(threeNames);
      expect(result3).toBe('sadie, sophia, and aurelia');
    });

  });
});
