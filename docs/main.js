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

console.log("Eternally loaded");

function generateLink(type) {
    const name1 = document.getElementById("name1").value.trim();
    const name2 = document.getElementById("name2").value.trim();
    const date  = document.getElementById("date").value.trim();
    const messageEl = document.getElementById("message");
    const message = messageEl ? messageEl.value.trim() : "";

    if (!name1 || !name2 || !date || !message) {
        alert("Please fill in all fields.");
        return;
    }

    const data = { name1, name2, date, message, type };
    localStorage.setItem("eternally_proposal", JSON.stringify(data));

    const basePath = window.location.href.replace(/\/[^\/]*$/, '');
    const link = `${basePath}/proposal.html`;

    document.getElementById("proposalLink").value = link;
    document.getElementById("linkBox").style.display = "flex";
}
function copyLink() {
    const input = document.getElementById("proposalLink");
    input.select();
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

function initProposal() {
    const raw = localStorage.getItem("eternally_proposal");
    if (!raw) return;

    const data = JSON.parse(raw);

    const titles = {
        bestfriends: "Best Friends Proposal",
        friendship: "Friendship Proposal",
        confession: "Confession",
        engagement: "Engagement Proposal",
        rlts: "Relationship Proposal"
    };

    document.getElementById("proposalTitle").innerText =
        titles[data.type] || "Proposal";

    document.getElementById("proposalMessage").innerText = data.message;
    document.getElementById("from-name").innerText = data.name1;
    document.getElementById("to-name").innerText = data.name2;
    document.getElementById("the-date").innerText = data.date;
}

function acceptProposal() {
    window.location.href = "certificate.html";
}

function rejectProposal() {
    window.location.href = "no.html";
}

function loadCertificateData() {
    const raw = localStorage.getItem("eternally_proposal");
    if (!raw) return;

    const data = JSON.parse(raw);

    const n1 = document.getElementById("certName1");
    const n2 = document.getElementById("certName2");
    const d  = document.getElementById("certDate");

    if (n1) n1.innerText = data.name1;
    if (n2) n2.innerText = data.name2;
    if (d)  d.innerText  = data.date;
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

