import { ne } from "@faker-js/faker";
import updateLastConnection from "../middleware/lastConnectionMiddleware.js";
import { sessionService } from "../services/index.js";
import { userService } from "../services/index.js";
import { generateToken } from "../utils.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res, next) => {
  try {
    const logData = req.body;
    const user = await sessionService.loginUser(logData);
    if (user == null) return res.redirect("/login");
    
    req.user = user;

    const access_token = generateToken(user);
    res.cookie("keyCookieForJWTJRCP", (user.token = access_token), {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      })
      .redirect("/api/products");
      return next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const userData = req.body;

    const user = await sessionService.registerUser(userData);
    
    const access_token = generateToken(user);
    res
      .status(200)
      .cookie("keyCookieForJWTJRCP", (user.token = access_token), {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      })
      .redirect("/login");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserCurrent = async (req, res) => {
  try {
    const user = await sessionService.getUserCurrent(req.user);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetearPassword = async (req, res) => {
  try {
    res.render("resetearPassword", {});
  } catch (error) {
    req.logger.fatal("Error al resetear la contraseña");
    res.status(500).json({ error: error.message });
  }
};

export const restart = async (req, res) => {
  const email = req.body.email;
  const result = await sessionService.validUserSentEmailPassword(email);

  res.send({
    status: "success",
    message: "Email enviado con las instrucciones para cambiar la contraseña",
  });
};

export const resetPasswordForm = async (req, res) => {
  const token = req.params.token;
  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      req.logger.fatal("Token de verificacion no válido");
      res.status(500).render("resetearPassword");
    }
    res.status(200).render("formReset");
  });
};

export const validPassword = async (req, res) => {
  try {
    const password = req.body.newPassword;
    const email = req.body.email;
    const confirmpassword = req.body.confirmPassword;
    await sessionService.resetPasswordForm(email, password, confirmpassword);
    res.render("login", {});
  } catch (error) {
    req.logger.fatal("Error al validar la contraseña");
    res.status(500).json({ error: error.message });
  }
};

export const getTicketByUser = async (req, res) => {
  try {
    const user = req.user.user;

    const tickets = await sessionService.getTicketByUser(user);

    res.status(200).render("tickets", { tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
