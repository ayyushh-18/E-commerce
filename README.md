# 🛒 E-Commerce Website — Full-Stack Open Source Project

> A modern, responsive, and feature-rich full-stack e-commerce platform built using **Node.js, Express.js, MySQL, JWT, HTML, CSS, and Vanilla JavaScript**.

This project includes:
- User authentication system
- Product browsing & filtering
- Shopping cart & checkout flow
- Wishlist system
- Admin dashboard
- Order management
- Responsive modern UI
- Open source contribution support

---

# 🌐 Live Demo

🚀 Live Website:  
https://e-commerce-git-main-bhuvanshs-projects.vercel.app

---

# 📌 Features

## 👤 Authentication
- User Signup & Login
- JWT Authentication
- Refresh Token System
- Protected Routes
- Admin Role Support

## 🛍️ Shopping Features
- Product Listing
- Product Detail Page
- Search & Filtering
- Category Filtering
- Sorting System
- Recently Viewed Products
- Wishlist System
- Cart Drawer
- Full Cart Management

## 💳 Checkout & Orders
- Checkout Validation
- Order Placement
- Order History
- Address Management
- Shipping Calculation
- Tax Calculation

## ⚙️ Admin Features
- Add Products
- Edit Products
- Delete Products
- Dashboard Overview
- User Management
- Order Monitoring

## 🎨 UI/UX
- Fully Responsive Design
- Modern Product Cards
- Toast Notifications
- Ripple Effects
- Smooth Animations
- Mobile Navigation
- Lazy Loaded Images

## 🔒 Security Improvements
- Helmet Security Middleware
- Request Rate Limiting
- Input Validation
- JWT Authentication
- Secure Cart & Checkout Flow
- Backend Total Verification

---

# 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Node.js | Backend Runtime |
| Express.js | API Framework |
| MySQL | Database |
| JWT | Authentication |
| HTML5 | Frontend Structure |
| CSS3 | Styling |
| JavaScript | Frontend Logic |
| Vercel | Frontend Deployment |

---

# 📂 Updated Project Structure

```text
E-commerce/
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── hiero-bot.yml
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── services/
│   │   └── order.service.js
│   │
│   ├── utils/
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── schema.sql
│   └── server.js
│
├── frontend/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── footer.html
│   │   └── navbar.html
│   │
│   ├── scripts/
│   │   ├── about.js
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── cart-drawer.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── components.js
│   │   ├── config.js
│   │   ├── dashboard.js
│   │   ├── hero.js
│   │   ├── home-init.js
│   │   ├── order.js
│   │   ├── ordersHistory.js
│   │   ├── product-actions-home.js
│   │   ├── product-actions.js
│   │   ├── product-cards-home.js
│   │   ├── product-render.js
│   │   ├── product-reviews.js
│   │   ├── product-variants.js
│   │   ├── product.js
│   │   ├── profile.js
│   │   ├── recentlyViewed.js
│   │   ├── related-products.js
│   │   ├── script.js
│   │   ├── shop-controls.js
│   │   ├── shop.js
│   │   ├── toast.js
│   │   ├── ui.js
│   │   ├── utils.js
│   │   └── wishlist.js
│   │
│   ├── styles/
│   │   ├── admin.css
│   │   ├── auth.css
│   │   ├── base.css
│   │   ├── cart.css
│   │   ├── checkout.css
│   │   ├── components.css
│   │   ├── dashboard.css
│   │   ├── hero.css
│   │   ├── layout.css
│   │   ├── product-card.css
│   │   ├── product.css
│   │   ├── shop.css
│   │   └── style.css
│   │
│   ├── about.html
│   ├── admin.html
│   ├── blog.html
│   ├── cart.html
│   ├── checkout.html
│   ├── contact.html
│   ├── dashboard.html
│   ├── help.html
│   ├── index.html
│   ├── order.html
│   ├── privacy.html
│   ├── product.html
│   ├── profile.html
│   ├── shop.html
│   ├── signin.html
│   ├── signup.html
│   ├── success.html
│   ├── terms.html
│   └── wishlist.html
│
├── public/
│
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
---

## 🚀 Local Setup Guide

### 1️⃣ Clone Repository
```
git clone https://github.com/your-username/E-commerce.git
```

### 2️⃣ Open Project Folder

```
cd E-commerce
```

## ⚙️ Backend Setup
### 3️⃣ Open Backend Folder
```
cd backend
```

4️⃣ Install Dependencies
```
npm install
```

5️⃣ Create Environment File
Create a .env file inside the backend/ folder using .env.example:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://127.0.0.1:5500
```

6️⃣ Import Database Schema
```
mysql -u root -p ecommerce < schema.sql
```

7️⃣ Start Backend Server
```
npm run dev
```

Backend will run at:
```
http://localhost:5000
```

## 🌐 Frontend Setup
### 8️⃣ Open Frontend Folder
Open the ```frontend/``` folder in VS Code.

### 9️⃣ Run Frontend
Use Live Server extension or any local server.
Example using VS Code Live Server:
- Right click on index.html
- Click Open with Live Server

Frontend will run at:
```
http://127.0.0.1:5500
```

---

## 🎯 Learning Goals

This project demonstrates:

* Full-stack web development fundamentals
* REST API development using Node.js & Express
* MySQL database integration and query handling
* JWT-based authentication & authorization
* Frontend UI/UX design and responsive layouts
* DOM manipulation and dynamic rendering
* Cart, checkout, and order management systems
* Admin dashboard development
* Real-world e-commerce application architecture
* API integration between frontend and backend
* Open-source project structuring and collaboration
* Debugging, validation, and error handling

---

## 👨‍💻 Maintainers & Organization

This project is developed under the **[Anthropic Bots](https://github.com/AnthropicBots)** organization.

### 👑 Organization Owner
**[Mohit Yadav](https://github.com/mohityadav8)**

- Founder & Owner of Anthropic Bots
- Passionate about Full-Stack Development & Software Engineering
- Focused on building scalable real-world applications

---

### 🛠️ Project Maintainer
**[Bhuvansh Kataria](https://github.com/BHUVANSH855)**

- Active maintainer of this E-Commerce project
- Responsible for feature development, backend integration, bug fixes, and open-source improvements
- Contributing towards improving project structure, security, and overall user experience

---
💡 This project is actively maintained and improved through open-source collaboration.

Contributions, suggestions, and improvements are always welcome.

---

## 📜 License

This project is licensed under the MIT License and is free to use for learning and educational purposes.

---

⭐ If you like this project, consider giving it a star on GitHub and supporting the repository!
