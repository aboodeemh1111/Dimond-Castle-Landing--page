import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "../config/env";
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export async function login(req, res) {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { email, password } = parse.data;
    const user = await User.findOne({ email }).exec();
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, {
        expiresIn: "7d",
    });
    return res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
    });
}
