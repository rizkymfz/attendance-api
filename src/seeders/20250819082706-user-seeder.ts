import { QueryInterface } from "sequelize";
import bcrypt from "bcrypt";

export const up = async (queryInterface: QueryInterface) => {
  const password = await bcrypt.hash("password", 10);

  await queryInterface.bulkInsert("users", [
    {
      email: "admin@test.com",
      name:"Administrator",
      password,
      phone: "081234567890",
      role: "admin",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      email: "osborn@test.com",
      name: "Norman Osborn",
      password,
      phone: "081111111111",
      role: "user",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      email: "parker@test.com",
      name: "Peter Parker",
      password,
      phone: "082222222222",
      role: "user",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete("users", {}, {});
};
