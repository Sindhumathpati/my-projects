// Import the functions you need from the SDKs you need
 const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push, onChildAdded } = require('firebase/database');


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx0zxrKL7EDa51OuYEngo-NTKHZBGC7ig",
  authDomain: "cloud-based-chat-application.firebaseapp.com",
  databaseURL: "https://cloud-based-chat-application-default-rtdb.firebaseio.com",
  projectId: "cloud-based-chat-application",
  storageBucket: "cloud-based-chat-application.appspot.com",
  messagingSenderId: "825731921778",
  appId: "1:825731921778:web:ced09625bd444886238feb",
  measurementId: "G-LWRE7SC244"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'messages');

// Elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Send message
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        const newMessageRef = push(messagesRef);
        set(newMessageRef, {
            message: message,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
});

// Receive messages
onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val().message;
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to latest message
});
