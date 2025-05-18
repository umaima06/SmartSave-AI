from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth, initialize_app

import requests

app = Flask(__name__)
CORS(app)  # This will allow all origins by default

# ✅ Firebase Initialization
firebase_creds_json = os.environ.get("FIREBASE_CREDENTIALS")
if firebase_creds_json:
    cred = credentials.Certificate(json.loads(firebase_creds_json))
    initialize_app(cred)
    db = firestore.client()
else:
    raise Exception("FIREBASE_CREDENTIALS environment variable not set")

# ✅ Simple Home Route (for testing if backend is running)
@app.route('/')
def home():
    return "SmartSave AI Backend is Running 🧠💰"

# ✅ Test Route to Check Firebase Connection
@app.route('/test')
def test_connection():
    return "SmartSave AI is connected to Firebase!"

# ✅ Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']
    username = data['username']
    
    users_ref = db.collection("users")
    username_taken = users_ref.where("username", "==", username).get()
    if username_taken:
        return jsonify({"error": "This username is already taken!"}), 400

    try:
        user = auth.create_user(email=email, password=password)
        users_ref.document(user.uid).set({
            "username": username,
            "email": email
        })
        return jsonify({"message": "User created", "uid": user.uid})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ✅ Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    
    api_key = "AIzaSyAuylaOXF0uFDpgWitCS4IVDgCl_bDw8zw"  # Replace with your actual Firebase Web API Key
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }

    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": response.json()}), 401

# ✅ Save Budget
@app.route('/save_budget', methods=['POST'])
def save_budget():
    data = request.json
    uid = data['uid']
    budget = data['budget']
    db.collection("users").document(uid).set({"budget": budget}, merge=True)
    return jsonify({"message": "Budget saved"})

# ✅ Get Budget
@app.route('/get_budget/<uid>', methods=['GET'])
def get_budget(uid):
    doc = db.collection("users").document(uid).get()
    if doc.exists:
        return jsonify(doc.to_dict())
    return jsonify({"error": "User not found"}), 404

# ✅ Add Expense
@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.json
    uid = data['uid']
    category = data['category']
    amount = data['amount']
    db.collection("users").document(uid).collection("expenses").add({
        "category": category,
        "amount": amount
    })
    return jsonify({"message": "Expense added"})

# ✅ Get Expenses
@app.route('/get_expenses/<uid>', methods=['GET'])
def get_expenses(uid):
    expenses_ref = db.collection("users").document(uid).collection("expenses").stream()
    expenses = [{"id": e.id, **e.to_dict()} for e in expenses_ref]
    return jsonify(expenses)

# ✅ Save Financial Goal
@app.route('/save_goal', methods=['POST'])
def save_goal():
    data = request.json
    uid = data['uid']
    goal_name = data['goal_name']
    goal_amount = data['goal_amount']
    db.collection("users").document(uid).collection("goals").document(goal_name).set({
        "amount": goal_amount
    })
    return jsonify({"message": "Goal saved"})

# ✅ Get Goals
@app.route('/get_goals/<uid>', methods=['GET'])
def get_goals(uid):
    goals_ref = db.collection("users").document(uid).collection("goals").stream()
    goals = [{"name": g.id, **g.to_dict()} for g in goals_ref]
    return jsonify(goals)



# 🤖 OpenAI API Key
openai.api_key = "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"
openai.api_base = "https://openrouter.ai/api/v1"

@app.route("/api/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    messages = data.get("messages", [])
    uid = data.get("uid")

    if not uid:
        return jsonify({"reply": "User ID not provided."}), 400
    if not messages:
        return jsonify({"reply": "Please say something!"}), 400

    try:
        # Check the latest user message
        latest_msg = messages[-1]["content"].lower()
        keywords = ["save", "spend", "budget", "money", "expenses", "goal", "reduce", "track", "subscriptions"]

        # Determine if user's question is financial
        should_inject_context = any(keyword in latest_msg for keyword in keywords)

        full_messages = []

        # If user is asking something financial, inject personal budget data
        if should_inject_context:
            prefs_doc = db.collection("userPreferences").document(uid).get()
            if prefs_doc.exists:
                prefs = prefs_doc.to_dict()
                budget = prefs.get("budget", 0)
                categoryAmounts = prefs.get("categoryAmounts", {})
                savingsGoal = prefs.get("savingsGoal", 0)

                category_str = ", ".join([f"{k}: ₹{v}" for k, v in categoryAmounts.items()])
                context_info = f"""
This user has:
- A total budget of ₹{budget}
- Expenses across categories: {category_str}
- A savings goal of ₹{savingsGoal}

Use this data to give personalized, practical suggestions only when relevant. Avoid repeating it unless asked.
"""
                full_messages.append({
                    "role": "system",
                    "content": f"You are SmartSave AI, a helpful and friendly financial mentor for students.\n{context_info}"
                })
        else:
            full_messages.append({
                "role": "system",
                "content": "You are SmartSave AI, a friendly and intelligent assistant that helps students manage their finances. Respond casually to greetings and general messages. Only give money tips when asked."
            })

        full_messages.extend(messages)

        response = openai.ChatCompletion.create(
            model="mistralai/mixtral-8x7b-instruct",
            messages=full_messages,
            max_tokens=600,
            temperature=0.75
        )

        reply = response["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": f"Something went wrong: {str(e)}"}), 500

    
   #ai generated tips fro dashboard!
@app.route('/api/ai/generate-tips', methods=['POST'])
def generate_ai_tips():
    data = request.json
    uid = data.get("uid")

    if not uid:
        return jsonify({"reply": "User ID not provided."}), 400

    try:
        # Fetch user preferences (budget, categoryAmounts, savingsGoal)
        prefs_doc = db.collection("userPreferences").document(uid).get()
        if not prefs_doc.exists:
            return jsonify({"reply": "User Preferences not found"}), 404

        prefs = prefs_doc.to_dict()
        budget = prefs.get("budget", 0)
        categoryAmounts = prefs.get("categoryAmounts", {})
        savingsGoal = prefs.get("savingsGoal", 0)

        # Format AI prompt
        prompt = f"""
You are SmartSave AI — a smart, friendly budgeting assistant for students.

A student has entered the following details:

- Monthly Budget: ₹{budget}
- Expenses: {', '.join([f"{cat}: ₹{amt}" for cat, amt in categoryAmounts.items()])}
- Savings Goal: ₹{savingsGoal}

Analyze the spending patterns and savings target.

Generate 5–7 personalized, practical suggestions to help the student:
1. Reduce overspending if applicable
2. Optimize savings
3. Improve spending habits
4. Meet or exceed their savings goal

Tips must be concise, friendly, and student-specific.
Where possible, use numbers (e.g. “Reduce food expense by 10% = ₹200 saved”).
Each tip should be on a new line and numbered like this:
1. Do this...
2. Do that...

Conclude with a short, powerful **bold motivational line** using Markdown to encourage consistency.
        """

        response = openai.ChatCompletion.create(
            model="mistralai/mixtral-8x7b-instruct",
            messages=[
                {
                    "role": "system",
                    "content": "You are SmartSave AI, a helpful assistant that gives smart money-saving advice to students."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=500,
            temperature=0.7
        )

        ai_reply = response["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": ai_reply})

    except Exception as e:
        return jsonify({"reply": f"Error generating tips: {str(e)}"}), 500
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
