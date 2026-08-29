import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Code, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { AnalyzedProfile } from '../types';

interface LanguageChartProps {
  profile: AnalyzedProfile;
}

export const LanguageChart: React.FC<LanguageChartProps> = ({ profile }) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const { languages, topLanguage } = profile;

  if (!languages || languages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
        <Code className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Programming Languages Detected</h3>
        <p className="text-sm text-slate-500">Repositories in this profile do not specify primary programming languages.</p>
      </div>
    );
  }

  // Take top 8 languages for clean visualization, combine rest into "Others"
  const displayLanguages = languages.slice(0, 7);
  if (languages.length > 7) {
    const otherCount = languages.slice(7).reduce((sum, l) => sum + l.count, 0);
    const totalReposWithLang = languages.reduce((sum, l) => sum + l.count, 0);
    displayLanguages.push({
      name: 'Other',
      count: otherCount,
      percentage: Math.round((otherCount / totalReposWithLang) * 100),
      color: '#94a3b8',
    });
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-colors">
      {/* Header & Chart Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-malachite" />
            <h3 className="text-xl font-bold text-forest dark:text-cream tracking-tight">
              Language Breakdown
            </h3>
          </div>
          <p className="text-xs text-forest/70 dark:text-cream/70 mt-1">
            Top language is <strong className="text-razzmatazz dark:text-heliotrope">{topLanguage}</strong> across public code repositories
          </p>
        </div>

        <div className="flex items-center bg-[#22120a]/80 p-1 rounded-2xl border border-[#ffccb3]/30 text-xs font-medium backdrop-blur-md self-start sm:self-auto">
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              chartType === 'donut'
                ? 'bg-[#fff2e6] text-[#7a1a00] shadow-xs font-bold backdrop-blur-md border border-[#ffccb3]'
                : 'text-cream/70 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-[#7a1a00]" />
            <span>Donut</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-[#fff2e6] text-[#7a1a00] shadow-xs font-bold backdrop-blur-md border border-[#ffccb3]'
                : 'text-cream/70 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#7a1a00]" />
            <span>Bar Chart</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Chart Visualization */}
        <div className="lg:col-span-7 h-64 sm:h-72 w-full">
          {chartType === 'donut' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayLanguages}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {displayLanguages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel text-forest dark:text-cream p-3 rounded-2xl shadow-xl border border-moss/30 dark:border-ochre/30 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shadow-xs" style={{ backgroundColor: data.color }} />
                            <span className="font-bold">{data.name}</span>
                          </div>
                          <p className="text-forest/80 dark:text-cream/80">
                            {data.count} repos ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayLanguages} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  width={90}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel text-forest dark:text-cream p-2.5 rounded-xl shadow-xl text-xs font-semibold border border-moss/30 dark:border-ochre/30">
                          {data.name}: {data.count} repos ({data.percentage}%)
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {displayLanguages.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend & Breakdown List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h4 className="text-xs uppercase font-bold text-forest/60 dark:text-cream/60 tracking-wider">
            Language Share ({languages.length} total)
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {displayLanguages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center justify-between p-2.5 rounded-2xl glass-pill hover:border-moss/40 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-semibold text-forest dark:text-cream">{lang.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-forest/70 dark:text-cream/70">{lang.count} repos</span>
                  <span className="font-mono font-bold text-moss dark:text-ochre w-10 text-right">
                    {lang.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
