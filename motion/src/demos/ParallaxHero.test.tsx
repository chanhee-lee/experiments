import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ParallaxHero } from './ParallaxHero'

test('renders hero headline', () => {
  render(<MemoryRouter><ParallaxHero /></MemoryRouter>)
  expect(screen.getByText(/Build things/i)).toBeInTheDocument()
})
