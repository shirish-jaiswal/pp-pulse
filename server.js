require("dotenv").config();
const { spawn } = require("child_process");

const port = process.env.PORT || 3000;
const command = process.argv[2]; // "dev" or "start"

if (!command) {
  console.error("Please provide a command: dev or start");
  process.exit(1);
}

spawn(
  "next",
  [command, "-p", port],
  {
    stdio: "inherit",
    shell: true,
  }
);