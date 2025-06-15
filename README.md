# Simple Book API

A comprehensive RESTful API for managing books with user authentication, email notifications, and database seeding capabilities.

## 🚀 Live Deployment

**Deployed URL**: [https://appdev2-qc9f.onrender.com](https://appdev2-qc9f.onrender.com)

## 📋 Features

- **User Authentication** - JWT-based authentication system
- **Book Management** - Full CRUD operations for books
- **User-Book Associations** - Each book is linked to a user
- **Email Notifications** - Pug-templated emails for book creation
- **Database Seeding** - Comprehensive seeding system with realistic data
- **Security** - Password hashing with bcrypt, protected routes
- **MongoDB Integration** - MongoDB Atlas cloud database

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer with Pug templates
- **Validation**: Joi
- **Development**: Nodemon
- **Deployment**: Render (Free tier)

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed)
}
```

### Book Model
```javascript
{
  title: String (required),
  author: String (required),
  userId: ObjectId (required, ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Test Accounts

| Username | Email | Password |
|----------|-------|----------|
| admin | admin@bookapi.com | admin123 |
| testuser | test@bookapi.com | test123 |

## 📡 API Endpoints

### Authentication Endpoints

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@bookapi.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Book Endpoints (Protected)

#### Get All Books
```http
GET /api/books
Authorization: Bearer <token>
```

#### Get Book by ID
```http
GET /api/books/:id
Authorization: Bearer <token>
```

#### Create New Book
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name"
}
```

#### Update Book
```http
PATCH /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "Updated Author"
}
```

#### Delete Book
```http
DELETE /api/books/:id
Authorization: Bearer <token>
```

## 🧪 Testing the API

### Using cURL

1. **Sign In to get a token:**
```bash
curl -X POST https://appdev2-qc9f.onrender.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bookapi.com","password":"admin123"}'
```

2. **Get all books (replace TOKEN with actual token):**
```bash
curl -H "Authorization: Bearer TOKEN" \
  https://appdev2-qc9f.onrender.com/api/books
```

3. **Create a new book:**
```bash
curl -X POST https://appdev2-qc9f.onrender.com/api/books \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author"}'
```

### Using Postman

1. Import the provided `api_test.http` file
2. Update the base URL to: `https://appdev2-qc9f.onrender.com`
3. Sign in to get a token
4. Use the token in subsequent requests

## 🌱 Database Seeding

The API includes a comprehensive seeding system:

```bash
# Seed database with sample data
npm run seed

# Seed only books
npm run seed:books

# Seed only users  
npm run seed:users

# Interactive seeding CLI
npm run seed:cli
```

**Seeded Data:**
- 5 Users (including test accounts)
- 10+ Books with realistic titles and authors
- User-book associations
- Properly hashed passwords

## 📧 Email Notifications

When a new book is created, the system sends email notifications using:
- **Pug templates** for HTML emails
- **Nodemailer** for email delivery
- **Asynchronous processing** (doesn't block API responses)

## 🚀 Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Setup
1. Clone the repository:
```bash
git clone https://github.com/Grraffic/appdev2.git
cd appdev2
git checkout simple-book-api-deployment
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
ADMIN_EMAIL=admin@example.com
```

4. Seed the database:
```bash
npm run seed
```

5. Start development server:
```bash
npm run dev
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `TOKEN_SECRET` | JWT secret key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `EMAIL_SERVICE` | Email service provider | No |
| `EMAIL_USER` | Email username | No |
| `EMAIL_PASS` | Email password/app password | No |
| `EMAIL_FROM` | From email address | No |
| `ADMIN_EMAIL` | Admin notification email | No |

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run seed` | Seed database with sample data |
| `npm run seed:books` | Seed only books |
| `npm run seed:users` | Seed only users |
| `npm run seed:cli` | Interactive seeding CLI |
| `npm test` | Run tests |

## 🐛 Troubleshooting

### Common Issues

**502 Bad Gateway on Render:**
- Service might be cold starting (wait 30-60 seconds)
- Check Render logs for deployment errors
- Verify environment variables are set correctly

**Database Connection Issues:**
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
- Verify `MONGODB_URI` is correctly formatted
- Check MongoDB Atlas cluster status

**Authentication Errors:**
- Ensure `TOKEN_SECRET` environment variable is set
- Verify user credentials with seeded test accounts
- Check token expiration (24 hours)

### Render Deployment Notes

- **Free tier limitations**: Service may sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep may take 30-60 seconds
- **Build time**: Initial deployment takes 2-5 minutes

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created as part of Application Development coursework.

---

**Note**: This API is deployed on Render's free tier, which may experience cold starts. For production use, consider upgrading to a paid plan for better performance and uptime.
