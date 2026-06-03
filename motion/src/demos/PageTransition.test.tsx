import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PageTransition } from './PageTransition'

test('renders all nav items', () => {
  render(<MemoryRouter initialEntries={['/page-transition']}><PageTransition /></MemoryRouter>)
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Work')).toBeInTheDocument()
  expect(screen.getByText('About')).toBeInTheDocument()
})
