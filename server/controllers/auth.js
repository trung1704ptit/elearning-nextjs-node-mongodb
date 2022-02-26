import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long.");
    }

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is already taken");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again");
  }
};

export const login = async (req, res) => {
  try {
    // check if our db has user with that email
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    // check password
    const match = await comparePassword(password, user.password);
    if (match) {
      // create signed jwt
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          roles: user.roles,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      user.password = undefined;
      // return user and token to client.

      res.cookie("token", token, {
        httpOnly: true,
        // secure: true,
      });

      // send user as json response
      return res.json(user);
    } else {
      return res.status(400).send('Username or password incorrect.')
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error. Try again");
  }
};


export const logout = (req, res) => {
  
}