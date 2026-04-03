# 🌐 AI-Driven Website Summariser Web App

## 📌 Overview

This project is a web application that allows users to input any public URL and generate a concise summary of the webpage using AI.

The app fetches the content of the provided URL, processes it through an AI model, and displays a clean, readable summary along with key insights.

---

## 🔗 Live Website

👉 https://website-summariser-web-app.vercel.app

---
🖼️ App Preview

<img width="1895" height="897" alt="image" src="https://github.com/user-attachments/assets/fc0e96de-0562-483f-bd50-95da6ded5c9d" />

---
## 🚀 Features

* 🔗 Enter any public website URL
* 🤖 AI-powered content summarization
* 📄 Clean and structured summary output
* ⚡ Fast and responsive UI
* 🧠 Extracts key points from long articles

---

## 🛠️ Tech Stack

### Frontend

* React (with TypeScript)
* Redux Toolkit (state management)
* CSS for styling

### Backend / API

* Axios for API requests
* RapidAPI (or AI API integration)

### AI Integration

* AI model used for summarization (via API)
* Processes raw webpage content into:

  * Summary
  * Key Points
  

---

## ⚙️ How It Works

1. User enters a URL
2. App sends request to API
3. API fetches webpage content
4. Content is sent to AI model
5. AI returns structured summary
6. UI displays:
   * Summary
   * Key Points
   

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aindm98/website-summariser-web-app.git
cd website-summariser-web-app
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
VITE_RAPIDAPI_BASE_URL=your_api_base_url
VITE_RAPIDAPI_API_KEY=your_api_key
VITE_RAPIDAPI_HOST=your_api_host
VITE_SUMMARIZER_LANG=en
VITE_SUMMARIZER_ENGINE=2
```

---

### 4. Run the App

```bash
npm run dev
```

App will be available at:

```
http://localhost:5173
```

---

## 🤖 How AI Was Used

The AI model is used to:

* Analyze webpage content
* Generate concise summaries
* Extract key bullet points
* Improve readability of long articles

### Flow:

* Raw HTML/text → API → AI Model → Structured Output

Example Output:

* Summary paragraph
* Bullet-point insights
* Optional metadata (word count, reading time)

---

## 🧪 Future Improvements

* Add history of summarized URLs
* Support multiple languages
* Improve UI/UX with animations
* Add export (PDF / Copy / Share)
* Better error handling & validation

---

## 🙌 Acknowledgements

* AI API provider (RapidAPI / Gemini / OpenAI)
* React & Redux ecosystem

---

## 📬 Contact

For any queries or suggestions, feel free to reach out!
Email: aindrilam18@gmail.com

---

⭐ If you like this project, consider giving it a star!
