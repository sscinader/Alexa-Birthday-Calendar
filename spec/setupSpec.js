const setupMode = require('../src/mode/setup');

describe('setupMode', () => {
  it('should respond to a no intent when we know birthday', () => {
    const state = global.state;
    state.attributes.currentlyAdding = {
      birthdate: '1968-12-30',
    };

    const noIntent = setupMode.handlers['AMAZON.NoIntent'].bind(state);
    noIntent();
    expect(state.attributes.currentlyAdding.birthdate).toBe(undefined);
    expect(state.emit).toHaveBeenCalledWith(
      ':ask',
      `Ok, ${state.attributes.owner}, what is your birthday?`,
      'Please say your birthday, or exit to quit');
  });

  it('should respond to a no intent when we don\'t know birthday', () => {
    const state = global.state;
    state.attributes.currentlyAdding = {
      name: 'Sadie',
    };

    const noIntent = setupMode.handlers['AMAZON.NoIntent'].bind(state);
    noIntent();
    expect(state.attributes.currentlyAdding).toBe(undefined);
    expect(state.emit).toHaveBeenCalledWith(':ask', 'Ok, please say your name again.', 'Please say your name, or exit to quit');
  });

  it('should respond to a yes intent when we don\'t know birthday', () => {
    const state = global.state;
    state.attributes.currentlyAdding = {
      // birthdate: '1972-3-22',
      name: 'Heidi',
    };

    const yesIntent = setupMode.handlers['AMAZON.YesIntent'].bind(state);
    yesIntent();
    expect(state.attributes.owner).toBe('Heidi');
  });

  it('should respond to a yes intent when we know birthday', () => {
    const state = global.state;
    state.attributes.currentlyAdding = {
      birthdate: '1972-3-22',
      name: 'Heidi',
    };

    const yesIntent = setupMode.handlers['AMAZON.YesIntent'].bind(state);
    yesIntent();
    expect(state.attributes.birthdays.Heidi).toBe('1972-3-22');
  });

  it('help should say something', () => {
    const state = global.state;
    const helpIntent = setupMode.handlers['AMAZON.HelpIntent'].bind(state);
    helpIntent();
    expect(state.emit).toHaveBeenCalledWith(':ask', 'You can say restart or stop', 'Say restart to start over or stop to quit.');
  });
});
