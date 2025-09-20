import { useEffect } from 'react'
import ContactSection from '../../../Components/HomeSection/ContactSection'

function Contact() {
    useEffect(() => {
          document.title = "Smart Hostel | Contact";
      }, []);
  return (
    <div className="max-w-[1322px] mx-auto pt-32 py-12 ">
      <ContactSection></ContactSection>
    </div>
  )
}

export default Contact