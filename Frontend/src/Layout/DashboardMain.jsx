import Menu from '../Page/DashBoard/Menu/Menu';
import { Outlet } from 'react-router-dom'

function DashboardMain() {
    return (
        <div className='flex gap-4'>
            <Menu></Menu>
            <Outlet></Outlet>
        </div>
    )
}

export default DashboardMain;