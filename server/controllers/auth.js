import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVerison: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

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
      return res.status(400).send("Username or password incorrect.");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error. Try again");
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout successful" });
  } catch (error) {
    console.log(error);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

export const sendTestEmail = async (req, res) => {
  // return res.json({ ok: true });
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: { ToAddresses: [process.env.EMAIL_FROM] },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <h1>Reset password link</h1>
              <p>Please use the following to reset your password</p>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset",
      },
    },
  };

  const emailSent = SES.sendEmail(params).promise();
  emailSent
    .then((data) => {
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );

    if (!user) return res.status(400).send("User not found");

    // prepare for email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: { ToAddresses: [email] },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
            <html>
              <h1>Reset password</h1>
              <p>Please use this code to reset your password</p>
              <h2 style="color:red;">${shortCode}</h2>
              <i>onino-elearning.com</i>
            </html>
          `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Onino Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        return res.status(200).send({ ok: true });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, password, code } = req.body;
    // console.log(email, password, code)
    const hashedPassword = await hashPassword(password);
    const user = User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: hashedPassword, passwordResetCode: "" }
    ).exec();

    return res.status(200).send({ ok: true })
  } catch (error) {
    console.table(error);
    return res.status(400).send('Error! try again.')
  }
}