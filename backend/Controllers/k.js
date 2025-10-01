// hash.js
import bcrypt from "bcryptjs";

const run = async () => {
  const plain = "admin123";  // or "admin@123", whichever you want
  const hash = await bcrypt.hash(plain, 10);
  console.log("New hash:", hash);
};
run();
