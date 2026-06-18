document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Redirecionar se já estiver logado
  if (
    UserSession.isAuthenticated() &&
    (window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/")
  ) {
    window.location.href = "dashboard.html";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        // Como não há endpoint de login, buscamos o usuário pelo e-mail
        // Nota: Em um sistema real, isso seria um POST /login
        const response = await api.get(`/users/email/${email}`); // Simulação baseada no findByEmail
        const user = response.data;

        if (user && user.id) {
          UserSession.save(user);
          UI.showToast("Login realizado com sucesso!");
          window.location.href = "dashboard.html";
        } else {
          UI.showToast("Usuário não encontrado.", "error");
        }
      } catch (error) {
        console.error(error);
        UI.showToast(
          "Erro ao realizar login. Verifique suas credenciais.",
          "error",
        );
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userData = {
        firstName: registerForm.firstName.value,
        lastName: registerForm.lastName.value,
        email: registerForm.email.value,
        cpf: registerForm.cpf.value,
        password: registerForm.password.value,
      };

      try {
        await api.post("/users", userData);
        UI.showToast("Cadastro realizado com sucesso! Faça login.");
        window.location.href = "index.html";
      } catch (error) {
        console.error(error);
        UI.showToast("Erro ao realizar cadastro.", "error");
      }
    });
  }
});
