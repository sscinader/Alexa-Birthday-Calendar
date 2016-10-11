const birthdayHelper = require('../helper/birthday');
const states = require('../states');
const logger = require('config').logger;

const handlers = {
  // TODO: add delete entry....
  'AMAZON.NoIntent': function () {
    if (!this.attributes.currentlyAdding) {
      // this shouldn't happen
      logger.error('in Entry No Intent without currently Adding', this);
      this.emit(':ask', 'Ok, please say the name again',
        'Please say the name, or exit to quit'
      );
      return;
    }

    if (this.attributes.currentlyAdding.birthdate) {
      // if we have a birthday in the currently adding object,
      // and we're in the no intent, then we know that the user
      // said no when we asked them to verify the birthday.
      delete this.attributes.currentlyAdding.birthdate;
      this.emit(':ask', `Ok, what is ${this.attributes.currentlyAdding.name}'s  birthday?`, `Please say ${this.attributes.currentlyAdding.name}'s birthday, or exit to quit`);
    } else {
      // if we don't have a birthday, we should have the name but
      // since we're in the no block, they said that we got it wrong.
      // so ask them to say it again.
      delete this.attributes.currentlyAdding;
      this.emit(':ask', 'Ok, please say the name again.', 'Please say the name, or exit to quit');
    }
  },
  'AMAZON.YesIntent': function () {
    if (!this.attributes.currentlyAdding) {
      logger.error('in Entry Yes Intent without currently Adding', this);
      this.emit(':ask',
        'Hm, I lost your input.  Sorry.  Please say your name and birthday again.',
        'Please say your name and birthday again'
      );
      return;
    }

    const name = this.attributes.currentlyAdding.name;
    if (!this.attributes.currentlyAdding.birthdate) {
      // ok, we have the name right!
      this.emit(
        ':ask',
        `Ok, What is ${name}'s birthday?`,
        `Say ${name}'s birthday including year`
      );
    } else {
      birthdayHelper.addBirthday.bind(this)();
      this.handler.state = states.QUERYMODE;
      this.emit(
        ':ask',
        `Ok, I have added ${name}'s birthday.  ` +
        'you can say another name to add another birthday or you can the birthday a question?',
        'You can ask a question like when is someone\'s birthday, ' +
        'or say a name to add it to the calendar.');
    }
  },
};

module.exports = { handlers };
