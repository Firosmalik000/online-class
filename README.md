# 🎓 Online Course Platform

A web-based online course platform built using **Laravel** and **Inertia.js**, with integrated **Midtrans payment gateway** for handling secure and automated transactions.

## 🚀 Features

- User registration and login
- Dashboard for users to view purchased and available courses
- Course listing and detail pages
- Admin panel for managing courses and transactions
- Payment integration using **Midtrans Snap API**
- Real-time payment status updates (success, pending, failed)
- Single Page Application (SPA) feel using Inertia.js + Vue.js

## 🛠️ Tech Stack

- **Backend:** Laravel 10+
- **Frontend:** Inertia.js, React.js
- **Database:** MySQL
- **Payment Gateway:** Midtrans Snap API (sandbox & production ready)
- **Authentication:** Laravel Breeze

## 📦 Installation

```bash
git clone https://github.com/Firosmalik000/online-class.git
cd onlne-class

# Install PHP dependencies
composer install

# Install JS dependencies
npm install && npm run dev

# Copy .env and set up
cp .env.example .env
php artisan key:generate

# Set your database & midtrans credentials in .env
php artisan migrate --seed
````

## ⚙️ Midtrans Integration

Make sure you have a Midtrans account. Set your keys in the `.env` file:

```env
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
```

> Switch `MIDTRANS_IS_PRODUCTION=true` on production.

## 🖥️ Screenshots

*(Optional: Add images here to show the UI, payment flow, etc.)*

## 🧑‍💻 Author

Developed by **\[Alif Fadhil Muhamad]** & **\[Firos Malik Abdillah]** — Junior Web Developer
📫 Reach us at: \[[alif70662@gmai.com](mailto:alif70662@gmai.com)] && \[[firosmalik44@gmail.com](mailto:firosmalik44@gmail.com)] 

## 📄 License

This project is licensed under the MIT License.
