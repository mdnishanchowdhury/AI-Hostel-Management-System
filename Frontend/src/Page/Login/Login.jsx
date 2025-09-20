import { Link, } from 'react-router-dom';

function Login() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex flex-col lg:flex-row-reverse gap-16 md:gap-[204px]">

                {/* Login Card */}
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <h2 className='text-4xl font-bold text-center'>Login</h2>
                    <form className="card-body" onSubmit={handleSubmit}>

                        <div className="form-control">
                            <label className="label">Email</label>
                            <input name="email" type="email" className="input input-bordered w-full" placeholder="Email" required />
                        </div>

                        <div className="form-control">
                            <label className="label">Password</label>
                            <input type="password" name="password" className="input input-bordered w-full" placeholder="Password" required />
                        </div>

                        <div className="form-control">
                            <input className="btn btn-neutral bg-[#D1A054] w-full mt-4" type="submit" value="Login" />
                        </div>
                    </form>
                    <h2 className='font-semibold text-center mb-2 text-[#D1A054]'><span className='font-normal'>New here? </span> <Link to='/signUp'>Create a New Account</Link></h2>
                </div>


            </div>
        </div>
    );
}

export default Login;
