const API_BASE_URL = 'http://localhost:8080'; // Altere conforme necessário

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper para gerenciar o estado do usuário (já que não há Spring Security)
const UserSession = {
    save(userData) {
        localStorage.setItem('zeta_user', JSON.stringify(userData));
    },
    get() {
        const data = localStorage.getItem('zeta_user');
        return data ? JSON.parse(data) : null;
    },
    clear() {
        localStorage.removeItem('zeta_user');
    },
    isAuthenticated() {
        return !!this.get();
    }
};

// Feedback visual (IHC)
const UI = {
    showToast(message, type = 'success') {
        alert(`${type.toUpperCase()}: ${message}`);
    },
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
};
