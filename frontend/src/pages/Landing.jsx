import './Landing.css';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Landmark,
  LogIn,
  NotebookPen,
  PenLine,
  Receipt,
  ScrollText,
  Shield,
  Tags,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Receipt,
    tab: 'DR',
    title: 'Log Expenses',
    desc: 'Record every purchase in seconds. Filter the ledger by date, category, or amount whenever you need to look back.',
    ink: 'var(--ink-red)',
  },
  {
    icon: Landmark,
    tab: 'CR',
    title: 'Track Income',
    desc: 'Enter every deposit and watch what you earn grow over time, right alongside what you spend.',
    ink: 'var(--ink-green)',
  },
  {
    icon: BarChart3,
    tab: '§3',
    title: 'Read the Numbers',
    desc: 'Charts turn rows of entries into patterns you can see — where the money goes, and when it goes there.',
    ink: 'var(--brass)',
  },
  {
    icon: Tags,
    tab: '§4',
    title: 'Sort by Category',
    desc: 'Give every entry a category, a color, and a place, so nothing gets lost between the columns.',
    ink: 'var(--ink)',
  },
  {
    icon: Shield,
    tab: '§5',
    title: 'Lock the Ledger',
    desc: 'Sign in with a verified account only you control. Nobody else gets to read your books.',
    ink: 'var(--ink-green)',
  },
  {
    icon: ScrollText,
    tab: '§6',
    title: 'Print a Statement',
    desc: 'Export any date range as a PDF or spreadsheet, ready to hand to an accountant, or just to yourself.',
    ink: 'var(--ink-red)',
  },
];

const ENTRIES = [
  {
    no: '1',
    icon: NotebookPen,
    title: 'Open an account',
    desc: 'Sign up in under a minute. Confirm your email and your ledger is ready to write in.',
  },
  {
    no: '2',
    icon: PenLine,
    title: 'Make your first entry',
    desc: 'Add an expense or a deposit — amount, date, category. That\u2019s the whole form.',
  },
  {
    no: '3',
    icon: BarChart3,
    title: 'Watch the balance update',
    desc: 'Every entry recalculates your totals and charts at once, so the picture is always current.',
  },
];

const STATEMENT = [
  { value: '10,000+', label: 'Ledgers Opened' },
  { value: '5,000,000+', label: 'Entries Recorded' },
  { value: '99.9%', label: 'Uptime, Rain or Shine' },
  { value: '$0', label: 'To Start Writing' },
];

const RECEIPT_LINES = [
  'N E X S P E N D',
  '- - - - - - - - - - - - - - -',
  'DATE   ITEM              AMT',
  '07/07  COFFEE SHOP     -4.50',
  '07/06  SALARY DEP  +3,200.00',
  '07/05  GROCERIES      -84.20',
  '07/03  RENT        -1,450.00',
  '- - - - - - - - - - - - - - -',
  'BALANCE:        $12,480.50',
  'THANK YOU FOR TRACKING',
];

