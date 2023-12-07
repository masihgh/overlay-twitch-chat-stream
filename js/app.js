const server = "irc-ws.chat.twitch.tv";
const port = 443; // Use secure WebSocket port for wss
const nickname = "m4sihpc";
const token = "oauth:#";
const channel = "#m4sihpc";

const twitchChannel = channel.substring(1); // Remove '#' from the channel name
const chatDisplay = document.getElementById('chat');

// Create a WebSocket connection to Twitch's chat server
const socket = new WebSocket(`wss://${server}:${port}/`);
socket.addEventListener('open', () => {
  socket.send(`PASS ${token}`);
  socket.send(`NICK ${nickname}`);
  socket.send(`JOIN ${channel}`);
});

// Listen for incoming messages from the chat socket
socket.addEventListener('message', (event) => {
  const message = event.data;
  if (message.startsWith('PING')) {
    socket.send('PONG :tmi.twitch.tv');
  } else {
    const parsedMessage = parseTwitchMessage(message);
    if (parsedMessage) {
      displayMessage(parsedMessage);
    }
  }
});

// Function to parse Twitch chat messages
function parseTwitchMessage(rawMessage) {
  // Implement your parsing logic here based on Twitch's IRC format
  // For example, extract sender's username and message content
  const messageParts = rawMessage.split(":");

  if (messageParts.length > 2 && messageParts[1].includes('PRIVMSG')) {
    const username = messageParts[1].split("!")[0].substring(1);
    const content = messageParts.slice(2).join(":");
    return { username, content };
  }

  return null; // Return null if message format doesn't match
}

// Function to display messages in the chat interface
function displayMessage(message) {
  const { username, content } = message;
  const chatMessage = document.createElement('div');
  chatMessage.innerHTML = `<strong>${username}:</strong> ${content}`;
  chatDisplay.appendChild(chatMessage);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}
