/* ============================================
   🔥 BLOCK 1 — CORE ENGINE (Firebase + Chat)
   ============================================ */

/* ========== FIREBASE IMPORTS ========== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getDatabase, ref, push, onChildAdded, remove 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/* ========== FIREBASE CONFIG — YOUR CONFIG ========== */
const firebaseConfig = {
    apiKey: "AIzaSyB0R_sX_3-iHTIdR-cV6XnBkK-dCi15ny0",
    authDomain: "project-ano.firebaseapp.com",
    projectId: "project-ano",
    storageBucket: "project-ano.firebasestorage.app",
    messagingSenderId: "871392286002",
    appId: "1:871392286002:web:614a92e162f4f8a42e332b",
    measurementId: "G-TECFSQTKB4",
    databaseURL: "https://project-ano-default-rtdb.firebaseio.com/"
};

/* Init */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ========== GLOBAL VARIABLES ========== */
let currentUser = localStorage.getItem("username") || "";
let isAdmin = false;

/* ========== ELEMENTS ========== */
const loginBox = document.getElementById("login-container");
const chatBox = document.getElementById("chat-container");
const adminBadge = document.getElementById("admin-badge");
const adminBtn = document.getElementById("adminPanelBtn");
const messagesDiv = document.getElementById("messages");

/* ============================================
   🔐 LOGIN SYSTEM
   ============================================ */
document.getElementById("loginBtn").addEventListener("click", () => {
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value.trim();

    if (!user) return alert("Username required");

    // ADMIN LOGIN
    if (user === "zerohex" && pass === "badatom2556") {
        isAdmin = true;
        currentUser = "ADMIN";
        localStorage.setItem("username", currentUser);
    } else {
        if (!pass) return alert("Password required (anything allowed)");
        currentUser = user;
        isAdmin = false;
        localStorage.setItem("username", currentUser);
    }

    loginBox.style.display = "none";
    chatBox.style.display = "flex";

    if (isAdmin) {
        adminBadge.style.display = "inline-block";
        adminBtn.style.display = "block";
    }
});

/* ============================================
   🚪 LOGOUT
   ============================================ */
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("username");
    location.reload();
});

/* ============================================
   💬 SEND MESSAGE
   ============================================ */
document.getElementById("sendBtn").addEventListener("click", () => {
    let msg = document.getElementById("messageInput").value.trim();
    if (!msg) return;

    push(ref(db, "messages"), {
        username: currentUser,
        text: msg,
        admin: isAdmin,
        time: Date.now()
    });

    document.getElementById("messageInput").value = "";
});

/* ============================================
   📥 RECEIVE & DISPLAY MESSAGE
   ============================================ */
