import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';


const VerifyOTP = () => {

  const navigate = useNavigate();

  const location = useLocation();


  const email = location.state?.email;



  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();


    if(!email){

      toast.error("Email not found");

      return;

    }



    setLoading(true);


    try {


      await authService.verifyOTP({

        email,

        otp

      });



      toast.success(
        "OTP verified successfully"
      );



      navigate('/reset-password',{

        state:{
          email,
          otp
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

      title="Verify OTP"

      subtitle="Enter the OTP sent to your email."

    >



      <form

        onSubmit={handleSubmit}

        className="space-y-5"

      >



        <div>

          <label className="label">
            Enter OTP
          </label>


          <input

            type="text"

            maxLength="6"

            required

            className="input text-center tracking-[8px] text-lg"

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
            ? "Verifying..."
            : "Verify OTP"
          }


        </button>



      </form>






      <p className="mt-6 text-sm text-ink/50">


        Wrong email?{' '}


        <Link

          to="/forgot-password"

          className="font-semibold text-primary-500 hover:underline"

        >

          Try again

        </Link>


      </p>



    </AuthLayout>

  );

};



export default VerifyOTP;