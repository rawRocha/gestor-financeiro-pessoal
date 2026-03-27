import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function salvarDespesa(despesa) {
  const user = auth.currentUser;

  if (!user) {
    alert("Usuário não autenticado");
    return;
  }

  try {
    await addDoc(collection(db, "usuarios", user.uid, "despesas"), {
      ...despesa,
      createdAt: serverTimestamp(),
    });

    console.log("Despesa salva com sucesso");
    carregarDespesas();
  } catch (error) {
    console.error("Erro ao salvar despesa:", error);
  }
}

export async function carregarDespesas() {
  const user = auth.currentUser;

  if (!user) return;

  try {
    const ref = collection(db, "usuarios", user.uid, "despesas");

    const snapshot = await getDocs(ref);

    renderizarDespesas(snapshot);
  } catch (error) {
    console.error("Erro ao carregar despesas:", error);
  }
}

function renderizarDespesas(snapshot) {
  const lista = document.getElementById("listaDespesas");
  const totalDespesas = document.getElementById("totalDespesas");

  let total = 0;

  // remove tudo menos o cabeçalho
  lista.querySelectorAll(".despesa-item").forEach((el) => el.remove());

  snapshot.forEach((doc) => {
    const despesa = doc.data();

    total += Number(despesa.valor);

    const li = document.createElement("li");
    li.classList.add("list-group-item", "border-0", "despesa-item");

    li.innerHTML = `
      <div class="row align-items-center flex-nowrap" style="min-width: 700px">

        <div class="col-4">${despesa.descricao}</div>

        <div class="col-3">${despesa.responsavel}</div>

        <div class="col-2">R$ ${Number(despesa.valor).toFixed(2)}</div>

        <div class="col-3 text-end">
          <div class="d-flex justify-content-end flex-nowrap overflow-auto">

            <button class="btn btn-sm me-2">
              <img src="img/edit_icon.svg" width="20">
            </button>

            <button class="btn btn-sm me-2">
              <img src="img/delete_icon.svg" width="20">
            </button>

            <button class="btn btn-sm">
              <img src="img/check_icon.svg" width="20">
            </button>

          </div>
        </div>

      </div>
    `;

    lista.appendChild(li);
  });

  totalDespesas.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
