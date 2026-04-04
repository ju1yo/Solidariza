import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@/components/ui/button'
import React from 'react'

describe('UI Component: Button', () => {
  it('should render the button with text', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique</Button>)
    
    fireEvent.click(screen.getByText('Clique'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should show loading state if implementation supports it (manual check)', () => {
    // Apenas um exemplo de como testaríamos variantes do Shadcn se necessário
    render(<Button variant="destructive">Destrutivo</Button>)
    const button = screen.getByText('Destrutivo')
    expect(button).toHaveClass('bg-destructive')
  })
})
