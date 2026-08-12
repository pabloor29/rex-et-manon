import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Feature from './components/Feature'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Zones from './components/Zones'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Feature />
        <Services />
        <Gallery />
        <Zones />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