// ─── Scroll reveal hook ─────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/10" style={{ background: 'var(--paper)' }}>
    <div className="spine absolute left-0 top-0 bottom-0 w-2" />
    <div className="max-w-6xl mx-auto pl-8 pr-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded" style={{ background: 'var(--cover)' }}>
          <Wallet size={17} color="var(--brass-light)" />
        </div>
        <span className="font-display font-semibold text-lg tracking-tight" style={{ color: 'var(--ink)' }}>
          NexSpend
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm font-mono px-3 py-1.5 opacity-80 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--ink)' }}
        >
          <LogIn size={14} />
          Sign in
        </Link>
        <Link to="/register" className="btn-primary flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-md">
          Get Started
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </nav>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="paper-rules relative pt-32 pb-24 px-6 overflow-hidden">
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 text-center lg:text-left">
        <p
          className="fade-up delay-1 font-mono text-xs tracking-[0.2em] uppercase mb-5 inline-block px-3 py-1 rounded-sm"
          style={{ color: 'var(--ink-green)', border: '1px solid var(--ink-green)' }}
        >
          Ledger No. 0001 — Est. Today
        </p>

        <h1
          className="fade-up delay-2 font-display font-semibold text-5xl lg:text-6xl xl:text-[4.2rem] leading-[1.08] tracking-tight mb-6"
          style={{ color: 'var(--ink)' }}
        >
          Balance the books<br />on your own life.
        </h1>

        <p className="fade-up delay-3 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10 opacity-80">
          NexSpend turns everyday spending into a real ledger. Every expense entered,
          every deposit recorded, the balance always current.
        </p>

        <div className="fade-up delay-4 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
          <Link to="/register" className="btn-primary flex items-center gap-2 px-7 py-3.5 font-semibold text-sm rounded-md">
            Open a Free Ledger
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 px-7 py-3.5 font-semibold text-sm rounded-md">
            Sign In
          </Link>
        </div>

        <div className="fade-up delay-5 flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-10 font-mono text-xs opacity-70">
          <span>No card required</span>
          <span>·</span>
          <span>Free forever plan</span>
          <span>·</span>
          <span>Bank-level encryption</span>
        </div>
      </div>

      {/* Receipt tape — signature element */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm">
        <div className="receipt receipt-float w-72 px-6 pt-8 pb-10">
          <div className="font-mono text-[13px] leading-relaxed" style={{ color: '#2a2417' }}>
            {RECEIPT_LINES.map((line, i) => (
              <div
                key={i}
                className="receipt-line"
                style={{
                  animationDelay: `${0.7 + i * 0.22}s`,
                  fontWeight: line.startsWith('BALANCE') ? 600 : 400,
                  color: line.includes('-4.50') || line.includes('-84.20') || line.includes('-1,450.00')
                    ? 'var(--ink-red)'
                    : line.includes('+3,200.00')
                    ? 'var(--ink-green)'
                    : undefined,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Features ─────────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, tab, title, desc, ink }) => {
  const [ref, inView] = useReveal();
  return (
    <div
      ref={ref}
      className="index-card rounded-md p-6 relative"
      style={{ opacity: inView ? 1 : 0, transform: inView ? undefined : 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
    >
      <span
        className="card-pin absolute -top-2 left-6 w-3.5 h-3.5 rounded-full"
        style={{ background: 'var(--brass)' }}
      />
      <div className="flex items-start justify-between mb-4">
        <Icon size={22} color={ink} />
        <span className="font-mono text-[11px] tracking-widest opacity-40">{tab}</span>
      </div>
      <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--ink)' }}>{title}</h3>
      <div className="w-8 h-[2px] mb-3" style={{ background: ink }} />
      <p className="text-sm leading-relaxed opacity-75">{desc}</p>
    </div>
  );
};

const Features = () => (
  <section id="features" className="torn-edge-top torn-edge-bottom py-28 px-6" style={{ background: 'var(--paper-dim)' }}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--ink-red)' }}>
          The Index
        </p>
        <h2 className="font-display font-semibold text-4xl lg:text-5xl mb-4 leading-tight" style={{ color: 'var(--ink)' }}>
          Six tabs. One ledger.
        </h2>
        <p className="opacity-70 max-w-xl mx-auto">
          Everything a real ledger needs — nothing a dashboard doesn't.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
      </div>
    </div>
  </section>
);

// ─── How It Works ──────────────────────────────────────────────────────────────
const EntryRow = ({ no, icon: Icon, title, desc }) => {
  const [ref, inView] = useReveal();
  return (
    <div
      ref={ref}
      className="flex items-start gap-5 py-6"
      style={{ opacity: inView ? 1 : 0, transform: inView ? undefined : 'translateY(14px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
    >
      <div className="entry-stamp font-mono font-semibold w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm">
        {no}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={16} style={{ color: 'var(--ink-green)' }} />
          <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--ink)' }}>{title}</h3>
          <span className="leader-dots hidden sm:block" />
          <span className="font-mono text-xs opacity-40 hidden sm:block">Entry {no}</span>
        </div>
        <p className="text-sm leading-relaxed opacity-75 max-w-xl">{desc}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => (
  <section className="py-28 px-6" style={{ background: 'var(--paper)' }}>
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-14">
        <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--ink-green)' }}>
          How It Works
        </p>
        <h2 className="font-display font-semibold text-4xl lg:text-5xl" style={{ color: 'var(--ink)' }}>
          Three entries to get started
        </h2>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
        {ENTRIES.map((e) => <EntryRow key={e.no} {...e} />)}
      </div>
    </div>
  </section>
);

// ─── Statement (stats) ─────────────────────────────────────────────────────────
const Stats = () => (
  <section className="statement-strip py-16 px-6">
    <div className="max-w-5xl mx-auto">
      <p className="font-mono text-xs tracking-[0.2em] uppercase mb-8 text-center" style={{ color: 'var(--brass-light)' }}>
        Statement Summary
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {STATEMENT.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="font-mono text-3xl lg:text-4xl font-semibold mb-1" style={{ color: 'var(--paper)' }}>{value}</p>
            <p className="text-xs opacity-60" style={{ color: 'var(--paper)' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CTA ──────────────────────────────────────────────────────────────────────
const CTA = () => {
  const [ref, inView] = useReveal();
  return (
    <section className="py-28 px-6" style={{ background: 'var(--paper)' }}>
      <div ref={ref} className="max-w-3xl mx-auto cheque-border rounded-lg p-12 text-center relative" style={{ background: 'var(--paper-dim)' }}>
        {inView && (
          <div className="stamp stamp-in absolute -top-8 right-8 hidden sm:flex items-center justify-center w-24 h-24 font-display font-bold text-sm tracking-wide">
            APPROVED
          </div>
        )}

        <p className="font-mono text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--ink-red)' }}>
          Pay to the Order of: You
        </p>
        <h2 className="font-display font-semibold text-4xl lg:text-5xl mb-4 leading-tight" style={{ color: 'var(--ink)' }}>
          Ready to balance your own books?
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto opacity-75">
          Join thousands who've opened a ledger with NexSpend and finally know
          where the money goes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-3.5 font-semibold text-sm rounded-md">
            Open a Free Ledger
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 px-8 py-3.5 font-semibold text-sm rounded-md">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="spine py-10 px-6">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <Wallet size={15} color="var(--brass-light)" />
        <span className="font-display font-semibold text-sm" style={{ color: 'var(--paper)' }}>NexSpend</span>
      </div>

      <p className="font-mono text-xs text-center opacity-60" style={{ color: 'var(--paper)' }}>
        Books closed for today. © {new Date().getFullYear()} NexSpend.
      </p>

      <div className="flex items-center gap-5 font-mono text-xs">
        <Link to="/login" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--paper)' }}>Sign In</Link>
        <Link to="/register" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--paper)' }}>Register</Link>
      </div>
    </div>
  </footer>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
const Landing = () => (
  <div className="ledger-page paper-grain min-h-screen">
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <Stats />
    <CTA />
    <Footer />
  </div>
);

export default Landing;