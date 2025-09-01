import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || "attendance",
    process.env.DB_USER || "root",
    process.env.DB_PASS || "",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
        timezone: '+07:00',
        dialectOptions: {
          useUTC: false,
        },
    }
);

export const logDB = new Sequelize(
  process.env.LOG_DB_NAME!,
  process.env.LOG_DB_USER!,
  process.env.LOG_DB_PASS!,
  {
    host: process.env.LOG_DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);