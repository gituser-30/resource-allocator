// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");

// // Register User
// exports.register = async (req, res) => {
//   try {
//     const { fullName, email, dob, password } = req.body;

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate verification token
//     const verificationToken = crypto.randomBytes(32).toString("hex");

//     // Create user
//     user = new User({
//       fullName,
//       email,
//       dob,
//       password: hashedPassword,
//       profilePhoto: req.file ? req.file.path : null,
//       verificationToken
//     });

//     await user.save();

//     // Send verification email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // your gmail
//         pass: process.env.EMAIL_PASS  // app password
//       }
//     });

//     const verifyURL = `http://localhost:5000/api/auth/verify/${verificationToken}`;

//     await transporter.sendMail({
//       from: `"MyApp" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Verify Your Email",
//       html: `<h2>Welcome ${fullName}!</h2>
//              <p>Please click the link below to verify your email:</p>
//              <a href="${verifyURL}">${verifyURL}</a>`
//     });

//     res.status(201).json({ message: "User registered. Please check your email to verify." });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Verify Email
// exports.verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     let user = await User.findOne({ verificationToken: token });

//     if (!user) return res.status(400).json({ message: "Invalid token" });

//     user.verified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.status(200).json({ message: "Email verified successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
