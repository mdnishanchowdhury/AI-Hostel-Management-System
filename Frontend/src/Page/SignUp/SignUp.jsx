import { useEffect, useState } from 'react';
import { Link, } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';

function SignUp() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = data => {
        createUser(data)
    };

    useEffect(() => {
        document.title = 'Smart Hostel | SignUp';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r  from-[#f87171] to-[#fb923c] py-10">
            <div className="card w-full max-w-md bg-white shadow-xl rounded-2xl p-6 md:p-10">
                <h2 className="text-4xl font-normal text-center font-poppins text-gray-800 mb-6">Create Account</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    <div className="form-control">
                        <label className="label text-gray-600 font-medium font-poppins">Name</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Your Name"
                            className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                        />
                        {errors.name && <span className='text-red-600'>Name is required</span>}
                    </div>

                    {/* Photo URL */}
                    <div className="form-control">
                        <label className="label text-gray-600 font-poppins font-medium">Photo URL</label>
                        <input
                            type="text"
                            {...register("PhotoURl")}
                            placeholder="Photo URL"
                            className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label text-gray-600 font-poppins font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Email"
                            className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                        />
                        {errors.email && <span className='text-red-600'>Email is required</span>}
                    </div>

                    {/* Password */}
                    <div className="form-control relative">
                        <label className="label font-poppins text-gray-600 font-medium">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                maxLength: 20,
                                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/
                            })}
                            placeholder="Password"
                            className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none pr-10"
                        />
                        <span
                            className="absolute right-3 top-[38px] cursor-pointer font-poppins text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                        </span>
                        {errors.password?.type === 'minLength' && <span className='text-red-600'>Password must be at least 6 characters</span>}
                        {errors.password?.type === 'maxLength' && <span className='text-red-600'>Password must be less than 20 characters</span>}
                        {errors.password?.type === 'pattern' && <span className='text-red-600'>Password must include one uppercase, one lowercase & one number</span>}
                    </div>

                    {/* Submit */}
                    <div className="form-control mt-4">
                        <button
                            type="submit"
                            className="btn bg-[#f87171] font-poppins hover:bg-red-600 text-white font-semibold w-full rounded-lg transition-all duration-300"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                {/* <p className="text-center text-gray-500 mt-4">
                    Already registered?{" "}
                    <Link to='' className="text-red-600 font-semibold hover:underline">
                        Go to Login
                    </Link>
                </p> */}

            </div>
        </div>
    );
}

export default SignUp;
