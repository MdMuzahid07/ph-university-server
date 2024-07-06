import mongoose from 'mongoose';
import config from './app/config';
import { Server } from "http";
import app from './app';
import seedSuperAdmin from './DB';

let server: Server;


async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });


  } catch (err) {
    console.log(err);
  }
}

main();

process.on("unhandledRejection", () => {
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1);
});


process.on("uncaughtException", () => {
  process.exit(1);
});