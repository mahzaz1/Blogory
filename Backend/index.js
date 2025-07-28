const express = require("express");
const { connectToMongoose } = require("./connection");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authroute = require("./routes/auth");
const postroute = require("./routes/post");
const userroute = require("./routes/user");
const commentroute = require("./routes/comment");
const { verifyToken } = require("./middleware/verifytoken");
const multer = require("multer");

const app = express();

// middleware
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/images", express.static("images"));
app.use("/", authroute);
app.use("/user", verifyToken, userroute);
app.use("/post", verifyToken, postroute);
app.use("/comment", verifyToken, commentroute);

connectToMongoose(process.env.MONGODB_URL).then(() =>
  console.log("MongoDB Connected")
);

const storage = multer.diskStorage({
  destination: (req, res, fn) => {
    fn(null, "images");
  },
  filename: (req, res, fn) => {
    fn(null, req.body.image);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "Image is uploaded successfully" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started At ${process.env.PORT}`);
});
