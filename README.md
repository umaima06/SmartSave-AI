# 💰 SmartSave AI - Your Personal Finance Assistant

SmartSave AI is an intelligent, interactive, and gamified budgeting assistant that helps users track expenses, set savings goals, and get smart financial advice — all in one place.

Designed during the *2025 Hackathon*, this project leverages AI and intuitive design to help users take charge of their finances without stress. 

---

## 🚀 Features

✨ *AI Financial Tips Generator*  
Personalized suggestions to help you budget smarter using OpenAI’s GPT API.

💬 *SmartSave AI Chatbot*  
A conversational assistant that answers user questions about saving money, managing expenses, and general financial advice. (Built with OpenAI & Flask backend)

📊 *Dashboard Analytics*  
Real-time expense tracking with beautiful charts and responsive budget overview cards.

🔐 *Firebase Authentication*  
Secure and smooth user login & signup via Firebase Auth.

📁 *Firestore Integration*  
All user data is stored and retrieved in real-time from Firebase Firestore.

🎯 *Savings Goal Tracker*  
Set personalized savings goals and monitor your progress visually.

📱 *Mobile-First UI*  
A responsive layout built with HTML, CSS & JavaScript for seamless use across devices.

---

##  Tech Stack

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

