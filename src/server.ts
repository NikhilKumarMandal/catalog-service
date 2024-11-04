import { MessageProducerBroker } from './common/types/broker';
import app from "./app";
import config from "config"
import logger from "./config/logger";
import { db } from "./config/db";
import { createMessageProducerBroker } from './common/factories/brokerFactory';



const PORT: number = config.get("server.port") || 5502
let messageProduceBroker: MessageProducerBroker | null = null;
db().then(async () => {
    // Handle application error events
    app.on("error", (error) => {
      if (error instanceof Error) {
       logger.error(error.message);
      }
    });
  messageProduceBroker = createMessageProducerBroker()
  
  await messageProduceBroker.connect()

    // Start the server
    app.listen(PORT, () => {
        logger.info(`⚙️  Server is running at port : ${PORT}`);
    });

}).catch((err) => {
  if (err instanceof Error) {
      if (messageProduceBroker) {
        messageProduceBroker.disconnect()
      }
      logger.error(err.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
});
