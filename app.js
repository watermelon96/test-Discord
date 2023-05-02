import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import localtunnel from 'localtunnel';

// Create and configure express app
const app = express();
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

app.post('/interactions', function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;
  /**
   * Handle slash command requests
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    // Slash command with name of "test"
    if (data.name === 'test_command') {
      // Send a message as response
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: 'A wild message appeared' },
      });
    }
    else if (data.name === 'test_button') {
      // Send a message with a button
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'A message with a button',
          // Buttons are inside of action rows
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  // Value for your app to identify the button
                  custom_id: 'my_button',
                  label: 'Click',
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
    else if (data.name === 'test_modal') {
      // Send a modal as response
      var _result = res.send({
        type: InteractionResponseType.MODAL,
        data: {
          custom_id: 'my_modal',
          title: 'Modal title',
          components: [
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'my_text',
                  style: 1,
                  label: 'Type some text',
                },
              ],
            },
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'my_longer_text',
                  // Bigger text box for input
                  style: 2,
                  label: 'Type some (longer) text',
                },
              ],
            },
          ],
        },
      });
      return _result
    }
    else if (data.name === 'test_select') {
      // Send a message with a button
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'A message with a button',
          // Selects are inside of action rows
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  // Value for your app to identify the select menu interactions
                  custom_id: 'my_select',
                  // Select options - see https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
                  options: [
                    {
                      label: 'Option #1',
                      value: 'option_1',
                      description: 'The very first option',
                    },
                    {
                      label: 'Second option',
                      value: 'option_2',
                      description: 'The second AND last option',
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
    }
  }

  /**
   * Handle modal submissions
   */
  if (type === InteractionType.MODAL_SUBMIT) {
    // custom_id of modal
    const modalId = data.custom_id;
    // user ID of member who filled out modal
    const userId = req.body.member.user.id;

    if (modalId === 'my_modal') {
      let modalValues = '';
      // Get value of text inputs
      for (let action of data.components) {
        let inputComponent = action.components[0];
        modalValues += `${inputComponent.custom_id}: ${inputComponent.value}\n`;
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<@${userId}> typed the following (in a modal):\n\n${modalValues}`,
        },
      });
    }
  }

  /**
   * Handle requests from interactive components
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;
    // user who clicked button
    const userId = req.body.member.user.id;

    if (componentId === 'my_button') {
      console.log(req.body);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `<@${userId} clicked the button` },
      });
    }
    else if (componentId === 'my_select') {
      console.log(req.body);

      // Get selected option from payload
      const selectedOption = data.values[0];
      const userId = req.body.member.user.id;

      // Send results
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `<@${userId}> selected ${selectedOption}` },
      });
    }
  }

});


app.listen(PORT, async () => {
  console.log('Listening on port', PORT);
  const subdomain = "m4ore-dc-bot"
  const tunnel = await localtunnel({ host: "https://tunnel.m4ore.com", port: PORT, subdomain: subdomain });
  console.log("Tunnel: ", `https://${subdomain}.m4ore.com/`);
  tunnel.on('close', () => {
  });
});
