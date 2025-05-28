const express = require("express");
const router = express.Router();

const user = [
  {
    id: 1,
    email: "rafaelramos@gmail.com",
    password: "secret123",
  },
];

router.post("/sigin", (req, res) => {
  const { email, password } = req.body;

  const userExist = user.find(
    (user) => user.email === email && user.password === password
  );

  if (userExist) {
    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: userExist,
    });
  }

  res.status(401).json({ status: false, message: "Invalid credentials" });
});

module.exports = router;
