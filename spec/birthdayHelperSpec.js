const birthdayHelper = require('../src/helper/birthday');
const testHelper = require('./testHelper');

describe('Calendar Skills', () => {
  describe('Working with birthdays', () => {
    it('should list oldest to youngest', () => {
      const sorted = birthdayHelper.youngestToOldest.bind(testHelper.birthdayState)();
      expect(sorted[0]).toBe('aurelia');
      expect(sorted[1]).toBe('sophia');
      expect(sorted[2]).toBe('sadie');
    });

    it('should calculate how many more days', () => {
      const testToday = '2016-09-25T17:42:20Z';
      expect(birthdayHelper.howManyDays('1968-12-30T00:00:00.000Z', testToday)).toBe(94);
      expect(birthdayHelper.howManyDays('2007-05-26T00:00:00.000Z', testToday)).toBe(241);
      expect(birthdayHelper.howManyDays(testToday, testToday)).toBe(0);
    });
  });
});
