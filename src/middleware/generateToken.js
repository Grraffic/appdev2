const jwt = require("jsonwebtoken");

// Sample payload (data you want to store in the token)
const payload = {
  id: 1,
  username: "john_doe",
  role: "admin",
};

// Secret key (keep this safe!)
const secret = "your_secret_key"; // Replace with your JWT_SECRET from env in real apps

// Token options (optional)
const options = {
  expiresIn: "1h", // Token expires in 1 hour
};

// Generate the token
const token = jwt.sign(payload, secret, options);

console.log("Generated Token:", token);
