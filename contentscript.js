// ---- Helpers to work with React/controlled inputs ----
function findYesNoControl(keywords) {
  const candidates = Array.from(document.querySelectorAll("select, input[type=radio]"));
  let best = null;
  let bestScore = 0;

  for (const el of candidates) {
    const label = normalize(getLabelTextForInput(el));
    const name = normalize(el.getAttribute("name") || "");
    const id = normalize(el.id || "");

    const hay = `${label} ${name} ${id}`;

    let score = 0;
    for (const kw of keywords) {
      if (hay.includes(kw)) score += 10;
    }

    if (score > bestScore) {
      bestScore = score;
      best = el;
    }
  }

  return bestScore >= 10 ? best : null;
}

function setSelectValue(selectEl, desired) {
  const options = Array.from(selectEl.options || []);
  const normDesired = normalize(desired);

  const match = options.find(o => normalize(o.textContent).includes(normDesired));
  if (!match) return false;

  selectEl.focus();
  selectEl.value = match.value;
  selectEl.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function setYesNoRadioGroup(groupName, yes) {
  const radios = document.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
  for (const r of radios) {
    const label = normalize(getLabelTextForInput(r));
    if ((yes && label.includes("yes")) || (!yes && label.includes("no"))) {
      r.click();
      return true;
    }
  }
  return false;
}

function setNativeValue(element, value) {
  const { set: valueSetter } =
    Object.getOwnPropertyDescriptor(element, "value") || {};
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeSetter } =
    Object.getOwnPropertyDescriptor(prototype, "value") || {};

  if (prototypeSetter && valueSetter !== prototypeSetter) {
    prototypeSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 +]/g, "")
    .trim();
}

function getLabelTextForInput(input) {
  // 1) <label for="...">
  if (input.id) {
    const label = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
    if (label) return label.textContent || "";
  }

  // 2) Wrapped by label <label>...<input/></label>
  const parentLabel = input.closest("label");
  if (parentLabel) return parentLabel.textContent || "";

  // 3) aria-label
  if (input.getAttribute("aria-label")) return input.getAttribute("aria-label");

  // 4) aria-labelledby
  const labelledBy = input.getAttribute("aria-labelledby");
  if (labelledBy) {
    const el = document.getElementById(labelledBy);
    if (el) return el.textContent || "";
  }

  // 5) Nearby text (best-effort)
  const container = input.closest("div, fieldset, section, li") || input.parentElement;
  if (container) {
    const text = container.textContent || "";
    return text.slice(0, 120); // keep it small
  }

  return "";
}

function scoreField(input, keywords) {
  const label = normalize(getLabelTextForInput(input));
  const placeholder = normalize(input.getAttribute("placeholder") || "");
  const name = normalize(input.getAttribute("name") || "");
  const id = normalize(input.id || "");

  const hay = `${label} ${placeholder} ${name} ${id}`;

  let score = 0;
  for (const kw of keywords) {
    if (hay.includes(kw)) score += 10;
  }

  // small bonuses
  if (input.type === "email" && keywords.includes("email")) score += 6;
  if (input.type === "tel" && keywords.includes("phone")) score += 6;

  return score;
}

function findBestInput(keywords) {
  const inputs = Array.from(document.querySelectorAll("input, textarea"));
  let best = null;
  let bestScore = 0;

  for (const el of inputs) {
    // skip hidden/disabled/readOnly
    const style = window.getComputedStyle(el);
    if (el.disabled || el.readOnly) continue;
    if (style.display === "none" || style.visibility === "hidden") continue;
    if (el.type === "hidden" || el.getAttribute("aria-hidden") === "true") continue;

    const s = scoreField(el, keywords);
    if (s > bestScore) {
      bestScore = s;
      best = el;
    }
  }

  return bestScore >= 10 ? best : null; // threshold
}

function fillBasics(profile) {
  const mapping = [
    { value: profile.firstName, keywords: ["first name", "given name", "firstname"] },
    { value: profile.lastName, keywords: ["last name", "surname", "family name", "lastname"] },
    { value: profile.email, keywords: ["email", "email address"] },
    { value: profile.phone, keywords: ["phone", "mobile", "telephone", "tel"] },
    { value: profile.linkedin, keywords: ["linkedin", "linkedin profile"] },
    { value: profile.address1, keywords: ["address line 1", "street address", "address", "street"] },
    { value: profile.city, keywords: ["city", "town"] },
    { value: profile.state, keywords: ["state", "province", "region"] },
    { value: profile.zip, keywords: ["zip", "zip code", "postal", "postal code"] },
    { value: profile.country, keywords: ["country"] }
  ];

  let filledCount = 0;

  for (const m of mapping) {
    if (!m.value) continue;

    const input = findBestInput(m.keywords);
    if (!input) continue;

    input.focus();
    setNativeValue(input, m.value);
    filledCount++;
  }
  if (profile.workAuth) {
    const el = findYesNoControl([
      "authorized",
      "work authorization",
      "legally authorized",
      "eligible to work"
    ]);
    if (el) {
      if (el.tagName === "SELECT") {
        setSelectValue(el, profile.workAuth);
      } else if (el.type === "radio" && el.name) {
        setYesNoRadioGroup(el.name, profile.workAuth === "yes");
      }
    }
  }

  // Sponsorship
  if (profile.sponsorship) {
    const el = findYesNoControl([
      "sponsorship",
      "visa sponsorship",
      "require sponsorship"
    ]);
    if (el) {
      if (el.tagName === "SELECT") {
        setSelectValue(el, profile.sponsorship);
      } else if (el.type === "radio" && el.name) {
        setYesNoRadioGroup(el.name, profile.sponsorship === "yes");
      }
    }
  }
  return filledCount;
}


chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
  if (msg?.type === "FILL_BASICS") {
    const count = fillBasics(msg.payload || {});
    // Helpful for debugging: open DevTools Console and see this
    console.log(`[JobApply Assist] Filled ${count} fields`);
  }
});
