import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SharedElement } from './SharedElement'

test('renders photo grid', () => {
  render(<MemoryRouter><SharedElement /></MemoryRouter>)
  expect(screen.getByText('Mountain Dawn')).toBeInTheDocument()
  expect(screen.getByText('Ocean Depths')).toBeInTheDocument()
})
