import { MessageProducerBroker } from './common/types/broker';
import app from "./app";
import config from "config";
import logger from "./config/logger";
import { db } from "./config/db";
import { createMessageProducerBroker } from './common/factories/brokerFactory';

const PORT: number = config.get("server.port") || 5502;
let messageProduceBroker: MessageProducerBroker | null = null;

async function startServer() {
  try {
    // Connect to the database
    await db();

    // Handle application error events
    app.on("error", (error) => {
      if (error instanceof Error) {
        logger.error(error.message, error.stack);
      }
    });

    // Initialize the message broker and connect with retries
    messageProduceBroker = createMessageProducerBroker();
    await retryConnectBroker(messageProduceBroker);

    // Start the server
    app.listen(PORT, () => {
      logger.info(`⚙️  Server is running at port : ${PORT}`);
    });

    // Graceful shutdown on process termination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (err) {
    if (err instanceof Error) {
      if (messageProduceBroker) {
        await messageProduceBroker.disconnect();
      }
      logger.error("Startup error: " + err.message, err.stack);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
}

async function retryConnectBroker(broker: MessageProducerBroker, retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            logger.info(`Attempting broker connection (${i + 1}/${retries})...`);
            await broker.connect();
            logger.info("Broker connected successfully.");
            return;
        } catch (error) {
            logger.error(`Broker connection attempt ${i + 1} failed: ${(error as Error).message}`);
            if (i === retries - 1) throw error; // Throw after last retry
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}


async function shutdown() {
  logger.info("Shutting down gracefully...");
  if (messageProduceBroker) {
    await messageProduceBroker.disconnect();
  }
  process.exit(0);
}

// Start the server
startServer();

