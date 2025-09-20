import ActivitySection from '../../Components/Home/ActivitySection'
import Banner from '../../Components/Home/Banner'
import ContactSection from '../../Components/Home/ContactSection'
import HostelFacality from '../../Components/Home/HostelFacality'
import Overview from '../../Components/Home/Overview'
import Services from '../../Components/Home/Services'

function Home() {
    return (
        <div>
            <Banner></Banner>
            <Overview></Overview>
            <Services></Services>
            <ActivitySection></ActivitySection>
            <HostelFacality></HostelFacality>
            <ContactSection></ContactSection>
        </div>
    )
}

export default Home