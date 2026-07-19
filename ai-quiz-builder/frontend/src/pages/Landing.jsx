// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import QuizCodeTicket from '../components/QuizCodeTicket';

// const steps = [
//   {
//     n: '01',
//     title: 'Prompt it',
//     body: 'Type "Generate 10 Java OOP MCQs" — Gemini drafts the questions, options, answers and difficulty in seconds.',
//   },
//   {
//     n: '02',
//     title: 'Review & publish',
//     body: 'Edit any question inline, set the timer and negative marking, then publish to get a shareable quiz code.',
//   },
//   {
//     n: '03',
//     title: 'Watch it run live',
//     body: 'Students join with the code. Every submission updates the leaderboard instantly for the whole room.',
//   },
// ];

// const features = [
//   { title: 'AI question generation', body: 'Gemini writes balanced MCQs with difficulty tagging and rationale.' },
//   { title: 'Real-time leaderboard', body: 'Socket.io pushes rank changes the moment a student submits.' },
//   { title: 'Role-based access', body: 'Separate, protected experiences for educators and students.' },
//   { title: 'Timed auto-submit', body: 'Countdown timers auto-submit so no attempt hangs open.' },
//   { title: 'Negative marking', body: 'Optional penalty per wrong answer, configured per quiz.' },
//   { title: 'Analytics dashboard', body: 'Track averages, top performers and per-quiz trends over time.' },
// ];

// const Landing = () => (
//   <div className="min-h-screen bg-paper">
//     <Navbar />

//     {/* Hero */}
//     <section className="relative overflow-hidden border-b border-ink/10">
//       <div className="absolute inset-0 bg-grid-lines bg-[size:28px_28px] opacity-60" />
//       <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
//         <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
//           <div>
//             <p className="section-eyebrow mb-4">Educator prompt → live classroom quiz</p>
//             <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
//               Write one sentence.
//               <br />
//               Get a graded quiz <span className="text-primary-500">with a scoreboard.</span>
//             </h1>
//             <p className="mt-6 max-w-lg text-base text-ink/55">
//               AI Quiz Builder turns a short prompt into a ready-to-run MCQ set, then lets your class compete on a
//               leaderboard that updates the instant someone submits — no refresh required.
//             </p>
//             <div className="mt-8 flex flex-wrap items-center gap-3">
//               <Link to="/register" className="btn-primary !px-6 !py-3 text-sm">
//                 Start building quizzes →
//               </Link>
//               <Link to="/login" className="btn-secondary !px-6 !py-3 text-sm">
//                 I already have an account
//               </Link>
//             </div>
//             <div className="mt-8 flex items-center gap-3">
//               <span className="text-xs uppercase tracking-wide text-ink/40">Sample join code</span>
//               <QuizCodeTicket code="7XQK2P" />
//             </div>
//           </div>

//           {/* Signature element: a mock live leaderboard card */}
//           <div className="surface p-1.5 lg:justify-self-end lg:w-full lg:max-w-md">
//             <div className="rounded-[0.9rem] bg-ink px-5 py-4 text-paper">
//               <div className="flex items-center justify-between">
//                 <p className="section-eyebrow !text-gold-400">Data Structures Quiz</p>
//                 <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
//                   <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
//                 </span>
//               </div>
//               <p className="mt-1 font-mono text-xs text-paper/40">32 students in room</p>
//             </div>
//             <div className="p-4 space-y-2">
//               {[
//                 { rank: 1, name: 'Aditi R.', score: '18/20', pct: '90%' },
//                 { rank: 2, name: 'Marcus O.', score: '17/20', pct: '85%' },
//                 { rank: 3, name: 'Priya N.', score: '16/20', pct: '80%' },
//               ].map((r) => (
//                 <div key={r.rank} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-paper-dim">
//                   <div className="flex items-center gap-3">
//                     <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-50 font-mono text-xs font-bold text-gold-600">
//                       {r.rank}
//                     </span>
//                     <span className="text-sm font-medium">{r.name}</span>
//                   </div>
//                   <div className="flex items-center gap-3 font-mono text-sm">
//                     <span className="text-ink/50">{r.score}</span>
//                     <span className="font-semibold text-primary-500">{r.pct}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>

//     {/* How it works */}
//     <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
//       <p className="section-eyebrow">How it works</p>
//       <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Three steps, one class period.</h2>

//       <div className="mt-10 grid gap-8 md:grid-cols-3">
//         {steps.map((s) => (
//           <div key={s.n} className="relative pl-2">
//             <p className="font-display text-5xl font-semibold text-ink/10">{s.n}</p>
//             <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
//             <p className="mt-2 text-sm leading-relaxed text-ink/55">{s.body}</p>
//           </div>
//         ))}
//       </div>
//     </section>

