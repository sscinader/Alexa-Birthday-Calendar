const config = require('config');
const _ = require('lodash');

const moment = config.moment;

const addBirthday = function addBirthday() {
  if (!this.attributes.birthdays) {
    this.attributes.birthdays = {};
  }
  const currentlyAdding = this.attributes.currentlyAdding;
  const name = currentlyAdding.name;
  const birthdate = currentlyAdding.birthdate;

  // FIXME: check if the name already exists.
  delete this.attributes.currentlyAdding;
  this.attributes.birthdays[name] = birthdate;
};

// Optional second argument to help with consistent testing
const howManyDays = function howManyDays(birthdateString, todayString) {
  // this next funky incantation will give you today at midnight -- which is what
  // you want to compare.
  const startOfToday = moment(moment().format(config.dateFormat), config.dateFormat);
  const today = todayString ? moment(todayString, config.dateFormat) : startOfToday;
  const birthdate = moment(birthdateString, config.dateFormat);


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
      -(moment(birthdays[a], config.dateFormat).toDate()
        - moment(birthdays[b], config.dateFormat).toDate())
    );
  return namesSorted;
};

const sortedBirthdays = function sortedBirthdays() {
  const birthdays = this.attributes.birthdays;
  const sorted = _.map(birthdays, (birthday, name) => [name, howManyDays(birthday)])
    .sort((a, b) => a[1] - b[1]);

  return sorted;
};

module.exports = {
  addBirthday,
  howManyDays,
  youngestToOldest,
  sortedBirthdays,
};
