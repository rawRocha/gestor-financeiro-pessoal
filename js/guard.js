import { auth } from "./firebase.js";
import { carregarReceitas } from "./receitas.js";
import { carregarDespesas } from "./despesas.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  carregarReceitas();
  carregarDespesas();
});
