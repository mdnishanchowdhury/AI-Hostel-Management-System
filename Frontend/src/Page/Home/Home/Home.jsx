import ActivitySection from '../../../Components/HomeSection/ActivitySection'
import Banner from '../../../Components/HomeSection/Banner'
import ContactSection from '../../../Components/HomeSection/ContactSection'
import HostelFacality from '../../../Components/HomeSection/HostelFacality'
import Overview from '../../../Components/HomeSection/Overview'
import FacilitiesSection from '../../../Components/HomeSection/FacilitiesSection'

function Home() {
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