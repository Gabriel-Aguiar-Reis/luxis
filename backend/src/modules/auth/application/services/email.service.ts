import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Email } from '@/shared/common/value-object/email.vo'

@Injectable()
export class EmailService {
  private readonly mailerSend: MailerSend

  constructor(
    private readonly configService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository
  ) {
    const apiKey = this.configService.getMailersendApiKey()
    if (!apiKey) {
      this.logger.error('MAILERSEND_API_KEY not configured', 'EmailService')
      throw new Error('MailerSend API Key is required')
    }

    this.mailerSend = new MailerSend({
      apiKey: apiKey
    })

    this.logger.log('MailerSend initialized successfully', 'EmailService')
  }

  public async sendResetPasswordLink(email: Email): Promise<void> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new NotFoundException(
        `User not found for email: ${email.getValue()}`
      )
    }

    const payload = {
      sub: user.id,
      email: user.email.getValue(),
      type: 'password_reset'
    }

    const token = this.jwtService.sign(payload, {
      expiresIn: '1h'
    })

    const resetUrl = this.configService.isProduction()
      ? `${this.configService.getEmailResetPasswordUrl()}?token=${token}`
      : `http://localhost:3001/reset-password?token=${token}`

    const fromEmail =
      this.configService.getEmailFrom() || 'noreply@luxis.com.br'
    const sentFrom = new Sender(fromEmail, 'Luxis')
    const recipients = [new Recipient(email.getValue())]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Recuperação de Senha').setHtml(`
        <h1>Recuperação de Senha</h1>
        <p>Olá,</p>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Este link é válido por 1 hora.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      `).setText(`
        Recuperação de Senha
        
        Olá,
        
        Você solicitou a recuperação de senha. Acesse o link abaixo para redefinir sua senha:
        ${resetUrl}
        
        Este link é válido por 1 hora.
        Se você não solicitou a recuperação de senha, ignore este email.
      `)

    try {
      await this.mailerSend.email.send(emailParams)
      this.logger.log(`Email sent to ${email.getValue()}`, 'EmailService')
    } catch (error) {
      this.logger.error(
        `Error sending email to ${email.getValue()}: ${JSON.stringify(error)}`,
        'EmailService'
      )
      throw error
    }
  }
}
