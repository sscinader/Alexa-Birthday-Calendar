const birthdayHelper = require('../helper/birthday');
const states = require('../states');

// FIXME
const imageObj = {
  smallImageUrl: 'https://s3.amazonaws.com/easy-static-stuff/108_Party-Hat.png',
  largeImageUrl: 'https://s3.amazonaws.com/easy-static-stuff/512_Party-Hat.png',
};

const handlers = {
  'AMAZON.NoIntent': function () {
    if (!this.attributes.currentlyAdding) {
      // TODO: this shouldn't happen and is an error.
      // what to do with an error?
      // should ask to enter owner name....
      return;
    }

    if (this.attributes.currentlyAdding.birthdate) {
      // if we have a birthday in the currently adding object,
      // and we're in the no intent, then we know that the user
      // said no when we asked them to verify the birthday.
      delete this.attributes.currentlyAdding.birthdate;
      this.emit(':ask', `Ok, ${this.attributes.owner}, what is your birthday?`, 'Please say your birthday, or exit to quit');
    } else {
      // if we don't have a birthday, we should have the name but
      // since we're in the no block, they said that we got it wrong.
      // so ask them to say it again.
      delete this.attributes.currentlyAdding;
      this.emit(':ask', 'Ok, please say your name again.', 'Please say your name, or exit to quit');
    }
  },

  'AMAZON.YesIntent': function () {
    if (!this.attributes.currentlyAdding) {
      // TODO: this shouldn't happen and is an error.
      // what to do with an error?
      // should ask to enter owner name....
      return;
    }
    if (!this.attributes.currentlyAdding.birthdate) {
      // ok, we have the name right!  Add it to the attributes
      const name = this.attributes.currentlyAdding.name;
      // add the owner to the attributes so we'll always no whose calendar it is!
      this.attributes.owner = name;
      // I don't think this intent will actually have a card, but just adding as a sample
      this.emit(
        ':askWithCard',
        `Ok, hi ${name}.  What is your birthday?`,
        'Say your birthday including year',
        'This is the card title',
        'This is what the card says (the content)',
        imageObj);
    } else {
      birthdayHelper.addBirthday.call(this);
      this.handler.state = states.ENTRYMODE;
      this.emit(
        ':ask',
        `Ok, ${this.attributes.owner}, no let's add some birthdays!` +
          'Say a name and birthday to add names to your calendar.',
        'To add a birthday to your calendar you can say name was born on.');
    }
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', 'You can say restart or stop', 'Say restart to start over or stop to quit.');
  },
};

module.exports = {
  handlers,
};
