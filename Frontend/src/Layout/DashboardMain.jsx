import DashoardMenu from '../Page/DashoardMenu/Menu';
import { Outlet } from 'react-router-dom'

function DashboardMain() {
    return (
        <div className='flex gap-4'>
            <DashoardMenu></DashoardMenu>
            <Outlet></Outlet>
        </div>
    )
}

export default DashboardMain;