const config = require('../src/node_modules/config');
const birthdayHelper = require('../src/helper/birthday');
const testHelper = require('./testHelper');

const moment = config.moment;

describe('Calendar Skills', () => {
  describe('Working with birthdays', () => {
    it('should list oldest to youngest', () => {
      const sorted = birthdayHelper.youngestToOldest.bind(testHelper.birthdayState)();
      expect(sorted[0]).toBe('aurelia');
      expect(sorted[1]).toBe('sophia');
      expect(sorted[2]).toBe('sadie');
    });

    it('should calculate how many more days', () => {
      const testToday = '2016-09-25';
      expect(birthdayHelper.howManyDays('1968-12-30', testToday)).toBe(96);
      expect(birthdayHelper.howManyDays('2007-05-26', testToday)).toBe(243);
      expect(birthdayHelper.howManyDays(testToday, testToday)).toBe(0);
    });

    it('should calculate tomorrow correctly', () => {
      const tomorrow = moment().add(1, 'day').format(config.dateFormat);
      const days = birthdayHelper.howManyDays(tomorrow);
      expect(days).toBe(1);
    });

    it('should calculate today correctly', () => {
      const today = moment(moment().format(config.dateFormat), config.dateFormat);
      expect(birthdayHelper.howManyDays(today)).toBe(0);
    });

    it('should calculate yesterday correctly', () => {
      const yesterday = moment().subtract(1, 'day').format(config.dateFormat);
      const days = birthdayHelper.howManyDays(yesterday);
      const yesterdayInAYear = moment(yesterday, config.birthdate).add(1, 'year');
      const today = moment(moment().format(config.dateFormat), config.dateFormat);
      expect(days).toBe(yesterdayInAYear.diff(today, 'days'));
    });

    it('should add a birthday if no existing birthdays', () => {
      const state = {
        attributes: {
          currentlyAdding: {
            name: 'Sadie',
            birthdate: '2007-05-26',
          },
        },
      };

      birthdayHelper.addBirthday.bind(state)();
      expect(state.attributes.currentlyAdding).toBe(undefined);
      expect(state.attributes.birthdays.Sadie).toBe('2007-05-26');
    });

    it('should add a birthday if existing birthdays array already', () => {
      const state = {
        attributes: {
          birthdays: {
            Sophia: '2010-05-15',
          },
          currentlyAdding: {
            name: 'Sadie',
            birthdate: '2007-05-26',
          },
        },
      };

      birthdayHelper.addBirthday.bind(state)();
      expect(state.attributes.currentlyAdding).toBe(undefined);
      expect(state.attributes.birthdays.Sadie).toBe('2007-05-26');
    });
  });
});
