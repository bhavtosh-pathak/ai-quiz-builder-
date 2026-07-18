import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';


const ForgotPassword = () => {

  const navigate = useNavigate();


  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);


    try {

      await authService.forgotPassword({
        email
      });


      toast.success(
        "OTP sent to your email"
      );


      navigate('/verify-otp', {
        state:{
          email
        }
      });


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

      title="Forgot Password"

      subtitle="Enter your email and we will send you an OTP."

    >


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >


        <div>

          <label className="label">
            Email
          </label>


          <input

            type="email"

            required

            className="input"

            placeholder="you@example.com"

            value={email}

            onChange={(e)=>
              setEmail(e.target.value)
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
            ? "Sending OTP..."
            : "Send OTP"
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


export default ForgotPassword;