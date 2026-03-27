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

let despesaEditandoId = null;

export async function salvarDespesa(despesa) {
  const user = auth.currentUser;

  if (!user) {
    alert("Usuário não autenticado");
    return;
  }

  try {
    if (despesaEditandoId) {
      await updateDoc(
        doc(db, "usuarios", user.uid, "despesas", despesaEditandoId),
        despesa,
      );

      despesaEditandoId = null;

      carregarDespesas();
    } else {
      await addDoc(collection(db, "usuarios", user.uid, "despesas"), {
        ...despesa,
        createdAt: serverTimestamp(),
      });
    }

    const modalElement = document.getElementById("modalDespesa");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    document.activeElement.blur();
    document.getElementById("formDespesa").reset();
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

  snapshot.forEach((docSnap) => {
    const despesa = docSnap.data();

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

      const confirmar = confirm("Deseja excluir está despesa?");
      if (!confirmar) return;

      try {
        await deleteDoc(doc(db, "usuarios", user.uid, "despesas", docSnap.id));

        carregarDespesas();
      } catch (error) {
        console.log("Erro ao deletar despesa: " + error);
      }
    });

    const btnEdit = li.querySelector(".btn-edit");

    btnEdit.addEventListener("click", () => {
      despesaEditandoId = docSnap.id;

      // ✅ preenche os inputs corretamente
      document.getElementById("descricaoDespesa").value = despesa.descricao;
      document.getElementById("responsavelDespesa").value = despesa.responsavel;
      document.getElementById("valorDespesa").value = despesa.valor;
      document.getElementById("vencimentoDespesa").value = despesa.vencimento;

      document.getElementById("totalParcelas").value =
        despesa.totalParcelas || "";
      document.getElementById("parcelaAtual").value =
        despesa.parcelaAtual || "";
      document.getElementById("categoriaDespesa").value =
        despesa.categoria || "";
      document.getElementById("statusDespesa").value = despesa.status || "";

      // ✅ marcar radio (recorrente)
      if (despesa.recorrente === true) {
        document.querySelector(
          'input[name="recorrenteDespesa"][value="true"]',
        ).checked = true;
      } else {
        document.querySelector(
          'input[name="recorrenteDespesa"][value="false"]',
        ).checked = true;
      }

      // ✅ abre modal
      const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalDespesa"),
      );

      modal.show();
    });

    lista.appendChild(li);
  });

  totalDespesas.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
