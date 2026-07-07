import { AuthContext } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import authServices from '@/services/authServices'
import {
  Camera,
  Loader,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Shield,
  ShieldCheck,
  Sun,
  User,
} from 'lucide-react'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
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
  const { user, setUser } = useContext(AuthContext)
  const [loading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { theme, setLight, setDark, setSystem } = useTheme()
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateLoading, setIsUpdateLoading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed!')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setPhotoUploading(true)
    try {
      const data = await authServices.uploadProfilePhoto(file)
      if (data && data.success) {
        setUser(prev => ({ ...prev, profilePhoto: data.image_url }))
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload photo')
    } finally {
      setPhotoUploading(false)
    }
  }

  // Detect if system is currently active (no saved pref or matches OS)
  const savedPref = localStorage.getItem('nexspend-theme')
  const sysDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const isSystem = !savedPref || (savedPref === (sysDark ? 'dark' : 'light'))
  const userEmail = user?.email;
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const data = await authServices.logout()
      if (data.success) navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setIsUpdateLoading(true)
    try {

      const data = await authServices.changePassword({
        email: userEmail,
        password,
        newPassword
      })

      if(!data) return;

      if(data.success) {
        setPassword("");
        setNewPassword("");
      } else {
        toast.error(data.error)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUpdateLoading(false)
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
          <div className='flex flex-col items-center sm:flex-row gap-5 pb-4 border-b border-border mb-4'>
            <div className='relative group w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center shadow-md transition-all duration-300 hover:border-blue-500'>
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user?.name}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold uppercase select-none'>
                  {user?.name?.charAt(0)}
                </div>
              )}

              {/* Upload Overlay */}
              <label
                htmlFor='profile-photo-input'
                className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer ${
                  photoUploading ? 'opacity-100 bg-black/75 cursor-not-allowed' : ''
                }`}
              >
                {photoUploading ? (
                  <Loader2 size={18} className='animate-spin text-white' />
                ) : (
                  <>
                    <Camera size={16} />
                    <span className='text-[9px] font-medium'>Change</span>
                  </>
                )}
              </label>
              <input
                id='profile-photo-input'
                type='file'
                accept='image/*'
                onChange={handlePhotoUpload}
                disabled={photoUploading}
                className='hidden'
              />
            </div>
            
            <div className='text-center sm:text-left space-y-1'>
              <h3 className='font-medium text-foreground text-sm'>Profile Picture</h3>
              <p className='text-xs text-muted-foreground'>
                Supports JPG, PNG, or WEBP.
              </p>
              <p className='text-xs text-muted-foreground'>
                Max file size: 5MB.
              </p>
            </div>
          </div>
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

      <SectionCard icon={ShieldCheck} title='Security' iconClass='bg-blue-100 dark:bg-blue-950 text-blue-500'>
        <h1 className='text-center text-lg font-semibold'>Change Your Password</h1>
        <div className='space-y-4'>
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-muted-foreground'>Your Password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' className='mt-1.5 border border-border rounded-xl px-4 py-3 text-foreground bg-muted/40 select-none'/>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-muted-foreground'>New Password</label>
            <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type='password' className='mt-1.5 border border-border rounded-xl px-4 py-3 text-foreground bg-muted/40 select-none'/>
          </div>
        </div>
        <button disabled={updateLoading || !password || !newPassword} onClick={handleChangePassword} className={`bg-blue-500 text-white p-3 rounded-lg mt-6 w-30 x duration-500 flex items-center justify-center ${(updateLoading || !password || !newPassword) ? "opacity-60 cursor-not-allowed" : "cursor-pointer cursor-pointer"}`}>{updateLoading ? <Loader className='animate-spin'/> : "Update"}</button>
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