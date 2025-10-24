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
import Settings from "../Page/UserDashboard/Settings/Settings";
import AutoBookedMeals from "../Page/AdminDashboard/AutoBookedMeals.jsx/AutoBookedMeals";
import MealsBooking from "../Page/UserDashboard/MealsBooking/MealsBooking";
import AdminMealsHistory from "../Page/AdminDashboard/MealsHistory/AdminMealsHistory";
import UserMealsHistory from "../Page/UserDashboard/UserMealsHistory/UserMealsHistory";
import UserPayment from "../Page/UserDashboard/UserPayment.jsx/UserPayment";
import UserPaymentHistory from "../Page/UserDashboard/UserPaymentHistory/UserPaymentHistory";
import AdminPaymentsHistory from "../Page/AdminDashboard/PaymentsHistory/AdminPaymentsHistory";
import DailyBookedMeals from "../Page/AdminDashboard/DailyBookedMeals/DailyBookedMeals";
import PaymentSuccess from "../Page/UserDashboard/UserPayment.jsx/PaymentSuccess";
import PaymentFail from "../Page/UserDashboard/UserPayment.jsx/PaymentFail";
import PaymentCancel from "../Page/UserDashboard/UserPayment.jsx/PaymentCancel";
import AddRoom from "../Page/AdminDashboard/AddRoom/AddRoom";
import AdminRooms from "../Page/AdminDashboard/AdminRooms/AdminRooms";

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
            },
            // SSLCommerz redirect pages
            {
                path: 'payment-success', element: <PaymentSuccess />
            },
            {
                path: 'payment-fail', element: <PaymentFail />
            },
            {
                path: 'payment-cancel', element: <PaymentCancel />
            },
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
            },
            {
                path: "settings",
                element: <PrivetRoute><Settings></Settings></PrivetRoute>,
            },
            {
                path: "mealbooking",
                element: <PrivetRoute><MealsBooking></MealsBooking></PrivetRoute>,
            },
            {
                path: "autobooking",
                element: <PrivetRoute><AutoBookedMeals></AutoBookedMeals></PrivetRoute>,
            },
            {
                path: "dailyBookedMeals",
                element: <PrivetRoute><DailyBookedMeals></DailyBookedMeals></PrivetRoute>,
            },
            {
                path: "mealsHistory",
                element: <PrivetRoute><AdminMealsHistory></AdminMealsHistory></PrivetRoute>,
            },
            {
                path: "history",
                element: <PrivetRoute><UserMealsHistory></UserMealsHistory></PrivetRoute>,
            },
            {
                path: "payments",
                element: <PrivetRoute><UserPayment></UserPayment></PrivetRoute>,
            },
            {
                path: "payments/History",
                element: <PrivetRoute><UserPaymentHistory></UserPaymentHistory></PrivetRoute>,
            },
            {
                path: "admin/payments/History",
                element: <PrivetRoute><AdminPaymentsHistory></AdminPaymentsHistory></PrivetRoute>,
            },
            {
                path: "addRoom",
                element: <PrivetRoute><AddRoom></AddRoom></PrivetRoute>,
            },
            {
                path: "adminRooms",
                element: <PrivetRoute><AdminRooms></AdminRooms></PrivetRoute>,
            }

        ]
    }
]);