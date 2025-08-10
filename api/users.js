import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByEmailAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).json({ user, token });
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByEmailAndPassword(username, password);
    if (!user) return res.status(401).send("invalid email or password");
    const token = createToken({ id: user.id });
    res.send(token);
  });