onChildAdded(ref(db, "messages"), (snap) => {
    let data = snap.val();
    let id = snap.key;

    let div = document.createElement("div");
    div.className = "message";

    div.innerHTML = `
        <span class="username">${data.username}</span>
        ${data.admin ? "<span class='admin-tag'>(ADMIN)</span>" : ""}
        <span class="deleteBtn" data-id="${id}" style="display:none;">[delete]</span>
        <br>${data.text}
    `;

    // Admin delete visibility
    if (isAdmin) {
        div.querySelector(".deleteBtn").style.display = "inline";
    }

    // Delete message
    div.querySelector(".deleteBtn").addEventListener("click", () => {
        remove(ref(db, "messages/" + id));
        div.remove();
    });

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

/* ============================================
   ⚡ BLOCK 2 — ADMIN PANEL FEATURES
   ============================================ */

/* ========== ADMIN PANEL BUTTON ========== */
adminBtn.addEventListener("click", () => {
    adminPanel.style.display = "block";
});

document.getElementById("closePanel").addEventListener("click", () => {
    adminPanel.style.display = "none";
});

/* ========== ADMIN CONTROLS ========== */

// Clear All Messages
document.getElementById("clearMessages").addEventListener("click", () => {
    if (!isAdmin) return;
    if (confirm("Are you sure? Clear ALL messages?")) {
        update(ref(db), { messages: null });
        messagesDiv.innerHTML = "";
    }
});

// Read-Only Mode Toggle
let readOnly = false;
document.getElementById("readOnlyToggle").addEventListener("click", () => {
    if (!isAdmin) return;
    readOnly = !readOnly;
    alert("Read-Only Mode: " + (readOnly ? "ON" : "OFF"));
});

// Global Announcement
document.getElementById("announcementBtn").addEventListener("click", () => {
    if (!isAdmin) return;
    let text = prompt("Enter announcement message:");
    if (text) {
        push(ref(db, "messages"), {
            username: "SYSTEM",
            text: "📢 ANNOUNCEMENT: " + text,
            admin: true,
            time: Date.now()
        });
    }
});

// Freeze Chat
let freezeChat = false;
document.getElementById("freezeBtn").addEventListener("click", () => {
    if (!isAdmin) return;
    freezeChat = !freezeChat;
    alert("Freeze Chat: " + (freezeChat ? "ON" : "OFF"));
});

// Glitch Effect
document.getElementById("glitchBtn").addEventListener("click", () => {
    if (!isAdmin) return;
    document.body.classList.toggle("glitch");
    setTimeout(() => {
        document.body.classList.remove("glitch");
    }, 2000);
});

/* ============================================
   🌐 BLOCK 3 — ADVANCED USER FEATURES
   ============================================ */

/* ========== ONLINE USERS TRACKING ========== */
const userListDiv = document.getElementById("userList");
const usersRef = ref(db, "onlineUsers/");

// Mark current user online
push(usersRef, {
    username: currentUser,
    time: Date.now()
});

// Listen online users
onChildAdded(usersRef, (snap) => {
    let data = snap.val();
    let div = document.createElement("div");
    div.id = "user-" + snap.key;
    div.textContent = data.username + " (Online)";
    userListDiv.appendChild(div);
});

// Typing indicator
let typing = false;
document.getElementById("messageInput").addEventListener("input", () => {
    typing = true;
    // Optional: broadcast typing status to other users
    setTimeout(() => { typing = false; }, 2000);
});

/* ========== PINNED MESSAGES ========== */
const pinnedRef = ref(db, "pinned/");
onChildAdded(pinnedRef, (snap) => {
    let data = snap.val();
    let div = document.createElement("div");
    div.className = "message";
    div.style.border = "2px solid #ff0";
    div.innerHTML = `<b>Pinned:</b> ${data.text}`;
    messagesDiv.prepend(div);
});

/* ========== MESSAGE LIKES ========== */
onChildAdded(ref(db, "messages"), (snap) => {
    const likeBtn = document.createElement("span");
    likeBtn.textContent = " [❤0]";
    likeBtn.style.cursor = "pointer";
    likeBtn.style.marginLeft = "10px";

    likeBtn.addEventListener("click", () => {
        const likesRef = ref(db, "likes/" + snap.key);
        push(likesRef, { user: currentUser });
    });

    const msgDiv = messagesDiv.querySelector(`.message:last-child`);
    if (msgDiv) msgDiv.appendChild(likeBtn);
});

/* ========== CHAT SOUND EFFECTS ========== */
const msgSound = new Audio("https://freesound.org/data/previews/258/258142_4486188-lq.mp3"); // short beep

onChildAdded(ref(db, "messages"), (snap) => {
    if (snap.val().username !== currentUser) {
        msgSound.play();
    }
});

/* ========== USER STATUS LOGIC (optional) ========== */
setInterval(() => {
    update(ref(db, "onlineUsers/" + currentUser), { time: Date.now() });
}, 30000); // refresh timestamp every 30s

/* ========== EXTRA HACKER ANIMATION ========== */
setInterval(() => {
    if (Math.random() < 0.1) {
        document.body.classList.toggle("glitch");
        setTimeout(() => document.body.classList.remove("glitch"), 500);
    }
}, 5000);
