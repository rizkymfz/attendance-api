// models/UserLog.ts
import { DataTypes, Model } from "sequelize";
import { logDB } from "../config/database.js";

export class UserLog extends Model {}

UserLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: logDB,
    tableName: "user_logs",
    underscored: true,
    timestamps: false,
  }
);
