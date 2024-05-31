// create middleware for to check login user or not using jwt token
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByEmail } from "../services/userService";
import { IUser } from "../models/userModel";

export interface RequestExtended extends Request {
  user?: IUser | null;
}

export const checkAuth = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction
) => {
  const { adminEmail } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("token in middlewhere", token);
  console.log("adminEmail in middlewhere", adminEmail);
  if (adminEmail) {
    req.user = await findUserByEmail(adminEmail);
    return next();
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    let decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY!) as
      | string
      | JwtPayload;

    if (typeof decodedUser === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Now TypeScript knows decodedUser is a JwtPayload
    const decodedPayload = decodedUser as JwtPayload;
    console.log("decodedPayload", decodedPayload);
    if (typeof decodedPayload === "object" && "email" in decodedPayload) {
      req.user = await findUserByEmail(decodedPayload.email);
      next();
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
