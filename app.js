//Creating Prerequisites
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 8080;
// Mongo DB initialisation
async function run() {
  await mongoose.connect(
    "mongodb+srv://root:root@11street.tjyb0.mongodb.net/11streetDB"
  );
  console.log("Database Connected ");
}
run().catch((e) => {
  console.log(e);
});
// Defining Schemas
const UsersSchema = {
  firstname: {
    type: String,
    required: true,
    max: 30,
  },
  lastname: {
    type: String,
    required: true,
    max: 30,
  },
  username: {
    type: String,
    required: true,
    max: 30,
  },
  email: {
    type: String,
    required: true,
    max: 30,
  },
  password: {
    type: String,
    required: true,
    max: 30,
  },
};
const User = new mongoose.model("User", UsersSchema);
// End Of MongoDB Declarations
//Requests
// Home Route Requests
const homeRoute = "/";
app.get(homeRoute, (req, res) => {
  console.log("A user Just Connected to the Website.");
  res.render("index", {
    userexists: "",
    wrongPass: "",
    noUser: "",
    emailExists: "",
  });
});
app.post(homeRoute, (req, res) => {
  // Requests Values
  const firstName = req.body.firstname;
  const lastName = req.body.Lastname;
  const userName = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const login = req.body.login;
  const signUp = req.body.signUp;
  // Checks If the request is from the Login Form
  if (login === "Login") {
    User.find({ username: userName }, (err, UserFound) => {
      if (err) {
        console.log(err);
      } else if (UserFound.length === 0) {
        console.log("No User Found with this Username.");
        res.render("index", {
          userexists: "",
          wrongPass: "",
          noUser: "Invalid Username",
          emailExists: "",
        });
      } else {
        console.log(UserFound, UserFound.length);
        UserFound.forEach((User) => {
          console.log(User.username);
          // Checks if Password is correct
          if (User.password != password) {
            console.log("Wrong Password");
            res.render("index", {
              userexists: "",
              wrongPass: "Incorrect Password",
              noUser: "",
              emailExists: "",
            });
          } else {
            console.log("Password Matched.");
            res.redirect("/loggedin");
          }
        });
      }
    });
  }
  // If request if from Sign up form
  else {
    // Checks If Theres a User with the requested user name
    function checkIfEmailExists() {
      // User.find({ email: email }, (err, UserFound) => {
      // //   if (!err) {
      // //     if (UserFound) {
      // //       console.log(UserFound);
      // //       UserFound.forEach((User) => {
      // //         console.log(User.email);
      // //       });
      // //     }
      // //   }
      // });
      User.find({ email: email }, (err, UserFound) => {
        if (err) {
          console.log(err);
        } else {
          // If User Doesnt Exist. A new user is Created with the Email
          if (UserFound.length === 0) {
            // Confirms if the username doesn't exist
            checkIfUsernameExists();
          }
          // If user already Exists The User Refills the Form with another Email
          else {
            res.render("index", {
              userexists: "",
              wrongPass: "",
              noUser: "",
              emailExists: "Email Exists. Try another Email.",
            });
            console.log("User with this Email already Exists");
          }
        }
      });
    }
    checkIfEmailExists();
    function checkIfUsernameExists() {
      User.find({ username: userName }, (err, UserFound) => {
        if (err) {
          console.log(err);
        } else {
          // If User Doesnt Exist a new user is Created with the Username
          if (UserFound.length === 0) {
            console.log("No User Found with this Username");
            const user = new User({
              firstname: firstName,
              lastname: lastName,
              username: userName,
              email: email,
              password: password,
            });
            user.save();
            console.log("Successfully saved User with " + userName);
            res.redirect("/loggedin");
          }
          // If user already Exists The User Refills the Form with another Username
          else {
            res.render("index", {
              userexists: "User Exists. Try another Username.",
              wrongPass: "",
              noUser: "",
              emailExists: "",
            });
            console.log("User with this Username already Exists");
          }
        }
      });
    }
  }
});
// Logged In Route
app.get("/loggedin", (req, res) => {
  res.render("loggedin");
});
//Listener
app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
