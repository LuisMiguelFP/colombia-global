// ─── MODELO ───────────────────────────────────────────────────────────────
const AssistantModel = {
  chatHistory: [],
  isListening: false,
  recognition: null,
  maxHistory: 10,

  addToHistory(role, content) {
    this.chatHistory.push({ role, content: String(content) });
    if (this.chatHistory.length > this.maxHistory) {
      this.chatHistory = this.chatHistory.slice(-this.maxHistory);
    }
  },

  clearHistory() {
    this.chatHistory = [];
  }
};

// ─── VISTA ────────────────────────────────────────────────────────────────
const AssistantView = {
  getTime() {
    return new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  },

  addMessage(role, text) {
    const win = document.getElementById("chatWindow");
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <div class="msg-time">${this.getTime()}</div>
    `;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
  },

  showTyping() {
    const win = document.getElementById("chatWindow");
    const div = document.createElement("div");
    div.id = "typingIndicator";
    div.className = "msg assistant";
    div.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>`;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
  },

  removeTyping() {
    const el = document.getElementById("typingIndicator");
    if (el) el.remove();
  },

  setVoiceListening(active) {
    const btn = document.getElementById("voiceBtn");
    const stopBtn = document.getElementById("stopVoiceBtn");
    const status = document.getElementById("voiceStatus");
    const content = document.getElementById("voiceBtnContent");
    if (active) {
      btn.classList.add("listening");
      btn.style.display = "none";
      stopBtn.style.display = "block";
      status.textContent = "Escuchando...";
      content.innerHTML = `
        <div class="voice-waveform">
          <div class="wave-bar"></div><div class="wave-bar"></div>
          <div class="wave-bar"></div><div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>
        Escuchando...`;
    } else {
      btn.classList.remove("listening");
      btn.style.display = "block";
      stopBtn.style.display = "none";
      status.textContent = "Listo";
      content.textContent = "🎙 Hablar con el asistente";
    }
  },

  setSendDisabled(disabled) {
    document.getElementById("sendBtn").disabled = disabled;
  }
};

// ─── CONTROLADOR ──────────────────────────────────────────────────────────
const AssistantController = {
  init() {
    document.getElementById("chatInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
    document.getElementById("modelBadge").textContent = `Modelo: ${CONFIG.MODEL}`;
  },

  speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, "").substring(0, 300);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = "es-CO";
    utt.rate = 0.75;
    utt.pitch = 1;
    const voices = speechSynthesis.getVoices();
    const spanish = voices.find(v => v.lang.startsWith("es"));
    if (spanish) utt.voice = spanish;
    speechSynthesis.speak(utt);
  },

  toggleVoice() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      AssistantView.addMessage("assistant", "⚠ Tu navegador no soporta voz. Usa Chrome.");
      return;
    }
    AssistantModel.isListening ? this.stopListening() : this.startListening();
  },

  startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      AssistantView.addMessage("assistant", "⚠ Tu navegador no soporta voz. Usa Chrome.");
      return;
    }

    AssistantModel.recognition = new SR();
    AssistantModel.recognition.lang = "es-CO";
    AssistantModel.recognition.continuous = true;
    AssistantModel.recognition.interimResults = true;

    let finalTranscript = '';

    AssistantModel.recognition.onstart = () => {
      AssistantModel.isListening = true;
      AssistantView.setVoiceListening(true);
    };

    AssistantModel.recognition.onresult = (e) => {
      let interimTranscript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      document.getElementById("chatInput").value = finalTranscript + interimTranscript;
    };

    AssistantModel.recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      if (e.error !== "no-speech" && e.error !== "audio-capture" && e.error !== "network") {
        this.stopListening();
        AssistantView.addMessage("assistant", "⚠ Error al escuchar: " + e.error);
      }
    };

    AssistantModel.recognition.onend = () => {
      if (AssistantModel.isListening) {
        const input = document.getElementById("chatInput");
        if (input.value.trim()) {
          this.sendMessage();
        }
        this.stopListening();
      }
    };

    try {
      AssistantModel.recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      AssistantView.addMessage("assistant", "⚠ Error al iniciar reconocimiento de voz.");
    }
  },

  stopListening() {
    AssistantModel.isListening = false;
    if (AssistantModel.recognition) {
      AssistantModel.recognition.stop();
      AssistantModel.recognition = null;
    }
    AssistantView.setVoiceListening(false);
  },

  async sendMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    AssistantView.addMessage("user", text);
    AssistantView.setSendDisabled(true);
    AssistantModel.addToHistory("user", text);
    AssistantView.showTyping();

    try {
      const messages = [
        {
          role: "system",
          content: "Eres un asistente especializado en noticias mundiales y su impacto en Colombia. Responde siempre en español colombiano, de forma clara y directa. Máximo 3-4 oraciones."
        },
        ...AssistantModel.chatHistory.slice(-6)
      ];

      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: CONFIG.MODEL,
          messages: messages,
          temperature: 0.7,
          max_tokens: 300
        })
      });

      const data = await res.json();
      AssistantView.removeTyping();

      if (data.error) {
        console.error("Groq API Error:", data.error);
        AssistantModel.clearHistory();
        AssistantView.addMessage("assistant", "⚠ Error: " + (data.error.message || "API key inválida o modelo no soportado"));
        return;
      }

      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        AssistantModel.addToHistory("assistant", reply);
        AssistantView.addMessage("assistant", reply);
        this.speak(reply);
      } else {
        AssistantView.addMessage("assistant", "⚠ Sin respuesta del modelo.");
      }
    } catch (err) {
      AssistantView.removeTyping();
      AssistantView.addMessage("assistant", "⚠ Error: verifica tu conexión o API key de Groq.");
    }

    AssistantView.setSendDisabled(false);
  },

  askQuick(question) {
    document.getElementById("chatInput").value = question;
    this.sendMessage();
  }
};