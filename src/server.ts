import app from "./app";
import config from "config"
import logger from "./config/logger";

const startServer = () => {
  const PORT: number = config.get("server.port") || 5502
  try {
    app.listen(PORT, () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logger.info(`Listening on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

startServer();
