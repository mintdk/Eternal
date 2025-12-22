console.log("📄 main.js cargado");

const firebaseConfig = {
  apiKey: "AIzaSyBjEv31mw8_zZuMmCU29jHkP5tU5HqHUPc",
  authDomain: "eternal-e48c8.firebaseapp.com",
  projectId: "eternal-e48c8",
  storageBucket: "eternal-e48c8.firebasestorage.app",
  messagingSenderId: "284085087396",
  appId: "1:284085087396:web:0f7606e15a1a56ac4bca31"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("🔥 Firebase inicializado");
}

const db = firebase.firestore();

window.generateLink = async function (type) {
  console.log("🟢 generateLink()");

  const name1 = document.getElementById("name1")?.value.trim();
  const name2 = document.getElementById("name2")?.value.trim();
  const date = document.getElementById("date")?.value.trim();
  const message = document.getElementById("message")?.value.trim();

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

    const basePath = location.pathname.replace(/\/[^/]*$/, "");
    const link = `${location.origin}${basePath}/proposal.html?id=${docRef.id}`;

    document.getElementById("proposalLink").value = link;
    document.getElementById("linkBox").style.display = "block";

    console.log("✅ Link creado:", link);
  } catch (err) {
    console.error("❌ Error guardando propuesta:", err);
    alert("Error creating proposal");
  }
};

window.copyLink = function () {
  const input = document.getElementById("proposalLink");
  input.select();
  document.execCommand("copy");
  alert("Link copied!");
};

window.openProposal = function () {
  const link = document.getElementById("proposalLink").value;
  if (link) window.open(link, "_blank");
};

window.loadProposal = async function () {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  try {
    const doc = await db.collection("proposals").doc(id).get();
    if (!doc.exists) {
      alert("Proposal not found");
      return;
    }

    const data = doc.data();

    document.getElementById("proposalMessage").textContent = data.message || "";
    document.getElementById("from-name").textContent = data.name1;
    document.getElementById("to-name").textContent = data.name2;
    document.getElementById("the-date").textContent = data.date;

    console.log("📄 Proposal loaded:", data);
  } catch (err) {
    console.error("❌ Error loading proposal:", err);
  }
};

window.acceptProposal = async function () {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  await db.collection("proposals").doc(id).update({
    status: "accepted"
  });

  window.location.href = "certificate.html?id=" + id;
};

window.rejectProposal = async function () {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  await db.collection("proposals").doc(id).update({
    status: "rejected"
  });

  window.location.href = "no.html";
};

window.loadCertificate = async function () {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  try {
    const doc = await db.collection("proposals").doc(id).get();
    if (!doc.exists) return;

    const data = doc.data();

    document.getElementById("certName1").textContent = data.name1;
    document.getElementById("certName2").textContent = data.name2;
    document.getElementById("certDate").textContent = data.date;

    console.log("🏆 Certificate loaded");
  } catch (err) {
    console.error("❌ Error loading certificate:", err);
  }
};

window.saveCertificateImage = function () {
  const cert = document.getElementById("certificate");
  if (!cert) return;

  html2canvas(cert, {
    scale: 2,
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.includes("proposal.html")) {
    loadProposal();
  }

  if (location.pathname.includes("certificate.html")) {
    loadCertificate();
  }
});
