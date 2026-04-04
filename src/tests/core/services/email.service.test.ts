import { vi, describe, it, expect, beforeEach } from 'vitest'
import { EmailService } from '@/core/services/email.service'

const { vi_sendMock } = vi.hoisted(() => ({
  vi_sendMock: vi.fn()
}))

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: vi_sendMock
      }
    }
  }
})

describe('EmailService', () => {
  let emailService: EmailService

  beforeEach(() => {
    vi.clearAllMocks()
    emailService = new EmailService()
  })

  it('should send welcome email', async () => {
    await emailService.sendWelcomeEmail('test@example.com', 'Test User')
    expect(vi_sendMock).toHaveBeenCalledWith(expect.objectContaining({
      to: ['test@example.com'],
      subject: 'Bem-vindo ao Solidariza!',
    }))
  })

  it('should handle errors in welcome email silently', async () => {
    const error = new Error('API Error')
    vi_sendMock.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await emailService.sendWelcomeEmail('fail@example.com', 'Fail User')
    
    expect(consoleSpy).toHaveBeenCalledWith("Erro ao enviar email de boas-vindas:", error)
    consoleSpy.mockRestore()
  })

  it('should send help offer notification', async () => {
    await emailService.sendHelpOfferNotification('recv@test.com', 'Receiver', 'Donor', 'Help Request 1')
    expect(vi_sendMock).toHaveBeenCalledWith(expect.objectContaining({
      to: ['recv@test.com'],
      subject: 'Nova oferta de ajuda recebida!',
    }))
  })

  it('should handle errors in help offer notification silently', async () => {
    const error = new Error('API Error')
    vi_sendMock.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await emailService.sendHelpOfferNotification('recv@test.com', 'Receiver', 'Donor', 'Help Request 1')
    expect(consoleSpy).toHaveBeenCalledWith("Erro ao enviar email de oferta:", error)
    consoleSpy.mockRestore()
  })

  it('should send donation confirmed notification', async () => {
    await emailService.sendDonationConfirmedNotification('donor@test.com', 'Donor', 'Help Request 1')
    expect(vi_sendMock).toHaveBeenCalledWith(expect.objectContaining({
      to: ['donor@test.com'],
      subject: 'Sua ajuda chegou ao destino!',
    }))
  })

  it('should handle errors in donation confirmed notification silently', async () => {
    const error = new Error('API Error')
    vi_sendMock.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await emailService.sendDonationConfirmedNotification('donor@test.com', 'Donor', 'Help Request 1')
    expect(consoleSpy).toHaveBeenCalledWith("Erro ao enviar email de confirmação:", error)
    consoleSpy.mockRestore()
  })
})
