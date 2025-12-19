console.log("Eternally loaded");
const firebaseConfig = {
  apiKey: "AIzaSyBjEv31mw8_zZuMmCU29jHkP5tU5HqHUPc",
  authDomain: "eternal-e48c8.firebaseapp.com",
  projectId: "eternal-e48c8",
  storageBucket: "eternal-e48c8.firebasestorage.app",
  messagingSenderId: "284085087396",
  appId: "1:284085087396:web:0f7606e15a1a56ac4bca31"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("🔥 Firebase connected");

async function generateLink(type) {
  const name1 = document.getElementById("name1").value.trim();
  const name2 = document.getElementById("name2").value.trim();
  const date = document.getElementById("date").value.trim();
  const messageEl = document.getElementById("message");
  const message = messageEl ? messageEl.value.trim() : "";

  if (!name1 || !name2 || !date) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const docRef = await db.collection("proposals").add({
      name1,
      name2,
      date,
      message,
      type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const link = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]+$/, '')}/proposal.html?id=${docRef.id}`;

    document.getElementById("proposalLink").value = link;
    document.getElementById("linkBox").style.display = "flex";

  } catch (err) {
    console.error(err);
    alert("Error creating proposal");
  }
}

function copyLink() {
  const input = document.getElementById("proposalLink");
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
  alert("Link copied 💖");
}

function openProposal() {
  const link = document.getElementById("proposalLink").value;
  if (!link) {
    alert("Generate the link first");
    return;
  }
  window.open(link, "_blank");
}
async function initProposal() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    const doc = await db.collection("proposals").doc(id).get();
    if (!doc.exists) return;

    const data = doc.data();

    const titles = {
      bestfriends: "Best Friends Proposal",
      friendship: "Friendship Proposal",
      confession: "Confession",
      engagement: "Engagement Proposal",
      rlts: "Relationship Proposal"
    };

    document.getElementById("proposalTitle").innerText =
      titles[data.type] || "Proposal";

    document.getElementById("proposalMessage").innerText = data.message || "";
    document.getElementById("from-name").innerText = data.name1;
    document.getElementById("to-name").innerText = data.name2;
    document.getElementById("the-date").innerText = data.date;

    window.currentProposalId = id;

  } catch (err) {
    console.error(err);
  }
}

function acceptProposal() {
  if (!window.currentProposalId) return;
  window.location.href = `certificate.html?id=${window.currentProposalId}`;
}

function rejectProposal() {
  window.location.href = "no.html";
}

async function loadCertificateData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    const doc = await db.collection("proposals").doc(id).get();
    if (!doc.exists) return;

    const data = doc.data();

    document.getElementById("certName1").innerText = data.name1;
    document.getElementById("certName2").innerText = data.name2;
    document.getElementById("certDate").innerText = data.date;

  } catch (err) {
    console.error(err);
  }
}
function saveCertificateImage() {
  const cert = document.querySelector(".certificate-box");
  if (!cert) return;

  html2canvas(cert, { scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("proposalTitle")) {
    initProposal();
  }

  if (document.getElementById("certName1")) {
    loadCertificateData();
  }
});
