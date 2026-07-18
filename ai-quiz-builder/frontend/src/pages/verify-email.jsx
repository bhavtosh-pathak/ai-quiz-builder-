import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';


const VerifyEmail = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { loginUser } = useAuth();


  const email = location.state?.email;


  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();


    if(!email){

      toast.error(
        "Email not found"
      );

      return;

    }



    setLoading(true);



    try {


      const res = await authService.verifyEmail({

        email,

        otp

      });



      toast.success(
        "Email verified successfully"
      );



      // save login data

      loginUser(
        res
      );



      navigate(
        res.user.role === 'teacher'
        ?
        '/teacher/dashboard'
        :
        '/student/dashboard',

        {
          replace:true
        }

      );



    } catch(err){


      toast.error(
        err.message
      );


    } finally{


      setLoading(false);


    }


  };




  return (

    <AuthLayout

      title="Verify your email"

      subtitle="Enter the 6 digit OTP sent to your email."

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

            className="input bg-gray-100"

            value={email || ''}

            disabled

          />


        </div>





        <div>

          <label className="label">
            Enter OTP
          </label>


          <input

            required

            maxLength={6}

            className="input text-center tracking-[8px] text-xl"

            placeholder="000000"

            value={otp}

            onChange={(e)=>
              setOtp(e.target.value)
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
            ?
            "Verifying..."
            :
            "Verify Email"
          }


        </button>



      </form>





      <p className="mt-6 text-sm text-ink/50">

        Wrong email?{' '}

        <Link

          to="/register"

          className="font-semibold text-primary-500 hover:underline"

        >

          Register again

        </Link>


      </p>




    </AuthLayout>

  );

};


export default VerifyEmail;