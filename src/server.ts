import app from "./app";
import config from "config"
import logger from "./config/logger";
import { db } from "./config/db";

// const startServer = async () => {
//   const PORT: number = config.get("server.port") || 5502
//   try {

//     await db()
    
//     app.listen(PORT, () => {
//       logger.info(`Listening on port ${PORT}`);
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       logger.error(error.message);
//       setTimeout(() => {
//         process.exit(1);
//       }, 1000);
//     }
//   }
// };

// void startServer();




const PORT: number = config.get("server.port") || 5502

db().then(() => {
    // Handle application error events
    app.on("error", (error) => {
      if (error instanceof Error) {
       logger.error(error.message);
      }
    });

    // Start the server
    app.listen(PORT, () => {
        logger.info(`⚙️  Server is running at port : ${PORT}`);
    });
}).catch((err) => {
     if (err instanceof Error) {
      logger.error(err.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
});
