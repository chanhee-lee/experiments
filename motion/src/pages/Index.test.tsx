import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Index } from './Index'

test('renders all 6 demo cards', () => {
  render(<MemoryRouter><Index /></MemoryRouter>)
  expect(screen.getByText('Scroll Reveal')).toBeInTheDocument()
  expect(screen.getByText('Page Transition')).toBeInTheDocument()
  expect(screen.getByText('Stagger List')).toBeInTheDocument()
  expect(screen.getByText('Gesture Card')).toBeInTheDocument()
  expect(screen.getByText('Shared Element')).toBeInTheDocument()
  expect(screen.getByText('Parallax Hero')).toBeInTheDocument()
})
