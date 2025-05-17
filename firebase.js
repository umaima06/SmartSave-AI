import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAuylaOXF0uFDpgWitCS4IVDgCl_bDw8zw",
  authDomain: "smartsave-ai-backend.firebaseapp.com",
  projectId: "smartsave-ai-backend",
  storageBucket: "smartsave-ai-backend.appspot.com",
  messagingSenderId: "878148375077",
  appId: "1:878148375077:web:7f4059e336dadc2d03a5cc",
  measurementId: "G-FTT8FZV12B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function fillMissingDays(history, goalInput) {
  const today = new Date();
  const filled = [];
  let currentDate = new Date(history.length ? history[0].date : today);
  const endDate = new Date(today);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const existing = history.find(e => e.date === dateStr);
    filled.push(existing || { date: dateStr, amount: goalInput });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return filled;
}

async function saveSavingsGoal(goalInput, uid) {
  if (!goalInput || goalInput <= 0) throw new Error("Invalid goal amount");
  if (!uid) throw new Error("User not logged in");

  const userDocRef = doc(db, "userPreferences", uid);
  const userSnap = await getDoc(userDocRef);
  const existingData = userSnap.exists() ? userSnap.data() : {};
  const existingHistory = existingData.savingsHistory || [];

  const today = new Date().toISOString().split('T')[0];
  const newEntry = { date: today, amount: goalInput };

  let updatedHistory = existingHistory.filter(e => e.date !== today);
  updatedHistory.push(newEntry);
  updatedHistory = fillMissingDays(updatedHistory, goalInput);

  await setDoc(userDocRef, {
    savingsGoal: goalInput,
    savingsHistory: updatedHistory
  }, { merge: true });

  return updatedHistory;
}

async function fetchUserPreferences(uid) {
  if (!uid) throw new Error("User not logged in");

  const prefsRef = doc(db, "userPreferences", uid);
  const prefsSnap = await getDoc(prefsRef);
  return prefsSnap.exists() ? prefsSnap.data() : {};
}

export { auth, db, saveSavingsGoal, fetchUserPreferences };