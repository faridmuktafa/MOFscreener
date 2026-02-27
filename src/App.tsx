import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Beaker, Layers, Maximize, Ruler, Weight, Box, CheckCircle2, XCircle, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

type Inputs = {
  gsa: number;
  vsa: number;
  vf: number;
  pv: number;
  density: number;
  lcd: number;
  pld: number;
};

const INITIAL_INPUTS: Inputs = {
  gsa: 3000,
  vsa: 1500,
  vf: 0.5,
  pv: 1.2,
  density: 0.8,
  lcd: 12,
  pld: 8,
};

export default function App() {
  const [inputs, setInputs] = useState<Inputs>(INITIAL_INPUTS);
  const [wug, setWug] = useState<number>(0);
  const [wuv, setWuv] = useState<number>(0);
  const [showThresholds, setShowThresholds] = useState<boolean>(true);

  const WUG_THRESHOLD = 5.5;
  const WUV_THRESHOLD = 40;

  useEffect(() => {
    calculateOutputs();
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const calculateOutputs = () => {
    const { gsa: GSA, vsa: VSA, vf: VF, pv: PV, density: p, lcd: LCD, pld: PLD } = inputs;

    // WUG Equation
    const wugVal = -4.47194 
      + 1.77349 * p 
      + 0.000511149 * GSA 
      + 0.00163429 * VSA 
      + 3.92696 * VF 
      + 5.59522 * PV 
      - 0.0764434 * LCD 
      + 0.262302 * PLD 
      - 0.163317 * Math.pow(p, 2) 
      - 0.00133171 * p * GSA 
      + 7.69048e-5 * p * VSA 
      - 2.66592 * p * VF 
      + 2.45092 * p * PV 
      + 0.089082 * p * LCD 
      - 0.0975448 * p * PLD 
      - 4.1166e-8 * Math.pow(GSA, 2) 
      - 1.15768e-7 * GSA * VSA 
      + 0.00280453 * GSA * VF 
      - 2.35326e-5 * GSA * PV 
      + 8.39123e-6 * GSA * LCD 
      - 3.89128e-6 * GSA * PLD 
      + 2.21456e-7 * Math.pow(VSA, 2) 
      - 0.00231186 * VSA * VF 
      - 0.00180075 * VSA * PV 
      + 4.34998e-6 * VSA * LCD 
      + 1.65433e-5 * VSA * PLD 
      + 4.52648 * Math.pow(VF, 2) 
      - 3.82519 * VF * PV 
      - 0.0639716 * VF * LCD 
      - 0.283064 * VF * PLD 
      - 0.0213098 * Math.pow(PV, 2) 
      + 0.000824477 * PV * LCD 
      + 0.00253194 * PV * PLD 
      + 0.000521033 * Math.pow(LCD, 2) 
      + 0.000700743 * LCD * PLD 
      - 0.000244913 * Math.pow(PLD, 2);

    // WUV Equation
    const wuvVal = -49.6238 
      + 17.4843 * p 
      - 0.000310481 * GSA 
      + 0.0214365 * VSA 
      + 32.4082 * VF 
      + 14.1933 * PV 
      + 0.0660557 * LCD 
      + 1.66494 * PLD 
      - 1.79789 * Math.pow(p, 2) 
      - 0.00754047 * p * GSA 
      - 0.0012505 * p * VSA 
      - 22.99 * p * VF 
      + 69.0864 * p * PV 
      + 0.861169 * p * LCD 
      - 0.523851 * p * PLD 
      + 1.51676e-7 * Math.pow(GSA, 2) 
      + 3.18358e-7 * GSA * VSA 
      + 0.0145422 * GSA * VF 
      - 5.75705e-5 * GSA * PV 
      + 0.000157672 * GSA * LCD 
      - 2.93554e-5 * GSA * PLD 
      + 7.11672e-7 * Math.pow(VSA, 2) 
      - 0.0162344 * VSA * VF 
      - 0.0208807 * VSA * PV 
      + 3.334e-5 * VSA * LCD 
      + 0.000196064 * VSA * PLD 
      + 44.1803 * Math.pow(VF, 2) 
      - 14.2407 * VF * PV 
      - 1.95209 * VF * LCD 
      - 2.23509 * VF * PLD 
      - 0.0384937 * Math.pow(PV, 2) 
      - 0.00185746 * PV * LCD 
      + 0.0410538 * PV * PLD 
      + 0.00735029 * Math.pow(LCD, 2) 
      + 0.00119741 * LCD * PLD 
      + 0.00386859 * Math.pow(PLD, 2);

    setWug(wugVal);
    setWuv(wuvVal);
  };

  const isWugPassing = wug >= WUG_THRESHOLD;
  const isWuvPassing = wuv >= WUV_THRESHOLD;
  const isOverallPassing = isWugPassing && isWuvPassing;

  const chartData = [
    {
      name: 'Gravimetric (wt%)',
      value: Math.max(0, wug),
      threshold: WUG_THRESHOLD,
      isPassing: isWugPassing,
    },
    {
      name: 'Volumetric (g/L)',
      value: Math.max(0, wuv),
      threshold: WUV_THRESHOLD,
      isPassing: isWuvPassing,
    },
  ];

  return (
    <div className="relative min-h-screen font-sans text-[#1d1d1f]">
      {/* Animated Ambient Background */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
        <div className="ambient-orb orb-4"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-4"
        >
          {/* Mobile Logo */}
          <div className="md:hidden w-full flex justify-center sm:justify-start">
            <img 
              src="/logo.png" 
              alt="Institution Logo" 
              className="h-12 sm:h-16 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/mof/600/120';
              }}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">MOF Screener</h1>
            <p className="text-gray-500 mt-2 text-lg">Predict Working Uptake Gravimetric & Volumetric</p>
            <p className="text-xs text-gray-500/80 mt-3 font-medium leading-relaxed max-w-2xl">
              <span className="text-gray-400">Created by:</span> Naufal Fawwaz D., Moh. Farid Muktafa, Rama Oktavian, S.T., M.Sc., Ph.D., Dr. Mar’atul Fauziyah, S.T.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            {/* Desktop Logo */}
            <div className="hidden md:block">
              <img 
                src="/logo.png" 
                alt="Institution Logo" 
                className="h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/mof/600/120';
                }}
              />
            </div>
            <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-gray-200 shadow-sm w-fit">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="text-sm font-medium text-gray-700">DOE Targets: 5.5 wt% & 40 g/L</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="apple-card p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-blue-500" />
                Geometric Factors
              </h2>
              
              <div className="space-y-5">
                <InputField 
                  label="ASA Gravimetric" 
                  name="gsa" 
                  value={inputs.gsa} 
                  onChange={handleInputChange} 
                  unit="m²/g" 
                  icon={<Activity className="w-4 h-4 text-gray-400" />}
                />
                <InputField 
                  label="ASA Volumetric" 
                  name="vsa" 
                  value={inputs.vsa} 
                  onChange={handleInputChange} 
                  unit="m²/cm³" 
                  icon={<Layers className="w-4 h-4 text-gray-400" />}
                />
                <InputField 
                  label="Void Fraction" 
                  name="vf" 
                  value={inputs.vf} 
                  onChange={handleInputChange} 
                  unit="av_vf" 
                  icon={<Box className="w-4 h-4 text-gray-400" />}
                  step="0.01"
                />
                <InputField 
                  label="Pore Volume" 
                  name="pv" 
                  value={inputs.pv} 
                  onChange={handleInputChange} 
                  unit="cm³/g" 
                  icon={<Maximize className="w-4 h-4 text-gray-400" />}
                  step="0.01"
                />
                <InputField 
                  label="Density" 
                  name="density" 
                  value={inputs.density} 
                  onChange={handleInputChange} 
                  unit="g/cm³" 
                  icon={<Weight className="w-4 h-4 text-gray-400" />}
                  step="0.01"
                />
                <InputField 
                  label="Largest Cavity Diameter" 
                  name="lcd" 
                  value={inputs.lcd} 
                  onChange={handleInputChange} 
                  unit="Å" 
                  icon={<Ruler className="w-4 h-4 text-gray-400" />}
                  step="0.1"
                />
                <InputField 
                  label="Pore Limiting Diameter" 
                  name="pld" 
                  value={inputs.pld} 
                  onChange={handleInputChange} 
                  unit="Å" 
                  icon={<Ruler className="w-4 h-4 text-gray-400" />}
                  step="0.1"
                />
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Status Card */}
            <div className={`apple-card p-8 border-l-8 ${isOverallPassing ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Screening Result</h2>
                  <p className="text-gray-500">Based on Department of Energy targets</p>
                </div>
                {isOverallPassing ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-semibold">Promising Candidate</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-full">
                    <XCircle className="w-6 h-6" />
                    <span className="font-semibold">Does Not Meet Targets</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <ResultWidget 
                  title="Working Uptake Gravimetric" 
                  value={wug} 
                  unit="wt%" 
                  threshold={WUG_THRESHOLD} 
                  isPassing={isWugPassing} 
                />
                <ResultWidget 
                  title="Working Uptake Volumetric" 
                  value={wuv} 
                  unit="g/L" 
                  threshold={WUV_THRESHOLD} 
                  isPassing={isWuvPassing} 
                />
              </div>
            </div>

            {/* Chart Card */}
            <div className="apple-card p-8 h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Performance vs Targets</h2>
                <button 
                  onClick={() => setShowThresholds(!showThresholds)}
                  className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
                >
                  {showThresholds ? 'Hide Targets' : 'Show Targets'}
                </button>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    />
                    <Bar dataKey="value" name="Value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isPassing ? '#10b981' : '#f43f5e'} />
                      ))}
                    </Bar>
                    {showThresholds && (
                      <Bar dataKey="threshold" name="Target" fill="#94a3b8" radius={[6, 6, 0, 0]} maxBarSize={60} opacity={0.5} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-8 pb-4 text-gray-500 text-sm font-medium"
        >
          Copyright Farid Naufal 2026
        </motion.div>
      </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, unit, icon, step = "any" }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none">
          {icon}
        </div>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          step={step}
          className="apple-input w-full pl-10 pr-16 py-2.5 text-gray-900"
        />
        <div className="absolute right-3 pointer-events-none text-gray-400 text-sm font-medium">
          {unit}
        </div>
      </div>
    </div>
  );
}

function ResultWidget({ title, value, unit, threshold, isPassing }: any) {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-semibold tracking-tight ${isPassing ? 'text-gray-900' : 'text-gray-900'}`}>
          {value.toFixed(2)}
        </span>
        <span className="text-gray-500 font-medium">{unit}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="text-gray-500">Target: &ge; {threshold} {unit}</span>
        {isPassing ? (
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Pass
          </span>
        ) : (
          <span className="text-rose-600 font-medium flex items-center gap-1">
            <XCircle className="w-4 h-4" /> Fail
          </span>
        )}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            Value: <span className="font-medium text-gray-900">{data.value.toFixed(2)}</span>
          </p>
          <p className="text-gray-600">
            Target: <span className="font-medium text-gray-900">&ge; {data.threshold}</span>
          </p>
          <p className={`font-medium ${data.isPassing ? 'text-emerald-600' : 'text-rose-600'}`}>
            {data.isPassing ? 'Meets Target' : 'Below Target'}
          </p>
        </div>
      </div>
    );
  }
  return null;
}
