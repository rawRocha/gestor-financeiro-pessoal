import { auth } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

export function loginGoogle() {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((e) => console.error("Erro login:", e));
}

export function logout() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}
