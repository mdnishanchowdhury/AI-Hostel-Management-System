import  { useEffect } from 'react'
import ServicesSection from '../../../Components/HomeSection/FacilitiesSection'

function Services() {
    useEffect(() => {
          document.title = "Smart Hostel | Services";
      }, []);
  return (
    <div className="max-w-[1322px] mx-auto pt-32 py-12">
      <ServicesSection></ServicesSection>
    </div>
  )
}

export default Services