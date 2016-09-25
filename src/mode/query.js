const moment = require('moment');
const nameHelper = require('../helper/name');
const birthdayHelper = require('../helper/birthday');

const queryInstructionsMessage =
  'You can ask another question, say enter to add more birthdays or quit to exit.';

const genericHelpForMode = 'Ask another question or say quit';
const nameNotFoundMessage = name => `I can\'t find ${name}.`;
const nameNotFoundRepeat = 'Try saying again if I got the name wrong, Or say enter to enter a name';

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
    // figure out what is going on here.  need to configure eslint properly for this
    // version of node
    // eslint-disable-next-line
    var name = this.event.request.intent.slots.EnteredName.value;
    if (name.endsWith("'s")) {
      name = name.slice(0, name.length - 2);
    }

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
  WhoseCalendarIntent() {
    this.emit(':ask', `This is ${this.attributes.owner.name}'s Calendar`, 'Ask another question, say enter to add more birthdays or quit to exit.');
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
