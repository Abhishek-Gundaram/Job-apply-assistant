🚀 JobApply Assist – Smart Autofill Chrome Extension

JobApply Assist is a Chrome extension that helps streamline job applications by automatically filling repetitive form fields (name, email, phone, LinkedIn, etc.) across multiple Applicant Tracking Systems (ATS) such as Workday, Greenhouse, Lever, and custom company career pages.

The extension uses DOM heuristics and event-based input simulation to work reliably even on modern React-based forms. It’s designed as a fill-assist tool (not an auto-submit bot), keeping the user in control while significantly reducing time spent on repetitive data entry.

✨ Features

🔐 Local Profile Storage
Save your basic profile (name, email, phone, LinkedIn) securely in browser storage.

⚡ One-Click Autofill
Fill common fields on any job application page with a single click.

⌨️ Keyboard Shortcut Support
Trigger autofill using shortcuts (e.g., Alt + 1) without opening the popup.

🧠 Smart Field Detection
Matches input fields using labels, placeholders, ARIA attributes, and nearby text, making it resilient across different ATS platforms and custom forms.

⚛️ React-Friendly Input Handling
Dispatches native input and change events so values are properly registered by React/Angular-controlled forms.

🔒 Privacy-First
All data is stored locally in your browser. No servers, no tracking.

🏗️ Architecture Overview
Chrome Extension (Manifest v3)
│
├── Popup UI
│   └── Manage profile & trigger autofill
│
├── Background Service Worker
│   └── Handles keyboard shortcuts (e.g., Alt + 1)
│
├── Content Script
│   └── Scans DOM and fills inputs on the active page
│
└── Chrome Local Storage
    └── Stores user profile data

🛠️ Tech Stack

Chrome Extensions (Manifest V3)

JavaScript (ES6+)

DOM APIs

Chrome Storage API

Event dispatching for React-controlled inputs

📦 Installation (Local Development)

Clone the repository:

git clone https://github.com/<your-username>/jobapply-assist.git
cd jobapply-assist


Open Chrome and go to:

chrome://extensions


Enable Developer mode (top-right corner).

Click Load unpacked and select the project folder.

Pin the extension from the Chrome toolbar for easy access.

🧪 How to Use

Click the extension icon in Chrome.

Enter your profile details (name, email, phone, LinkedIn).

Click Save.

Navigate to any job application form.

Click Fill Basics in the popup or press Alt + 1 to auto-fill supported fields.

🧠 Design Principles

Assist, don’t automate submission
The tool intentionally avoids auto-submitting forms to respect platform ToS and ensure user control.

Heuristic-based matching over brittle selectors
The extension uses semantic cues (labels, placeholders, ARIA) instead of hardcoded field IDs, making it robust across different sites.

Privacy by default
No external services or data collection.

🚧 Limitations

File uploads (resume/cover letter) must be done manually due to browser security restrictions.

CAPTCHA and bot-detection mechanisms are intentionally not bypassed.

Some highly customized UI components may require site-specific tuning.

🗺️ Roadmap

⌨️ Additional keyboard shortcuts for links and templates

🧩 Per-site learning mode (map fields once, reuse on the same ATS)

🧠 AI-assisted template answers for common application questions

☁️ Optional cloud sync for profile data

📸 Demo (Optional)

Add screenshots or a short GIF showing autofill in action on a job application page.

🤝 Contributing

This is a personal productivity and learning project. Contributions and ideas are welcome via issues or pull requests.

📄 License

MIT License