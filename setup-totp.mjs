import "dotenv/config";
import { TOTP } from "totp-generator";

setInterval(() => {
  const { otp, expires } = TOTP.generate(process.env.TOTP_SECRET);
  console.log(
    otp,
    new Date().toLocaleString(),
    Math.trunc((expires - Date.now()) / 1000)
  );
}, 1000);
