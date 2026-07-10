"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  Sparkles,
  BrainCircuit,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Bot,
  Layers,
  Upload,
  Wand2,
  Trophy,
  FileText,
  Zap,
  Users,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring" as const, bounce: 0.35, duration: 0.8 } },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload your materials",
    description: "Teachers drop in slides, PDFs, and syllabi. Students add personal notes to their private vault.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "02",
    icon: Wand2,
    title: "Select your context",
    description: "Pick exact pages, slides, or files — no more summarizing an entire textbook when you only need chapter 4.",
    color: "from-violet-500 to-purple-500",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Generate & study",
    description: "Instant flashcards, summaries, and quizzes tailored to your selection. Review, practice, and ace the exam.",
    color: "from-indigo-500 to-blue-500",
  },
]

const STATS = [
  { value: "RAG", label: "Grounded in your uploaded PDFs" },
  { value: "3", label: "Output types — summary, flashcards, quiz" },
  { value: "Pages", label: "Select exact slides or page ranges" },
  { value: "Roles", label: "Separate student & teacher workflows" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-landing flex flex-col font-sans selection:bg-primary/20 relative overflow-x-hidden">
      <div className="noise-overlay fixed inset-0 pointer-events-none z-0" />

      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 w-full glass-nav">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <BookOpen className="size-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">NoteSeek</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="#educators" className="hover:text-primary transition-colors">For Educators</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex font-medium" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="font-semibold shadow-lg shadow-primary/25 rounded-full px-5" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-36">
          <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-indigo-400/20 blur-[100px] animate-float" />
          <div className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-violet-400/15 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-400/10 blur-[80px]" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="container mx-auto px-4 md:px-6"
          >
            <div className="text-center max-w-4xl mx-auto">
              <motion.div variants={fadeUp}>
                <Badge
                  variant="outline"
                  className="mb-6 py-1.5 px-4 glass-card text-primary font-medium tracking-wide border-primary/20"
                >
                  <Sparkles className="size-3.5 mr-2 inline" />
                  AI-powered · retrieval-augmented study tools
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]"
              >
                The AI-Powered Hub for{" "}
                <span className="gradient-text">Modern Education</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed"
              >
                Transform static lectures into interactive study material. Teachers upload effortlessly — students generate bespoke flashcards, summaries, and quizzes on demand.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base shadow-xl shadow-indigo-500/25 rounded-full hover:scale-[1.02] transition-transform w-full sm:w-auto"
                >
                  <Link href="/login">
                    Enter Student Portal <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base glass-card rounded-full w-full sm:w-auto hover:bg-white/70"
                >
                  <Link href="/login">
                    Access Teacher Dashboard <GraduationCap className="ml-2 size-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-6 text-sm text-muted-foreground font-medium">
                No credit card required · Free for individual students
              </motion.p>
            </div>

            {/* Floating glass preview cards */}
            <motion.div
              variants={fadeUp}
              className="mt-16 lg:mt-20 max-w-5xl mx-auto grid sm:grid-cols-3 gap-4"
            >
              {[
                { icon: FileText, label: "Smart Summaries", stat: "Condense lectures into key points", color: "text-blue-600" },
                { icon: Zap, label: "Flashcards", stat: "Built from your chosen context", color: "text-violet-600" },
                { icon: Trophy, label: "Practice Quizzes", stat: "Teachers assign · students review", color: "text-indigo-600" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card-hover rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className={`size-11 rounded-xl glass-card flex items-center justify-center ${item.color}`}>
                    <item.icon className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.stat}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ===== STATS BAR ===== */}
        <section className="py-12 border-y border-white/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-extrabold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 glass-card border-primary/20 text-primary">
                Simple workflow
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How NoteSeek works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From upload to exam-ready study material in three effortless steps.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.7, delay: i * 0.1 }}
                  className="glass-card-hover rounded-2xl p-8 relative group"
                >
                  <span className="text-5xl font-black text-primary/10 absolute top-4 right-6 select-none">
                    {step.step}
                  </span>
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center mb-5 shadow-lg`}>
                    <step.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES SPLIT ===== */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                One Platform. Two Powerful Perspectives.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                NoteSeek bridges the gap between instruction and comprehension with dedicated workflows for both sides of the classroom.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Students */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                className="glass-card-hover rounded-3xl p-8 md:p-10 relative overflow-hidden group"
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/15 rounded-full blur-[80px] group-hover:bg-blue-400/25 transition-colors" />
                <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-600/25">
                  <BrainCircuit className="size-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Students</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Stop rereading the textbook. Select specific pages from your professor&apos;s slides or your own uploads, then instantly generate tailored study materials.
                </p>
                <ul className="space-y-4">
                  {[
                    "Generate instant flashcards and summaries",
                    "Take AI-created practice quizzes to test retention",
                    "Upload personal PDFs to the private Study Vault",
                    "Submit assignments and track grades in one place",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Try the Student experience <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </motion.div>

              {/* Educators */}
              <motion.div
                id="educators"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.8, delay: 0.1 }}
                className="glass-card-hover rounded-3xl p-8 md:p-10 relative overflow-hidden group"
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-400/15 rounded-full blur-[80px] group-hover:bg-indigo-400/25 transition-colors" />
                <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/25">
                  <Layers className="size-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Educators</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Build your digital course in minutes. Upload syllabi, slide decks, and readings — then let NoteSeek&apos;s AI help you build assessments and grade submissions effortlessly.
                </p>
                <ul className="space-y-4">
                  {[
                    "Create and manage multiple courses & sections",
                    "Auto-generate quiz questions from chosen slides",
                    "Centralized grading dashboard for all submissions",
                    "Monitor student engagement and assessment scores",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-indigo-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                  >
                    Explore the Teacher tools <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== GRANULAR AI HIGHLIGHT ===== */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-500/30 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-500/20 blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                className="lg:w-1/2 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-blue-300 font-medium text-sm">
                  <Bot className="size-4" /> The magic of Granular AI
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                  Generate from exactly what matters.
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Don&apos;t summarize the entire textbook. With NoteSeek&apos;s Context Selection interface, pick specific files, pages, or slides to generate the perfect, hyper-focused study guide or quiz.
                </p>
                <ul className="space-y-3 pt-4 border-t border-white/10">
                  {[
                    { icon: Sparkles, text: "Context-aware algorithms", color: "text-blue-400" },
                    { icon: Layers, text: "Multiple file merging", color: "text-purple-400" },
                    { icon: Wand2, text: "Custom prompting", color: "text-pink-400" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-slate-200">
                      <item.icon className={`size-5 ${item.color}`} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                className="lg:w-1/2 w-full"
              >
                <div className="glass-dark rounded-2xl p-2 shadow-2xl">
                  <div className="rounded-xl border border-white/5 bg-slate-950/60 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                      <div className="size-3 rounded-full bg-red-500/80" />
                      <div className="size-3 rounded-full bg-amber-500/80" />
                      <div className="size-3 rounded-full bg-green-500/80" />
                      <span className="ml-3 text-xs text-slate-500 font-mono">context-selection.tsx</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <FileText className="size-4 text-blue-400 shrink-0" />
                        <span className="text-sm text-slate-300">Lecture_04_Slides.pdf</span>
                        <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-0 text-xs">Pages 12–14</Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 opacity-60">
                        <FileText className="size-4 text-slate-500 shrink-0" />
                        <span className="text-sm text-slate-400">Chapter_3_Notes.pdf</span>
                      </div>

                      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-blue-200 font-medium text-sm">Target Scope: Pages 12–14</p>
                            <p className="text-xs text-slate-400 mt-0.5">3 slides · 1,240 words</p>
                          </div>
                          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shrink-0">
                            Generate Quiz
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for real classrooms</h2>
              <p className="text-muted-foreground text-lg">How students and teachers use NoteSeek day to day.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  quote: "I uploaded my Data Structures notes, picked the heap-sort section, and got flashcards that matched our midterm scope.",
                  name: "Ayesha R.",
                  role: "BSCS Student, UMT",
                },
                {
                  quote: "I publish assignments from selected lecture slides instead of writing every question by hand. Grading stays in one dashboard.",
                  name: "Dr. Usman Ali",
                  role: "Software Engineering Faculty",
                },
                {
                  quote: "Page-range selection means the AI only uses what we actually taught — not random chapters from the PDF.",
                  name: "Bilal H.",
                  role: "Final-year CS Student",
                },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-hover rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 pt-4 border-t border-white/50 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
            >
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-400/20 rounded-full blur-[80px]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-4 text-primary">
                  <Users className="size-5" />
                  <span className="text-sm font-semibold">Free for students & teachers</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to transform how you study?
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Create your free account today and experience AI-powered education that actually understands your curriculum.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="h-13 px-8 rounded-full shadow-xl shadow-primary/25" asChild>
                    <Link href="/register">
                      Create free account <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-13 px-8 rounded-full glass-card" asChild>
                    <Link href="/login">Log in to existing account</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/50 glass-nav py-12">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <BookOpen className="size-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">NoteSeek</span>
          </Link>
          <p className="max-w-md text-sm text-muted-foreground mb-8">
            The next-generation platform bridging the gap between educators and students with the power of artificial intelligence.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact Support</Link>
          </div>
          <p className="mt-10 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} NoteSeek Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
