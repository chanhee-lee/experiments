import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DemoLayout } from './DemoLayout'

test('renders back link, title, and API tags', () => {
  render(
    <MemoryRouter>
      <DemoLayout title="Scroll Reveal" apis={['whileInView', 'viewport']} accent="#6366F1">
        <div>demo content</div>
      </DemoLayout>
    </MemoryRouter>
  )
  expect(screen.getByText('← Back')).toBeInTheDocument()
  expect(screen.getByText('Scroll Reveal')).toBeInTheDocument()
  expect(screen.getByText('whileInView')).toBeInTheDocument()
  expect(screen.getByText('viewport')).toBeInTheDocument()
  expect(screen.getByText('demo content')).toBeInTheDocument()
})
