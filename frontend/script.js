const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Replace with your Render backend URL
const API_URL = "https://smartassistant-6zzm.onrender.com/api/ask";

sendBtn.addEventListener("click", async () => {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    // Show user's message in the chat box
    chatBox.innerHTML += `<div class="user-msg">You: ${prompt}</div>`;
    userInput.value = "";

    try {
        // Send request to deployed backend
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();

        // Show AI's response or handle errors
        if (data.reply) {
            chatBox.innerHTML += `<div class="bot-msg">AI: ${data.reply}</div>`;
        } else {
            chatBox.innerHTML += `<div class="bot-msg error">Error: ${data.error || "Something went wrong"}</div>`;
        }

        // Auto-scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        chatBox.innerHTML += `<div class="bot-msg error">Network Error: ${err.message}</div>`;
    }
});
