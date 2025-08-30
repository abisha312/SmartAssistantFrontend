const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

const API_URL = "https://<your-render-backend-url>/api/ask"; // Replace with your Flask backend URL

// Add message to chat box
function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to backend
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    const data = await response.json();
    if (data.reply) {
      addMessage(data.reply, "bot");
      speakText(data.reply);
    } else {
      addMessage("Error: Could not get a response.", "bot");
    }
  } catch (error) {
    addMessage("Error: " + error.message, "bot");
  }
}

// Convert AI response to speech
function speakText(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  synth.speak(utterance);
}

// Voice input (speech-to-text)
voiceBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const voiceText = event.results[0][0].transcript;
    userInput.value = voiceText;
    sendMessage();
  };

  recognition.onerror = () => {
    addMessage("Voice recognition failed. Try again.", "bot");
  };
});

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
