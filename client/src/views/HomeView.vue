<template>
  <div class="home">
    <h2>Otel Arama</h2>

    <div class="search-form">
      <input v-model="searchCity" placeholder="Şehir giriniz" />
      <input type="date" v-model="dateFrom" />
      <input type="date" v-model="dateTo" />
      <input type="number" v-model="guestCount" min="1" placeholder="Kişi sayısı" />
      <button @click="searchHotels">Ara</button>
      <button @click="toggleMap">Haritada Göster</button>
    </div>

    <p v-if="userName" class="welcome">Hoşgeldin, {{ userName }}!</p>

    <div class="hotel-grid">
      <router-link
        v-for="hotel in hotels"
        :key="hotel.id"
        :to="`/hotels/${hotel.id}`"
        class="hotel-card"
      >
        <div v-if="hotel.discount_rate && hotel.discount_rate > 0" class="discount-label">
          -%{{ hotel.discount_rate }}
        </div>
        <img :src="hotel.photo_url || dummyPhoto" class="hotel-photo" />
        <div class="card-body">
          <h3>{{ hotel.name }}</h3>
          <p>{{ hotel.city }} | ⭐ {{ hotel.rating }}</p>

          <p v-if="hotel.discount_rate && isLoggedIn">
            <s>{{ hotel.price }}₺</s> →
            <strong>{{ calculateDiscountedPrice(hotel.discount_rate, hotel.price) }}₺</strong>
          </p>
          <p v-else-if="isLoggedIn">
            <s>{{ hotel.price }}₺</s> →
            <strong>{{ calculateDiscountedPrice(10, hotel.price) }}₺</strong>
          </p>
          <p v-else>
            {{ hotel.price }}₺ <span class="non-member">(Üye fiyatı için giriş yapın)</span>
          </p>
        </div>
      </router-link>
    </div>

    <div id="map" v-if="showMap"></div>
  </div>
</template>

<script>
import axios from 'axios'
import L from 'leaflet'

export default {
  data() {
    return {
      hotels: [],
      isLoggedIn: false,
      userName: null,
      searchCity: '',
      dateFrom: '',
      dateTo: '',
      guestCount: '',
      showMap: false,
      mapInstance: null,
      dummyPhoto: 'https://picsum.photos/400/200?random=1'
    }
  },
  mounted() {
    this.fetchAllHotels()
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        this.userName = payload.username
        this.isLoggedIn = true
      } catch {
        this.isLoggedIn = false
      }
    }
  },
  methods: {
    async fetchAllHotels() {
      const res = await axios.get('http://localhost:3000/hotels')
      this.hotels = res.data
    },
    async searchHotels() {
      const params = {
        city: this.searchCity,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        guests: this.guestCount
      }
      const res = await axios.get('http://localhost:3000/hotels', { params })
      this.hotels = res.data
    },
    calculateDiscountedPrice(rate, price) {
      return Math.floor(price * (1 - rate / 100))
    },
    toggleMap() {
      this.showMap = !this.showMap
      this.$nextTick(() => {
        if (this.showMap) this.initMap()
      })
    },
    initMap() {
      if (this.mapInstance) this.mapInstance.remove()
      const center = this.hotels.length > 0
        ? [this.hotels[0].latitude, this.hotels[0].longitude]
        : [39.0, 35.0]
      this.mapInstance = L.map('map').setView(center, 6)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.mapInstance)
      this.hotels.forEach(hotel => {
        if (hotel.latitude && hotel.longitude) {
          L.marker([hotel.latitude, hotel.longitude])
            .addTo(this.mapInstance)
            .bindPopup(`<strong>${hotel.name}</strong><br/>${hotel.price}₺`)
        }
      })
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}
.search-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.welcome {
  font-size: 18px;
  margin-bottom: 20px;
}
.hotel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.hotel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: 0.2s;
}
.hotel-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.hotel-photo {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.card-body {
  padding: 12px;
}
.discount-label {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: red;
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
  z-index: 1;
}
.non-member {
  color: red;
  font-size: 14px;
}
#map {
  height: 500px;
  margin-top: 20px;
}
</style>
