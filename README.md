# 🤖 EmoTracker Backend

A lightweight **Express.js** backend powering the AI features of **EmoTracker**.

This service securely communicates with the **Google Gemini API**, generates personalized journal insights, and returns them to the React frontend. The Gemini API key is stored securely using environment variables and is never exposed to the client.

---

## ✨ Features

* 🤖 Google Gemini AI integration
* 🔒 Secure server-side API key handling
* 📤 REST API endpoint for AI insights
* 🛡️ Rate limiting using Express Rate Limit
* 🌐 CORS enabled for frontend communication
* ⚡ Deployed on Render

---

## 🛠 Tech Stack

* Node.js
* Express.js
* Google Gemini API
* dotenv
* express-rate-limit
* CORS

---

## 📦 Installation

```bash
git clone https://github.com/khushi05sharma/emotracker-backend.git
cd emotracker-backend
npm install
```

Create a `.env` file in the project root:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:

```bash
node server.js
```

The backend will run at:

```
http://localhost:5000
```

---

## 📡 API Endpoint

### POST `/api/insight`

Generates an AI-powered response based on the user's mood and journal entry.

**Request Body**

```json
{
  "emotion": "happy",
  "journalText": "Today I completed my React project."
}
```

**Response**

```json
{
  "encouragement": "...",
  "reflection": "...",
  "suggestion": "..."
}
```

---

## 🚀 Deployment

The backend is deployed on **Render** and communicates securely with the React frontend hosted on **GitHub Pages**.

---

## 🔐 Security

* API keys are stored using environment variables.
* `.env` is excluded from Git using `.gitignore`.
* Gemini API requests are made only from the backend, ensuring credentials are never exposed to the browser.
* Rate limiting is enabled to reduce API abuse.
