const API_BASE_URL = "http://localhost:8080"; // Altere conforme necessário

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para capturar erros do backend e mostrar a mensagem
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const data = error?.response?.data;
      const message = data?.message || error.message || "Erro inesperado";
      if (typeof UI !== "undefined" && UI && UI.showToast) {
        UI.showToast(message, "error");
      } else {
        alert(`ERRO: ${message}`);
      }
    } catch (e) {
      console.error("Erro no interceptor de resposta", e);
    }
    return Promise.reject(error);
  },
);

const UserSession = {
  save(userData) {
    localStorage.setItem("zeta_user", JSON.stringify(userData));
  },
  get() {
    const data = localStorage.getItem("zeta_user");
    return data ? JSON.parse(data) : null;
  },
  clear() {
    localStorage.removeItem("zeta_user");
  },
  isAuthenticated() {
    return !!this.get();
  },
};

// Feedback visual (IHC)
const UI = {
  showToast(message, type = "success", options = {}) {
    try {
      const containerId = "toast-container";
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
      }

      const existing = Array.from(container.children).find(
        (c) => c.innerText && c.innerText.includes(message),
      );
      if (existing) return;

      const toast = document.createElement("div");
      toast.className = `toast ${type === "error" ? "error" : "success"}`;
      toast.textContent = message;

      const closeBtn = document.createElement("button");
      closeBtn.className = "close-btn";
      closeBtn.innerText = "×";
      closeBtn.onclick = () => toast.remove();
      toast.appendChild(closeBtn);

      container.appendChild(toast);

      const duration = options.duration || 4000;
      setTimeout(() => {
        toast.remove();
      }, duration);
    } catch (e) {
      console.error("Erro ao mostrar toast", e);
      alert(message);
    }
  },
  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  },
};
