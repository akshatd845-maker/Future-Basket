# Future Basket 🛒
> **Whenever, Wherever** — A secure, production-ready MERN stack ecommerce platform integrated with JWT authentication and Razorpay test mode payment gateway.

---

## 📋 Project Overview
**Future Basket** is a modern, high-performance, and responsive MERN (MongoDB, Express, React, Node.js) ecommerce application. Built to support robust online shopping, the system features a professional visual design system, secure token-based session management, real-time cart updates, order tracking pipelines, and secure payment processing with Razorpay.

The repository is built with a decoupled structure separating the frontend client (Vite + React) and backend server (Node + Express), following secure coding practices including sanitization of committed repositories and case-insensitive API authorizations.

---

## ✨ Key Features
- 🔐 **Secure JWT Session Management**: Multi-token flow with HttpOnly cookie credentials and `accessToken` local persistency. Automated transparent token refresh on token expiration via Axios interceptors.
- 💳 **Razorpay Payment Gateway**: Seamless online transaction flow with server-side SHA256 HMAC cryptographic signature validation.
- 📦 **Order Timeline Tracking**: Multi-state order progress tracking (`Pending` ──> `Processing` ──> `Delivered` ──> `Cancelled`) with custom progress visualization.
- 🛒 **Dynamic Cart & Stock Badge Management**: Centralized cart context provider checking real-time stock thresholds.
- 🖥️ **Full-Featured Admin Panel**: Fully protected administrative dashboards to manage inventory, update order states, and assign roles.
- 🎨 **Harmonious Visual Theme**: Curated Slate tones, vibrant blue call-to-actions, and Outfit typography to deliver a premium shopping experience.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (ES Module structure)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: Vanilla CSS with unified HSL color tokens and Outfit font
- **HTTP Client**: [Axios v1.16](https://axios-http.com/) (Interceptors configured with `AxiosHeaders`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js v5](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose v8](https://mongoosejs.com/)
- **Authentication**: JWT (`jsonwebtoken`) + cookies (`cookie-parser`) + Hashing (`bcryptjs`)
- **Payment SDK**: [Razorpay official SDK](https://razorpay.com/)

---

## 🏗️ Architecture Overview

```
                      +-------------------+
                      |   React Client    |
                      |  (Vite on :5173)  |
                      +---------+---------+
                                |
                   (Axios + Credentials + JWT)
                                |
                                v
                      +---------+---------+
                      |   Express API     |
                      |  (Node on :5000)  |
                      +----+---------+----+
                           |         |
      (Mongoose / schemas) |         | (HMAC Verification)
                           v         v
                    +------+---+ +---+------+
                    | MongoDB  | | Razorpay |
                    |  Atlas   | | API/SDK |
                    +----------+ +----------+
```

---

## 📸 Screenshots Section
*Visual previews of the application states:*

- **Home Storefront Banner**: `[Insert Placeholder: /screenshots/home.png]`
- **Product Details Panel**: `[Insert Placeholder: /screenshots/product_detail.png]`
- **Vibrant Cart Review**: `[Insert Placeholder: /screenshots/cart.png]`
- **Razorpay Secure Checkout Modal**: `[Insert Placeholder: /screenshots/payment_modal.png]`
- **Interactive Tracking Timeline**: `[Insert Placeholder: /screenshots/order_timeline.png]`

---

## 🚀 Installation & Environment Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas database cluster URI
- Razorpay test keys

### 📦 Environment Variables Configuration

To run this application locally, you must set up the environment files in both the client and server directories. 

#### Server Configuration
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
MONGO_URI_FALLBACK=your_fallback_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Optional Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Client Configuration
Create `client/.env` based on `client/.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📂 Project Structure

```
ecommerce-store/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets (favicons, images)
│   ├── src/
│   │   ├── components/         # Reusable markup (Navbar, Footer, ProtectedRoute)
│   │   ├── context/            # AuthContext, CartProvider, CartUtils
│   │   ├── pages/              # Cart, Checkout, Home, Login, Orders, OrderDetails, PlaceOrder, ProductDetails, Register
│   │   └── services/           # Axios API configuration (api.js)
│   ├── .gitignore              # Client specific git exclusions
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # DB connections, validation filters, Cloudinary config
│   ├── controllers/            # Auth, Admin, Order, Product, Payment controllers
│   ├── middleware/             # protect, admin, and error handlers
│   ├── models/                 # Mongoose schemas (User, Product, Order)
│   ├── routes/                 # Express API routes mapping
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Express application entrypoint
│
└── .gitignore                  # Global Git exclusions (ignoring local .env configurations)
```

---

## 🔌 API Overview

### Authentication APIs
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Verify password and set cookies + return token
- `POST /api/auth/logout` - Clear cookies and session tokens
- `GET /api/auth/me` - Retrieve current user details (Protected)
- `POST /api/auth/refresh` - Refresh access tokens using refresh token cookies

### Product APIs
- `GET /api/products` - List all products
- `GET /api/products/:id` - Fetch individual product details
- `POST /api/products` - Admin only creation of product cards

### Orders & Checkout APIs
- `POST /api/orders` - Place new order (Protected)
- `GET /api/orders/my` - Fetch client order history (Protected)
- `GET /api/orders/:id` - Inspect individual order timeline details (Protected)
- `PATCH /api/orders/:id/cancel` - Cancel order (Protected)

### Payment APIs
- `POST /api/payment/create-order` - Create transaction details in Razorpay (Protected)
- `POST /api/payment/verify` - Cryptographically verify payment signatures (Protected)

---

## 🔒 Security Implementations
1. **Repository Safety (No Committed Secrets)**:
   All environment-specific files (`.env`, `.env.*`) are ignored in Git configuration. diagnostic scripts leverage secure process environmental variables.
2. **Case-Insensitive Authorization Checks**:
   The backend protect middleware accepts both `Bearer` and `bearer` schemas safely, ensuring multi-client accessibility.
3. **AxiosHeaders Protection**:
   Configured Axios clients set dynamic headers utilizing bracket notation, avoiding property errors on retried operations.
4. **Dynamic CORS Control**:
   Allowed origins are resolved dynamically on development environments, avoiding cookie drop problems on port shifts.

---

## 🏃 Running Locally

### Step 1: Clone and install dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/future-basket.git
cd future-basket

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Start the servers
```bash
# In the server folder, run the development server
cd server
npm run start

# In the client folder, run the Vite development server
cd client
npm run dev
```

The application client runs on `http://localhost:5173` (or `http://localhost:5174`) and the server maps endpoints on `http://localhost:5000/api`.

---

## 🏗️ Build & Deployment Notes
- **Production Build**: 
  Compile frontend bundles using `npm run build` in the `client` directory to generate minimized build assets inside the `dist` directory.
- **Backend Deployment**:
  The Express app is ready to deploy to environments like Render, AWS, Heroku, or digital Ocean. Ensure that `validateEnv()` is passed by configuring environment variables in your hosting provider's panel.

---

## 🔮 Future Improvements
- 📸 Multi-image product slide previews using the implemented Cloudinary uploader.
- 📈 Full analytical reporting dashboard for business metrics (revenue, cancel rate, etc.).
- 📧 Automated transactional emails for successful orders.

---

## 🧑‍💻 Author
**Akshat**
- **GitHub**: [@Akshat](https://github.com/akshatd845-maker)
- **Role**: Full-Stack MERN Developer

---
**Future Basket** — Whenever, Wherever.
