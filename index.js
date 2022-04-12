const express = require("express");
const app = express();
const port = 5000;

const bodyParse = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");

//application/x-www-form-urlencoede
app.use(bodyParse.urlencoded({ extended: true }));

//application/json
app.use(bodyParse.json());

const mongoose = require("mongoose");
const key = require("./config/key");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("Hello World!11234");
});

app.post("/register", (req, res) => {
  //회원가입 할때 필요한 정보들을 clinet에서 가져오면
  //그것들을 데이터베이스에 넣어준다

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
