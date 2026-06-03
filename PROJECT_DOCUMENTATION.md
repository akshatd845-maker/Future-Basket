# Technical Architecture & Project Documentation
## Future Basket — Whenever, Wherever

---

## 1. Introduction
**Future Basket** is a complete, feature-rich MERN (MongoDB, Express, React, Node.js) ecommerce application. The platform provides a production-grade virtual storefront allowing shoppers to explore catalogs, maintain local cart items, place transactions, and track order progression in real-time. This document outlines the technical design, database schemas, API architecture, authorization states, and third-party integrations implemented in the system.

---

## 2. Project Objectives
- Build a secure Full-Stack ecommerce platform that maintains high performance and UI consistency.
- Implement an automated dual-token authorization flow (HttpOnly cookies + localStorage keys) with transparent interceptor-driven session refresh mechanisms.
- Provide a robust payment checkout system using the Razorpay SDK, fully secured with server-side HMAC signature verification.
- Establish clean, protected administration endpoints to manage catalogue items, orders, and user access levels.

---

## 3. Problem Statement
Modern online marketplaces require highly secure session authentication, real-time cart/inventory tracking, and transaction safety. Traditional cookies are vulnerable to CSRF, while local-storage alone is vulnerable to XSS attacks. Furthermore, client-side transaction calculations can be easily spoofed. 

Future Basket resolves these issues by implementing:
1. A **hybrid auth mechanism** combining memory-tokens, localStorage trackers, and HttpOnly refresh cookies.
2. Server-side **strict order validation & payment signature validation** checking cryptographic hashes before updating payment statuses.

---

## 4. System Architecture
The application uses a decoupled client-server architecture:

```
[React App (Client)] <==== Axios / CORS ====> [Express API (Server)] <==== Mongoose ====> [MongoDB Atlas]
         |                                           |
         | (Initialize Script)                       | (Official Node SDK)
         v                                           v
[Razorpay Checkout overlay] <== HMAC Verify ==> [Razorpay payment Portal]
```

- **Client App**: Vite-based SPA containing pages for store navigation, checkout forms, and user dashboards.
- **API Server**: Express application mapping request handlers, executing validations, and interacting with MongoDB via Mongoose.
- **External Interfaces**: Razorpay Payment gateway integration for client overlays and server-side merchant operations.

---

## 5. Technology Stack

### Frontend:
- **React**: Modern components with Context API provider wrappers.
- **Vite**: Rapid asset compilation and bundling.
- **Context API**: Managing cart lists and user auth states.
- **React Router**: Frontend client routing with protected wrapper routes.

### Backend:
- **Node.js**: Underlying asynchronous runtime environment.
- **Express.js**: Request routing and middleware pipelines.
- **MongoDB**: Schema-flexible NoSQL document store.
- **Mongoose**: Object-Document Mapping (ODM) layer for Mongo.

### Authentication:
- **JWT**: Dual-token schema (JWT access token + JWT refresh token).

### Payment:
- **Razorpay**: Official Razorpay integration for cards, UPI, and netbanking.

---

## 6. Folder Structure

```
ecommerce-store/
├── client/                     # React Single Page Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute wrappers
│   │   ├── context/            # AuthContext, CartProvider contexts
│   │   ├── pages/              # Cart, Checkout, Home, Login, Orders, OrderDetails, PlaceOrder, ProductDetails, Register
│   │   └── services/           # api.js client config
│   ├── package.json
│   └── vite.config.js
│
└── server/                     # Node/Express Backend
    ├── config/                 # db.js, validateEnv.js, cloudinary.js
    ├── controllers/            # adminController, authController, orderController, productController, paymentController
    ├── middleware/             # authMiddleware (protect/admin checks), errorMiddleware
    ├── models/                 # User.js, Product.js, Order.js schemas
    ├── routes/                 # Express API routes
    ├── package.json
    └── server.js               # Entry script
```

---

## 7. Database Design

### Model 1: User Schema (`User.js`)
Stores customer and administrator profile details.
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshToken: { type: String, select: false }
}
```

### Model 2: Product Schema (`Product.js`)
Stores product catalogue items.
```javascript
{
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }
}
```

### Model 3: Order Schema (`Order.js`)
Stores billing details, items, payment statuses, and Razorpay transaction references.
```javascript
{
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true, enum: ["card", "cod", "razorpay"] },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  orderStatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paymentResult: { id: String, status: String, email_address: String }
}
```

---

## 8. Authentication Flow

```
[Register/Login Request] ──> [Hash Password] ──> [Generate Access + Refresh Token]
                                                         |
         +-----------------------------------------------+-----------------------------------+
         v                                                                                   v
