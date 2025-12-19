// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjEv31mw8_zZuMmCU29jHkP5tU5HqHUPc",
  authDomain: "eternal-e48c8.firebaseapp.com",
  projectId: "eternal-e48c8",
  storageBucket: "eternal-e48c8.firebasestorage.app",
  messagingSenderId: "284085087396",
  appId: "1:284085087396:web:0f7606e15a1a56ac4bca31",
  measurementId: "G-JHB9SF8FFF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Generate proposal link
async function generateLink(type) {
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
      type: type,
      name1: name1,
      name2: name2,
      date: date,
      message: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const link = `${window.location.origin}/proposal.html?id=${docRef.id}`;

    document.getElementById("proposalLink").value = link;
    document.getElementById("linkBox").style.display = "block";
  } catch (error) {
    console.error("Error saving proposal:", error);
    alert("Error saving proposal");
  }
}

function copyLink() {
  const input = document.getElementById("proposalLink");
  input.select();
  document.execCommand("copy");
  alert("Link copied!");
}

function openProposal() {
  const link = document.getElementById("proposalLink").value;
  window.open(link, "_blank");
}
