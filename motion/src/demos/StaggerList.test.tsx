import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StaggerList } from './StaggerList'

test('renders Replay button and post list', () => {
  render(<MemoryRouter><StaggerList /></MemoryRouter>)
  expect(screen.getByText('Replay')).toBeInTheDocument()
  expect(screen.getByText('Building with Motion v12')).toBeInTheDocument()
})
