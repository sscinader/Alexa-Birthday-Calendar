const queryMode = require('../src/mode/query');
const testHelper = require('./testHelper');
const moment = require('../src/node_modules/config').moment;

describe('QueryMode', () => {
  beforeEach(() => {
    const state = global.state;
    state.attributes.birthdays = testHelper.birthdayState.attributes.birthdays;
  });

  it('HowOldAmI will fake a slot', () => {
    const state = global.state;
    const howOldAmIIntent = queryMode.handlers.HowOldAmIIntent.bind(state);
    howOldAmIIntent();
    expect(state.event.request.intent.slots.EnteredName.value).toBe('I');
  });

  it('HowOldIntent with no name will say error', () => {
    const state = global.state;
    const howOldIntent = queryMode.handlers.HowOldIntent.bind(state);
    howOldIntent();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'Hm, I seem to have misplaced that name.  Can you say it again?',
      'please say the name you are trying to enter.');
  });

  it('HowOldIntent with a name we don\'t know will say error', () => {
    const state = global.state;
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'Cory',
      },
    };

    const howOldIntent = queryMode.handlers.HowOldIntent.bind(state);
    howOldIntent();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'I can\'t find Cory.', 'Try saying again if I got the name wrong, Or say enter to enter a name');
  });

  it('HowOldIntent will say something', () => {
    const state = global.state;
    // let's make sophia six years old no matter what
    state.attributes.birthdays.sophia = moment().subtract(6, 'years');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'sophia',
      },
    };

    const howOldIntent = queryMode.handlers.HowOldIntent.bind(state);
    howOldIntent();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'sophia is 6 years old. Ask another question.', 'You can ask another question, say enter to add more birthdays or quit to exit.');
  });

  it('HowOldIntent with possessive input will work', () => {
    const state = global.state;
    // let's make sophia six years old no matter what
    state.attributes.birthdays.sophia = moment().subtract(6, 'years');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'sophia\'s',
      },
    };

    const howOldIntent = queryMode.handlers.HowOldIntent.bind(state);
    howOldIntent();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'sophia is 6 years old. Ask another question.', 'You can ask another question, say enter to add more birthdays or quit to exit.');
  });

  it('should list birthdays', () => {
    const state = global.state;
    const listBirthdays = queryMode.handlers.ListBirthdaysIntent.bind(state);
    listBirthdays();
    expect(state.emit).toHaveBeenCalledWith(
      ':ask',
      'I have birthdays for aurelia, sophia, and sadie. What would you like to know next?',
      'You can ask another question, say enter to add more birthdays or quit to exit.');
  });

  it('should tell how many days till birthday', () => {
    const state = global.state;
    // let's make sophia six years old no matter what
    state.attributes.birthdays.sophia = moment()
      .subtract(6, 'years')
      .format('YYYY-MM-DD');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'sophia',
      },
    };

    const howManyDays = queryMode.handlers.HowManyDaysTillIntent.bind(state);
    howManyDays();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'Today is sophia\'s birthday!  Happy Birthday!', 'Ask another question or say quit');
  });

  it('should tell how many days till my birthday', () => {
    const state = global.state;
    // let's make Sadie nine years old and one month no matter what
    state.attributes.birthdays.Sadie = moment()
      .subtract(9, 'years')
      .add(2, 'days')
      .format('YYYY-MM-DD');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'my',
      },
    };

    const howManyDays = queryMode.handlers.HowManyDaysTillIntent.bind(state);
    howManyDays();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'Sadie\'s birthday is in 2 days', 'Ask another question or say quit');
  });

  it('should tell me my birthday is in one day', () => {
    const state = global.state;
    // let's make Sadie nine years old and one month no matter what
    state.attributes.birthdays.Sadie = moment()
      .subtract(9, 'years')
      .add(1, 'days')
      .format('YYYY-MM-DD');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'my',
      },
    };

    const howManyDays = queryMode.handlers.HowManyDaysTillIntent.bind(state);
    howManyDays();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'Sadie\'s birthday is in 1 day', 'Ask another question or say quit');
  });

  it('should tell when a birthday is', () => {
    const state = global.state;
    // let's make sophia six years old no matter what
    state.attributes.birthdays.sophia = moment().subtract(6, 'years');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'sophia',
      },
    };

    const whenIsBirthday = queryMode.handlers.WhenIsBirthdayIntent.bind(state);
    whenIsBirthday();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'Today is sophia\'s birthday!  Happy Birthday!', 'Ask another question or say quit');
  });

  it('should tell whose calendar this is', () => {
    const state = global.state;
    const whoseCalendarIntent = queryMode.handlers.WhoseCalendarIntent.bind(state);
    whoseCalendarIntent();
    expect(state.emit).toHaveBeenCalledWith(':ask', 'This is Sadie\'s Calendar', 'Ask another question, say enter to add more birthdays or quit to exit.');
  });

  it('unhandled should say something', () => {
    const state = global.state;
    const unhandled = queryMode.handlers.Unhandled.bind(state);
    unhandled();
    expect(state.emit).toHaveBeenCalledWith(':ask', 'I\'m sorry, but I\'m not sure what you asked me.  You can ask another question, say enter to add more birthdays or quit to exit.', 'You can ask another question, say enter to add more birthdays or quit to exit.');
  });

  it('days to christmas should say something', () => {
    const state = global.state;
    const dayToChristmas = queryMode.handlers.DaysToChristmasIntent.bind(state);
    dayToChristmas();
    expect(state.emit).toHaveBeenCalled();
  });

  it('should say next birthday when only one birthday today', () => {
    const today = moment();
    const tomorrow = moment().add(1, 'days');
    const dayAfterTomorrow = moment().add(2, 'days');

    const state = global.state;
    const birthdays = {
      third: dayAfterTomorrow.format('YYYY-MM-DD'),
      first: today.format('YYYY-MM-DD'),
      second: tomorrow.format('YYYY-MM-DD'),
    };
    state.attributes.birthdays = birthdays;
    const sortedBirthdays = queryMode.handlers.NextBirthdayIntent.bind(state);
    sortedBirthdays();
    expect(state.emit).toHaveBeenCalledWith(
      ':ask',
      'Today is first\'s birthday',
      'you can ask another question, add a new name or quit');
  });

  it('should say next birthday when more than one birthday today', () => {
    const today = moment();
    const alsoToday = moment();
    const dayAfterTomorrow = moment().add(2, 'days');

    const state = global.state;
    const birthdays = {
      third: dayAfterTomorrow.format('YYYY-MM-DD'),
      first: today.format('YYYY-MM-DD'),
      alsoFirst: alsoToday.format('YYYY-MM-DD'),
    };
    state.attributes.birthdays = birthdays;
    const sortedBirthdays = queryMode.handlers.NextBirthdayIntent.bind(state);
    sortedBirthdays();

    expect(state.emit).toHaveBeenCalledWith(
      ':ask',
      'Today is first and alsoFirst\'s birthday',
      'you can ask another question, add a new name or quit');
  });

  it('should say next birthday when more than one birthday', () => {
    const today = moment().add(1, 'days');
    const alsoToday = moment().add(1, 'days');
    const dayAfterTomorrow = moment().add(2, 'days');

    const state = global.state;
    const birthdays = {
      third: dayAfterTomorrow.format('YYYY-MM-DD'),
      first: today.format('YYYY-MM-DD'),
      alsoFirst: alsoToday.format('YYYY-MM-DD'),
    };
    state.attributes.birthdays = birthdays;
    const sortedBirthdays = queryMode.handlers.NextBirthdayIntent.bind(state);
    sortedBirthdays();

    expect(state.emit).toHaveBeenCalledWith(
      ':ask',
      'first and alsoFirst have the next birthdays in 1 day',
      'you can ask another question, add a new name or quit');
  });

  it('should say next birthday when more than one days in future', () => {
    const first = moment().add(2, 'days').format('YYYY-MM-DD');
    const second = moment().add(3, 'days').format('YYYY-MM-DD');
    const third = moment().add(4, 'days').format('YYYY-MM-DD');

    const state = global.state;
    const birthdays = {
      third,
      first,
      second,
    };
    state.attributes.birthdays = birthdays;
    const sortedBirthdays = queryMode.handlers.NextBirthdayIntent.bind(state);
    sortedBirthdays();

    expect(state.emit).toHaveBeenCalledWith(
      ':ask',
      'first has the next birthday in 2 days',
      'you can ask another question, add a new name or quit');
  });
});
