document.addEventListener("DOMContentLoaded", () => {
  const user = UserSession.get();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Elementos da UI
  const userNameElem = document.getElementById("user-name");
  const balanceValueElem = document.getElementById("balance-value");
  const toggleBalanceBtn = document.getElementById("toggle-balance");
  const logoutBtn = document.getElementById("logout-btn");
  const transferForm = document.getElementById("transfer-form");
  const createPixBtn = document.getElementById("create-pix-btn");
  const pixKeysList = document.getElementById("pix-keys-list");
  const historyList = document.getElementById("history-list");

  let isBalanceVisible = false;
  let currentBalance = 0;

  // Inicialização
  userNameElem.textContent = `${user.firstName} ${user.lastName}`;
  loadDashboardData();

  // Event Listeners
  toggleBalanceBtn.addEventListener("click", () => {
    isBalanceVisible = !isBalanceVisible;
    balanceValueElem.textContent = isBalanceVisible
      ? UI.formatCurrency(currentBalance)
      : "R$ ••••••";
    balanceValueElem.classList.toggle("hidden", !isBalanceVisible);
    toggleBalanceBtn.textContent = isBalanceVisible ? "Esconder" : "Mostrar";
  });

  logoutBtn.addEventListener("click", () => {
    UserSession.clear();
    window.location.href = "index.html";
  });

  transferForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const transferData = {
      idRemetente: user.id,
      chavePixDestinario: transferForm["pix-key-dest"].value,
      moneyAmount: parseFloat(transferForm.amount.value),
    };

    try {
      await api.post("/transferencia", transferData);
      UI.showToast("Transferência realizada com sucesso!");
      transferForm.reset();
      loadDashboardData();
    } catch (error) {
      console.error(error);
      UI.showToast(
        "Erro na transferência. Verifique o saldo e a chave.",
        "error",
      );
    }
  });

  createPixBtn.addEventListener("click", async () => {
    const type = document.getElementById("pix-type").value;
    try {
      await api.post("/pix", { id: user.id, tipo: type });
      UI.showToast("Chave Pix gerada com sucesso!");
      loadPixKeys();
    } catch (error) {
      console.error(error);
      UI.showToast("Erro ao gerar chave Pix.", "error");
    }
  });

  // Funções de carregamento
  async function loadDashboardData() {
    try {
      // Atualizar dados do usuário (saldo)
      const userRes = await api.get(`/users/${user.id}`);
      console.debug("user response:", userRes.data);
      const rawAmount = userRes.data?.moneyAmount ?? 0;
      const num = Number(rawAmount);
      currentBalance = Number.isFinite(num) ? num : 0;
      if (isBalanceVisible) {
        balanceValueElem.textContent = UI.formatCurrency(currentBalance);
      }

      loadPixKeys();
      loadHistory();
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    }
  }

  async function loadPixKeys() {
    try {
      const res = await api.get(`/pix/${user.id}`);
      console.debug("pix response:", res.data);
      // Normalize response to an array in case API returns an object or single item
      let keys = res.data;
      if (!Array.isArray(keys)) {
        if (keys && typeof keys === "object") {
          if (Array.isArray(keys.data)) keys = keys.data;
          else if (Array.isArray(keys.pix)) keys = keys.pix;
          else {
            // If it's an object with pix properties, convert to array of entries
            keys = Object.keys(keys).length ? [keys] : [];
          }
        } else {
          keys = [];
        }
      }

      pixKeysList.innerHTML = keys
        .map((key) => {
          const tipo = key.tipo || key.type || "—";
          const pix =
            key.pix ||
            key.chave ||
            key.value ||
            key.id ||
            (typeof key === "string" ? key : JSON.stringify(key));
          return `
                <li>
                    <span>${tipo}</span>
                    <strong>${pix}</strong>
                </li>
            `;
        })
        .join("");
    } catch (error) {
      console.error("Erro ao carregar chaves Pix", error);
    }
  }

  async function loadHistory() {
    try {
      const res = await api.get(`/transferencia/${user.id}`);
      historyList.innerHTML = res.data
        .map((t) => {
          const isOutcome = t.remetente.includes(user.firstName);
          return `
                    <tr>
                        <td>${isOutcome ? `Para: ${t.destinatario}` : `De: ${t.remetente}`}</td>
                        <td class="amount-negative">
                            ${isOutcome ? "-" : "+"} ${UI.formatCurrency(t.moneyAmount)}
                        </td>
                    </tr>
                `;
        })
        .join("");
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  }
});
