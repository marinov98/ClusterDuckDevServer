import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const { error } = config();

  if (error) throw error;
}

const port = process.env.PORT || 3002;
const db_url = process.env.MONGODB_URL || "mongodb://localhost:27017/graphql";
const jwt_secret = process.env.JWT_SECRET || "DEFAULT_SECRET";
const refresh_secret = process.env.JWT_REFRESH || "SECONDARY SECRET";
const google_secret = process.env.GOOGLE_SECRET || "GOOGLE_SECRET";

const configuration = {
  port,
  db_url,
  jwt_secret,
  refresh_secret,
  google_secret
};

export default configuration;
