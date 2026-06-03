import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GestureCard } from './GestureCard'

test('renders all three gesture cards', () => {
  render(<MemoryRouter><GestureCard /></MemoryRouter>)
  expect(screen.getByText('Drag Me')).toBeInTheDocument()
  expect(screen.getByText('Hover Tilt')).toBeInTheDocument()
  expect(screen.getByText('Tap Press')).toBeInTheDocument()
})
