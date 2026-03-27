import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

let receitaEditandoId = null;

export async function salvarReceita(receita) {
  const user = auth.currentUser;

  if (!user) {
    alert("Usuário não autenticado");
    return;
  }

  try {
    if (receitaEditandoId) {
      await updateDoc(
        doc(db, "usuarios", user.uid, "receitas", receitaEditandoId),
        receita,
      );

      console.log("Receita atualizada!");
      receitaEditandoId = null;

      carregarReceitas();
    } else {
      await addDoc(collection(db, "usuarios", user.uid, "receitas"), {
        ...receita,
        createdAt: serverTimestamp(),
      });
    }

    const modalElement = document.getElementById("modalReceita");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    document.activeElement.blur();
    document.getElementById("formReceita").reset();

    carregarReceitas();
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

    renderizarReceitas(querySnapshot);
  } catch (error) {
    console.error("Erro ao carregar receitas:", error);
  }
}

function renderizarReceitas(snapshot) {
  const lista = document.getElementById("listaReceitas");

  // remove tudo menos o cabeçalho
  lista.querySelectorAll(".receita-item").forEach((el) => el.remove());

  snapshot.forEach((docSnap) => {
    const receita = docSnap.data();

    const li = document.createElement("li");
    li.classList.add("list-group-item", "border-0", "receita-item");

    li.innerHTML = `
      <div class="row align-items-center flex-nowrap" style="min-width: 700px">

        <div class="col-4">${receita.descricao}</div>

        <div class="col-2">R$ ${Number(receita.valor).toFixed(2)}</div>

        <div class="col-3 text-end">
          <div class="d-flex justify-content-end flex-nowrap overflow-auto">

            <button class="btn btn-sm me-2 btn-edit">
              <img src="img/edit_icon.svg" width="20">
            </button>

            <button class="btn btn-sm me-2 btn-delete">
              <img src="img/delete_icon.svg" width="20">
            </button>

            <button class="btn btn-sm">
              <img src="img/check_icon.svg" width="20">
            </button>

          </div>
        </div>

      </div>
    `;

    const btnDelete = li.querySelector(".btn-delete");

    btnDelete.addEventListener("click", async () => {
      const user = auth.currentUser;

      if (!user) return;

      const confirmar = confirm("Deseja excluir essa receita?");
      if (!confirmar) return;

      try {
        await deleteDoc(doc(db, "usuarios", user.uid, "receitas", docSnap.id));

        carregarReceitas();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    });

    const btnEdit = li.querySelector(".btn-edit");

    btnEdit.addEventListener("click", () => {
      receitaEditandoId = docSnap.id;

      // preenche o formulário
      document.getElementById("descricaoReceita").value = receita.descricao;
      document.getElementById("valorReceita").value = receita.valor;
      document.getElementById("mesReceita").value = receita.mes;

      // abre o modal
      const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalReceita"),
      );

      modal.show();
    });

    lista.appendChild(li);
  });
}
