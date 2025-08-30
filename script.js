const chatBox = document.getElementById("chat-box");
const micBtn = document.getElementById("mic-btn");

const speak = (text) => {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en-US";
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
};

// Speak first when page loads
window.onload = () => {
    speak("Hello! I'm your smart assistant. What do you want me to do?");
};

// Start voice recognition
micBtn.addEventListener("click", () => {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = async (event) => {
        const userText = event.results[0][0].transcript;

        // Show user message in chat
        let userDiv = document.createElement("div");
        userDiv.classList.add("user-message");
        userDiv.textContent = userText;
        chatBox.appendChild(userDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Send to backend
        const response = await fetch("http://127.0.0.1:5000/voice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: userText })
        });

        const data = await response.json();
        const botReply = data.reply;

        // Show bot message
        let botDiv = document.createElement("div");
        botDiv.classList.add("bot-message");
        botDiv.textContent = botReply;
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Speak response
        speak(botReply);
    };
});
