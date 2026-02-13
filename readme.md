# JobApply Assist

A lightweight Chrome extension to autofill repetitive fields in job application forms (name, email, phone, LinkedIn) across common ATS platforms like Workday, Greenhouse, and Lever.

## Features
- Save basic profile information locally
- Autofill common fields with one click
- Keyboard shortcut support (Alt + 1)
- Works with React-based forms by triggering input/change events
- Privacy-first: all data stored locally in the browser

## Tech Stack
- Chrome Extensions (Manifest V3)
- JavaScript (ES6+)
- DOM APIs
- Chrome Storage API

## Installation
1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable Developer mode
4. Click "Load unpacked" and select the project folder

## Usage
1. Open the extension popup and save your profile
2. Navigate to a job application form
3. Click "Fill Basics" or press Alt + 1 to autofill fields

## Limitations
- File uploads and CAPTCHA must be completed manually
- Auto-submit is intentionally not supported

## License
MIT