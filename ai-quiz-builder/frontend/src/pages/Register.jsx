// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import AuthLayout from '../layouts/AuthLayout';
// import { useAuth } from '../context/AuthContext';

// const Register = () => {
//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', institution: '' });
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const user = await register(form);
//       toast.success(`Account created — welcome, ${user.name.split(' ')[0]}`);
//       navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard', { replace: true });
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <AuthLayout title="Create your account" subtitle="Educators generate quizzes. Students compete on them.">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="label">I am a...</label>
//           <div className="grid grid-cols-2 gap-2">
//             {[
//               { value: 'student', label: 'Student', icon: '🎓' },
//               { value: 'teacher', label: 'Educator', icon: '📋' },
//             ].map((r) => (
//               <button
//                 type="button"
//                 key={r.value}
//                 onClick={() => setForm({ ...form, role: r.value })}
//                 className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
//                   form.role === r.value
//                     ? 'border-primary-400 bg-primary-50 text-primary-600'
//                     : 'border-ink/15 text-ink/60 hover:border-ink/30'
//                 }`}
//               >
//                 <span>{r.icon}</span> {r.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="label">Full name</label>
//           <input
//             required
//             className="input"
//             placeholder="Jordan Lee"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//         </div>
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
//             minLength={6}
//             className="input"
//             placeholder="At least 6 characters"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />
//         </div>
//         <div>
//           <label className="label">School / institution (optional)</label>
//           <input
//             className="input"
//             placeholder="Riverside High School"
//             value={form.institution}
//             onChange={(e) => setForm({ ...form, institution: e.target.value })}
//           />
//         </div>

//         <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
//           {submitting ? 'Creating account...' : 'Create account'}
//         </button>
//       </form>
//       <p className="mt-6 text-sm text-ink/50">
//         Already have an account?{' '}
//         <Link to="/login" className="font-semibold text-primary-500 hover:underline">
//           Log in
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// };

// export default Register;




import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';


const Register = () => {

  const { register } = useAuth();

  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    institution: ''
  });


  const [submitting, setSubmitting] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);


    try {

      await register(form);


      toast.success(
        "OTP sent to your email"
      );


      navigate('/verify-email', {

        state: {
          email: form.email
        }

      });


    } catch (err) {

      toast.error(
        err.message
      );

    } finally {

      setSubmitting(false);

    }

  };




  return (

    <AuthLayout
      title="Create your account"
      subtitle="Educators generate quizzes. Students compete on them."
    >


      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >



        <div>

          <label className="label">
            I am a...
          </label>


          <div className="grid grid-cols-2 gap-2">


            {[
              {
                value:'student',
                label:'Student',
                icon:'🎓'
              },

              {
                value:'teacher',
                label:'Educator',
                icon:'📋'
              }

            ].map((r)=>(


              <button

                type="button"

                key={r.value}

                onClick={() =>
                  setForm({
                    ...form,
                    role:r.value
                  })
                }


                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
                  
                  form.role === r.value

                  ?

                  'border-primary-400 bg-primary-50 text-primary-600'

                  :

                  'border-ink/15 text-ink/60 hover:border-ink/30'

                }`}

              >

                <span>
                  {r.icon}
                </span>

                {r.label}


              </button>


            ))}


          </div>

        </div>







        <div>

          <label className="label">
            Full name
          </label>


          <input

            required

            className="input"

            placeholder="Jordan Lee"

            value={form.name}

            onChange={(e)=>
              setForm({
                ...form,
                name:e.target.value
              })
            }

          />

        </div>







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

            minLength={6}

            className="input"

            placeholder="At least 6 characters"

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
            School / institution (optional)
          </label>


          <input

            className="input"

            placeholder="Riverside High School"

            value={form.institution}

            onChange={(e)=>
              setForm({
                ...form,
                institution:e.target.value
              })
            }

          />


        </div>







        <button

          type="submit"

          disabled={submitting}

          className="btn-primary w-full !py-3"

        >

          {
            submitting
            ?
            "Sending OTP..."
            :
            "Create account"
          }


        </button>




      </form>







      <p className="mt-6 text-sm text-ink/50">

        Already have an account?{' '}


        <Link

          to="/login"

          className="font-semibold text-primary-500 hover:underline"

        >

          Log in

        </Link>


      </p>




    </AuthLayout>

  );

};


export default Register;