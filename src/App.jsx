import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Fragments from './pages/Fragments'
import FragmentForm from './pages/FragmentForm'
import Tags from './pages/Tags'
import Info from './pages/Info'
import './App.css'
import Footer from './components/Footer'


function App() {
  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/fragments" element={<Fragments />} />
        <Route path="/fragment-form" element={<FragmentForm />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/info" element={<Info />} />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Fragments />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App