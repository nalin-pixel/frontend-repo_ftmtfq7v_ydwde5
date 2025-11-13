import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Car, Bike, MessageCircle, CalendarDays, Shield, Sparkles, Flame, ArrowRight } from 'lucide-react';

const GradientBg = ({ children }) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 text-white overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] bg-blue-500/30 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-[40rem] h-[40rem] bg-orange-400/30 blur-3xl rounded-full" />
    </div>
    {children}
  </div>
);

const SplashScreen = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <GradientBg>
      <div className="relative flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <motion.div
            className="absolute -inset-10 bg-gradient-to-tr from-blue-400/40 to-orange-400/40 blur-2xl rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Flame className="w-12 h-12 text-orange-300 drop-shadow-[0_0_20px_rgba(251,146,60,0.7)]" />
            </motion.div>
            <div className="text-3xl font-semibold tracking-wide">Flames.Blue</div>
          </div>
        </motion.div>
      </div>
    </GradientBg>
  );
};

const AuthScreen = ({ onAuth }) => {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/send-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
      const data = await res.json();
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, code }) });
      if (res.ok) onAuth({ phone });
    } finally { setLoading(false); }
  };

  return (
    <GradientBg>
      <div className="relative h-screen flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <motion.div layout className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-xl border border-white/15">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="text-orange-300" />
              <div className="font-semibold">Welcome to Flames.Blue</div>
            </div>
            {step === 0 && (
              <div>
                <label className="text-sm text-white/80">Mobile Number</label>
                <motion.input whileFocus={{ scale: 1.01 }} type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g., +15551234567" className="mt-2 w-full bg-white/5 border border-white/20 rounded-xl p-3 outline-none focus:ring-2 ring-orange-300" />
                <motion.button whileTap={{ scale: 0.98 }} onClick={sendOtp} disabled={!phone || loading} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-400 font-medium shadow-lg shadow-orange-500/20">
                  {loading ? 'Sending...' : 'Send OTP'}
                </motion.button>
              </div>
            )}
            {step === 1 && (
              <div>
                <label className="text-sm text-white/80">Enter OTP</label>
                <motion.input whileFocus={{ scale: 1.01 }} value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit code" className="mt-2 w-full bg-white/5 border border-white/20 rounded-xl p-3 outline-none focus:ring-2 ring-orange-300" />
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-orange-400 to-blue-500" />
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={verifyOtp} disabled={!code || loading} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-400 font-medium shadow-lg shadow-blue-500/20">
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </GradientBg>
  );
};

const Card = ({ title, subtitle, icon: Icon, onClick }) => (
  <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} className="backdrop-blur-xl bg-white/10 rounded-3xl p-5 border border-white/15 w-full text-left shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-white/70 text-sm">{subtitle}</div>
      </div>
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} className="p-3 rounded-2xl bg-white/10">
        <Icon className="w-6 h-6" />
      </motion.div>
    </div>
  </motion.button>
);

const Dashboard = ({ onNavigate }) => {
  return (
    <GradientBg>
      <div className="relative min-h-screen p-6 pb-32">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-orange-300" />
            <div className="font-semibold">Flames.Blue</div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card title="Rent a Vehicle" subtitle="Bikes and cars at your fingertips" icon={Car} onClick={() => onNavigate('booking')} />
            <Card title="List Your Vehicle" subtitle="Earn by sharing your ride" icon={Bike} onClick={() => onNavigate('list')} />
          </div>
        </div>
      </div>
    </GradientBg>
  );
};

const ListVehicle = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ type: 'car', title: '', description: '', price_per_day: '', has_insurance: false });
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const next = () => setStep(s => Math.min(2, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  const save = async () => {
    await fetch(`${API}/vehicles`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      owner_id: 'me',
      type: form.type,
      title: form.title,
      description: form.description,
      photos: [],
      has_insurance: form.has_insurance,
      price_per_day: Number(form.price_per_day)
    }) });
    onBack();
  };

  return (
    <GradientBg>
      <div className="min-h-screen p-6">
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="text-sm text-white/80">Back</button>
            <div className="font-semibold">List Your Vehicle</div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div className="h-full bg-gradient-to-r from-orange-400 to-blue-500" animate={{ width: `${(step+1)/3*100}%` }} />
          </div>

          {step === 0 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-5 border border-white/15">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setForm({ ...form, type: 'bike' })} className={`p-3 rounded-2xl border ${form.type==='bike'?'border-orange-300 bg-white/15':'border-white/20 bg-white/5'}`}>Bike</button>
                <button onClick={() => setForm({ ...form, type: 'car' })} className={`p-3 rounded-2xl border ${form.type==='car'?'border-orange-300 bg-white/15':'border-white/20 bg-white/5'}`}>Car</button>
              </div>
              <input value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} placeholder="Listing title" className="mt-3 w-full bg-white/5 border border-white/20 rounded-xl p-3 outline-none" />
              <textarea value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })} placeholder="Description" className="mt-3 w-full bg-white/5 border border-white/20 rounded-xl p-3 outline-none" />
              <button onClick={next} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-400">Next</button>
            </div>
          )}

          {step === 1 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-5 border border-white/15">
              <div className="text-white/80 text-sm">Upload photos (mock)</div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white/10 rounded-2xl border border-white/15" />
                ))}
              </div>
              <button onClick={next} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-400">Next</button>
              <button onClick={prev} className="mt-2 w-full py-3 rounded-xl bg-white/10">Back</button>
            </div>
          )}

          {step === 2 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-5 border border-white/15">
              <div className="flex items-center justify-between">
                <div className="text-white/80">Insurance</div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={()=>setForm(f=>({ ...f, has_insurance: !f.has_insurance }))} className={`px-4 py-2 rounded-full border ${form.has_insurance?'border-orange-300 bg-gradient-to-r from-orange-400/40 to-blue-500/40 shadow-[0_0_20px_rgba(251,146,60,0.5)]':'border-white/20 bg-white/5'}`}>
                  {form.has_insurance ? 'Enabled' : 'Disabled'}
                </motion.button>
              </div>
              <input type="number" value={form.price_per_day} onChange={e=>setForm({ ...form, price_per_day: e.target.value })} placeholder="Price per day" className="mt-3 w-full bg-white/5 border border-white/20 rounded-xl p-3 outline-none" />
              <button onClick={save} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-400">Save Listing</button>
              <button onClick={prev} className="mt-2 w-full py-3 rounded-xl bg-white/10">Back</button>
            </div>
          )}
        </div>
      </div>
    </GradientBg>
  );
};

