import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test_command',
  description: 'Basic command',
  type: 1,
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

var ALL_COMMANDS = [];
ALL_COMMANDS.push(TEST_COMMAND)
ALL_COMMANDS.push(CHALLENGE_COMMAND)
ALL_COMMANDS.push({
  name: 'test_modal',
  description: 'Basic Modal',
  type: 1,
})
ALL_COMMANDS.push({
  name: 'test_button',
  description: 'Basic Button',
  type: 1,
})
ALL_COMMANDS.push({
  name: 'test_select',
  description: 'Basic Select',
  type: 1,
})


InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);