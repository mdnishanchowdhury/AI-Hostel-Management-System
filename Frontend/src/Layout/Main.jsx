import Navbar from '../Shared/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../Shared/Footer'

function Main() {
  const location = useLocation();
  const noheaderFooter = location.pathname.includes('/login')


  return (
    <div>
      {
        noheaderFooter || <Navbar></Navbar>
      }
      <Outlet></Outlet>
      {
        noheaderFooter || <Footer></Footer>
      }
    </div>
  )
}

export default Main