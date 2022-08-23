import jwt from "jsonwebtoken";
import configs from "../configs";

function signJwtToken(email: string, _id: string): string {
  return jwt.sign(
    {
      username: email,
      _id: _id,
      sub: _id,
    },
    configs.JWT_SECRET,
    {
      expiresIn: "3d", // 3 days
    }
  );
}

export default { signJwtToken };
