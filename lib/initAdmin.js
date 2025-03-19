import dbConnect from "../lib/dbConnect.js";
import Admin from "../models/Admin.js";

async function createAdmin() {
  await dbConnect();

  const username = "madz";
  const pin = "Akima2124";

  await Admin.deleteOne({ username }); // Remove existing admin
  await Admin.create({ username, pin });

  console.log("Admin created successfully!");
  process.exit();
}

createAdmin().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
