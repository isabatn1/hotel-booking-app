# 🏨 Hotel Booking Web Application

This is a full-stack hotel booking application that allows users to explore hotels, view detailed information, register/login, and get discounted prices.

🔗 **Live Website:** [hotel-booking-app-client.onrender.com](https://hotel-booking-app-client.onrender.com)  
🎥 **Video Demo:** [Watch the walkthrough](https://drive.google.com/file/d/1pookBVyklVpppOTiFPDdtxt2mV9frDmx/view?usp=sharing)

## 🚀 Features

- 🌍 **Search Hotels** by city, hotel name, date, and guest count.
- 📋 **Hotel Listings**: Sorted by rating (descending), shows picture, name, city, rating, and price.
- 💬 **Hotel Detail Page**:
  - Popular amenities
  - Service ratings (cleanliness, staff, facilities)
  - Static user comment
  - Map showing the hotel location using **Leaflet.js**
- 🔐 **Authentication**:
  - Register with email, password, location and optional photo
  - Login via email/password or **Google OAuth**
- 💸 **Discount Logic**:
  - Members get 10% off
  - Some hotels offer additional discounts
  - Strikethrough for original price and highlight for new price
- 🗺️ **View Hotels on Map**
  - Hotels shown on interactive map with popup info

## 🧪 Test Credentials

- Email: `test@example.com`  
- Password: `Test123!`

## ⚙️ Technologies Used

| Layer       | Technologies                          |
|-------------|----------------------------------------|
| Frontend    | Vue 3, Vue Router, Axios, Leaflet      |
| Backend     | Node.js, Express.js                    |
| Database    | PostgreSQL (hosted on Render.com)      |
| Auth        | JWT (for email/password), Google OAuth |

## 🗃️ Project Structure

