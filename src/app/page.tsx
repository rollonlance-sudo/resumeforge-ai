import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Image src="/logo-192.png" alt="ResumeForge AI" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold text-gray-900">ResumeForge AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</Link>
              <Link href="/signup" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            Trusted by 50,000+ job seekers
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
            Your Resume,<br /><span className="text-indigo-600">Rewritten by AI</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Paste your resume, add a job description, and get an ATS-optimized version in seconds. Score higher, land more interviews.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Optimize My Resume — Free
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">See How It Works</a>
          </div>
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-xs text-gray-400">resumeforge.ai/dashboard/results</span>
              </div>
              <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-1 flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">92</span>
                  </div>
                  <span className="text-sm text-gray-500">ATS Score</span>
                  <div className="w-full space-y-2">
                    {["Keywords", "Structure", "Achievements"].map((label, i) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-gray-500"><span>{label}</span><span>{85 + i * 3}%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${85 + i * 3}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 space-y-3">
                  {[1, 2, 3, 4].map((i) => (<div key={i} className="h-4 bg-gray-100 rounded-full" style={{ width: `${70 + i * 7}%` }} />))}
                  <div className="h-3 bg-gray-50 rounded-full w-3/4 mt-4" />
                  {[1, 2, 3].map((i) => (<div key={`b-${i}`} className="h-4 bg-gray-100 rounded-full" style={{ width: `${60 + i * 10}%` }} />))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to your perfect resume</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Paste Your Resume", description: "Copy and paste your current resume or upload a PDF/DOCX file.", icon: "📄" },
              { step: "2", title: "Add Job Description", description: "Paste the target job description for tailored optimization.", icon: "💼" },
              { step: "3", title: "Get Optimized Version", description: "Receive an ATS-optimized resume with scores and suggestions in seconds.", icon: "✨" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-6">{item.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 text-white text-sm font-bold rounded-full mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything You Need to Land the Interview</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful AI features to make your resume stand out</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "ATS Score Analysis", desc: "Get a detailed compatibility score with major ATS systems.", icon: "📊" },
              { title: "Keyword Optimization", desc: "Automatically identify and add missing industry keywords.", icon: "🔑" },
              { title: "Tailored to Job Descriptions", desc: "Optimize specifically for the role you're applying to.", icon: "🎯" },
              { title: "Multiple Export Formats", desc: "Download as PDF, DOCX, or plain text.", icon: "📄" },
              { title: "Generation History", desc: "Access all your past optimizations anytime.", icon: "📚" },
              { title: "Tone & Style Control", desc: "Choose from professional, executive, technical, and more.", icon: "🎨" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Start free, upgrade when you need more</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-bold text-gray-900">$0</span><span className="text-gray-500">/month</span></div>
              <p className="mt-4 text-sm text-gray-600">Perfect for trying out AI resume optimization.</p>
              <ul className="mt-8 space-y-3">
                {["3 optimizations per month", "Basic ATS scoring", "Text export only", "30-day history", "Professional tone only"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-8 block text-center py-3 px-6 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition">Get Started Free</Link>
            </div>
            <div className="rounded-2xl border-2 border-indigo-600 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-bold text-gray-900">$19</span><span className="text-gray-500">/month</span></div>
              <p className="mt-4 text-sm text-gray-600">For serious job seekers who want every advantage.</p>
              <ul className="mt-8 space-y-3">
                {["Unlimited optimizations", "Detailed 5-category ATS scoring", "Job description matching", "Diff view (see changes)", "PDF + DOCX + Text export", "Unlimited history", "All 5 tone options", "Priority AI processing"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-8 block text-center py-3 px-6 rounded-xl bg-indigo-600 font-medium text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Start Pro Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[{ stat: "50,000+", label: "Resumes Optimized" }, { stat: "92%", label: "Avg. Score Improvement" }, { stat: "3x", label: "More Interview Callbacks" }, { stat: "4.9/5", label: "User Rating" }].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{item.stat}</div>
                <div className="text-sm text-gray-600 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Software Engineer", text: "ResumeForge AI helped me tailor my resume for a FAANG company. I got callbacks from 4 out of 5 applications!" },
              { name: "Michael Rodriguez", role: "Product Manager", text: "The ATS scoring feature is a game-changer. I went from a 45 to 91 ATS score and landed my dream job." },
              { name: "Emily Thompson", role: "Marketing Director", text: "I love how it lets me customize the tone. The executive tone option was perfect for my senior role applications." },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map((s) => (<svg key={s} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                <p className="text-gray-700 text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo-192.png" alt="ResumeForge AI" width={32} height={32} className="rounded-lg" />
                <span className="text-lg font-bold text-white">ResumeForge AI</span>
              </div>
              <p className="text-sm">AI-powered resume optimization for modern job seekers.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><Link href="/login" className="hover:text-white transition">Log In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <span className="hover:text-white transition cursor-pointer" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 ResumeForge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
