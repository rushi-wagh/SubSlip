import React from "react";

/**
 * HowItWorks.jsx
 *
 * - Strict Tailwind CSS only, no extra styles.
 * - Responsive: cards stack on small screens, three columns on md+.
 * - Replace brand with responsive image (logo at /assets/logo.png).
 * - Matches the provided UI: centered heading, subtext, three softly bordered cards with numbered badges.
 *
 * Place your logo at: /public/assets/logo.png (or update src).
 */

const HowItWorks = () => {
  return (
    <section className="w-full h-[50vh] bg-[#f6f8fb] pb-12" id="HowItWorks">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Optional brand image replaced here */}
        <div className="flex justify-center mb-4">
          <img
            src="/assets/logo.png"
            alt="SubmitEase"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">How It Works.</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Three simple steps to streamline your workflow.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#e6f6ff] text-[#0369a1] flex items-center justify-center font-medium">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Track Your Subjects</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Stay organized with a clear overview of all your course subjects and their submission timelines.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#e6f6ff] text-[#0369a1] flex items-center justify-center font-medium">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Mark for Each Subject</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Easily complete and submit assignments or reports for individual subjects as you progress.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#e6f6ff] text-[#0369a1] flex items-center justify-center font-medium">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Make the Final Submission</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Once all subject submissions are done, complete your final course submission in one simple step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HowItWorks;




