export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
};

export const otpConstants = {
  secret: process.env.OTP_SECRET_KEY
}

export const applicationConstants = {
  sendGridKey: process.env.ENV_SEND_GRID_KEY,
  DB_URL: process.env.ENV_DB_URL
}