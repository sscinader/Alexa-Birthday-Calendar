'use strict';

const config = require('config');
const nameHelper = require('../helper/name');
const birthdayHelper = require('../helper/birthday');

const moment = config.moment;

const queryInstructionsMessage =
  'You can ask another question, say enter to add more birthdays or quit to exit.';

const genericHelpForMode = 'Ask another question or say quit';
const nameNotFoundMessage = name => `I can\'t find ${name}.`;
const nameNotFoundRepeat = 'Try saying again if I got the name wrong, Or say enter to enter a name';

const getName = function getName() {
  if (!this.event.request.intent.slots.EnteredName ||
      !this.event.request.intent.slots.EnteredName.value) {
    this.emit(':ask', 'Hm, I seem to have misplaced that name.  Can you say it again?',
      'please say the name you are trying to enter.');
    return false;
  }

  const me = ['me', 'my', 'i'];

  const input = this.event.request.intent.slots.EnteredName.value;
  const name = me.indexOf(input.toLowerCase()) > -1
    ? this.attributes.owner : nameHelper.getName.call(this);

  return nameHelper.dePossessiveName.call(this, name);
};

const handlers = {
  HowOldAmIIntent() {
    // let's fake the input
    this.event.request.intent.slots = {
      EnteredName: {
        name: 'EnteredName',
        value: 'I',
      },
    };

    this.emitWithState('HowOldIntent');
  },
  HowOldIntent() {
    const name = getName.call(this);
    if (!this.attributes.birthdays[name]) {
      this.emit(':ask', nameNotFoundMessage(name), nameNotFoundRepeat);
      return;
    }
    const birthday = this.attributes.birthdays[name];

    // add fractions....
    const age = moment().diff(moment(birthday, config.dateFormat), 'years');
    // if (age < 13) {
    //   // get days till birthday
    // }
    this.emit(':ask', `${name} is ${age} years old. Ask another question.`,
      queryInstructionsMessage);
  },
  ListBirthdaysIntent() {
    const names = birthdayHelper.youngestToOldest.call(this);
    const namesString = nameHelper.makeStringFromArray(names);
    this.emit(':ask', `I have birthdays for ${namesString}. What would you like to know next?`,
      queryInstructionsMessage
    );
  },
  HowManyDaysTillIntent() {
    const name = getName.call(this);

    if (!this.attributes.birthdays[name]) {
      this.emit(':ask', nameNotFoundMessage(name), nameNotFoundRepeat);
    }
    const birthday = this.attributes.birthdays[name];
    const days = birthdayHelper.howManyDays(birthday);
    if (days === 0) {
      this.emit(':ask', `Today is ${name}'s birthday!  Happy Birthday!`, genericHelpForMode);
    }
    const pluralDay = days > 1 ? 's' : '';
    this.emit(':ask', `${name}'s birthday is in ${days} day${pluralDay}`, genericHelpForMode);
  },
  WhenIsBirthdayIntent() {
    const name = getName.call(this);

    if (!this.attributes.birthdays[name]) {
      this.emit(':ask', nameNotFoundMessage(name), nameNotFoundRepeat);
    }
    const birthday = this.attributes.birthdays[name];
    const days = birthdayHelper.howManyDays(birthday);
    if (days === 0) {
      this.emit(':ask', `Today is ${name}'s birthday!  Happy Birthday!`, genericHelpForMode);
    }

    return this.emit(':ask',
      `${name}'s birthday is on <say-as interpret-as="date" format="md">${moment(birthday, config.dateFormat).format('MM/DD')}</say-as>`,
      genericHelpForMode);
  },
  NextBirthdayIntent() {
    // there should always be at least one birthday to get here.
    // an array with name in 0 and days to birthday in 1
    const sortedBirthdays = birthdayHelper.sortedBirthdays.call(this);
    const firstBirthdays = [];
    let minDays;
    for (let i = 0; i < sortedBirthdays.length; i += 1) {
      const daysToBirthday = sortedBirthdays[i][1];
      if (minDays === undefined) {
        minDays = daysToBirthday;
      } else if (minDays < daysToBirthday) {
        break;
      }

      firstBirthdays.push(sortedBirthdays[i][0]);
    }

    const firstDays = sortedBirthdays[0][1];
    const pluralNames = firstBirthdays.length > 1 ? 's' : '';
    const pluralDays = firstDays > 1 ? 's' : '';
    const pluralHave = firstBirthdays.length > 1 ? 'have' : 'has';

    const say = (firstDays === 0)
      ? `Today is ${nameHelper.makeStringFromArray(firstBirthdays)}'s birthday`
      : `${nameHelper.makeStringFromArray(firstBirthdays)} ${pluralHave} the ` +
        `next birthday${pluralNames} in ${firstDays} day${pluralDays}`;
    this.emit(':ask', say, 'you can ask another question, add a new name or quit');
  },
  WhoseCalendarIntent() {
    this.emit(':ask', `This is ${this.attributes.owner}'s Calendar`, 'Ask another question, say enter to add more birthdays or quit to exit.');
  },
  DaysToChristmasIntent() {
    const daysToChristmas = birthdayHelper.howManyDays('2000-12-25');
    this.emit(':ask', `There are ${daysToChristmas} days to Christmas`, genericHelpForMode);
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
