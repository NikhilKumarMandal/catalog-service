import { createLogger, format, transports } from "winston";
import { Config } from ".";
const { combine, timestamp, json, colorize, printf } = format;

// Custom format for console logging with colors
const consoleLogFormat = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
      silent: Config.NODE_ENV === "test",
    }),
    new transports.File({
      filename: "app.log",
      dirname: "logs",
      level: "info",
      silent: Config.NODE_ENV === "test",
    }),
    new transports.File({
      filename: "error.log",
      dirname: "logs",
      level: "error",
      silent: Config.NODE_ENV === "test",
    }),
  ],
});

export default logger;
