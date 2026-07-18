// import { Link } from 'react-router-dom';

// const AuthLayout = ({ children, title, subtitle }) => (
//   <div className="min-h-screen grid lg:grid-cols-2 bg-paper">
//     {/* Left: form */}
//     <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
//       <Link to="/" className="mb-10 flex items-center gap-2">
//         <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-base font-semibold text-gold-400">
//           Q
//         </span>
//         <span className="font-display text-lg font-semibold">AI Quiz Builder</span>
//       </Link>
//       <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
//       {subtitle && <p className="mt-2 text-sm text-ink/50">{subtitle}</p>}
//       <div className="mt-8 max-w-sm">{children}</div>
//     </div>

//     {/* Right: editorial panel echoing the exam-ledger identity */}
//     <div className="hidden lg:flex relative overflow-hidden bg-ink text-paper flex-col justify-between p-14">
//       <div className="absolute inset-0 bg-grid-lines bg-[size:32px_32px] opacity-[0.06]" />
//       <p className="section-eyebrow text-gold-400 relative">Result Sheet — Class of Today</p>

//       <div className="relative space-y-6">
//         <p className="font-display text-4xl leading-tight">
//           "Great quizzes don't just test knowledge — they inspire curiosity, challenge minds, and turn learning into an experience."
          
//         </p>
//         <div className="flex items-center gap-4 font-mono text-xs text-paper/50">
//           <span>10 MCQs generated in 4.2s</span>
//           <span className="h-1 w-1 rounded-full bg-paper/30" />
//           <span>Auto-graded on submit</span>
//         </div>
//       </div>

//       <div className="relative grid grid-cols-3 gap-4 border-t border-paper/10 pt-6">
//         {[
//           { label: 'Rank', value: '#1' },
//           { label: 'Score', value: '92%' },
//           { label: 'Time', value: '04:12' },
//         ].map((s) => (
//           <div key={s.label}>
//             <p className="font-mono text-2xl font-semibold text-gold-400">{s.value}</p>
//             <p className="text-xs uppercase tracking-wide text-paper/40">{s.label}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// export default AuthLayout;
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen grid lg:grid-cols-2 bg-paper">

    {/* Left: Form */}
    <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
      
      <Link to="/" className="mb-10 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-base font-semibold text-gold-400">
          Q
        </span>

        <span className="font-display text-lg font-semibold">
          AI Quiz Builder
        </span>
      </Link>


      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-sm text-ink/50">
          {subtitle}
        </p>
      )}

      <div className="mt-8 max-w-sm">
        {children}
      </div>

    </div>



    {/* Right: AI Quiz Experience Panel */}
    <div className="hidden lg:flex relative overflow-hidden bg-ink text-paper flex-col justify-between p-14">

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-lines bg-[size:32px_32px] opacity-[0.06]" />


      {/* Top Heading */}
      <p className="section-eyebrow text-gold-400 relative">
        AI Powered Learning Experience
      </p>



      {/* Main Quote */}
      <div className="relative space-y-6">

        <p className="font-display text-4xl leading-tight">

          Build smarter quizzes with
          <span className="text-gold-400"> Artificial Intelligence </span>

          and turn every learning session into an
          <span className="text-white">
            {" "}interactive experience.
          </span>

        </p>


        <p className="text-sm text-paper/50 leading-relaxed max-w-md">
          Generate questions instantly, challenge your skills,
          compete with others and track your learning progress
          with real-time insights.
        </p>



        {/* Features */}
        <div className="flex items-center gap-4 font-mono text-xs text-paper/50">

          <span>
            AI Generated MCQs
          </span>

          <span className="h-1 w-1 rounded-full bg-gold-400" />

          <span>
            Live Leaderboard
          </span>

          <span className="h-1 w-1 rounded-full bg-gold-400" />

          <span>
            Auto Evaluation
          </span>

        </div>

      </div>




      {/* Stats Section */}
      <div className="relative grid grid-cols-3 gap-4 border-t border-paper/10 pt-6">

        {/* {[
          {
            label: 'Questions',
            value: '10+'
          },
          {
            label: 'Accuracy',
            value: '92%'
          },
          {
            label: 'Attempts',
            value: '1.2K+'
          }

        ].map((item) => (

          <div key={item.label}>

            <p className="font-mono text-2xl font-semibold text-gold-400">
              {item.value}
            </p>


            <p className="text-xs uppercase tracking-wide text-paper/40">
              {item.label}
            </p>

          </div>

        ))} */}

      </div>


    </div>

  </div>
);


export default AuthLayout;