[HTTP Response Body: accessToken]                                              [Set-Cookie Header: HttpOnly Cookies]
         |                                                                                   |
         v                                                                                   v
[Stored in Client localStorage]                                                [Automatically sent with credentials]
```

- **Access Token**: Short-lived JWT (15 mins) sent inside the `Authorization: Bearer <token>` header to authenticate protected API requests.
- **Refresh Token**: Long-lived JWT (7 days) stored as a secure, HttpOnly, SameSite `lax` cookie. Used to query `/api/auth/refresh` on access token expiration.
- **Authorization Middleware**: Extracts the token from either the `Authorization` header or `req.cookies.accessToken`, validates it, and mounts the user document to `req.user`.

---

## 9. Product Flow
1. **Catalog Navigation**: `Home.jsx` fetches all products from `/api/products` and splits listings based on URL queries/categories.
2. **Product Details**: Selecting a card triggers `/api/products/:id`, retrieving details (images, pricing, reviews, features) in `ProductDetails.jsx`.
3. **Cart Management**: Users can adjust quantities, triggering the centralized `CartProvider.jsx` context to calculate the cart items array, subtotal, and stock thresholds.

---

## 10. Checkout Flow
1. **Cart Review**: Review quantities and proceed to shipping.
2. **Address Form Validation**: In `Checkout.jsx`, validate inputs (fullName, phone, postalCode) and proceed to review.
3. **Payment Choice**: In `PlaceOrder.jsx`, select payment:
   - **Cash on Delivery (COD)**: Instantly creates a pending order and redirects to `/orders`.
   - **Online (Razorpay)**: Commits order metadata first, then starts the Razorpay payment modal sequence.

---

## 11. Razorpay Payment Flow

```
[Client] ──> Create Order on DB ──> POST /api/payment/create-order ──> [Server]
                                                                             |
                                                                  (Init Razorpay Order SDK)
                                                                             |
                                                                             v
[Client] <── Returns keyId & razorpayOrder ──────────────────────────────────+
   |
(Open Razorpay Modal & Complete Payment)
   |
   v
[Client] ──> POST /api/payment/verify (order_id, payment_id, signature) ──> [Server]
                                                                                 |
                                                                      (SHA256 HMAC Match)
                                                                                 |
                                                                                 v
