<template>
  <div id="app">
    <nav>
      <router-link to="/">Ana Sayfa</router-link> |
      <router-link to="/register">Kayıt Ol</router-link> |
      <router-link to="/login" v-if="!isLoggedIn">Giriş Yap</router-link>
      <span v-if="isLoggedIn">| <a href="#" @click.prevent="logout">Çıkış Yap</a></span>
    </nav>

    <hr />
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false
    }
  },
  created() {
    const token = localStorage.getItem('token')
    this.isLoggedIn = !!token
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.isLoggedIn = false
      this.$router.push('/login')
    }
  }
}
</script>

<style>
nav {
  text-align: center;
  margin-top: 20px;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}
nav a.router-link-active {
  font-weight: bold;
}
</style>
