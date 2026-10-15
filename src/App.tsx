import { lazy, Suspense, useEffect, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type MouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Check, Copy, Github, Mail, Menu, Minus, Phone, Plus, Sparkles, X } from 'lucide-react'

const PortfolioWorld = lazy(() => import('./components/PortfolioWorld'))

const github = 'https://github.com/dhanushkshatriya'
const email = 'dhanush97405@gmail.com'

const projects = [
  {
    title: 'SecureX-2',
    index: '01',
    tag: 'Identity security',
    description: 'An identity security platform with breach detection, password checks, phishing tools, and security guidance.',
    stack: ['Python', 'Flask', 'JavaScript', 'Kotlin'],
    href: `${github}/SecureX-2`,
    art: 'secure',
  },
  {
    title: 'PhishTrace',
    index: '02',
    tag: 'Cyber Security',
    description: 'A local-first email investigation prototype that parses messages, explains risk findings, and verifies the original file’s SHA-256 digest.',
    stack: ['Python', 'React', 'SHA-256'],
    href: `${github}/pishtrace-AI`,
    art: 'trace',
  },
  {
    title: 'Campus Lost & Found',
    index: '03',
    tag: 'Full-stack web app',
    description: 'A campus reporting system for lost and found items, featuring secure accounts, search, reports, analytics, and similarity-based matching.',
    stack: ['Flask', 'SQLite', 'Bootstrap', 'Matplotlib'],
    href: `${github}/-CampusL-F`,
    art: 'campus',
  },
  {
    title: 'PlantCare AI',
    index: '04',
    tag: 'Machine Learning',
    description: 'A plant disease classification project using transfer learning with MobileNetV2 across 38 classes of leaf imagery.',
    stack: ['Python', 'MobileNetV2', 'Computer Vision'],
    href: `${github}/dynamic-thinkers`,
    art: 'plant',
  },
]

const skills = [
  { name: 'HTML', label: 'Structure', detail: 'Semantic foundations for clear, accessible web pages.' },
  { name: 'CSS', label: 'Interface craft', detail: 'Responsive layout, visual systems, and thoughtful interaction states.' },
  { name: 'Java', label: 'Core programming', detail: 'Object-oriented problem solving and application fundamentals.' },
  { name: 'React.js', label: 'Front-end systems', detail: 'Component-based interfaces with reusable, maintainable structure.' },
  { name: 'Python', label: 'Automation & AI', detail: 'Prototypes, backend utilities, and data-oriented exploration.' },
  { name: 'C++', label: 'Problem solving', detail: 'Performance-minded programming and foundational algorithms.' },
  { name: 'C', label: 'Systems fundamentals', detail: 'Low-level programming concepts and computational basics.' },
  { name: 'Data Structures & Algorithms', label: 'Logic & patterns', detail: 'The patterns behind efficient and scalable problem solving.' },
]

const certificates = [
  { title: 'Python', issuer: 'IBM Developer Skills Network / Etrain Education', type: 'Course certificate' },
  { title: 'Introduction to Generative AI', issuer: 'Adobe Learning Manager', type: 'Course certificate' },
  { title: 'Software Foundation Course – Basic', issuer: 'IBM Career Education Program', type: 'Course certificate' },
  { title: 'Cloud and DevOps (Automating with CI/CD)', issuer: 'Sambhram Institute of Technology / OSCode', type: 'Participation certificate' },
  { title: 'Digital Application Fundamentals (STEM)', issuer: 'FutureSkills Prime / Nasscom IT-ITeS SSC', type: 'Course certificate' },
  { title: 'GenAI Forge Hackathon', issuer: 'SmartBridge / FutureSkills Prime', type: 'Participation certificate' },
]

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function ProjectArt({ name }: { name: string }) {
  return <div className={`project-art project-art--${name}`} aria-hidden="true"><span /><i /><b /></div>
}

function MagneticLink({ className = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    setPosition({ x: (event.clientX - bounds.left - bounds.width / 2) * 0.12, y: (event.clientY - bounds.top - bounds.height / 2) * 0.16 })
  }
  return <a {...props} className={`magnetic ${className}`} onMouseMove={move} onMouseLeave={() => setPosition({ x: 0, y: 0 })} style={{ '--magnetic-x': `${position.x}px`, '--magnetic-y': `${position.y}px` } as CSSProperties}>{children}</a>
}

