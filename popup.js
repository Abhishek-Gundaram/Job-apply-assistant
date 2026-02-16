const ids = [
  "fullName",
  "firstName",
  "lastName",
  "email",
  "phone",
  "linkedin",
  "github",
  "portfolio",
  "address1",
  "city",
  "state",
  "zip",
  "country",
  "workAuth",
  "sponsorship"
];

function getFormData() {
  const data = {};
  for (const id of ids) {
    const el = document.getElementById(id);
    data[id] = el ? el.value.trim() : "";
  }
  return data;
}

function setStatus(msg, isError = false) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.style.color = isError ? "#c33" : "#2a6";
}

async function loadProfile() {
  const { profile } = await chrome.storage.local.get("profile");
  const p = profile || {};
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) el.value = p[id] || "";
  }
}

async function saveProfile() {
  const profile = getFormData();
  await chrome.storage.local.set({ profile });
  setStatus("Saved ✅");
}

async function fillBasics() {
  const { profile } = await chrome.storage.local.get("profile");
  if (!profile) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    setStatus("No actions fields found", true);
    return;
  }

  await chrome.tabs.sendMessage(tab.id, {
    type: "FILL_BASICS",
    payload: profile
  });

  setStatus("Fill triggered 🚀");
}

document.getElementById("save").addEventListener("click", saveProfile);
document.getElementById("fill").addEventListener("click", fillBasics);

loadProfile().catch(() => setStatus("Failed to load profile", true));
