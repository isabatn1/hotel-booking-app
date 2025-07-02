<template>
  <div class="login">
    <h2>Giriş Yap</h2>

    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Şifre" required />
      <button type="submit">Giriş Yap</button>
    </form>

    <p v-if="message">{{ message }}</p>

    <hr />

    <GoogleLogin @success="onGoogleSuccess" @error="onGoogleError" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      message: ''
    }
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.user.username)
        this.$router.push('/')
      } catch (err) {
        this.message = 'Giriş başarısız: ' + (err.response?.data?.error || err.message)
      }
    },
    async onGoogleSuccess(response) {
      try {
        const idToken = response.credential
        const res = await axios.post('http://localhost:3000/google-login', { idToken })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
        this.$router.push('/')
      } catch (err) {
        console.error('Google login backend hatası:', err)
        this.message = 'Google login başarısız.'
      }
    },
    onGoogleError(err) {
      console.error('Google login buton hatası:', err)
      this.message = 'Google login başarısız.'
    }
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
.login input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
</style>
