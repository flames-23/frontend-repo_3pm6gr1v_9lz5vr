import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Upload, FileText, Briefcase, MessageSquare, Sparkles } from 'lucide-react'

const PRIMARY = '#3E1C00'
const SECONDARY = '#E7E6E4'

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{background: `radial-gradient(1200px 600px at 70% -10%, ${SECONDARY}40, transparent)`}} />
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="text-center">
          <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full" style={{backgroundColor: SECONDARY, color: PRIMARY}}>
            <Sparkles size={16}/> AI-powered Career Platform
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight" style={{color: PRIMARY}}>
            Land your next role faster
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-700">
            Upload your resume, get tailored jobs, one‑click apply, practice interviews, and perfect your CV & cover letter.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#get-started" className="px-6 py-3 rounded-lg font-semibold shadow-sm" style={{backgroundColor: PRIMARY, color: 'white'}}>Get started</a>
            <a href="#features" className="px-6 py-3 rounded-lg font-semibold" style={{backgroundColor: SECONDARY, color: PRIMARY}}>Explore features</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({icon: Icon, title, desc}){
  return (
    <motion.div whileHover={{y:-4}} className="rounded-xl p-6 shadow-sm border" style={{backgroundColor: 'white', borderColor: SECONDARY}}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg" style={{backgroundColor: SECONDARY}}>
          <Icon color={PRIMARY} />
        </div>
        <div>
          <h3 className="font-semibold text-lg" style={{color: PRIMARY}}>{title}</h3>
          <p className="text-neutral-700 mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Landing() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#fff'}}>
      <nav className="sticky top-0 z-50 backdrop-blur border-b/50" style={{backgroundColor: 'rgba(231,230,228,0.6)', borderColor: SECONDARY}}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded" style={{backgroundColor: PRIMARY}}></div>
            <span className="font-bold" style={{color: PRIMARY}}>CareerFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm" style={{color: PRIMARY}}>
            <a href="#features">Features</a>
            <a href="#get-started">Get Started</a>
          </div>
        </div>
      </nav>

      <Hero/>

      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon={Upload} title="Upload CV → Job Matches" desc="Drop your resume and instantly see roles that fit your skills." />
          <FeatureCard icon={Briefcase} title="One‑click Apply" desc="Apply to saved roles with your best profile in a single tap." />
          <FeatureCard icon={MessageSquare} title="Mock Interviews" desc="Practice with curated questions by role and seniority." />
          <FeatureCard icon={FileText} title="CV Builder" desc="Craft a clean, ATS‑friendly resume with guided sections." />
          <FeatureCard icon={FileText} title="Cover Letter Writer" desc="Generate tailored letters in your preferred tone." />
          <FeatureCard icon={Sparkles} title="ATS Score Checker" desc="See your match score and missing keywords instantly." />
        </div>
      </section>

      <section id="get-started" className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold" style={{color: PRIMARY}}>Try the core workflow</h2>
          <p className="mt-2 text-neutral-700">Upload a resume to get job suggestions and your ATS score.</p>
          <DemoWidget/>
        </div>
      </section>

      <footer className="py-10" style={{backgroundColor: SECONDARY}}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm" style={{color: PRIMARY}}>© {new Date().getFullYear()} CareerFlow</span>
          <a className="text-sm font-medium" style={{color: PRIMARY}} href="#">Privacy</a>
        </div>
      </footer>
    </div>
  )
}

function DemoWidget(){
  const [content, setContent] = useState('Experienced React developer with Python and FastAPI, Docker, AWS. Built CI/CD pipelines, work with MongoDB and SQL. Strong communication and Agile.');
  const [resumeId, setResumeId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const upload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/resume/upload`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({content}) })
      const data = await res.json()
      setResumeId(data.resume_id)
      // get jobs
      const j = await fetch(`${API}/api/jobs/suggest?resume_id=${data.resume_id}`)
      const jd = await j.json()
      setJobs(jd.jobs || [])
      setSelectedJobId(jd.jobs?.[0]?._id || '')
    } finally {
      setLoading(false)
    }
  }

  const checkATS = async () => {
    if(!resumeId || !selectedJobId) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/ats-score`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({resume_id: resumeId, job_id: selectedJobId}) })
      const data = await res.json()
      setScore(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 grid gap-4">
      <textarea value={content} onChange={e=>setContent(e.target.value)} className="w-full h-32 p-4 rounded-lg border focus:outline-none" placeholder="Paste your resume content here" style={{borderColor: SECONDARY}}/>
      <div className="flex gap-3 justify-center">
        <button onClick={upload} className="px-5 py-3 rounded-lg font-semibold inline-flex items-center gap-2" style={{backgroundColor: PRIMARY, color:'white'}}>
          <Upload size={18}/> Upload & Get Jobs
        </button>
        <button onClick={checkATS} className="px-5 py-3 rounded-lg font-semibold inline-flex items-center gap-2" style={{backgroundColor: SECONDARY, color: PRIMARY}}>
          <Sparkles size={18}/> Check ATS
        </button>
      </div>

      {jobs?.length > 0 && (
        <div className="mt-4 grid gap-3">
          <label className="text-left text-sm font-medium" style={{color: PRIMARY}}>Suggested Jobs</label>
          <div className="grid gap-3">
            {jobs.map((j)=> (
              <div key={j._id} className="p-4 rounded-lg border flex items-start justify-between gap-3" style={{borderColor: SECONDARY}}>
                <div>
                  <div className="font-semibold" style={{color: PRIMARY}}>{j.title} · {j.company}</div>
                  <div className="text-sm text-neutral-700">Skills: {j.skills?.join(', ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setSelectedJobId(j._id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedJobId===j._id? 'ring-2 ring-offset-2': ''}`} style={{backgroundColor: SECONDARY, color: PRIMARY}}>Select</button>
                  {j.link && <a href={j.link} target="_blank" className="px-3 py-2 rounded-lg text-sm font-medium" style={{backgroundColor: PRIMARY, color: 'white'}}>Apply</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {score && (
        <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: SECONDARY}}>
          <div className="font-semibold" style={{color: PRIMARY}}>ATS Score: {score.score}%</div>
          {score.missing_keywords?.length > 0 && (
            <div className="text-sm mt-2 text-neutral-800">Missing: {score.missing_keywords.join(', ')}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function App(){
  return <Landing/>
}
