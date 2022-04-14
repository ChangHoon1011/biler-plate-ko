const express = require("express");
const app = express();
const port = 5000;

const bodyParse = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

const { auth } = require("./middleware/auth");

//application/x-www-form-urlencoede
app.use(bodyParse.urlencoded({ extended: true }));

//application/json
app.use(bodyParse.json());

const mongoose = require("mongoose");
const key = require("./config/key");
const { auth } = require("./middleware/auth");
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

app.post("/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  console.log("/login");
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    console.log("50");
    //요청된 이베일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    console.log("req.body.password:", req.body.password);
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log("isMatch:", isMatch);
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      console.log("58");
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        console.log("token 생성");
        // 토큰을 생성한단.  어디에? 쿠키, 로컬스토리지
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });

    //비밀번호가 맞다면 Token생성하기
  });
});

// role 1 어드민
// role 0 일반유저

app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
