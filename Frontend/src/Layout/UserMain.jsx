import StudentSidebar from '../Page/UserDashBoard/StudentSidebar'
import { Outlet } from 'react-router-dom'

function UserMain() {
    return (
        <div className='flex gap-4'>
            <StudentSidebar></StudentSidebar>
            <Outlet></Outlet>
        </div>
    )
}

export default UserMain