function ProjectCard({ project }: { project: typeof projects[number] }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, spotX: 50, spotY: 50 })
  const updateTilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    setTilt({ x: -y * 5.4, y: x * 5.4, spotX: (x + 0.5) * 100, spotY: (y + 0.5) * 100 })
  }
  const cardStyle = {
    '--rotate-x': `${tilt.x}deg`, '--rotate-y': `${tilt.y}deg`, '--spot-x': `${tilt.spotX}%`, '--spot-y': `${tilt.spotY}%`,
  } as CSSProperties
  return <article className="project-card" style={cardStyle} onPointerMove={updateTilt} onPointerLeave={() => setTilt({ x: 0, y: 0, spotX: 50, spotY: 50 })}>
    <ProjectArt name={project.art} />
    <div className="project-top"><span>{project.index}</span><span>{project.tag}</span></div>
    <div className="project-content"><h3>{project.title}</h3><p>{project.description}</p><ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul><a href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>View repository <ArrowUpRight size={17} /></a></div>
  </article>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [activeSkill, setActiveSkill] = useState(0)
  const reduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 })
  const cursorX = useMotionValue(-80)
  const cursorY = useMotionValue(-80)
  const cursorSpringX = useSpring(cursorX, { stiffness: 360, damping: 30, mass: 0.35 })
  const cursorSpringY = useSpring(cursorY, { stiffness: 360, damping: 30, mass: 0.35 })
  const [cursorVisible, setCursorVisible] = useState(false)

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setActiveSection(current.target.id)
    }, { rootMargin: '-35% 0px -55%', threshold: [0.01, 0.2, 0.5] })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.12, smoothWheel: true, syncTouch: false, lerp: 0.09, anchors: false })
    lenisRef.current = lenis
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(frame); lenis.destroy(); lenisRef.current = null }
  }, [reduced])

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const move = (event: PointerEvent) => { cursorX.set(event.clientX - 19); cursorY.set(event.clientY - 19); setCursorVisible(true) }
    const leave = () => setCursorVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    return () => { window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('mouseleave', leave) }
  }, [cursorX, cursorY, reduced])

  const closeMenu = () => setMenuOpen(false)
  const scrollTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    closeMenu()
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, { offset: -70, duration: 1.15 })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }
  }
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { window.location.href = `mailto:${email}` }
  }

  const nav = [
    ['Work', 'work'], ['About', 'about'], ['Skills', 'skills'], ['Contact', 'contact'],
  ]

  return (
    <div className="site-shell">
      <div className="ambient" aria-hidden="true">
        <span className="ambient-grid" /><span className="ambient-glow ambient-glow--one" /><span className="ambient-glow ambient-glow--two" /><span className="ambient-glow ambient-glow--three" /><span className="ambient-noise" />
      </div>
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} aria-hidden="true" />
      <motion.div className={`cursor-halo ${cursorVisible ? 'is-visible' : ''}`} style={{ x: cursorSpringX, y: cursorSpringY }} aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#home" onClick={(event) => scrollTo(event, 'home')} aria-label="Dhanush R. home">Dhanush R<span>.</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, id]) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`} onClick={(event) => scrollTo(event, id)}>{label}</a>)}
        </nav>
        <a className="header-email" href={`mailto:${email}`}>Let&apos;s talk <ArrowUpRight size={16} /></a>
        <button className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        {nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => scrollTo(event, id)}>{label}</a>)}
        <a href={`mailto:${email}`} onClick={closeMenu}>Get in touch <ArrowUpRight size={18} /></a>
      </div>

      <main id="main">
        <section id="home" className="hero section-wrap">
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>Dhanush R. <span>—</span> Student & Developer</motion.p>
            <motion.h1 initial={reduced ? false : { opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>Ideas into<br /><em>digital</em> experiences.</motion.h1>
            <motion.p className="hero-intro" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.42 }}>A B.Tech Cyber Security student and developer exploring thoughtful software, web experiences, and AI.</motion.p>
            <motion.div className="hero-actions" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.52 }}>
              <MagneticLink className="button button--dark" href="#work" onClick={(event) => scrollTo(event, 'work')}>Explore my work <ArrowDownRight size={17} /></MagneticLink>
              <MagneticLink className="button button--text" href="#contact" onClick={(event) => scrollTo(event, 'contact')}>Get in touch <ArrowDownRight size={17} /></MagneticLink>
            </motion.div>
            <motion.div className="hero-disciplines" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.63 }}>
              <span><i />Cyber Security</span><span><i />Web Systems</span><span><i />AI Exploration</span>
            </motion.div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" />
            <Suspense fallback={<div className="world-fallback" aria-label="Abstract project world"><span /><i /><b /><em /></div>}><PortfolioWorld /></Suspense>
            <div className="hero-interface hero-interface--status"><span className="status-dot" /> World mode</div>
            <p className="visual-caption"><span /> Interactive 3D scene</p>
          </div>
          <div className="hero-footer"><a href={github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub profile</a><span>Scroll to explore <ArrowDownRight size={16} /></span></div>
        </section>

        <section className="signal-strip" aria-label="Areas of focus">
          <div className="signal-track"><span>Cyber security</span><i>✦</i><span>Web development</span><i>✦</i><span>AI prototypes</span><i>✦</i><span>Software systems</span><i>✦</i><span>Cyber security</span><i>✦</i><span>Web development</span><i>✦</i><span>AI prototypes</span><i>✦</i><span>Software systems</span><i>✦</i></div>
        </section>

        <section id="work" className="section-wrap work-section">
          <Reveal className="section-heading"><p className="section-kicker">Selected work <span>01</span></p><h2>Built with<br /><em>intent.</em></h2><p>Projects selected from Dhanush&apos;s public GitHub repositories.</p></Reveal>
          <div className="projects-grid">
            {projects.map((project) => <Reveal key={project.title} className="project-reveal"><ProjectCard project={project} /></Reveal>)}
          </div>
          <Reveal><MagneticLink className="all-work" href={github} target="_blank" rel="noreferrer">See all repositories <ArrowUpRight size={20} /></MagneticLink></Reveal>
        </section>

        <section id="about" className="section-wrap about-section">
          <Reveal className="about-mark"><Sparkles size={26} /><span>In progress,<br />always.</span></Reveal>
          <Reveal className="about-copy"><p className="section-kicker">About <span>02</span></p><h2>Working at the intersection of <em>curiosity</em> and code.</h2><p className="lead">I&apos;m Dhanush, a B.Tech Cyber Security student who enjoys building software and investigating how technology can be made more useful, resilient, and human.</p><p>My work spans web development, AI prototypes, and security-minded tools. I like the process as much as the outcome: asking better questions, testing ideas, and making complex things feel clear.</p></Reveal>
          <Reveal className="about-meta"><div><span>Currently</span><strong>B.Tech in<br />Cyber Security</strong></div><div><span>Exploring</span><strong>Web development<br />& AI</strong></div></Reveal>
        </section>

        <section id="skills" className="section-wrap skills-section">
          <div className="skills-intro">
            <Reveal className="section-heading"><p className="section-kicker">Capabilities <span>03</span></p><h2>A focused<br />toolkit.</h2></Reveal>
            <motion.div className="skills-stage" key={skills[activeSkill].name} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38 }} aria-live="polite">
              <div className="skills-stage-art"><i /><b /><em /></div><p>Selected focus <span>{String(activeSkill + 1).padStart(2, '0')}</span></p><h3>{skills[activeSkill].name}</h3><strong>{skills[activeSkill].label}</strong><small>{skills[activeSkill].detail}</small>
            </motion.div>
          </div>
          <div className="skills-list">{skills.map((skill, index) => <Reveal key={skill.name} className={`skill-row ${activeSkill === index ? 'is-active' : ''}`}><button type="button" onClick={() => setActiveSkill(index)} aria-expanded={activeSkill === index} aria-controls={`skill-detail-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{skill.name}</h3><p>{skill.label}</p></div><i>{activeSkill === index ? <Minus size={18} /> : <Plus size={18} />}</i></button><div id={`skill-detail-${index}`} className="skill-detail" aria-hidden={activeSkill !== index}><p>{skill.detail}</p></div></Reveal>)}</div>
        </section>

        <section className="section-wrap certifications-section" aria-labelledby="certifications-title">
          <Reveal className="cert-heading"><p className="section-kicker">Learning & participation <span>04</span></p><h2 id="certifications-title">Certifications<br /><em>& milestones.</em></h2></Reveal>
          <div className="certificates-grid">{certificates.map((certificate, index) => <Reveal key={certificate.title}><article className="certificate"><span className="certificate-number">{String(index + 1).padStart(2, '0')}</span><div><p>{certificate.type}</p><h3>{certificate.title}</h3><small>{certificate.issuer}</small></div></article></Reveal>)}</div>
        </section>

        <section id="contact" className="section-wrap contact-section">
          <Reveal><p className="section-kicker">Contact <span>05</span></p><h2>Let&apos;s make<br />something <em>useful.</em></h2><p className="contact-intro">Have an idea, a question, or a collaboration in mind? My inbox is open.</p></Reveal>
          <Reveal className="contact-actions"><a className="contact-email" href={`mailto:${email}`}>{email} <ArrowUpRight size={23} /></a><button className="copy-button" onClick={copyEmail} aria-live="polite">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy email'}</button></Reveal>
          <Reveal className="contact-links"><a href={`tel:+9186609918559`}><Phone size={17} /> +91 86609918559</a><a href={github} target="_blank" rel="noreferrer"><Github size={17} /> github.com/dhanushkshatriya</a><a href={`mailto:${email}`}><Mail size={17} /> Email me</a></Reveal>
        </section>
      </main>
      <footer><a className="brand" href="#home" onClick={(event) => scrollTo(event, 'home')}>Dhanush R<span>.</span></a><span>Designed & built by Dhanush R.</span><span>© {new Date().getFullYear()}</span></footer>
    </div>
  )
}
