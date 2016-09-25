const moment = require('moment');
const nameHelper = require('../helper/name');
const birthdayHelper = require('../helper/birthday');

const queryInstructionsMessage =
  'You can ask another question, say enter to add more birthdays or quit to exit.';

const handlers = {
  HowOldIntent() {
    const name = this.event.request.intent.slots.EnteredName.value;
    if (!this.attributes.birthdays[name]) {
      this.emit(':ask',
        `I can\'t find ${name}.  Say enter to enter a new name or say "how old is" again if I got it wrong`,
        'Say \'how old is\' to get someones age');
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
