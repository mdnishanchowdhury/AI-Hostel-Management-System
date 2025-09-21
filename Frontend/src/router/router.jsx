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
import UserMain from "../Layout/UserMain";
import Dashboard from "../Page/UserDashBoard/Dashboard";

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
        ]
    },
    {
        path: "user",
        element: <UserMain></UserMain>,
        children: [
            {
                path: "",
                element: <Dashboard></Dashboard>,
            },
        ]
    }
]);