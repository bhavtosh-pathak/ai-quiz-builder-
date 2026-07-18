// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import AuthLayout from '../layouts/AuthLayout';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const user = await login(form);
//       toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
//       const dest = location.state?.from?.pathname || (user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
//       navigate(dest, { replace: true });
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <AuthLayout title="Log in" subtitle="Pick up right where you left off.">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="label">Email</label>
//           <input
//             type="email"
//             required
//             className="input"
//             placeholder="you@school.edu"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />
//         </div>
//         <div>
//           <label className="label">Password</label>
//           <input
//             type="password"
//             required
//             className="input"
//             placeholder="••••••••"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />
//         </div>
//         <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
//           {submitting ? 'Logging in...' : 'Log in'}
//         </button>
//       </form>
//       <p className="mt-6 text-sm text-ink/50">
//         New here?{' '}
//         <Link to="/register" className="font-semibold text-primary-500 hover:underline">
//           Create an account
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// };

// export default Login;


import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

const Login = () => {

  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();


  const [form, setForm] = useState({
    email: '',
    password: ''
  });


  const [submitting, setSubmitting] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);


    try {

      const user = await login(form);


      toast.success(
        `Welcome back, ${user.name.split(' ')[0]}`
      );


      const dest =
        location.state?.from?.pathname ||
        (
          user.role === 'teacher'
          ? '/teacher/dashboard'
          : '/student/dashboard'
        );


      navigate(dest, {
        replace:true
      });


    } catch(err){

      toast.error(err.message);

    }
    finally{

      setSubmitting(false);

    }

  };




  return (

    <AuthLayout 
      title="Log in" 
      subtitle="Pick up right where you left off."
    >


      <form 
        onSubmit={handleSubmit} 
        className="space-y-4"
      >


        <div>

          <label className="label">
            Email
          </label>


          <input

            type="email"

            required

            className="input"

            placeholder="you@school.edu"

            value={form.email}

            onChange={(e)=>
              setForm({
                ...form,
                email:e.target.value
              })
            }

          />

        </div>





        <div>

          <label className="label">
            Password
          </label>


          <input

            type="password"

            required

            className="input"

            placeholder="••••••••"

            value={form.password}

            onChange={(e)=>
              setForm({
                ...form,
                password:e.target.value
              })
            }

          />


        </div>





        {/* Forgot Password */}

        <div className="text-right">

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-primary-500 hover:underline"
          >
            Forgot password?
          </Link>

        </div>





        <button

          type="submit"

          disabled={submitting}

          className="btn-primary w-full !py-3"

        >

          {
            submitting
            ? 'Logging in...'
            : 'Log in'
          }

        </button>


      </form>





      <p className="mt-6 text-sm text-ink/50">

        New here?{' '}

        <Link

          to="/register"

          className="font-semibold text-primary-500 hover:underline"

        >
          Create an account
        </Link>


      </p>



    </AuthLayout>

  );

};


export default Login;