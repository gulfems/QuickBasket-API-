# QuickBasket API

A REST API for a grocery delivery service. Customers (users) browse products, fill their basket (cart) quickly and place their orders while couriers can claim and deliver orders. The database is managed by admin(s).

Built as a portfolio project for the Codecademy Full-Stack Engineering career path. (The end project of Backend)

---

## Features

- Authentication: JWT tokens generated for each account types => users and couriers
- Users can be attained to the admin role for database management
- Each product is belong to a specific category (Home&Living, Self Care, Fruits & Veggies etc.)
- Users can search products by filtering through categories and pagination
- Carts listen stock checks
- Checkout is designed as db transaction
- Order status: preparing -> on_the_way -> delivered, with cancellation.
- 43 automated tests
- API documentation via Swagger

---

## Tech stack

| | |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express 4 |
| Database | PostgreSQL 18 |
| Auth | jsonwebtoken, bcrypt |
| Testing | Mocha, Chai, Supertest |
| Docs | swagger-jsdoc, swagger-ui-express |
| Security | helmet, express-rate-limit |

---

## Getting started

### Requirements

- Node.js 18 or later
- PostgreSQL 14 or later

### Setup

Clone and install:

```bash
git clone https://github.com/gulfems/QuickBasket-API-.git
cd QuickBasket-API-
npm install
```

Create the database and load the schema and seed data:

```bash
createdb quickbasket
psql -d quickbasket -f db/schema.sql
psql -d quickbasket -f db/seed.sql
```

Create a `.env` file in the project root. `.env.example` lists the variables:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=quickbasket
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=a_long_random_string
```

Start the server:

```bash
npm start
```

The API runs at `http://localhost:3000`. Documentation is at
`http://localhost:3000/api-docs`.

### Running the tests

```bash
npm test
```

The tests run against the development database and expect the seed data to be
loaded. Rate limiting is disabled during tests via `NODE_ENV=test`.

---

## API overview

Full request and response details are in the Swagger docs. A summary:

### Auth — `/api/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a customer account |
| POST | `/login` | Public | Get a JWT |
| GET | `/me` | Customer | Your own details |

### Couriers — `/api/courier`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a courier account |
| POST | `/login` | Public | Get a JWT |
| GET | `/me` | Courier | Your own details |

### Categories — `/api/categories`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List categories |
| GET | `/:id/products` | Public | Products in a category |
| POST | `/` | Admin | Create a category |
| PUT | `/:id` | Admin | Rename a category |
| DELETE | `/:id` | Admin | Delete a category |

### Products — `/api/products`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List products. Supports `?category=`, `?search=`, `?limit=`, `?offset=` |
| GET | `/:id` | Public | A single product |
| POST | `/` | Admin | Create a product |
| PUT | `/:id` | Admin | Update a product |
| DELETE | `/:id` | Admin | Soft-delete a product |

### Users — `/api/user`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/:id` | Self or admin | A user's details |
| PUT | `/:id` | Self | Update email and phone |
| DELETE | `/:id` | Self or admin | Delete the account |

### Addresses — `/api/addresses`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Customer | Your addresses |
| POST | `/` | Customer | Add an address |
| PUT | `/:id` | Customer | Update an address |
| DELETE | `/:id` | Customer | Delete an address |

### Cart — `/api/cart`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Customer | Your cart, with product names and prices |
| POST | `/items` | Customer | Add a product, or increase its quantity |
| PUT | `/items/:id` | Customer | Set an item's quantity |
| DELETE | `/items/:id` | Customer | Remove one item |
| DELETE | `/` | Customer | Empty the cart |

### Orders — `/api/orders`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Customer | Place an order from the cart |
| GET | `/` | Customer | Your order history |
| GET | `/:id` | Owner, assigned courier, or admin | A single order |
| PUT | `/:id/cancel` | Owner | Cancel, while still preparing |
| GET | `/available` | Courier | Unclaimed orders |
| GET | `/assigned` | Courier | Your assigned orders |
| PUT | `/:id/claim` | Courier | Take an order |
| PUT | `/:id/deliver` | Assigned courier | Mark delivered |

---

## Database

Nine tables: `users`, `couriers`, `addresses`, `categories`, `products`,
`carts`, `cart_items`, `orders`, `order_items`.

Schema is in `db/schema.sql`, seed data in `db/seed.sql` (15 categories,
90 products, 3 couriers).

---

## Design Decisions

**Different tables for users and couriers**

Couriers and users are separated as they dont have almost anything in common with each other. The 'JWT' carries a role claim so the API can tell the two apart regardless of their ids.

**Prices are frozen at checkout**

`order_items.price_at_purchase` stores what
the customer actually paid rather than pointing at the product's current price.

**Checkout is one transaction**

Writing a service was complicating my code. Thus, I preferred a controller where orders, items, stock management and emptying the cart is in the same place.

**Products are soft-deleted**

`products.is_active` is set to false rather than
deleting the row, because old orders reference products and the history must
stay intact. Public queries filter on `is_active = true`.

**Stock is re-checked at checkout**

The cart also checks stock when items are
added, but a cart is a wish rather than a reservation — someone else may have
bought the last unit in the meantime.

**Paths are singular where the resource is the caller's own** (`/api/user`,
`/api/courier`) and plural for public collections (`/api/products`,
`/api/categories`).

**The cart is created on first add**, not at registration, so registration
stays a single insert.

**Ownership is checked in the controller, not in middleware.** Middleware can
read the token, but it can't know whether a given row belongs to the caller
without fetching it first.

**Money is `NUMERIC(10,2)`.**

---

## Limitations

- Cancelling an order does not return items to stock. (Hoping to update this in the second version)
- Two couriers claiming the same order at the same moment could race.
- Tests run against the development database rather than a dedicated test one,
  and do not clean up the rows they create.
- No password reset or email verification.
- No payment processing — orders are placed, not paid for.

---

## Project structure

```
src/
├── app.js              Express app, middleware, route mounting
├── server.js           Starts the server
├── config/
│   └── swagger.js      Swagger spec configuration
├── controllers/        Request handling and HTTP responses
├── db/
│   └── index.js        PostgreSQL connection pool
├── middleware/         Auth, roles, rate limiting, error handling
├── routes/             Route definitions and Swagger annotations
└── services/           Database queries, kept out of the controllers
db/
├── schema.sql
└── seed.sql
test/                   Mocha test suites
```

`app.js` and `server.js` are separate so Supertest can import the app without
binding a port.

---

Thank You !