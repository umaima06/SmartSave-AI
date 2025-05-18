# 💰 SmartSave AI - Your Personal Finance Assistant

SmartSave AI is a smart, minimalistic, and interactive web-based personal finance assistant designed to help users **track expenses**, **set savings goals**, and get **AI-powered money-saving tips**.

Built for the **2025 Hackathon**, SmartSave AI aims to **gamify financial literacy** and make budgeting fun, intelligent, and accessible!

---

## Features

✨ **AI Financial Tips**  
Get personalized suggestions using OpenAI to improve your financial habits.

📊 **Dashboard Analytics**  
View budget, expenses, savings, and goals—visually represented with dynamic charts and cards.

🔐 **Firebase Authentication**  
Secure login/signup using Firebase Auth.

📁 **User Data Storage**  
User budgets, expenses, and preferences are stored in Firestore and retrieved real-time.

📆 **Timeline View**  
View all past transactions and savings entries in an organized timeline format.

🎯 **Goal Tracking**  
Set custom savings goals and monitor your progress visually.

📱 **Responsive UI**  
Fully mobile-friendly with a collapsible navbar and clean layout using HTML, CSS, and JavaScript.

---

## 🧠 Tech Stack

| Tech                | Description                                   |
|---------------------|-----------------------------------------------|
| **Frontend**        | HTML, CSS, JavaScript                         |
| **Backend**         | Python + Flask API                            |
| **Authentication**  | Firebase Auth                                 |
| **Database**        | Firestore                                     |
| **AI API**          | OpenAI (via Flask backend)                    |
| **Charting**        | Chart.js                                      |
| **Hosting**         | GitHub Pages (Frontend) + Render (Backend)    |

---

---

##  How It Works

1. **User signs up / logs in**  
   🔐 Firebase Auth securely manages the session.

2. **Dashboard loads personalized data**  
   📤 Budget, expenses, and goals are pulled from Firestore.

3. **User enters budget or expenses**  
   📝 Dashboard dynamically updates total, remaining, and charts.

4. **AI Tip Generation**  
   🧠 Flask backend sends the user ID to OpenAI → gets back a smart financial tip → shown in UI.

5. **Savings Over Time**  
   📈 Line chart tracks historical savings (user can visually see progress!).

