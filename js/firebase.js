import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkzdzzAVcD3uKojY53UpJ0OTWogxc-zCM",
  authDomain: "minhas-financas-ed510.firebaseapp.com",
  projectId: "minhas-financas-ed510",
  storageBucket: "minhas-financas-ed510.firebasestorage.app",
  messagingSenderId: "853753246412",
  appId: "1:853753246412:web:fe88fdd94598698de14869",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
