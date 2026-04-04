import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterWizard from '@/app/register/page'
import { useRouter } from 'next/navigation'
import React from 'react'

// Mocking useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock fetch globally
global.fetch = vi.fn()

describe('Page: RegisterWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
  })

  it('should render Step 1 and allow navigation to Step 2 after valid input', async () => {
    render(<RegisterWizard />)
    
    expect(screen.getByText('Etapa 1 de 3')).toBeInTheDocument()
    
    const nameInput = screen.getByPlaceholderText('Nome')
    const emailInput = screen.getByPlaceholderText('E-mail')
    const passwordInput = screen.getByPlaceholderText('Senha')
    const confirmInput = screen.getByPlaceholderText('Confirmar Senha')
    const nextButton = screen.getByText('Próxima etapa')
    
    // Fill step 1
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@solidariza.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmInput, { target: { value: 'password123' } })
    
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Etapa 2 de 3')).toBeInTheDocument()
    })
  })

  it('should show error in Step 1 for invalid email', async () => {
    render(<RegisterWizard />)
    
    const emailInput = screen.getByPlaceholderText('E-mail')
    const nextButton = screen.getByText('Próxima etapa')
    
    // Fill other fields to isolate email error
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'User' } })
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('E-mail inválido.')).toBeInTheDocument()
    })
  })

  it('should complete Step 2 (Category & Terms) and move to Step 3', async () => {
    render(<RegisterWizard />)
    
    // Step 1
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'User' } })
    fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 't@t.com' } })
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByText('Próxima etapa'))
    
    await waitFor(() => expect(screen.getByText('Etapa 2 de 3')).toBeInTheDocument())
    
    // Step 2
    const checkbox = await screen.findByRole('checkbox')
    fireEvent.click(checkbox)
    fireEvent.click(screen.getByText('Próxima etapa'))
    
    await waitFor(() => {
      expect(screen.getByText('Etapa 3 de 3')).toBeInTheDocument()
    })
  })

  it('should submit successfully in Step 3 and redirect to login', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as any)
    
    render(<RegisterWizard />)
    
    // Step 1
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Success' } })
    fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'ok@ok.com' } })
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByText('Próxima etapa'))
    
    // Step 2
    await waitFor(() => screen.getByText('Etapa 2 de 3'))
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByText('Próxima etapa'))
    
    // Step 3
    await waitFor(() => screen.getByText('Revise e confirme'))
    
    const finishButton = screen.getByText('Finalizar Cadastro')
    fireEvent.click(finishButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
      expect(push).toHaveBeenCalledWith('/login')
    })
  })
})
