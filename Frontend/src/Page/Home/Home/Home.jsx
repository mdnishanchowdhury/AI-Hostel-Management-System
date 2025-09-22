import ActivitySection from '../../../Components/HomeSection/ActivitySection'
import Banner from '../../../Components/HomeSection/Banner'
import ContactSection from '../../../Components/HomeSection/ContactSection'
import HostelFacality from '../../../Components/HomeSection/HostelFacality'
import FacilitiesSection from '../../../Components/HomeSection/FacilitiesSection'
import { useEffect } from 'react'
import LifeHostel from '../../../Components/HomeSection/LifeHostel'

function Home() {
    useEffect(() => {
        document.title = "Smart Hostel | Home";
    }, []);
    return (
        <div>
            <Banner></Banner>
            <LifeHostel></LifeHostel>
            <FacilitiesSection></FacilitiesSection>
            <ActivitySection></ActivitySection>
            <HostelFacality></HostelFacality>
            <ContactSection></ContactSection>
        </div>
    )
}

export default Home