import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { LienMAC } from './LienMAC'
import { Footer } from './Footer'

function Layout() {
  return (
    <div>
        <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
        <main role="main" className="demande-aide">
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default Layout