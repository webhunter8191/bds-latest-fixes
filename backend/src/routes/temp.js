const bcrypt = require("bcryptjs");

async function testPassword() {
  const enteredPassword = "124124"; // Same password you tried
  const storedHash = "$2b$10$Gw.UBWD6ekLKFU6biD3tCuEPB56Jn0OYK45bESH73TfJ7aWn6rzLe"; // From your DB

  const isMatch = await bcrypt.compare(enteredPassword, storedHash);
  console.log("🔍 Does the password match?", isMatch);
}

testPassword();
