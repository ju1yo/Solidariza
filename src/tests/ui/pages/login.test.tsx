import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '@/app/login/page'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

// Mocking required modules (already partially done in setup.ts, but being explicit here for clarity)
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('Page: Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form correctly', () => {
    render(<LoginPage />)
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  it('should update input values on change', () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  it('should call signIn with credentials on submit', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Senha')
    const submitButton = screen.getByRole('button', { name: /Login/i })
    
    fireEvent.change(emailInput, { target: { value: 'admin@solidariza.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'admin@solidariza.com',
        password: '123456',
        callbackUrl: '/dashboard',
      })
    })
  })

  it('should display error message on login failure', async () => {
    vi.mocked(signIn).mockResolvedValue({ error: 'CredentialsSignin', status: 401, ok: false, url: null })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Senha')
    const submitButton = screen.getByRole('button', { name: /Login/i })

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument()
    })
  })

  it('should navigate to register page when clicking register button', () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as any)
    
    render(<LoginPage />)
    
    const registerButton = screen.getByText('Fazer Registro')
    fireEvent.click(registerButton)
    
    expect(push).toHaveBeenCalledWith('/register')
  })
})
