import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
      </Routes>
    </BrowserRouter>
  )
}
