/* ============================================================
   🔥 FIREBASE INITIALIZATION (your config inserted)
============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onChildAdded, remove, update, get } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ============================================================
   🟢 GLOBALS
============================================================ */

let currentUser = localStorage.getItem("chatUser") || null;

const bannedRef = ref(db, "bannedUsers/");
const messagesRef = ref(db, "messages/");

/* ============================================================
   🎭 PAGE IDENTIFIER
============================================================ */

const isLoginPage = document.getElementById("loginBtn") !== null;
const isChatPage  = document.getElementById("sendBtn") !== null;
const isAdminPage = document.getElementById("adminLoginBtn") !== null;

/* ============================================================
   🔐 USER LOGIN LOGIC (index.html)
============================================================ */

if (isLoginPage) {
    document.getElementById("loginBtn").onclick = async () => {
        
        let user = document.getElementById("usernameInput").value.trim();
        let pass = document.getElementById("passwordInput").value.trim();

        if (!user || !pass) {
            alert("Enter username & password!");
            return;
        }

        // CHECK BANNED USERS
        const banData = await get(bannedRef);
        if (banData.exists()) {
            const banned = banData.val();
            if (banned[user]) {
                alert("You are BANNED by Admin.");
                return;
            }
        }

        localStorage.setItem("chatUser", user);

        window.location = "chat.html";
    };
}

/* ============================================================
   💬 CHAT PAGE (chat.html)
============================================================ */

if (isChatPage) {

    // not logged?
    if (!currentUser) window.location = "index.html";

    const msgBox = document.getElementById("messages");
    const sendBtn = document.getElementById("sendBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const input = document.getElementById("messageInput");

    // SEND MESSAGE
    sendBtn.onclick = () => {
        let txt = input.value.trim();
        if (!txt) return;

        push(messagesRef, {
            sender: currentUser,
            text: txt,
            time: Date.now()
        });

        input.value = "";
    };

    // DISPLAY MESSAGES
    onChildAdded(messagesRef, snap => {
        const m = snap.val();

        let div = document.createElement("div");
        div.className = "message hackerFade";

        div.innerHTML = `
            <b>${m.sender}:</b> ${m.text}
        `;

        msgBox.appendChild(div);
        msgBox.scrollTop = msgBox.scrollHeight;
    });

    // LOGOUT
    logoutBtn.onclick = () => {
        localStorage.removeItem("chatUser");
        window.location = "index.html";
    };
}

/* ============================================================
   🔐 ADMIN LOGIN + PANEL (admin.html)
============================================================ */

if (isAdminPage) {
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const adminPanel = document.getElementById("adminPanel");
    const banUserBtn = document.getElementById("banUserBtn");
    const unbanUserBtn = document.getElementById("unbanUserBtn");
    const deleteMsgBtn = document.getElementById("deleteMsgBtn");
    const deleteAllBtn = document.getElementById("deleteAllBtn");
    const broadcastBtn = document.getElementById("broadcastBtn");

    // ADMIN LOGIN
    adminLoginBtn.onclick = () => {
        let user = document.getElementById("adminUser").value.trim();
        let pass = document.getElementById("adminPass").value.trim();

        if (user === "zerohex" && pass === "badatom2556") {
            document.getElementById("adminLogin").classList.add("hidden");
            adminPanel.classList.remove("hidden");
        } else {
            alert("Wrong admin credentials.");
        }
    };

    /* ========== ADMIN FEATURES ========== */

    // BAN USER
    banUserBtn.onclick = async () => {
        let user = prompt("Enter username to BAN:");
        if (!user) return;

        await set(ref(db, "bannedUsers/" + user), true);
        alert(user + " banned!");
    };

    // UNBAN USER
    unbanUserBtn.onclick = async () => {
        let user = prompt("Enter username to UNBAN:");
        if (!user) return;

        await remove(ref(db, "bannedUsers/" + user));
        alert(user + " unbanned!");
    };

    // DELETE SPECIFIC MESSAGE
    deleteMsgBtn.onclick = async () => {
        let id = prompt("Enter message ID to delete:");
        if (!id) return;

        await remove(ref(db, "messages/" + id));
        alert("Message deleted!");
    };

    // DELETE ALL MESSAGES
    deleteAllBtn.onclick = async () => {
        if (confirm("Delete ALL messages?")) {
            await remove(messagesRef);
            alert("All messages deleted!");
        }
    };

    // BROADCAST
    broadcastBtn.onclick = () => {
        let msg = prompt("Enter broadcast message:");
        if (!msg) return;

        push(messagesRef, {
            sender: "ADMIN",
            text: "[BROADCAST] " + msg,
            time: Date.now()
        });

        alert("Broadcast sent!");
    };
}

/* ============================================================
   🌐 HACKER EFFECTS (animations)
============================================================ */

setInterval(() => {
    document.body.style.filter = "hue-rotate(" + (Math.random() * 10) + "deg)";
}, 200);
