const globalMode = require('./global');
const birthdayHelper = require('../helper/birthday');

const handlers = {
  // TODO: add delete entry....
  AddNameIntent: globalMode.enterNameIntent,
  AddBirthdateIntent: globalMode.enterBirthdateIntent,
  'AMAZON.NoIntent': function () {
    if (!this.attributes.currentlyAdding) {
      // TODO: this shouldn't happen and is an error.
      // what to do with an error?
      // should ask to enter owner name....
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
      // TODO: this shouldn't happen and is an error.
      // what to do with an error?
      // should ask to enter owner name....
    }

    const name = this.attributes.currentlyAdding.name;
    if (!this.attributes.currentlyAdding.birthdate) {
      // ok, we have the name right!  Add it to the attributes
      this.emit(
        ':ask',
        `Ok, What is ${name}'s birthday?`,
        `Say ${name}'s birthday including year`
      );
    } else {
      birthdayHelper.addBirthday.bind(this)();
      this.emit(
        ':ask',
        `Ok, I have added ${name}'s birthday.  ` +
        'you can say another name to add another birthday or you can say \'ask\' to ask the birthday questions?',
        'Say ask to task birthday questions, or say a name to add more names to the calendar.');
    }
  },
};

module.exports = { handlers };
