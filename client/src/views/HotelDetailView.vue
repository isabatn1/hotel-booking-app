<template>
  <div class="hotel-detail">
    <img :src="photoUrl" alt="Otel Fotoğrafı" class="hotel-image" />

    <h2>{{ hotel.name }}</h2>
    <p class="location">{{ hotel.city }}, {{ hotel.country }}</p>

    <div class="info-box">
      <div class="rating-box">
        ⭐ {{ hotel.rating }} / 5
        <span>({{ hotel.comment_count }} yorum)</span>
      </div>

      <div class="price-box">
        <template v-if="isLoggedIn">
          <s>{{ hotel.price }}₺</s> →
          <strong>{{ calculateDiscountedPrice(hotel) }}₺</strong>
          <span v-if="hotel.discount_rate" class="discount-tag">(%{{ hotel.discount_rate }} indirim)</span>
        </template>
        <template v-else>
          {{ hotel.price }}₺
          <span class="non-member"> (Üye fiyatı için giriş yapın)</span>
        </template>
      </div>
    </div>

    <h3>Popüler Özellikler</h3>
    <div class="features">
      <span v-for="(f, i) in features" :key="i" class="feature">✔️ {{ f }}</span>
    </div>

    <h3>Servis Puanları</h3>
    <div class="ratings">
      <div v-for="(value, key) in serviceRatings" :key="key" class="bar">
        <label>{{ key }}</label>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: value * 10 + '%' }">
            {{ value }}/10
          </div>
        </div>
      </div>
    </div>

    <h3>Yorumlar</h3>
    <div class="comments">
      <div v-for="(c, i) in comments" :key="i" class="comment">
        <p><strong>{{ c.user }}</strong> - {{ c.date }}</p>
        <p>{{ c.text }}</p>
      </div>
    </div>

    <h3>Otel Konumu</h3>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import axios from 'axios'
import L from 'leaflet'

export default {
  data() {
    return {
      hotel: {},
      isLoggedIn: false,
      photoUrl: "https://picsum.photos/1000/400?random=2",
      features: [
        "Ücretsiz Wi-Fi",
        "Açık büfe kahvaltı",
        "Klima",
        "Spa merkezi",
        "Otopark"
      ],
      serviceRatingsMap: {
        1: { Temizlik: 9.6, "Personel ve servis": 9.4, "İmkan": 9.1 },
        2: { Temizlik: 8.8, "Personel ve servis": 9.0, "İmkan": 8.5 },
        3: { Temizlik: 9.2, "Personel ve servis": 9.6, "İmkan": 9.3 },
        4: { Temizlik: 9.0, "Personel ve servis": 9.1, "İmkan": 9.0 },
        5: { Temizlik: 8.7, "Personel ve servis": 8.5, "İmkan": 8.0 },
        6: { Temizlik: 9.9, "Personel ve servis": 9.8, "İmkan": 9.7 },
        7: { Temizlik: 8.5, "Personel ve servis": 8.3, "İmkan": 8.2 }
      },
      commentsMap: {
        1: [{ user: "Simge", date: "Haziran 2025", text: "Deniz manzarası çok güzeldi." }],
        2: [{ user: "Ali", date: "Haziran 2025", text: "Kahvaltı harikaydı, tekrar gelirim." }],
        3: [{ user: "Melike", date: "Mayıs 2025", text: "Spa merkezi muazzam!" }],
        4: [{ user: "Zeynep", date: "Temmuz 2025", text: "Ailecek çok memnun kaldık." }],
        5: [{ user: "Kerem", date: "Nisan 2025", text: "Odalar temizdi ama biraz küçüktü." }],
        6: [{ user: "Derya", date: "Mart 2025", text: "Otopark sıkıntısı yaşamadık, süper." }],
        7: [{ user: "Özgür", date: "Haziran 2025", text: "Konumu çok merkezi." }]
      },
      serviceRatings: {},
      comments: []
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/hotels`)
    this.hotel = res.data.find(h => h.id == id)

    const token = localStorage.getItem('token')
    if (token) {
      try {
        JSON.parse(atob(token.split('.')[1]))
        this.isLoggedIn = true
      } catch {
        this.isLoggedIn = false
      }
    }

    this.serviceRatings = this.serviceRatingsMap[id] || {}
    this.comments = this.commentsMap[id] || []

    this.initMap()
  },
  methods: {
    calculateDiscountedPrice(hotel) {
      const rate = hotel.discount_rate || 10
      return Math.floor(hotel.price * (1 - rate / 100))
    },
    initMap() {
      if (!this.hotel.latitude || !this.hotel.longitude) return
      const map = L.map('map').setView([this.hotel.latitude, this.hotel.longitude], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map)
      L.marker([this.hotel.latitude, this.hotel.longitude])
        .addTo(map)
        .bindPopup(this.hotel.name)
    }
  }
}
</script>

<style scoped>
.hotel-detail {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}
.hotel-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 20px;
}
.location {
  color: #555;
  font-style: italic;
}
.info-box {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}
.rating-box span {
  font-size: 14px;
  margin-left: 8px;
}
.price-box {
  font-size: 18px;
}
.discount-tag {
  color: green;
  font-size: 14px;
  margin-left: 10px;
}
.non-member {
  color: red;
  font-size: 14px;
}
.features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.feature {
  background: #f0f0f0;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 14px;
}
.ratings {
  margin-bottom: 30px;
}
.bar {
  margin-bottom: 10px;
}
.bar-track {
  width: 100%;
  background: #ddd;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}
.bar-fill {
  background: #3b82f6;
  height: 100%;
  color: white;
  padding-left: 8px;
}
.comments {
  margin-bottom: 30px;
}
.comment {
  background: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-left: 3px solid #3b82f6;
}
.map {
  height: 400px;
  border-radius: 10px;
  margin-top: 15px;
}
</style>