//     {/* Features */}
//     <section className="border-y border-ink/10 bg-paper-dim/60">
//       <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
//         <p className="section-eyebrow">Built for the whole quiz lifecycle</p>
//         <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Everything from prompt to podium.</h2>

//         <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {features.map((f) => (
//             <div key={f.title} className="surface p-5">
//               <h3 className="font-display text-base font-semibold">{f.title}</h3>
//               <p className="mt-1.5 text-sm text-ink/55">{f.body}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>

//     {/* CTA */}
//     <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
//       <div className="surface flex flex-col items-center gap-4 bg-ink px-8 py-14 text-center text-paper">
//         <p className="section-eyebrow !text-gold-400">Ready when you are</p>
//         <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
//           Your next quiz is one prompt away.
//         </h2>
//         <div className="mt-2 flex flex-wrap justify-center gap-3">
//           <Link to="/register" className="btn-gold !px-6 !py-3 text-sm">
//             Create a free account
//           </Link>
//         </div>
//       </div>
//     </section>

//     <Footer />
//   </div>
// );

// export default Landing;
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const steps = [
  {
    n: '01',
    title: 'Prompt it',
    body: 'Type "Generate Java OOP MCQs" — Gemini drafts the questions, options, answers and difficulty in seconds.',
  },
  {
    n: '02',
    title: 'Review & publish',
    body: 'Edit any question inline, set the timer and negative marking, then publish to get a shareable quiz code.',
  },
  {
    n: '03',
    title: 'Watch it run live',
    body: 'Students join with the code. Every submission updates the leaderboard instantly for the whole room.',
  },
];

const features = [
  { title: 'AI question generation', body: 'Gemini writes balanced MCQs with difficulty tagging and rationale.' },
  { title: 'Real-time leaderboard', body: 'Socket.io pushes rank changes the moment a student submits.' },
  { title: 'Role-based access', body: 'Separate, protected experiences for educators and students.' },
  { title: 'Timed auto-submit', body: 'Countdown timers auto-submit so no attempt hangs open.' },
  { title: 'Negative marking', body: 'Optional penalty per wrong answer, configured per quiz.' },
  { title: 'Analytics dashboard', body: 'Track averages, top performers and per-quiz trends over time.' },
];

const Landing = () => (
  <div className="min-h-screen bg-paper">
    <Navbar />

    {/* Hero */}
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="absolute inset-0 bg-grid-lines bg-[size:28px_28px] opacity-60" />
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <span className="mb-10 inline-flex items-center gap-6 rounded-full border border-ink/10 bg-paper px-3 py-3 text-xs font-semibold text-ink/90 shadow-sm">
            ✨ Powered by Gemini AI
          </span>
          <p className="section-eyebrow mb-4">Educator prompt → live classroom quiz</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Write one sentence.
            <br />
            Get a graded quiz <span className="text-primary-500">with a scoreboard.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-ink/55">
            AI Quiz Builder turns a short prompt into a ready-to-run MCQ set, then lets your class compete on a
            leaderboard that updates the instant someone submits — no refresh required.
          </p>
          {/* <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/register"
              className="btn-primary !px-7 !py-3.5 text-sm shadow-lg shadow-primary-500/20 transition-transform hover:-translate-y-0.5"
            >
              Try it free — no card needed ✨
            </Link>
            <p className="text-xs font-medium text-ink/45">
              Built by educators, for classrooms that move fast — first quiz in under 2 minutes.
            </p>
          </div> */}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="section-eyebrow">How it works</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Three steps, one class period.</h2>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="group relative pl-2 transition-transform hover:-translate-y-1">
            <p className="font-display text-5xl font-semibold text-ink/10 transition-colors group-hover:text-primary-500/20">
              {s.n}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">{s.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="border-y border-ink/10 bg-paper-dim/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="section-eyebrow">Built for the whole quiz lifecycle</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Everything from prompt to podium.</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="surface p-5 transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary-500/30"
            >
              <h3 className="font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink/55">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA — closing quote */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="surface relative overflow-hidden bg-ink px-8 py-16 text-center text-paper">
        <div className="pointer-events-none absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <p className="section-eyebrow !text-gold-400">Ready when you are</p>
          <span className="mt-4 block font-display text-5xl text-gold-400/40"></span>
          <blockquote className="font-display text-2xl font-medium leading-relaxed tracking-tight text-paper sm:text-3xl">
            "Great teaching moves fast — your assessments should too. One sentence in, a graded quiz and a live
            scoreboard out. No slides, no spreadsheets, no waiting "
          </blockquote>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            — AI Quiz Builder
          </p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Landing;