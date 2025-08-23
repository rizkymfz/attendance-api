import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";

export class Attendance extends Model {
  declare id: number;
  declare user_id: number;
  declare clock_in: Date | null;
  declare clock_out: Date | null;
  declare status: "in" | "out";
}

Attendance.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    clock_in: { type: DataTypes.DATE, allowNull: true },
    clock_out: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM("in", "out"), defaultValue: "in" },
  },
  {
    sequelize,
    modelName: "attendance",
    tableName: "attendances",
    underscored: true,
    timestamps: true,
  }
);

Attendance.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Attendance, { foreignKey: "user_id", as: "attendances" });
