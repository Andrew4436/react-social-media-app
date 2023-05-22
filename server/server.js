const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const port = 4040;
const mongoose = require("mongoose");
const User = require("./User");

const uri =
  "mongodb+srv://Andrew4436:Andrew4436@cluster0.zb3yqaa.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}

connect();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(authUser));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      done(null, false);
    } else {
      done(null, foundUser);
    }
  } catch (err) {
    console.log(err);
  }
});

async function authUser(username, password, done) {
  try {
    const foundUser = await User.findOne({
      username: username,
      password: password,
    });

    if (!foundUser) {
      return done(null, false);
    } else {
      return done(null, foundUser);
    }
  } catch (err) {
    console.log(err);
  }
}

app.post("/register", async (req, res) => {
  const { username, password, followers, following } = req.body;

  const newUser = new User({
    username: username,
    password: password,
    followers: followers,
    following: following,
  });

  await newUser.save();

  res.json({ message: "user registered" });
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "logged in", user: req.user });
});

app.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "logout successful" });
  });
});

app.post("/getUser", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "user authenticated", user: req.user });
  } else {
    res.json({ message: "not authenticated" });
  }
});

app.post("/getUsers", async (req, res) => {
  if (req.isAuthenticated()) {
    const users = await User.find({});
    const filtered = users.filter((user) => {
      return user.id !== req.session.passport.user;
    });
    res.json({ users: filtered });
  } else {
    res.json({ message: "not authenticated" });
  }
});

app.post("/createPost", async (req, res) => {
  const foundUser = await User.findById(req.session.passport.user);
  foundUser.posts.push(req.body);
  await foundUser.save();

  res.json({ message: "post added" });
});

app.post("/profile", async (req, res) => {
  const foundUser = await User.findById(req.body.id);

  res.json({ user: foundUser });
});

app.post("/followUser", async (req, res) => {
  const { following, followed } = req.body;
  const followingUser = await User.findById(following);
  const followedUser = await User.findById(followed);

  followingUser.following.push(followed);
  followedUser.followers.push(following);
  await followingUser.save();
  await followedUser.save();

  res.json({ message: "request successful" });
});

app.post("/unfollowUser", async (req, res) => {
  const { unfollowing, unfollowed } = req.body;
  const unfollowingUser = await User.findById(unfollowing);
  const unfollowedUser = await User.findById(unfollowed);

  const unfollowingFiltered = unfollowingUser.following.filter(
    (f) => f.toString() !== unfollowed.toString()
  );
  const unfollowedFiltered = unfollowedUser.followers.filter(
    (f) => f.toString() !== unfollowing.toString()
  );

  unfollowingUser.following = unfollowingFiltered;
  unfollowedUser.followers = unfollowedFiltered;

  await unfollowingUser.save();
  await unfollowedUser.save();

  res.json({ message: "request successful" });
});

app.post("/updatepfp", async (req, res) => {
  try {
    const foundUser = await User.findById(req.session.passport.user);
    foundUser.pfp = req.body.pfp
    await foundUser.save()
  } catch (err) {
    console.log(err);
  }
});

mongoose.connection.on("connected", () => {
  app.listen(port, () => {
    console.log("listening on port: " + port);
  });
});
