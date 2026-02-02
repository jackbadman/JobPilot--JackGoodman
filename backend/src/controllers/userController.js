import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Issue a short-lived access token for a user id.
 * @param {string} userId
 * @returns {string}
 */
const issueToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

/**
 * Register a new user and return a token + public profile.
 */
export const register = async (req, res) => {
  try {
    const { emailAddress, name, password } = req.body;
    if (!emailAddress || !name || !password) {
      return res.status(400).json({ error: "Email, name, and password are required." });
    }

    const normalizedEmail = emailAddress.toLowerCase().trim();
    const existing = await User.findOne({ emailAddress: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ emailAddress: normalizedEmail, name, passwordHash });
    const token = issueToken(user._id);

    res.status(201).json({
      user: { id: user._id, emailAddress: user.emailAddress, name: user.name },
      token
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Authenticate a user and return a token + public profile.
 */
export const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    if (!emailAddress || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = emailAddress.toLowerCase().trim();
    const user = await User.findOne({ emailAddress: normalizedEmail }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = issueToken(user._id);
    res.json({
      user: { id: user._id, emailAddress: user.emailAddress, name: user.name },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * List users with public fields only.
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("emailAddress name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Return the authenticated user's public profile.
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("emailAddress name");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
