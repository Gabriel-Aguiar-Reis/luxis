import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Injectable, LoggerService } from '@nestjs/common'
import { AppConfigService } from '@/shared/config/app-config.service'

@Injectable()
export class CustomLogger implements LoggerService {
  private static contextRules: Record<string, number> = {}
  private static initialized = false

  private readonly DEFAULT_CONTEXT = '*'
  private readonly DEFAULT_LEVEL = 'info'
  private readonly LOG_LEVEL_MAP: Record<string, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
  }

  constructor(
    @InjectPinoLogger()
    private readonly logger: PinoLogger,
    private readonly appConfigService: AppConfigService
  ) {
    if (!CustomLogger.initialized) {
      this.initializeContextRules()
      CustomLogger.initialized = true
    }
  }

  verbose(message: string, context?: string) {
    if (this.shouldLog('trace', context ?? '')) {
      this.logger.trace(
        { context, environment: this.appConfigService.getNodeEnv() },
        message
      )
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog('debug', context ?? '')) {
      this.logger.debug(
        { context, environment: this.appConfigService.getNodeEnv() },
        message
      )
    }
  }

  log(message: string, context?: string) {
    if (this.shouldLog('info', context ?? '')) {
      this.logger.info(
        { context, environment: this.appConfigService.getNodeEnv() },
        message
      )
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog('warn', context ?? '')) {
      this.logger.warn(
        { context, environment: this.appConfigService.getNodeEnv() },
        message
      )
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog('error', context ?? '')) {
      this.logger.error(
        {
          context,
          environment: this.appConfigService.getNodeEnv(),
          trace: this.appConfigService.isProduction() ? undefined : trace
        },
        message
      )
    }
  }

  private initializeContextRules() {
    const rules = this.appConfigService.getLogRules() ?? ''
    if (!rules) {
      CustomLogger.contextRules[this.DEFAULT_CONTEXT] =
        this.LOG_LEVEL_MAP[this.DEFAULT_LEVEL]
      return
    }

    try {
      const ruleEntries = rules.split('/')
      for (const rule of ruleEntries) {
        let contextPart = this.DEFAULT_CONTEXT
        let levelPart = this.DEFAULT_LEVEL
        const parts = rule.split(';')

        for (const part of parts) {
          if (part.startsWith('context=')) {
            contextPart = part.split('=')[1] || this.DEFAULT_CONTEXT
          } else if (part.startsWith('level=')) {
            levelPart = part.split('=')[1] || this.DEFAULT_LEVEL
          }
        }

        const contexts = contextPart.split(',')
        const numericLevel =
          this.LOG_LEVEL_MAP[levelPart.trim()] ??
          this.LOG_LEVEL_MAP[this.DEFAULT_LEVEL]

        for (const context of contexts) {
          CustomLogger.contextRules[context.trim()] = numericLevel
        }
      }
    } catch (error) {
      this.logger.error({ error }, 'Error initializing log rules')
      CustomLogger.contextRules[this.DEFAULT_CONTEXT] =
        this.LOG_LEVEL_MAP[this.DEFAULT_LEVEL]
    }
  }

  private shouldLog(methodLevel: string, context: string): boolean {
    const currentLevel = this.LOG_LEVEL_MAP[methodLevel]
    const requiredLevel = this.getLogLevel(context)
    return currentLevel >= requiredLevel
  }

  private getLogLevel(context?: string): number {
    context = context ?? ''
    return (
      CustomLogger.contextRules[context] ??
      CustomLogger.contextRules[this.DEFAULT_CONTEXT] ??
      this.LOG_LEVEL_MAP[this.DEFAULT_LEVEL]
    )
  }
}
