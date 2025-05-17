// Toggle chatbot visibility
function toggleChatbot() {
    const chatbot = document.getElementById("chatbot-container");
    chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
}

// Close chatbot
document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("chatbot-container").style.display = "none";
});

let chatHistory = [
  {
    role: "system",
    content:
      "You are SmartSave AI, a helpful assistant giving money-saving advice to students. Respond in complete, numbered tips."
  }
];

// Handle message sending
function sendMessage() {
  const userInput = document.getElementById("user-input");
  const messageText = userInput.value.trim();
  if (!messageText) return;

  displayMessage(messageText, "user");
  userInput.value = "";

  // Add user's message to chat history
  chatHistory.push({ role: "user", content: messageText });

  displayTypingIndicator();

  fetch("https://smartsave-ai.onrender.com/api/chatbot", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: chatHistory })
})

    .then((res) => res.json())
    .then((data) => {
      removeTypingIndicator();
      displayMessage(data.reply, "bot");
      // Save bot response to chat history
      chatHistory.push({ role: "assistant", content: data.reply });
    })
    .catch((err) => {
      removeTypingIndicator();
      console.error("Error:", err);
      displayMessage("Oops! Something went wrong.", "bot");
    });
}

function continueChat() {
  const userFollowUp = "Please continue your previous answer.";
  displayMessage(userFollowUp, "user");

  chatHistory.push({ role: "user", content: userFollowUp });
  displayTypingIndicator();

  fetch("https://smartsave-ai.onrender.com/api/chatbot", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: chatHistory })
})

    .then((res) => res.json())
    .then((data) => {
      removeTypingIndicator();
      displayMessage(data.reply, "bot");
      chatHistory.push({ role: "assistant", content: data.reply });
    })
    .catch((err) => {
      removeTypingIndicator();
      console.error("Error:", err);
      displayMessage("Oops! Something went wrong.", "bot");
    });
}


// Display messages in chat
function displayMessage(message, sender) {
    const messagesContainer = document.getElementById("chatbot-messages");

    // Remove typing indicator if bot is responding
    if (sender === "bot") removeTypingIndicator();

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    const img = document.createElement("img");
    img.src = sender === "user" ? "./human logo.png" : "./chatbot logo.png"; 
    img.alt = sender === "user" ? "User" : "Bot"; // Set alt text to avoid broken images
    img.classList.add("avatar");
    
    // Text bubble
    const textDiv = document.createElement("div");
    textDiv.classList.add("bubble");
    textDiv.innerHTML = message.replace(/<br>/g, "\n");

    // Append elements in correct order
    if (sender === "user") {
        msgDiv.appendChild(textDiv);
        msgDiv.appendChild(img);  // User's avatar on right
    } else {
        msgDiv.appendChild(img);  // Bot's avatar on left
        msgDiv.appendChild(textDiv);
    }

    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Display animated typing indicator
function displayTypingIndicator() {
    const messagesContainer = document.getElementById("chatbot-messages");

    // Avoid duplicate indicators
    if (document.getElementById("typing-indicator")) return;

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message", "typing-indicator");
    typingDiv.id = "typing-indicator";
    
    typingDiv.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingMsg = document.getElementById("typing-indicator");
    if (typingMsg) typingMsg.remove();
}


// Handle Enter key in input
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}
