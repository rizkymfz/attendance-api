import type { Dialect } from "sequelize";

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  timezone?:string;
  dialectOptions?: any;
}

const config: Record<string, DBConfig> = {
  development: {
    username: "root",
    password: "",
    database: "attendance_api",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+07:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  },
};

export default config;
