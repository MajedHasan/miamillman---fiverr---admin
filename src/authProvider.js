const authProvider = {
  login: async ({ username, password }) => {
    // const response = await fetch("http://localhost:5001/api/auth/login", {
    const response = await fetch("http://api.syriasouq.com/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    if (!response.ok || !json.jwt) {
      throw new Error(json.message || "Login failed");
    }

    // ✅ Store token & user data in localStorage
    localStorage.setItem(
      "SyriaSouq-auth",
      JSON.stringify({ token: json.jwt, user: json })
    );
  },

  logout: () => {
    localStorage.removeItem("SyriaSouq-auth");
    return Promise.resolve();
  },

  checkAuth: () => {
    const auth = JSON.parse(localStorage.getItem("SyriaSouq-auth"));
    if (auth && auth.user.role === "admin") {
      return Promise.resolve();
    } else {
      return Promise.reject(); // Reject if the user is not an admin
    }
  },

  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("SyriaSouq-auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    const auth = JSON.parse(localStorage.getItem("SyriaSouq-auth"));
    return auth ? auth.user.role : "guest";
  },
};

export default authProvider;
