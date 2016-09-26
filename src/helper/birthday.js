const moment = require('moment-timezone');

moment.tz.setDefault('US/Pacific');

// no way to get the timezone of the user so
// Going to (try) to nail all to Pacific Time.
// If it has to just be one timezone, may as well
// use ours!
const addBirthday = function addBirthday() {
  if (!this.attributes.birthdays) {
    this.attributes.birthdays = {};
  }
  const currentlyAdding = this.attributes.currentlyAdding;
  const name = currentlyAdding.name;
  const birthdate = currentlyAdding.birthdate;

  delete this.attributes.currentlyAdding;

  this.attributes.birthdays[name] = moment(birthdate, 'YYYY-MM-DD').toDate();
};

// Optional second argument
const howManyDays = function howManyDays(birthdateString, todayString) {
  const today = todayString ? moment(todayString) : moment();
  const birthdate = moment(birthdateString);

  const birthdateToCompare = moment({
    M: birthdate.month(),
    d: birthdate.date(),
  });

  if (birthdateToCompare.isSame(today, 'day')) {
    return 0;
  }

  if (birthdateToCompare.isBefore(today, 'day')) {
    birthdateToCompare.add(1, 'y');
  }

  return birthdateToCompare.diff(today, 'days');
};

const youngestToOldest = function youngestToOldest() {
  const birthdays = this.attributes.birthdays;
  const namesSorted = Object.keys(birthdays)
    .sort((a, b) =>
      -(moment(birthdays[a]).toDate() - moment(birthdays[b]).toDate())
    );
  return namesSorted;
};


module.exports = {
  addBirthday,
  howManyDays,
  youngestToOldest,
};
