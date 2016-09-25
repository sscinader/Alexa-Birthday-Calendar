const moment = require('moment');

// no way to get the timezone of the user so
// everything is in utc... :(
const addBirthday = function addBirthday() {
  if (!this.attributes.birthdays) {
    this.attributes.birthdays = {};
  }
  const currentlyAdding = this.attributes.currentlyAdding;
  const name = currentlyAdding.name;
  const birthdate = currentlyAdding.birthdate;

  delete this.attributes.currentlyAdding;

  this.attributes.birthdays[name] = new Date(birthdate);
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
      -(new Date(birthdays[a]) - new Date(birthdays[b]))
    );
  return namesSorted;
};


module.exports = {
  addBirthday,
  howManyDays,
  youngestToOldest,
};
