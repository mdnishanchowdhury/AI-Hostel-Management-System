import React, { useEffect } from 'react'

function Dashboard() {
    useEffect(() => {
          document.title = "Smart Hostel | User Dashboard";
      }, []);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard