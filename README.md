# 🛒 DCC Corner - Premium E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

DCC Corner is a modern, high-performance e-commerce platform built with **Next.js 15+**, **React 19**, and **Tailwind CSS v4**. It features a beautiful, highly responsive storefront and a powerful, comprehensive admin dashboard for full control over your business operations.

## ✨ Key Features

### 🛍️ Storefront
- **Modern Premium Design:** A highly polished, dynamic, and fully responsive user interface featuring glassmorphism, fluid animations, and a curated color palette.
- **Product Catalog:** Advanced product grids, sorting, and category-based filtering.
- **Popup Offers & Hot Deals:** Global popup banners for site-wide announcements and a dedicated system for highlighting discounted products.
- **Shopping Cart & Checkout:** Seamless, interactive cart drawer and a streamlined multi-step checkout process.
- **Order Tracking:** Real-time order status lookup for customers.
- **Dynamic Banners & Sliders:** Eye-catching Hero and Category sliders to highlight the best collections.

### ⚙️ Admin Dashboard
- **Centralized Command Center:** Manage the entire store from a sleek, intuitive, and secure admin panel (`/dcc-hq`).
- **Product & Category Management:** Create, edit, and organize products and categories with image uploads.
- **Order Management & Invoicing:** Track all orders, update statuses, and generate/print professional invoices.
- **Dynamic Offer System:** Set discounts easily with an auto-calculating offer management tool.
- **Banner Configuration:** Upload and manage hero carousel banners directly from the dashboard.
- **Cloudinary Integration:** Built-in seamless image uploading and optimization.

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (v4) & Shadcn UI Components
- **Database:** MongoDB via Mongoose
- **Icons:** Lucide React
- **State Management:** Zustand (Client-side)
- **Image Storage:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens)
- **Animations:** Tailwind Animate & Custom Micro-interactions

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EasinArafatDeveloper/dcc-corner-com.git
   cd dcc-corner-com
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   JWT_SECRET=your_jwt_secret

   # Cloudinary Image Upload
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📜 License

This project is licensed under the MIT License.
