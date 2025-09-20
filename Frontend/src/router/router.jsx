import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Page/Home/Home";
import Fees from "../Components/Home/Fees";
import Services from "../Components/Home/Services";
import Contact from "../Components/Home/Contact";
import About from "../Components/Home/About";
import Dashboard from "../Components/Home/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children:[
        {
            path:'',
            element:<Home></Home>,
        },
        {
            path:'fees',
            element:<Fees></Fees>,
        },
        {
            path:'services',
            element:<Services></Services>,
        },
        {
            path:'contact',
            element:<Contact></Contact>,
        },
        {
            path:'about',
            element:<About></About>,
        },
        {
            path:'dashboard',
            element:<Dashboard></Dashboard>,
        },
    ]
  },
]);