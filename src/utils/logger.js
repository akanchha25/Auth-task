const { createLogger, format, transports } = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const { environment } = require('./constants')

const logFormat = format.printf(
  ({ timestamp, label, level, message }) =>
    `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`
)

const debug = new DailyRotateFile({
  filename: 'logs/debug/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '30m',
  maxFiles: '7d',
  level: 'debug',
  handleExceptions: true
})

const info = new DailyRotateFile({
  filename: 'logs/info/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  handleExceptions: true
})

let transport = [new transports.Console({ silent: false }), debug]

if (process.env.NODE_ENV === environment.PRODUCTION) {
  transport = [info]
}

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.label({ label: process.env.APP_LABEL || 'PLATFORM_SERVER' }),
    logFormat
  ),
  transports: transport
})

module.exports = logger
