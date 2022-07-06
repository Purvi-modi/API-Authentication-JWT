const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

//sample get api
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to api",
  });
});

//Api that requires authenication token
//add token in headers with key as "Authorization" and value as "token"
app.post("/api/posts", verifyToken, (req, res) => {
  try {
    jwt.verify(req.token, "secretKey", (err, authData) => {
      console.log("in post req", req.token);
      if (err) {
        console.log("error", err);
        res.sendStatus(403);
      } else {
        res.json({
          message: "Post created...",
          authData,
        });
      }
    });
    res.json({
      message: "Posts created",
    });
  } catch (e) {
    res.json({ message: e });
  }
});

//This api will output the token which will expire in 40s
app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "purvi",
    email: "purvi@gmail.com",
  };

  //sign in user with secret key
  jwt.sign({ user }, "secretKey", { expiresIn: "40s" }, (err, token) => {
    if (err) {
      res.json({ message: err });
    }
    res.json({
      token,
    });
  });
});

//check whether given token in headers matches
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    console.log("header not undefined");
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];

    req.token = bearerToken;
    console.log(req.token);

    next();
  } else {
    res.sendStatus(403);
  }
}
app.listen(5000, () => console.log("Server started on port 5000"));
