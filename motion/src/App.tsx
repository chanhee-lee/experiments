import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'
import { PageTransition } from './demos/PageTransition'
import { StaggerList } from './demos/StaggerList'
import { GestureCard } from './demos/GestureCard'
import { SharedElement } from './demos/SharedElement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
        <Route path="/page-transition/*" element={<PageTransition />} />
        <Route path="/stagger-list" element={<StaggerList />} />
        <Route path="/gesture-card" element={<GestureCard />} />
        <Route path="/shared-element" element={<SharedElement />} />
      </Routes>
    </BrowserRouter>
  )
}
