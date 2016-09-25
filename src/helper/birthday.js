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

// we use from date instead of just now so we can test reliably.
const howManyDays = function howManyDays(fromString, birthdateString) {
  const fromdate = moment(fromString);
  const birthdate = moment(birthdateString);

  const birthdateToCompare = moment({
    M: birthdate.month(),
    d: birthdate.date(),
  });


  if (birthdateToCompare.isSame(fromdate, 'day')) {
    return 0;
  }

  if (birthdateToCompare.isBefore(fromdate, 'day')) {
    birthdateToCompare.add(1, 'y');
  }

  return birthdateToCompare.diff(fromdate, 'days');
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
