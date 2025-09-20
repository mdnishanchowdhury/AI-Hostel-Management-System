import React, { useEffect } from 'react'
import FacilitiesSection from '../../../Components/HomeSection/FacilitiesSection'

function Facilities() {
    useEffect(() => {
          document.title = "Smart Hostel | Facilities";
      }, []);
  return (
     <div className="max-w-[1322px] mx-auto pt-32 py-12 ">
      <FacilitiesSection></FacilitiesSection>
    </div>
  )
}

export default Facilities