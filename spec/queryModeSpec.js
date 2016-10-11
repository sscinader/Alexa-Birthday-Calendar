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
      }
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
      }
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
    state.attributes.birthdays.sophia = moment().subtract(6, 'years');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'sophia',
      }
    };

    const howManyDays = queryMode.handlers.HowManyDaysTillIntent.bind(state);
    howManyDays();

    expect(state.emit).toHaveBeenCalledWith(':ask', 'Today is sophia\'s birthday!  Happy Birthday!', 'Ask another question or say quit');
  });

  it('should tell when a birthday is', () => {
    const state = global.state;
    // let's make sophia six years old no matter what
    state.attributes.birthdays.sophia = moment().subtract(6, 'years');
    state.event.request.intent.slots = {
      EnteredName: {
        value: 'sophia',
      }
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

});
