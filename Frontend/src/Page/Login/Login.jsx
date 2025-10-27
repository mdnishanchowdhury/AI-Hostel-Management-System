import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import useAuth from "../../Hook/useAuth";
import Swal from "sweetalert2";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { signInUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        signInUser(email, password)
            .then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Logged in successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/')
            })
            .catch(error => {
                let message;
                switch (error.code) {
                    case "auth/user-not-found":
                        message = "User not found. Please register first.";
                        break;
                    case "auth/wrong-password":
                        message = "Wrong password. Try again.";
                        break;
                    case "auth/invalid-email":
                        message = "Invalid email format.";
                        break;
                    default:
                        message = "Login failed. Please check your password.";
                }

                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: message,
                    showConfirmButton: true
                });
            });
    };

    useEffect(() => {
        document.title = "Smart Hostel | Sign in";
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f87171] to-[#fb923c] px-3 md:px-0">
            <div className="card w-full max-w-md bg-white shadow-xl rounded-2xl p-6 md:p-10">
                <h2 className="text-4xl font-medium font-poppins text-center text-gray-800 mb-6">Sign in</h2>

                <h2 className="text-2xl">User</h2>
                <h2>Email: nishanchowdhury4130@gmail.com</h2>
                <h2>Password: Nishan@12</h2>

                <h2 className="text-2xl">Admin</h2>
                <h2>Email: nishanchowdhury.cse@gmail.com</h2>
                <h2>Password: Nishan@12</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="form-control">
                        <label className="label text-gray-600 font-poppins font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="form-control relative">
                        <label className="label font-poppins text-gray-600 font-medium">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
                            required
                        />
                        <span
                            className="absolute right-3 top-[38px] cursor-pointer font-poppins text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                        </span>
                    </div>

                    <div className="form-control mt-4">
                        <button
                            type="submit"
                            className="btn bg-[#f87171] font-poppins hover:bg-red-600 text-white font-semibold w-full rounded-lg transition-all duration-300"
                        >
                            Login
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-500 mt-4">
                    New here?{" "}
                    <Link to="/apply" className="text-[#f87171] font-poppins font-semibold hover:underline">
                        Hostel Registration Form
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