const Booking = ({ onBack }) => {
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const [date, setDate] = useState('');
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch(`${API}/vehicles`).then(r=>r.json()).then(setVehicles).catch(()=>{});
  }, []);

  return (
    <GradientBg>
      <div className="min-h-screen p-6">
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="text-sm text-white/80">Back</button>
            <div className="font-semibold">Book a Ride</div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-5 border border-white/15 mb-4">
            <div className="flex items-center gap-2 mb-2"><CalendarDays /> <div>Select dates</div></div>
            <motion.input type="date" value={date} onChange={e=>setDate(e.target.value)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white/5 border border-white/20 rounded-xl p-3" />
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-5 border border-white/15 mb-4">
            <motion.div animate={{ background: [
              'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(251,146,60,0.25))',
              'linear-gradient(135deg, rgba(251,146,60,0.25), rgba(59,130,246,0.25))'
            ] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="rounded-2xl p-4">
              <div className="font-medium">Subscription</div>
              <div className="text-sm text-white/80">Save up to 20% with weekly and monthly plans.</div>
            </motion.div>
          </div>

          <div className="grid gap-3">
            {vehicles.map(v => (
              <div key={v._id} className="backdrop-blur-xl bg-white/10 rounded-3xl p-4 border border-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{v.title}</div>
                    <div className="text-white/70 text-sm">{v.type} • ${v.price_per_day}/day</div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-orange-400">
                    Select
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-blue-500 shadow-lg">
            Instant Delivery
          </motion.button>
        </div>
      </div>
    </GradientBg>
  );
};

const Support = ({ onBack }) => {
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const [msgs, setMsgs] = useState([{ role: 'bot', message: 'Hi! I\'m here to help with bookings and listings.' }]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input) return;
    const newMsgs = [...msgs, { role: 'user', message: input }];
    setMsgs(newMsgs);
    setInput('');
    const res = await fetch(`${API}/support/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 'me', message: input })});
    const data = await res.json();
    setMsgs(m => [...m, { role: 'bot', message: data.reply }]);
  };

  return (
    <GradientBg>
      <div className="min-h-screen p-6">
        <div className="max-w-md mx-auto relative z-10 flex flex-col h-[90vh]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="text-sm text-white/80">Back</button>
            <div className="font-semibold">Support</div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[75%] p-3 rounded-2xl ${m.role==='bot'?'bg-white/10':'bg-gradient-to-r from-blue-500 to-orange-400 ml-auto'}`}>
                {m.message}
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/20 rounded-xl p-3 outline-none" />
            <motion.button whileTap={{ scale: 0.98 }} onClick={send} className="px-4 rounded-xl bg-gradient-to-r from-blue-500 to-orange-400">Send</motion.button>
          </div>
        </div>
      </div>
    </GradientBg>
  );
};

export default function App() {
  const [stage, setStage] = useState('splash');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setStage('auth'), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (user) setStage('dashboard');
  }, [user]);

  return (
    <AnimatePresence mode="wait">
      {stage === 'splash' && <SplashScreen onDone={() => setStage('auth')} />}
      {stage === 'auth' && <AuthScreen onAuth={setUser} />}
      {stage === 'dashboard' && <Dashboard onNavigate={(to)=>setStage(to)} />}
      {stage === 'list' && <ListVehicle onBack={()=>setStage('dashboard')} />}
      {stage === 'booking' && <Booking onBack={()=>setStage('dashboard')} />}
      {stage === 'support' && <Support onBack={()=>setStage('dashboard')} />}
    </AnimatePresence>
  );
}