[Client] <── Mark order as Paid + redirect to Order Details ─────────────────────+
```

1. **Transaction Initialization**: The client requests `POST /api/payment/create-order` with the MERN order ID.
2. **Order Construction**: The server verifies the order details, initializes a Razorpay order via the Node SDK (converting amount to paise), saves the generated `razorpayOrderId` to the database, and returns the parameters (`keyId`, `razorpayOrder`) to the client.
3. **Modal Overlay**: The client opens the Razorpay script modal (`window.Razorpay`).
4. **Signature Verification**: On payment completion, Razorpay returns a payload containing:
   - `razorpay_order_id`
   - `razorpay_payment_id`
   - `razorpay_signature`
5. **Cryptographic Validation**: The client submits these parameters along with the order ID to `POST /api/payment/verify`. The server checks the signature matches:
   $$\text{expectedSignature} = \text{HMAC-SHA256}(\text{razorpay\_order\_id} + "|" + \text{razorpay\_payment\_id}, \text{RAZORPAY\_KEY\_SECRET})$$
6. **Order Update**: If verified, order properties (`isPaid`, `paidAt`, `paymentResult`) are updated, the cart is cleared, and the client is redirected to the order page.

---

## 12. API Modules

### I. Auth API (`authRoutes.js`)
- `POST /api/auth/register` (Public) - Signs up users.
- `POST /api/auth/login` (Public) - Validates login credentials and returns session tokens.
- `POST /api/auth/logout` (Private) - Cleans active refresh sessions and cookies.
- `GET /api/auth/me` (Private) - Returns authenticated profile info.
- `POST /api/auth/refresh` (Public) - Issues fresh access tokens using refresh token cookies.

### II. Product API (`productRoutes.js`)
- `GET /api/products` (Public) - Returns all catalog items.
- `GET /api/products/:id` (Public) - Returns detail properties of a product.
- `POST /api/products` (Private, Admin) - Creates catalog items.

### III. Order API (`ordersRoutes.js`)
- `POST /api/orders` (Private) - Commits order details.
- `GET /api/orders/my` (Private) - Returns current client's order history.
- `GET /api/orders/:id` (Private) - Returns single order state.
- `PATCH /api/orders/:id/cancel` (Private) - Cancels pending orders.

### IV. Payment API (`paymentRoutes.js`)
- `POST /api/payment/create-order` (Private) - Creates Razorpay transactional parameters.
- `POST /api/payment/verify` (Private) - Cryptographically verifies transaction signatures.

### V. Admin API (`adminRoutes.js`)
- `GET /api/admin/dashboard/summary` (Private, Admin) - Calculates system metrics (sales, user counts, order charts).
- `PUT /api/admin/products/:id` (Private, Admin) - Updates inventory items.
- `DELETE /api/admin/products/:id` (Private, Admin) - Removes inventory items.
- `GET /api/admin/orders` (Private, Admin) - Lists all checkout orders.
- `PATCH /api/admin/orders/:id/status` (Private, Admin) - Transitions order states (e.g. Pending -> Processing -> Shipped -> Delivered).
- `GET /api/admin/users` (Private, Admin) - List of system accounts.
- `PATCH /api/admin/users/:id/role` (Private, Admin) - Updates roles between User and Admin.
- `DELETE /api/admin/users/:id` (Private, Admin) - Deletes system accounts.

---

## 13. Security Implementation
- **Password Hashing**: Done via `bcryptjs` using a salt work factor of 10 prior to DB save.
- **Decoupled Environment Variables**: Key details (credentials, secret keys) are managed in `.env` files which are excluded from Git commits.
- **HttpOnly Cookies**: Refresh tokens are stored in HttpOnly cookies to prevent client-side script reads (XSS mitigation).
- **HMAC Signatures**: Payment verifications require cryptographic verification utilizing SHA256 HMAC to prevent spoofing.
- **Express-Validator**: Inputs are validated and sanitized to prevent SQL/NoSQL injection and XSS.

---

## 14. Error Handling
The application uses a centralized error handler middleware (`errorMiddleware.js`). All controllers forward errors using `next(err)`. The error handler maps:
- `CastError` -> `404 Resource not found`
- `ValidationError` -> `400 Invalid inputs`
- `JsonWebTokenError` -> `401 Invalid token`
- `TokenExpiredError` -> `401 Token expired`
- General fallback -> `500 Server Error`

---

## 15. Performance Considerations
- **Index Optimization**: MongoDB indexes query lookups by email fields and user ID refs.
- **Lean Queries**: Administrative listings and products employ standard pagination and select-filtering to keep payload sizes small.
- **Asynchronous Task Batches**: Dynamic loaders and Axios concurrency ensure the frontend fetches data efficiently.

---

## 16. Responsive Design
- The application uses CSS flexbox and grid layouts, matching viewports from mobile (320px) up to ultra-wide displays (1440px+).
- Image rendering includes `onError` handlers to display a fallback banner image (`hero.png`) if a product asset fails to load.

---

## 17. Future Scope
- **Multi-image Upload**: Add multi-image upload using the implemented Cloudinary handler.
- **Notification Services**: Add SMS/Email triggers for order status changes.
- **Discount & coupon Engine**: Create checkout promotions and voucher checks.

---

## 18. Challenges Faced During Development
- **Cross-Origin Cookie Blocks (CORS)**: Solved by setting dynamic CORS origin checkers in development and configuring `withCredentials: true` globally.
- **Axios v1 Headers Mutation**: Fixed a bug where direct assignment of `originalRequest.headers.Authorization` failed to update Axios's internal headers map by using case-safe bracket notation and `AxiosHeaders.set`.
- **Preflight Authorizations**: Checked that route middlewares (like `protect`) do not process preflight `OPTIONS` requests, preventing CORS preflight failures.

---

## 19. Conclusion
Future Basket is a secure, responsive, and production-ready MERN ecommerce storefront. By combining professional styling patterns, secure hybrid token authentication, and robust Razorpay gateway checks, the system is fully equipped to serve as a reliable platform for online transactions.
