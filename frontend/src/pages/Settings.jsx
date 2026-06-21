import { AuthContext } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import authServices from '@/services/authServices'
import {
  Loader2,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Sun,
  User,
} from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Reusable section card ─────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, iconClass, children }) => (
  <div className='bg-card border border-border shadow-sm rounded-2xl p-6 mb-5'>
    <div className='flex items-center gap-2.5 mb-6'>
      <Icon size={32} className={`p-2 rounded-xl ${iconClass}`} />
      <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
    </div>
    {children}
  </div>
)

// ─── Theme option button ───────────────────────────────────────────────────────
const ThemeOption = ({ icon: Icon, label, description, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
      ${active
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
        : 'border-border bg-muted/40 hover:border-blue-300 hover:bg-muted'
      }`}
  >
    <div className={`p-2.5 rounded-xl ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-background text-muted-foreground'}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className={`font-medium text-sm ${active ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>{label}</p>
      <p className='text-xs text-muted-foreground mt-0.5'>{description}</p>
    </div>
    {active && (
      <div className='ml-auto w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0' />
    )}
  </button>
)

// ─── Page ──────────────────────────────────────────────────────────────────────
const Settings = () => {
  const { user } = useContext(AuthContext)
  const [loading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { theme, setLight, setDark, setSystem } = useTheme()

  // Detect if system is currently active (no saved pref or matches OS)
  const savedPref = localStorage.getItem('nexspend-theme')
  const sysDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const isSystem = !savedPref || (savedPref === (sysDark ? 'dark' : 'light'))

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const data = await authServices.logout()
      if (data.success) navigate('/login')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='text-foreground'>
      {/* Page header */}
      <h1 className='text-3xl font-bold mb-1 text-foreground'>Settings</h1>
      <p className='text-muted-foreground mb-6'>Manage your preferences and account</p>

      {/* ── Profile ─────────────────────────────────────────────────── */}
      <SectionCard icon={User} title='Profile' iconClass='bg-blue-100 dark:bg-blue-950 text-blue-500'>
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground'>Username</label>
            <div className='mt-1.5 border border-border rounded-xl px-4 py-3 text-foreground bg-muted/40 cursor-not-allowed select-none'>
              {user?.name}
            </div>
          </div>
          <div>
            <label className='text-sm font-medium text-muted-foreground'>Email</label>
            <div className='mt-1.5 border border-border rounded-xl px-4 py-3 text-foreground bg-muted/40 cursor-not-allowed select-none'>
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          className='mt-8 w-full border border-border text-foreground rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 transition-all duration-300 cursor-pointer font-medium text-sm'
        >
          {loading
            ? <Loader2 size={18} className='animate-spin' />
            : <><LogOut size={18} /> Sign out</>
          }
        </button>
      </SectionCard>

      {/* ── Appearance ──────────────────────────────────────────────── */}
      <SectionCard icon={Palette} title='Appearance' iconClass='bg-violet-100 dark:bg-violet-950 text-violet-500'>
        <p className='text-sm text-muted-foreground mb-4'>
          Choose how NexSpend looks. You can also toggle quickly from the button in the top-right header.
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <ThemeOption
            icon={Sun}
            label='Light'
            description='Classic light interface'
            active={theme === 'light' && !isSystem}
            onClick={() => { setLight(); }}
          />
          <ThemeOption
            icon={Moon}
            label='Dark'
            description='Easy on the eyes at night'
            active={theme === 'dark' && !isSystem}
            onClick={() => { setDark(); }}
          />
          <ThemeOption
            icon={Monitor}
            label='System'
            description='Follow your OS setting'
            active={isSystem}
            onClick={() => { setSystem(); }}
          />
        </div>

        {/* Live preview strip */}
        <div className='mt-5 rounded-xl border border-border overflow-hidden flex h-14'>
          <div className='w-1/2 bg-white flex items-center justify-center text-xs text-slate-500 font-medium gap-1.5'>
            <Sun size={13} /> Light
          </div>
          <div className='w-1/2 bg-slate-900 flex items-center justify-center text-xs text-slate-400 font-medium gap-1.5'>
            <Moon size={13} /> Dark
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default Settings