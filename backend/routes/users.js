const { Router } = require("express");
const { User, otp, Account } = require("../db/users");
const zod = require("zod");
const JWT = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
const router = Router();
const auth = require("../middleware/auth");
const OTP = require("../middleware/otp");
const { sendMail } = require("../services");
const { code } = require("../services");
const signUpSchema = zod.object({
  firstname: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});
const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
router.get("/", function (req, res) {
  res.send("Welcome you reached user route");
});
router.post("/signup", async function (req, res) {
  const { firstname, email, password } = req.body;
  const { success } = signUpSchema.safeParse({ firstname, email, password });
  const userExist = await User.findOne({ email: email });
  if (!success && userExist) {
    res.status(500).send({ message: "Invalid credentials..." });
  } else {
    const refOtp = await otp.create({ otp: code });
    const response = await User.create({
      firstname,
      email,
      password,
      otp: refOtp._id,
    });
    const userId = response._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });
    const token = JWT.sign({ UserId: userId }, JWT_KEY);
    const subject = "OTP Verification code for Paytm-clone ";
    const html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:20px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Paytm-clone</a>
        </div>
        <p style="font-size:1.1em">Hi User,</p>
        <p style="font-size:1.4em font-weight:300">${email}</p>
        <p> Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
        <p style="font-size:0.9em;">Regards,<br />Paytm-clone</p>
        <hr style="border:none;border-top:1px solid #eee" />

      </div>
    </div>`;

    await sendMail({
      to: email,
      subject,
      html,
    });
    res.send({
      response,
      message: "User signup successfully",
      token: token,
    });
  }
});
router.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  const { success } = signinSchema.safeParse({ email, password });
  const userExist = await User.findOne({ email: email });
  const token = JWT.sign({ UserId: userExist._id }, JWT_KEY);

  if (success && userExist && userExist.password == password) {
    res
      .status(200)
      .send({ message: "User logged in successfully...", token: token });
  } else {
    res.status(500).send({ message: "Invalid credentials....." });
  }
});

router.get("/auth", OTP, async function (req, res) {
  console.log(req.user);
  res.send({ message: "User signin successfully", user: req.user });
});
router.get("/bulk", async function (req, res) {
  const filter = req.query.filter || "";
  console.log(filter);
  const users = await User.find({
    $or: [{ firstname: { $regex: filter } }, { email: { $regex: filter } }],
  });
  console.log(users);
  res.json({
    user: users.map((user) => ({
      email: user.email,
      firstname: user.firstname,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
module.exports = router;
