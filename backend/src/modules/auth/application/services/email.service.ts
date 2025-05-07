import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectPinoLogger } from 'nestjs-pino'
import { createTransport, Transporter, Mail } from 'nodemailer'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Email } from '@/shared/common/value-object/email.vo'

@Injectable()
export class EmailService {
  private readonly transporter: Transporter

  constructor(
    private readonly configService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository
  ) {
    this.transporter = createTransport({
      host: this.configService.getEmailHost(),
      port: this.configService.getEmailPort(),
      secure: false,
      auth: {
        user: this.configService.getEmailUser(),
        pass: this.configService.getEmailPassword()
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  private async sendMail(options: Mail.Options): Promise<void> {
    try {
      await this.transporter.sendMail(options)
      this.logger.log(`Email sent to ${options.to}`, 'EmailService')
    } catch (error) {
      this.logger.error(
        `Error sending email to ${options.to}: ${error.message}`,
        'EmailService'
      )
      throw error
    }
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
      : `http://localhost:3000/auth/reset-password-page?token=${token}`

    const mailOptions: Mail.Options = {
      from: this.configService.getEmailUser(),
      to: email.getValue(),
      subject: 'Recuperação de Senha',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Olá,</p>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Este link é válido por 1 hora.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      `
    }

    await this.sendMail(mailOptions)
  }
}
