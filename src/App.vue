<template>
  <div class="app-container">
    <header class="bg-teal text-white p-2 header-footer">
      <div class="header-footer-content d-flex justify-content-between align-items-center">
        <h1>Bhakthi Ganga</h1>
        <nav>
          <button class="icon-button-app" @click="navigateToHome">
            <i class="fas fa-home"></i>
          </button>
          <button v-if="!isAdminPage" class="icon-button-app" @click="navigateToLogin">
            <i class="fas fa-bars"></i>
          </button>
          <button v-else class="icon-button-app" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </nav>
      </div>
    </header>
    <main class="container mt-4 flex-grow-1">
      <router-view />
    </main>
    <footer class="bg-dark-gray text-white p-2 header-footer">
      <div class="header-footer-content">
        <p>&copy; 2024 NadaVedaBrahma</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAdminPage() {
      return this.$route.path === '/admin';
    }
  },
  methods: {
    navigateToHome() {
      this.$router.push('/');
    },
    navigateToLogin() {
      console.log('Navigating to login');
      this.$router.push('/login').then(() => {
        console.log('Navigation to login successful');
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    },
    logout() {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('accessToken');
      this.$router.push('/login');
    }
  }
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
.header-footer-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-button-app {
  background: #008080; /* Teal background */
  border: none;
  cursor: pointer;
  color: white; /* White color for icons */
  font-size: 1.2em;
  margin-left: 20px;
  padding: 10px;
  border-radius: 40%;
}
.icon-button-app:hover {
  background: #006666; /* Darker teal background on hover */
  color: white; /* Keep icon color white on hover */
}
</style>