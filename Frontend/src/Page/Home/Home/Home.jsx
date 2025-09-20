import ActivitySection from '../../../Components/HomeSection/ActivitySection'
import Banner from '../../../Components/HomeSection/Banner'
import ContactSection from '../../../Components/HomeSection/ContactSection'
import HostelFacality from '../../../Components/HomeSection/HostelFacality'
import Overview from '../../../Components/HomeSection/Overview'
import FacilitiesSection from '../../../Components/HomeSection/FacilitiesSection'
import { useEffect } from 'react'

function Home() {
    useEffect(() => {
        document.title = "Smart Hostel | Home";
    }, []);
    return (
        <div>
            <Banner></Banner>
            <Overview></Overview>
            <FacilitiesSection></FacilitiesSection>
            <ActivitySection></ActivitySection>
            <HostelFacality></HostelFacality>
            <ContactSection></ContactSection>
        </div>
    )
}

export default Home