import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Page/Home/Home/Home";
import Fees from "../Page/Home/Fees/Fees";
import Contact from "../Page/Home/Contact/Contact";
import About from "../Page/Home/About/About";
import Services from "../Page/Home/Services/Services";
import Facilities from "../Page/Home/Facilities/Facilities";
import SignUp from "../Page/SignUp/SignUp";
import Login from "../Page/Login/Login";
import ApplyForm from "../Page/ApplyForm/ApplyForm";
import PrivetRoute from "./PrivetRoute";
import AllUsers from "../Page/AdminDashboard/AllUsers/AllUsers";
import AdminApplications from "../Page/AdminDashboard/AdminApplications/AdminApplications";
import DashboardSwitch from "../Page/DashboardSwitch/DashboardSwitch";
import MyRoom from "../Page/UserDashboard/MyRoon/MyRoon";
import DashboardMain from "../Layout/DashboardMain";
import Profile from "../Page/UserDashboard/Profile/Profile";
export const router = createBrowserRouter([
    
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: '',
                element: <Home></Home>,
            },
            {
                path: 'fees',
                element: <Fees></Fees>,
            },
            {
                path: 'services',
                element: <Services></Services>,
            },
            {
                path: 'contact',
                element: <Contact></Contact>,
            },
            {
                path: 'about',
                element: <About></About>,
            },
            {
                path: 'facilities',
                element: <Facilities></Facilities>,
            },
            {
                path: 'login',
                element: <Login></Login>,
            },
            {
                path: 'signUp',
                element: <PrivetRoute><SignUp></SignUp></PrivetRoute>,
            },
            {
                path: 'apply',
                element: <ApplyForm></ApplyForm>,
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivetRoute><DashboardMain></DashboardMain></PrivetRoute>,
        children: [
            {
                path: "",
                element: <PrivetRoute>
                    <DashboardSwitch></DashboardSwitch>
                </PrivetRoute>,
            },
            {
                path: "allUsers",
                element: <PrivetRoute><AllUsers></AllUsers></PrivetRoute>,
            },
            {
                path: "application",
                element: <PrivetRoute><AdminApplications></AdminApplications></PrivetRoute>,
            },
            {
                path: "myRoom",
                element: <PrivetRoute><MyRoom></MyRoom></PrivetRoute>,
            },
            {
                path: "profile",
                element: <PrivetRoute><Profile></Profile></PrivetRoute>,
            }
        ]
    }
]);