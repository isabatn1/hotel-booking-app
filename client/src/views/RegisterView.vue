<template>
  <div class="form-container">
    <h2>Kayıt Ol</h2>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="Kullanıcı Adı" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Şifre" required />
      <input type="text" v-model="country" placeholder="Ülke" />
      <input type="text" v-model="city" placeholder="Şehir" />
      <input type="text" v-model="photo_url" placeholder="Fotoğraf URL (opsiyonel)" />
      <button type="submit">Kayıt Ol</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      country: '',
      city: '',
      photo_url: '',
      message: ''
    }
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:3000/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          country: this.country,
          city: this.city,
          photo_url: this.photo_url
        })
        this.message = 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...'
        setTimeout(() => this.$router.push('/login'), 2000)
      } catch (err) {
        this.message = 'Kayıt başarısız: ' + (err.response?.data?.error || err.message)
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
form input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
form button {
  width: 100%;
  padding: 8px;
  font-weight: bold;
}
</style>
