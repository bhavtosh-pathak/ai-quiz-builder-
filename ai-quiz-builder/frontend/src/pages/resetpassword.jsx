import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';



const ResetPassword = () => {


  const navigate = useNavigate();

  const location = useLocation();



  const email = location.state?.email;

  const otp = location.state?.otp;




  const [form, setForm] = useState({

    password: '',

    confirmPassword: ''

  });



  const [loading, setLoading] = useState(false);





  const handleSubmit = async (e) => {


    e.preventDefault();



    if(!email || !otp){

      toast.error(
        "Invalid reset request"
      );

      return;

    }



    if(form.password !== form.confirmPassword){

      toast.error(
        "Passwords do not match"
      );

      return;

    }



    setLoading(true);



    try {


      await authService.resetPassword({

        email,

        otp,

        password: form.password

      });



      toast.success(
        "Password reset successful"
      );



      navigate('/login');



    } catch(err){


      toast.error(
        err.message
      );


    }
    finally{


      setLoading(false);


    }


  };





  return (

    <AuthLayout

      title="Reset Password"

      subtitle="Create a new password for your account."

    >



      <form

        onSubmit={handleSubmit}

        className="space-y-5"

      >



        <div>

          <label className="label">
            New Password
          </label>


          <input

            type="password"

            required

            className="input"

            placeholder="Enter new password"

            value={form.password}

            onChange={(e)=>
              setForm({

                ...form,

                password:e.target.value

              })
            }

          />

        </div>





        <div>

          <label className="label">
            Confirm Password
          </label>


          <input

            type="password"

            required

            className="input"

            placeholder="Confirm password"

            value={form.confirmPassword}

            onChange={(e)=>
              setForm({

                ...form,

                confirmPassword:e.target.value

              })
            }

          />

        </div>





        <button

          type="submit"

          disabled={loading}

          className="btn-primary w-full !py-3"

        >

          {
            loading
            ? "Updating..."
            : "Reset Password"
          }


        </button>




      </form>





      <p className="mt-6 text-sm text-ink/50">

        Remember your password?{' '}


        <Link

          to="/login"

          className="font-semibold text-primary-500 hover:underline"

        >

          Login

        </Link>


      </p>




    </AuthLayout>

  );

};



export default ResetPassword;