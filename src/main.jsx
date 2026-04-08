import "./style.css";

document.querySelector("#app").innerHTML = `
  <div class="app">
    <header class="header">
      <div class="logo">📈</div>
      <div>
        <h1>Value Analyst</h1>
        <p>Analityk zakładów sportowych</p>
      </div>
    </header>

    <main class="main">
      <div class="welcome">
        <div class="hero-icon">📈</div>
        <h2>Witaj w Value Analyst</h2>
        <p>Podaj dane meczu, a przeanalizuję kursy i znajdę value.</p>

        <div class="tips">
          <button class="tip-btn" data-text="Podaj statystyki drużyn">Podaj statystyki drużyn</button>
          <button class="tip-btn" data-text="Opisz kursy bukmachera">Opisz kursy bukmachera</button>
          <button class="tip-btn" data-text="Zapytaj 'co gramy?'">Zapytaj 'co gramy?'</button>
        </div>

        <div id="messages" class="messages"></div>
      </div>
    </main>

    <footer class="footer">
      <input id="chatInput" type="text" placeholder="Podaj dane meczu lub zapytaj 'co gramy?'..." />
      <button id="sendBtn">Wyślij</button>
    </footer>
  </div>
`;

const messages = document.getElementById("messages");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const tipButtons = document.querySelectorAll(".tip-btn");

function addMessage(role, content) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.innerHTML = `<strong>${role === "user" ? "Ty" : "AI"}:</strong> ${content}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function realReply(text) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();

    addMessage("assistant", data.reply || "Brak odpowiedzi z API.");
  } catch (error) {
    addMessage("assistant", "Błąd połączenia z API.");
  }
}

function sendMessage(text) {
  if (!text.trim()) return;
  addMessage("user", text);
  input.value = "";
  realReply(text);
}

sendBtn.addEventListener("click", () => {
  sendMessage(input.value);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage(input.value);
  }
});

tipButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sendMessage(btn.dataset.text || "");
  });
});
