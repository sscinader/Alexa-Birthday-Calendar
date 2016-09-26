const moment = require('moment');
const nameHelper = require('../helper/name');
const birthdayHelper = require('../helper/birthday');

const queryInstructionsMessage =
  'You can ask another question, say enter to add more birthdays or quit to exit.';

const genericHelpForMode = 'Ask another question or say quit';
const nameNotFoundMessage = name => `I can\'t find ${name}.`;
const nameNotFoundRepeat = 'Try saying again if I got the name wrong, Or say enter to enter a name';

const dePosessiveName = function dePosessiveName(name) {
  if (name.endsWith("'s")) {
    return name.slice(0, name.length - 2);
  }

  return name;
};

const handlers = {
  HowOldIntent() {
    const name = this.event.request.intent.slots.EnteredName.value;
    if (!this.attributes.birthdays[name]) {
      this.emit(':ask', nameNotFoundMessage(name), nameNotFoundRepeat);
    }
    const birthday = this.attributes.birthdays[name];

    // add fractions....
    const age = moment().diff(moment(birthday), 'years');
    if (age < 13) {
      // get days till birthday
    }
    this.emit(':ask', `${name} is ${age} years old. Ask another question.`,
      queryInstructionsMessage);
  },
  ListBirthdaysIntent() {
    const names = birthdayHelper.youngestToOldest.bind(this)();
    const namesString = nameHelper.makeStringFromArray(names);
    this.emit(':ask', `I have birthdays for ${namesString}. What would you like to know next?`,
      queryInstructionsMessage
    );
  },
  HowManyDaysTillIntent() {
    const name = dePosessiveName(this.event.request.intent.slots.EnteredName.value);

    if (!this.attributes.birthdays[name]) {
      this.emit(':ask', nameNotFoundMessage(name), nameNotFoundRepeat);
    }
    const birthday = this.attributes.birthdays[name];
    const days = birthdayHelper.howManyDays(birthday);
    if (days === 0) {
      this.emit(':ask', `Today is ${name}'s birthday!  Happy Birthday!`, genericHelpForMode);
    }
    this.emit(':ask', `${name}'s birthday is in ${days} days`, genericHelpForMode);
  },
  WhenIsBirthdayIntent() {
    const name = dePosessiveName(this.event.request.intent.slots.EnteredName.value);

    if (!this.attributes.birthdays[name]) {
      this.emit(':ask', nameNotFoundMessage(name), nameNotFoundRepeat);
    }
    const birthday = this.attributes.birthdays[name];
    const days = birthdayHelper.howManyDays(birthday);
    if (days === 0) {
      this.emit(':ask', `Today is ${name}'s birthday!  Happy Birthday!`, genericHelpForMode);
    }

    return this.emit(':ask',
      `${name}'s birthday is on <say-as interpret-as="date" format="md">${moment(birthday).format('MM/DD')}</say-as>`,
      genericHelpForMode);
  },
  WhoseCalendarIntent() {
    this.emit(':ask', `This is ${this.attributes.owner}'s Calendar`, 'Ask another question, say enter to add more birthdays or quit to exit.');
  },
  DaysToChristmasIntent() {
    const daysToChristmas = birthdayHelper.howManyDays('12-25-00');
    this.emit(':ask', `There are ${daysToChristmas} day to Christmas`, genericHelpForMode);
  },
  Unhandled() {
    this.emit(':ask',
      `I\'m sorry, but I\'m not sure what you asked me.  ${queryInstructionsMessage}`,
      queryInstructionsMessage);
  },
};

module.exports = {
  handlers,
};
