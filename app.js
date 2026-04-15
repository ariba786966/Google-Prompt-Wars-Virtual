document.addEventListener("DOMContentLoaded", () => {
    // --- State & Initializations ---
    const body = document.body;
    const STORAGE_PREFIX = "calmConnect_";
    
    // Load Preferences
    let isDark = localStorage.getItem(STORAGE_PREFIX + "theme") === "dark";
    let isLefty = localStorage.getItem(STORAGE_PREFIX + "lefty") === "true";
    
    const fontSizes = ["font-small", "font-medium", "font-large"];
    let currentFontIdx = parseInt(localStorage.getItem(STORAGE_PREFIX + "fontIdx") || "1");

    function applyTheme() {
        body.classList.remove("theme-light", "theme-dark");
        body.classList.add(isDark ? "theme-dark" : "theme-light");
    }
    
    function applyLefty() {
        body.classList.toggle("layout-left", isLefty);
        body.classList.toggle("layout-right", !isLefty);
    }
    
    function applyFont() {
        body.classList.remove(...fontSizes);
        body.classList.add(fontSizes[currentFontIdx]);
    }

    applyTheme();
    applyLefty();
    applyFont();

    // Generate Stars for Dark Mode (Static DOM nodes, opacity controlled by CSS)
    const starsContainer = document.getElementById("stars-container");
    for(let i=0; i<50; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.width = Math.random() * 3 + "px";
        star.style.height = star.style.width;
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 2 + "s";
        starsContainer.appendChild(star);
    }

    // --- Positive Loader ---
    const thoughts = [
        "Every day is a fresh start.",
        "Your potential is endless.",
        "You are doing great.",
        "Take a deep breath and smile.",
        "Peace begins with a smile."
    ];
    document.getElementById("loader-quote").innerText = thoughts[Math.floor(Math.random() * thoughts.length)];
    
    setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 2500);

    // --- Header Controls ---
    document.getElementById("btn-theme").addEventListener("click", () => {
        isDark = !isDark;
        localStorage.setItem(STORAGE_PREFIX + "theme", isDark ? "dark" : "light");
        applyTheme();
    });

    document.getElementById("btn-lefty").addEventListener("click", () => {
        isLefty = !isLefty;
        localStorage.setItem(STORAGE_PREFIX + "lefty", isLefty);
        applyLefty();
    });

    document.getElementById("btn-font").addEventListener("click", () => {
        currentFontIdx = (currentFontIdx + 1) % fontSizes.length;
        localStorage.setItem(STORAGE_PREFIX + "fontIdx", currentFontIdx);
        applyFont();
    });

    // --- Navigation ---
    const navBtns = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll("main section");
    
    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update Active Nav
            navBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // Switch Sections
            sections.forEach(sec => sec.classList.remove("active-section"));
            document.getElementById(btn.dataset.target).classList.add("active-section");
        });
    });

    // --- ASL Keyboard & Input ---
    const alphaContainer = document.getElementById("alpha-keys-container");
    const inputTextEl = document.getElementById("input-text");
    const placeholderEl = document.querySelector(".placeholder");
    let currentInput = "";
    
    // Abstract hand emojis as visual signs substitution
    const defaultSigns = ["✋", "✌️", "✊", "👍", "👎", "👆", "👇"];

    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const btn = document.createElement("button");
        btn.className = "key alpha-key";
        const sign = defaultSigns[i % defaultSigns.length]; // cyclical placeholder assignment
        btn.innerHTML = `<span class="asl-symbol">${sign}</span><span>${char}</span>`;
        btn.addEventListener("click", () => updateInput(currentInput + char));
        alphaContainer.appendChild(btn);
    }
    
    document.getElementById("key-space").addEventListener("click", () => updateInput(currentInput + " "));
    document.getElementById("key-backspace").addEventListener("click", () => updateInput(currentInput.slice(0, -1)));
    document.getElementById("btn-clear").addEventListener("click", () => updateInput(""));
    
    const emKeys = document.querySelectorAll(".em-key");
    emKeys.forEach(key => {
        key.addEventListener("click", () => {
            updateInput(currentInput + (currentInput ? " " : "") + key.dataset.val + " ");
        });
    });

    function updateInput(val) {
        currentInput = val;
        if (currentInput.length > 0) {
            placeholderEl.style.display = "none";
            inputTextEl.style.display = "inline";
            inputTextEl.innerText = currentInput;
        } else {
            placeholderEl.style.display = "inline";
            inputTextEl.style.display = "none";
            inputTextEl.innerText = "";
        }
    }

    // --- Chatbot Logic ---
    const chatHistoryEl = document.getElementById("chat-history");
    let chats = JSON.parse(localStorage.getItem(STORAGE_PREFIX + "chats") || "[]");
    
    function renderChats() {
        chatHistoryEl.innerHTML = "";
        chats.forEach(c => {
            const div = document.createElement("div");
            div.className = `message ${c.sender}-message`;
            div.innerText = c.text;
            chatHistoryEl.appendChild(div);
        });
        chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }
    renderChats();

    document.getElementById("btn-send").addEventListener("click", () => {
        if (!currentInput.trim()) return;
        
        // Add User Message
        chats.push({ sender: "user", text: currentInput.trim() });
        localStorage.setItem(STORAGE_PREFIX + "chats", JSON.stringify(chats));
        const userQuery = currentInput.trim().toLowerCase();
        updateInput("");
        renderChats();

        // Bot Response
        setTimeout(() => respond(userQuery), window.crypto.randomUUID ? 600 : 1000); // slight variance in "thinking" time
    });
    
    function respond(userText) {
        let response = "I'm here to help. Could you clarify?";
        if (userText.includes("[emergency]") || userText.includes("help")) {
            response = "Emergency mode triggered. Showing immediate visual assistance cues for surrounding people.";
        } else if (userText.includes("[medical]") || userText.includes("[doctor]") || userText.includes("[pain]")) {
            response = "I understand you need medical help. Please point to where it hurts or show this screen to the nearest person.";
        } else if (userText.includes("hello") || userText.includes("hi")) {
            response = "Hello! I hope you are having a calm and peaceful day.";
        } else if (userText.includes("how are you")) {
            response = "I'm doing well, thank you! Sending positive thoughts your way.";
        }
        
        chats.push({ sender: "bot", text: response });
        localStorage.setItem(STORAGE_PREFIX + "chats", JSON.stringify(chats));
        renderChats();
    }

    // --- Interpreter Camera Mock ---
    const webcam = document.getElementById("webcam");
    const btnStartCam = document.getElementById("btn-start-camera");
    const btnStopCam = document.getElementById("btn-stop-camera");
    const overlay = document.querySelector(".interpreter-overlay");
    const translationOutput = document.getElementById("translation-output");
    
    let stream = null;
    let mockInterpretInterval = null;

    btnStartCam.addEventListener("click", async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            webcam.srcObject = stream;
            webcam.style.display = "block";
            overlay.style.display = "block";
            btnStartCam.style.display = "none";
            btnStopCam.style.display = "inline-block";
            
            // Start simulated translation
            const fakePhrases = ["I need help", "Where is the hospital?", "Thank you", "I am deaf, reading signs", "Hello!"];
            translationOutput.innerText = "Scanning for signs... ✋";
            
            mockInterpretInterval = setInterval(() => {
                const phrase = fakePhrases[Math.floor(Math.random() * fakePhrases.length)];
                translationOutput.innerText = "Recognized: \n\"" + phrase + "\"";
            }, 4000);

        } catch (err) {
            alert("Camera access denied or unavailable. " + err.message);
        }
    });

    btnStopCam.addEventListener("click", () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        if (mockInterpretInterval) clearInterval(mockInterpretInterval);
        
        webcam.style.display = "none";
        overlay.style.display = "none";
        btnStartCam.style.display = "inline-block";
        btnStopCam.style.display = "none";
    });

});
