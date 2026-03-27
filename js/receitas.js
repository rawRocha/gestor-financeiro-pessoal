import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function salvarReceita(receita) {
  const user = auth.currentUser;

  if (!user) {
    alert("Usuário não autenticado");
    return;
  }

  try {
    await addDoc(collection(db, "usuarios", user.uid, "receitas"), {
      ...receita,
      createdAt: serverTimestamp(),
    });

    console.log("Receita salva com sucesso");
  } catch (error) {
    console.error("Erro ao salvar receita:", error);
  }
}

export async function carregarReceitas() {
  const user = auth.currentUser;

  if (!user) return;

  let totalReceitas = 0;

  try {
    const querySnapshot = await getDocs(
      collection(db, "usuarios", user.uid, "receitas"),
    );

    querySnapshot.forEach((doc) => {
      const receita = doc.data();

      totalReceitas += receita.valor;
    });

    document.getElementById("valorReceitas").textContent =
      totalReceitas.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
  } catch (error) {
    console.error("Erro ao carregar receitas:", error);
  }
}
