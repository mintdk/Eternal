console.log("main.js loaded");

const firebaseConfig = {
  apiKey: "AIzaSyBjEv31mw8_zZuMmCU29jHkP5tU5HqHUPc",
  authDomain: "eternal-e48c8.firebaseapp.com",
  projectId: "eternal-e48c8",
  storageBucket: "eternal-e48c8.firebasestorage.app",
  messagingSenderId: "284085087396",
  appId: "1:284085087396:web:0f7606e15a1a56ac4bca31",
  measurementId: "G-JHB9SF8FFF"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("Firebase initialized");

async function generateLink(type) {
  console.log("Generate link clicked");

  const name1 = document.getElementById("name1").value.trim();
  const name2 = document.getElementById("name2").value.trim();
  const date = document.getElementById("date").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name1 || !name2 || !date) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const docRef = await db.collection("proposals").add({
      type,
      name1,
      name2,
      date,
      message,
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const link = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]+$/, '')}/proposal.html?id=${docRef.id}`;

    document.getElementById("proposalLink").value = link;
    document.getElementById("linkBox").style.display = "flex";

    console.log("Proposal saved:", docRef.id);

  } catch (error) {
    console.error("Firestore error:", error);
    alert("Error saving proposal. Check console.");
  }
}

function copyLink() {
  const input = document.getElementById("proposalLink");
  input.select();
  navigator.clipboard.writeText(input.value);
  alert("Link copied 💖");
}

function openProposal() {
  const link = document.getElementById("proposalLink").value;
  if (!link) return;
  window.open(link, "_blank");
}
