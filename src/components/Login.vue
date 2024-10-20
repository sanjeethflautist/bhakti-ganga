<template>
    <div class="login-container">
      <h1>Admin Login</h1>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input v-model="username" id="username" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" v-model="password" id="password" class="form-control" required />
        </div>
        <button type="submit" class="button">Login</button>
      </form>
    </div>
  </template>
  <script>
  import { loginUser } from '../supabaseService';
  
  export default {
    name: 'UserLogin',
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await loginUser(this.username, this.password);
          localStorage.setItem('loggedIn', true);
          localStorage.setItem('accessToken', response.access_token);
          this.$router.push('/admin');
        } catch (error) {
          console.error('Login failed:', error);
          alert('Login failed. Please check your credentials and try again.');
        }
      }
    }
  };
  </script>
  
  <style>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>