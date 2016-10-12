const logger = require('config').logger;

/**
 * Get a random name from our list of birthdays.  Handle corner cases.
 */
const randomName = function randomName() {
  if (!this.attributes.birthdays) {
    return 'Sophia';
  }

  const names = Object.keys(this.attributes.birthdays);
  if (names.length === 1) {
    return names[0];
  }

  // randomly select a name.
  const randInt = Math.floor(Math.random() * names.length);
  return names[randInt];
};

/**
 * If an array has more than one name
 * add an 'and'. So ['sadie', 'sophia', 'aurelia']
 * will become the string 'sadie, sophia, and aurelia'.
 */
const makeStringFromArray = function makeStringFromArray(array) {
  if (array.length < 2) {
    return array.join('');
  }

  if (array.length === 2) {
    return array.join(' and ');
  }

  const lastNameInList = array.pop();
  return `${array.join(', ')}, and ${lastNameInList}`;
};

const dePossessiveName = function dePossessiveName(name) {
  if (typeof name !== 'string') {
    // not sure why this would happen
    logger.error(`dePossessiveName called with non string: ${typeof name})`);
    this.emitWithState('Unhandled');
    return name;
  }

  if (name.endsWith("'s")) {
    return name.slice(0, name.length - 2);
  }

  return name;
};

module.exports = {
  dePossessiveName,
  randomName,
  makeStringFromArray,
};
