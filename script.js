
const body = document.body;

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");

    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});

const aiModeButton = document.getElementById("aiModeButton");
const analogModeButton = document.getElementById("analogModeButton");
const featureAnalog = document.getElementById("featureAnalog");
const statusText = document.getElementById("statusText");
const heroModeLabel = document.getElementById("heroModeLabel");
const heroModeSub = document.getElementById("heroModeSub");
const modeFeedback = document.getElementById("modeFeedback");
const chatInput = document.getElementById("chatInput");
const chatNote = document.getElementById("chatNote");

let analogMode = false;

function setMode(useAnalog) {
  analogMode = useAnalog;
  body.classList.toggle("analog-mode", analogMode);

  aiModeButton.classList.toggle("selected", !analogMode);
  analogModeButton.classList.toggle("selected", analogMode);

  aiModeButton.querySelector("i").textContent = analogMode ? "○" : "●";
  analogModeButton.querySelector("i").textContent = analogMode ? "●" : "○";

  statusText.textContent = analogMode ? "ANALOG MODE" : "AI MODE ACTIVE";
  heroModeLabel.textContent = analogMode ? "Analog mode is on" : "AI mode is on";
  heroModeSub.textContent = analogMode
    ? "Digital visuals dimmed in this demo"
    : "Ready when you are";

  modeFeedback.textContent = analogMode
    ? "Analog Mode enabled. The website simulates a distraction-free experience."
    : "AI Mode enabled. Explore the OpenLens concept.";

  featureAnalog.textContent = analogMode ? "↻" : "↗";

  chatInput.disabled = analogMode;
  chatInput.placeholder = analogMode
    ? "Switch to AI Mode to use the demo"
    : "Ask me anything...";

  document.querySelector(".chat-form button").disabled = analogMode;

  chatNote.textContent = analogMode
    ? "Analog Mode · AI chat paused in this demo"
    : "Demo interface · Connect your AI backend for real answers";
}

aiModeButton.addEventListener("click", () => setMode(false));
analogModeButton.addEventListener("click", () => setMode(true));

featureAnalog.addEventListener("click", () => {
  setMode(!analogMode);
});

function getDemoResponse(question) {
  const q = question.toLowerCase();

  if (q.includes("study") || q.includes("learn")) {
    return "Try studying for 25 minutes, taking a 5-minute break, and finishing each session by recalling what you learned without looking at your notes.";
  }

  if (q.includes("openlens")) {
    return "OpenLens is an open-source smart glasses concept focused on AI assistance, privacy, and the freedom to switch back to an analog experience.";
  }

  if (q.includes("privacy")) {
    return "Privacy is a core design goal for OpenLens. A real implementation should clearly indicate sensor activity, minimise data collection, and give users control over AI features.";
  }

  if (q.includes("analog") || q.includes("off")) {
    return "Analog Escape is designed to let you step away from digital features. You can try the Analog Mode switch on this page.";
  }

  if (q.includes("idea") || q.includes("feature")) {
    return "The concept includes an AI assistant, contextual visual information, and an Analog Escape mode. Hardware-dependent features are still conceptual.";
  }

  return "That's an interesting question! This is currently a demo assistant. Connect your AI backend to get model-generated answers to a wider range of questions.";
}

const chatForm = document.getElementById("chatForm");
const chatBody = document.getElementById("chatBody");

function addMessage(message, type) {
  const element = document.createElement("div");
  element.className = `chat-message ${type}-message`;
  element.textContent = message;
  chatBody.appendChild(element);
  chatBody.scrollTop = chatBody.scrollHeight;
  return element;
}

async function askAssistant(question) {
  if (analogMode || !question.trim()) return;

  addMessage(question, "user");
  const loadingMessage = addMessage("Thinking...", "assistant");
  chatInput.value = "";
  chatInput.disabled = true;

  const sendButton = chatForm.querySelector("button");
  sendButton.disabled = true;

  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error("AI backend is not available");
    }

    const data = await response.json();
    loadingMessage.textContent =
      data.answer || data.response || "I couldn't generate an answer.";
  } catch (error) {
    loadingMessage.textContent = getDemoResponse(question);
  } finally {
    chatInput.disabled = analogMode;
    sendButton.disabled = analogMode;
    chatInput.placeholder = analogMode
      ? "Switch to AI Mode to use the demo"
      : "Ask me anything...";
    chatInput.focus();
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

chatForm.addEventListener("submit", async event => {
  event.preventDefault();
  await askAssistant(chatInput.value.trim());
});

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => {
    if (analogMode) return;
    askAssistant(button.textContent.trim());
  });
});

setMode(false);

const PRODUCT_PRICE = 4999;
const selectedColourText = document.getElementById("selectedColour");
const quantityValue = document.getElementById("quantityValue");
const bagBar = document.getElementById("bagBar");
const bagSummary = document.getElementById("bagSummary");
const checkoutOverlay = document.getElementById("checkoutOverlay");

let selectedColour = "Midnight Black";
let quantity = 1;
let bagItems = 0;

const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function updateQuantity() {
  quantityValue.textContent = quantity;
}

function updateCheckout() {
  const subtotal = PRODUCT_PRICE * quantity;

  document.getElementById("checkoutVariant").textContent =
    `${selectedColour} · Qty ${quantity}`;

  document.getElementById("checkoutPrice").textContent = money(subtotal);
  document.getElementById("checkoutSubtotal").textContent = money(subtotal);
  document.getElementById("checkoutTotal").textContent = money(subtotal);
}

document.getElementById("quantityMinus").addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateQuantity();
});

document.getElementById("quantityPlus").addEventListener("click", () => {
  quantity = Math.min(10, quantity + 1);
  updateQuantity();
});


document.querySelectorAll(".color-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedColour = button.dataset.color;
    selectedColourText.textContent = selectedColour;

    document.querySelectorAll(".color-option").forEach(option => {
      option.classList.toggle("selected", option === button);
    });
  });
});

document.getElementById("addToCart").addEventListener("click", () => {
  bagItems += quantity;

  bagSummary.textContent =
    `OpenLens One · ${bagItems} item${bagItems === 1 ? "" : "s"} · ${selectedColour}`;

  bagBar.hidden = false;

  document.getElementById("addToCart").textContent = "✓ Added to demo bag";

  bagBar.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});
function openCheckout() {
  updateCheckout();
  checkoutOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("checkoutNotice").textContent =
    "No payment will be collected. Your details are not sent anywhere.";

  document.getElementById("closeCheckout").focus();
}

function closeCheckout() {
  checkoutOverlay.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("buyNow").addEventListener("click", openCheckout);
document.getElementById("viewBag").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", event => {
  if (event.target === checkoutOverlay) {
    closeCheckout();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !checkoutOverlay.hidden) {
    closeCheckout();
  }
});

document.getElementById("demoOrderForm").addEventListener("submit", event => {
  event.preventDefault();

  const notice = document.getElementById("checkoutNotice");
  notice.textContent =
    "Demo complete! This is only a preview. No order was placed and no details were sent.";

  notice.style.color = "#69e8b8";
});
