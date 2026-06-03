import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ScrollReveal } from './ScrollReveal'

test('renders without crashing', () => {
  render(<MemoryRouter><ScrollReveal /></MemoryRouter>)
})
