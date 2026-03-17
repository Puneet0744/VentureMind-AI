
---

# 🚀 README.md (Run Instructions)

````markdown
# 🚀 VentureMind AI – Setup & Run Guide

This guide explains how to run the project locally.

---

## 📌 Prerequisites

Make sure you have installed:

- Python (>= 3.10)
- Node.js (>= 18)
- npm
- Git

---

## 🔑 Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/venturemind-ai.git
cd venturemind-ai
````

---

## ⚙️ Step 2: Backend Setup

```bash
cd backend
```

### Create virtual environment (recommended)

```bash
python -m venv venv
```

Activate it:

* Windows:

```bash
venv\Scripts\activate
```

* Mac/Linux:

```bash
source venv/bin/activate
```

---

### Install dependencies

```bash
pip install -r requirements.txt
```

---

### Create `.env` file

Inside `backend/`, create a file named `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
APIFY_TOKEN=your_apify_token
```

---

### Run backend server

```bash
python app.py
```

You should see:

```
Running on http://127.0.0.1:5000/
```

---

## 💻 Step 3: Frontend Setup

Open a new terminal:

```bash
cd VentureMind-AI-main
```

---

### Install dependencies

```bash
npm install
```

---

### Run frontend

```bash
npm run dev
```

You should see something like:

```
Local: http://localhost:5173/
```

---

## ▶️ Step 4: Use the App

1. Open browser:

```
http://localhost:5173/
```

2. Enter an industry (e.g. `healthcare`)

3. Click **Generate**

4. Wait ~10–20 seconds ⏳

---

## 🧪 Optional: Test Backend Only

```bash
cd backend
python test_pipeline.py
```

---

## ⚠️ Common Issues

### ❌ Scraper not working

* Check if `APIFY_TOKEN` is correct

---

### ❌ Gemini error

* Check `GEMINI_API_KEY`

---

### ❌ Slow response

* Normal (AI + scraping takes time)

---
