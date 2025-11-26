import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB0R_sX_3-iHTIdR-cV6XnBkK-dCi15ny0",
    authDomain: "project-ano.firebaseapp.com",
    databaseURL: "https://project-ano-default-rtdb.firebaseio.com/",
    projectId: "project-ano",
    storageBucket: "project-ano.firebasestorage.app",
    messagingSenderId: "871392286002",
    appId: "1:871392286002:web:614a92e162f4f8a42e332b",
    measurementId: "G-TECFSQTKB4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ELEMENTS
const loginPage = document.getElementById("loginPage");
const adminLoginPage = document.getElementById("adminLoginPage");
const chatPage = document.getElementById("chatPage");
const adminPanel = document.getElementById("adminPanel");

const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");

const adminLoginOpen = document.getElementById("adminLoginOpen");
const backToUserLogin = document.getElementById("backToUserLogin");

const adminUser = document.getElementById("adminUser");
const adminPass = document.getElementById("adminPass");
const adminLoginBtn = document.getElementById("adminLoginBtn");

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const logoutBtn = document.getElementById("logoutBtn");
const logoutAdminBtn = document.getElementById("logoutAdminBtn");

const banBtn = document.getElementById("banBtn");
const unbanBtn = document.getElementById("unbanBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");

const banUserInput = document.getElementById("banUserInput");
const unbanUserInput = document.getElementById("unbanUserInput");

let currentUser = null;

// USER LOGIN
loginBtn.onclick = () => {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!user || !pass) return alert("Enter username & password");

    get(ref(db, "banned/" + user)).then(s => {
        if (s.exists()) return alert("You are banned");

        currentUser = user;
        loginPage.classList.add("hidden");
        chatPage.classList.remove("hidden");
    });
};

// ADMIN LOGIN NAVIGATION
adminLoginOpen.onclick = () => {
    loginPage.classList.add("hidden");
    adminLoginPage.classList.remove("hidden");
};

backToUserLogin.onclick = () => {
    adminLoginPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
};

// ADMIN LOGIN
adminLoginBtn.onclick = () => {
    if (adminUser.value === "zerohex" && adminPass.value === "badatom2556") {
        adminLoginPage.classList.add("hidden");
        adminPanel.classList.remove("hidden");
    } else {
        alert("Wrong Admin Login");
    }
};

// SEND MESSAGE
sendBtn.onclick = () => {
    const msg = messageInput.value.trim();
    if (!msg) return;

    push(ref(db, "messages/"), {
        user: currentUser,
        text: msg,
        time: Date.now()
    });

    messageInput.value = "";
};

// LOAD MESSAGES LIVE
onValue(ref(db, "messages/"), snap => {
    messagesDiv.innerHTML = "";
    if (!snap.exists()) return;

    snap.forEach(c => {
        const m = c.val();
        const div = document.createElement("div");
        div.classList.add("message");
        div.innerHTML = `<b>${m.user}</b>: ${m.text}`;
        messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// BAN USER
banBtn.onclick = () => {
    const user = banUserInput.value.trim();
    if (!user) return;
    set(ref(db, "banned/" + user), true);
    alert("User Banned");
};

// UNBAN USER
unbanBtn.onclick = () => {
    const user = unbanUserInput.value.trim();
    if (!user) return;
    remove(ref(db, "banned/" + user));
    alert("User Unbanned");
};

// DELETE ALL MESSAGES
deleteAllBtn.onclick = () => {
    remove(ref(db, "messages/"));
    alert("All Messages Deleted");
};

// LOGOUT USER
logoutBtn.onclick = () => {
    currentUser = null;
    chatPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
};

// LOGOUT ADMIN
logoutAdminBtn.onclick = () => {
    adminPanel.classList.add("hidden");
    loginPage.classList.remove("hidden");
};
