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
import DashboardMain from "../Layout/dashboardMain";
import PrivetRoute from "./PrivetRoute";
import AllUsers from "../Page/DashBoard/AllUsers/AllUsers";
import Dashboard from "../Page/DashBoard/Dashboard/Dashboard";
import AdminApplications from "../Page/DashBoard/AdminApplications/AdminApplications";

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
                element: <SignUp></SignUp>,
            },
            {
                path: 'apply',
                element: <ApplyForm></ApplyForm>,
            },
        ]
    },
    {
        path: "dashboard",
        element: <PrivetRoute><DashboardMain></DashboardMain></PrivetRoute>,
        children: [
            {
                path: "",
                element: <PrivetRoute><Dashboard></Dashboard></PrivetRoute>,
            },
            {
                path: "allUsers",
                element: <PrivetRoute><AllUsers></AllUsers></PrivetRoute>,
            },
            {
                path: "application",
                element: <AdminApplications></AdminApplications>,
            },
        ]
    }
]);