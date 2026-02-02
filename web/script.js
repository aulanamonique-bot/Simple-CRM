// Lead Intake → Google Apps Script Web App
// Paste your deployment URL (must end with /exec)
const ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const form = document.getElementById("leadForm");
const msg = document.getElementById("msg");
const clearBtn = document.getElementById("clearBtn");

console.log("script.js loaded");

clearBtn.addEventListener("click", () => {
  form.reset();
  msg.textContent = "";
  msg.className = "msg";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Honeypot check
  const hp = form.querySelector('input[name="website"]');
  if (hp && hp.value) return;

  const data = Object.fromEntries(new FormData(form).entries());

  msg.textContent = "Saving...";
  msg.className = "msg";

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      // Apps Script is happiest with text/plain for CORS simplicity
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });

    const text = await res.text();
    console.log("RAW response:", text);

    // Always show something useful on-screen
    let json = {};
    try { json = JSON.parse(text); } catch (e) {}

    if (res.ok && json.ok) {
      msg.textContent = `Saved ✅ (${json.leadId || "ok"})`;
      msg.className = "msg ok";
      form.reset();
    } else {
      msg.textContent = `Error (${res.status}): ${json.error || text || "Unknown error"}`;
      msg.className = "msg bad";
    }

  } catch (err) {
    msg.textContent = `Error: ${String(err)}`;
    msg.className = "msg bad";
  }
});
