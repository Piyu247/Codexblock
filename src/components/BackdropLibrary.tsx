import React, { useState, useMemo } from 'react';
import { useSpriteStore } from '../stores/spriteStore';
import { useEditorStore } from '../stores/editorStore';
import { useTranslation } from '../stores/translations';

// ─── Built-in backdrop definitions ────────────────────────────────────────────

interface BackdropEntry {
  id: string;
  name: string;
  category: string;
  colors: string[];
  pattern: 'gradient' | 'sky' | 'sunset' | 'night' | 'underwater' | 'forest' | 'city' | 'space' | 'beach' | 'snow' | 'desert' | 'classroom' | 'stage' | 'gym' | 'bedroom' | 'kitchen' | 'castle' | 'cave' | 'jungle' | 'moon' | 'rainbow' | 'volcano';
}

const BACKDROP_LIBRARY: BackdropEntry[] = [
  // Outdoors
  { id: 'blue-sky', name: 'Blue Sky', category: 'Outdoors', colors: ['#87CEEB', '#E0F7FA'], pattern: 'sky' },
  { id: 'sunset', name: 'Sunset', category: 'Outdoors', colors: ['#FF6B35', '#FFD166', '#06D6A0'], pattern: 'sunset' },
  { id: 'forest', name: 'Forest', category: 'Outdoors', colors: ['#2D6A4F', '#40916C', '#74C69D'], pattern: 'forest' },
  { id: 'beach', name: 'Beach', category: 'Outdoors', colors: ['#87CEEB', '#F4D35E', '#06A77D'], pattern: 'beach' },
  { id: 'snowy', name: 'Snowy', category: 'Outdoors', colors: ['#E8F4FD', '#B0C4DE', '#FFFFFF'], pattern: 'snow' },
  { id: 'desert', name: 'Desert', category: 'Outdoors', colors: ['#F4A261', '#E9C46A', '#2A9D8F'], pattern: 'desert' },
  { id: 'jungle', name: 'Jungle', category: 'Outdoors', colors: ['#1B4332', '#2D6A4F', '#40916C'], pattern: 'jungle' },
  { id: 'volcano', name: 'Volcano', category: 'Outdoors', colors: ['#6B2D0E', '#D62828', '#F77F00'], pattern: 'volcano' },
  { id: 'rainbow', name: 'Rainbow', category: 'Outdoors', colors: ['#87CEEB', '#FFFFFF'], pattern: 'rainbow' },
  // Space
  { id: 'space', name: 'Space', category: 'Space', colors: ['#0D0D2B', '#1A1A4E'], pattern: 'space' },
  { id: 'moon', name: 'Moon', category: 'Space', colors: ['#1C1C3A', '#8B8B9E'], pattern: 'moon' },
  { id: 'night', name: 'Starry Night', category: 'Space', colors: ['#0A0A2E', '#1A1A4E'], pattern: 'night' },
  // Indoors
  { id: 'classroom', name: 'Classroom', category: 'Indoors', colors: ['#F5F0E8', '#D4A843'], pattern: 'classroom' },
  { id: 'bedroom', name: 'Bedroom', category: 'Indoors', colors: ['#FFE0E6', '#FFC2CC'], pattern: 'bedroom' },
  { id: 'kitchen', name: 'Kitchen', category: 'Indoors', colors: ['#F0EFE7', '#CCC5B9'], pattern: 'kitchen' },
  { id: 'gym', name: 'Gym', category: 'Indoors', colors: ['#4A4A4A', '#2C2C2C'], pattern: 'gym' },
  { id: 'stage', name: 'Stage', category: 'Indoors', colors: ['#1A0033', '#3D0066'], pattern: 'stage' },
  // Fantasy
  { id: 'castle', name: 'Castle', category: 'Fantasy', colors: ['#4A5568', '#718096'], pattern: 'castle' },
  { id: 'cave', name: 'Cave', category: 'Fantasy', colors: ['#2D3748', '#1A202C'], pattern: 'cave' },
  { id: 'underwater', name: 'Underwater', category: 'Fantasy', colors: ['#006994', '#0099CC'], pattern: 'underwater' },
  // Simple
  { id: 'gradient-blue', name: 'Blue Gradient', category: 'Simple', colors: ['#667EEA', '#764BA2'], pattern: 'gradient' },
  { id: 'city', name: 'City', category: 'Simple', colors: ['#2C3E50', '#BDC3C7'], pattern: 'city' },
];

const BACKDROP_CATEGORIES = ['All', ...Array.from(new Set(BACKDROP_LIBRARY.map((b) => b.category)))];

// ─── SVG backdrop renderers ──────────────────────────────────────────────────

function BackdropSVG({ entry, width = 120, height = 90 }: { entry: BackdropEntry; width?: number; height?: number }) {
  const w = width;
  const h = height;
  const [c1, c2, c3] = entry.colors;

  const patterns: Record<string, React.ReactNode> = {
    gradient: (
      <g>
        <defs>
          <linearGradient id={`grad-${entry.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1}/>
            <stop offset="100%" stopColor={c2}/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#grad-${entry.id})`}/>
      </g>
    ),
    sky: (
      <g>
        <defs>
          <linearGradient id={`sky-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4FC3F7"/>
            <stop offset="100%" stopColor="#E0F7FA"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#sky-${entry.id})`}/>
        <ellipse cx={w*0.25} cy={h*0.25} rx={w*0.12} ry={h*0.1} fill="#fff" opacity="0.9"/>
        <ellipse cx={w*0.35} cy={h*0.22} rx={w*0.16} ry={h*0.12} fill="#fff" opacity="0.9"/>
        <ellipse cx={w*0.45} cy={h*0.25} rx={w*0.12} ry={h*0.1} fill="#fff" opacity="0.9"/>
        <ellipse cx={w*0.72} cy={h*0.18} rx={w*0.1} ry={h*0.08} fill="#fff" opacity="0.9"/>
        <ellipse cx={w*0.8} cy={h*0.16} rx={w*0.13} ry={h*0.1} fill="#fff" opacity="0.9"/>
        <rect x="0" y={h*0.85} width={w} height={h*0.15} fill="#7EC850"/>
      </g>
    ),
    sunset: (
      <g>
        <defs>
          <linearGradient id={`sunset-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35"/>
            <stop offset="50%" stopColor="#FFD166"/>
            <stop offset="100%" stopColor="#06D6A0"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#sunset-${entry.id})`}/>
        <circle cx={w*0.5} cy={h*0.62} r={w*0.14} fill="#FF8C00" opacity="0.9"/>
        <rect x="0" y={h*0.82} width={w} height={h*0.18} fill="#2D6A4F"/>
      </g>
    ),
    night: (
      <g>
        <rect width={w} height={h} fill="#0A0A2E"/>
        {Array.from({length: 20}).map((_, i) => (
          <circle key={i} cx={Math.random()*w} cy={Math.random()*h*0.7} r={Math.random()*2+0.5} fill="#fff" opacity={Math.random()*0.8+0.2}/>
        ))}
        <circle cx={w*0.75} cy={h*0.2} r={w*0.1} fill="#FFFDE7"/>
        <rect x="0" y={h*0.82} width={w} height={h*0.18} fill="#1A1A3E"/>
      </g>
    ),
    underwater: (
      <g>
        <defs>
          <linearGradient id={`under-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0099CC"/>
            <stop offset="100%" stopColor="#003344"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#under-${entry.id})`}/>
        {[0.2,0.4,0.6,0.8].map((x, i) => (
          <ellipse key={i} cx={w*x} cy={h*0.9} rx={w*0.04} ry={h*0.12} fill="#2D6A4F" opacity="0.7"/>
        ))}
        <circle cx={w*0.3} cy={h*0.4} r={w*0.04} fill="#fff" opacity="0.3"/>
        <circle cx={w*0.7} cy={h*0.3} r={w*0.03} fill="#fff" opacity="0.3"/>
      </g>
    ),
    forest: (
      <g>
        <rect width={w} height={h} fill="#87CEEB"/>
        {[0.1,0.25,0.45,0.6,0.75,0.9].map((x, i) => (
          <g key={i}>
            <rect x={w*x-w*0.02} y={h*0.55} width={w*0.04} height={h*0.35} fill="#5D4037"/>
            <polygon points={`${w*x},${h*0.28} ${w*(x-0.08)},${h*0.6} ${w*(x+0.08)},${h*0.6}`} fill="#2D6A4F"/>
            <polygon points={`${w*x},${h*0.18} ${w*(x-0.06)},${h*0.45} ${w*(x+0.06)},${h*0.45}`} fill="#40916C"/>
          </g>
        ))}
        <rect x="0" y={h*0.85} width={w} height={h*0.15} fill="#4A7C59"/>
      </g>
    ),
    city: (
      <g>
        <defs>
          <linearGradient id={`city-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e"/>
            <stop offset="100%" stopColor="#4a4a6a"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#city-${entry.id})`}/>
        {[0.05,0.18,0.3,0.45,0.58,0.7,0.82,0.9].map((x, i) => {
          const bh = Math.random()*h*0.5+h*0.2;
          const bw = w*0.1;
          return (
            <g key={i}>
              <rect x={w*x} y={h-bh} width={bw} height={bh} fill={`hsl(${220+i*10},30%,${25+i*3}%)`}/>
              {Array.from({length: 4}).map((_, j) => (
                <rect key={j} x={w*x+bw*0.2+j%2*bw*0.4} y={h-bh+h*0.08+j*h*0.12} width={bw*0.15} height={h*0.07} fill="#FFFF00" opacity={Math.random()>0.3?0.8:0.1}/>
              ))}
            </g>
          );
        })}
      </g>
    ),
    space: (
      <g>
        <rect width={w} height={h} fill="#0D0D2B"/>
        {Array.from({length: 30}).map((_, i) => (
          <circle key={i} cx={Math.random()*w} cy={Math.random()*h} r={Math.random()*1.5+0.3} fill="#fff" opacity={Math.random()*0.9+0.1}/>
        ))}
        <circle cx={w*0.2} cy={h*0.25} r={w*0.08} fill="#8B7FE8" opacity="0.7"/>
        <circle cx={w*0.7} cy={h*0.6} r={w*0.06} fill="#E8A47F" opacity="0.6"/>
      </g>
    ),
    beach: (
      <g>
        <defs>
          <linearGradient id={`beach-sky-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB"/>
            <stop offset="100%" stopColor="#B0E0E6"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#beach-sky-${entry.id})`}/>
        <circle cx={w*0.85} cy={h*0.18} r={w*0.1} fill="#FFD700"/>
        <rect x="0" y={h*0.55} width={w} height={h*0.2} fill="#06A77D" opacity="0.7"/>
        <rect x="0" y={h*0.7} width={w} height={h*0.3} fill="#F4D35E"/>
      </g>
    ),
    snow: (
      <g>
        <defs>
          <linearGradient id={`snow-sky-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B0C4DE"/>
            <stop offset="100%" stopColor="#E8F4FD"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#snow-sky-${entry.id})`}/>
        {Array.from({length: 15}).map((_, i) => (
          <circle key={i} cx={Math.random()*w} cy={Math.random()*h*0.7} r={Math.random()*2+1} fill="#fff" opacity="0.8"/>
        ))}
        <rect x="0" y={h*0.78} width={w} height={h*0.22} fill="#FFFFFF"/>
        <polygon points={`${w*0.3},${h*0.78} ${w*0.18},${h*0.55} ${w*0.42},${h*0.55}`} fill="#FFFFFF"/>
        <polygon points={`${w*0.65},${h*0.78} ${w*0.53},${h*0.48} ${w*0.77},${h*0.48}`} fill="#FFFFFF"/>
      </g>
    ),
    desert: (
      <g>
        <defs>
          <linearGradient id={`desert-sky-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB"/>
            <stop offset="100%" stopColor="#FDB97D"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#desert-sky-${entry.id})`}/>
        <circle cx={w*0.8} cy={h*0.2} r={w*0.1} fill="#FFD700"/>
        <rect x="0" y={h*0.65} width={w} height={h*0.35} fill="#F4A261"/>
        <ellipse cx={w*0.25} cy={h*0.65} rx={w*0.06} ry={h*0.18} fill="#8B5E3C"/>
        <ellipse cx={w*0.23} cy={h*0.54} rx={w*0.05} ry={h*0.08} fill="#2D6A4F"/>
        <ellipse cx={w*0.75} cy={h*0.65} rx={w*0.05} ry={h*0.14} fill="#8B5E3C"/>
        <ellipse cx={w*0.73} cy={h*0.56} rx={w*0.04} ry={h*0.06} fill="#2D6A4F"/>
      </g>
    ),
    classroom: (
      <g>
        <rect width={w} height={h} fill="#F5F0E8"/>
        <rect x="0" y={h*0.05} width={w*0.65} height={h*0.55} rx="2" fill="#2C2C2C"/>
        <rect x="0" y={h*0.05} width={w*0.65} height={h*0.55} rx="2" fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        <rect x={w*0.72} y={h*0.15} width={w*0.22} height={h*0.4} rx="2" fill="#87CEEB" stroke="#5A9BB5" strokeWidth="1"/>
        <rect x="0" y={h*0.8} width={w} height={h*0.2} fill="#D4A843"/>
        {[0.2,0.35,0.5].map((x,i)=>(
          <g key={i}>
            <rect x={w*x} y={h*0.55} width={w*0.12} height={h*0.25} rx="1" fill="#8B6347"/>
            <rect x={w*(x-0.03)} y={h*0.72} width={w*0.18} height={h*0.08} rx="1" fill="#A0784A"/>
          </g>
        ))}
      </g>
    ),
    stage: (
      <g>
        <rect width={w} height={h} fill="#1A0033"/>
        <rect x={w*0.1} y={h*0.7} width={w*0.8} height={h*0.3} fill="#2D0052"/>
        {[0.15,0.35,0.5,0.65,0.85].map((x,i)=>(
          <circle key={i} cx={w*x} cy={h*0.08} r={h*0.06} fill={['#FF0','#F0F','#0FF','#FF0','#F0F'][i]} opacity="0.9"/>
        ))}
        <rect x="0" y={h*0.08} width={w*0.1} height={h*0.62} fill="#3D0066"/>
        <rect x={w*0.9} y={h*0.08} width={w*0.1} height={h*0.62} fill="#3D0066"/>
      </g>
    ),
    gym: (
      <g>
        <rect width={w} height={h} fill="#4A4A4A"/>
        <rect x="0" y={h*0.75} width={w} height={h*0.25} fill="#5A3E28"/>
        {[0.2,0.5,0.8].map((x,i)=>(
          <g key={i}>
            <rect x={w*(x-0.02)} y={h*0.15} width={w*0.04} height={h*0.6} fill="#888"/>
            <rect x={w*(x-0.1)} y={h*0.18} width={w*0.2} height={h*0.06} rx="3" fill="#555"/>
            <rect x={w*(x-0.1)} y={h*0.65} width={w*0.2} height={h*0.06} rx="3" fill="#555"/>
          </g>
        ))}
      </g>
    ),
    bedroom: (
      <g>
        <rect width={w} height={h} fill="#FFE0E6"/>
        <rect x="0" y={h*0.65} width={w} height={h*0.35} fill="#FFC2CC"/>
        <rect x={w*0.1} y={h*0.28} width={w*0.55} height={h*0.37} rx="3" fill="#F8BBD9"/>
        <rect x={w*0.1} y={h*0.18} width={w*0.55} height={h*0.14} rx="3" fill="#F48FB1"/>
        <rect x={w*0.15} y={h*0.2} width={w*0.18} height={h*0.1} rx={h*0.05} fill="#FCE4EC"/>
        <rect x={w*0.42} y={h*0.2} width={w*0.18} height={h*0.1} rx={h*0.05} fill="#FCE4EC"/>
        <rect x={w*0.72} y={h*0.3} width={w*0.12} height={h*0.35} fill="#C8956C"/>
        <rect x={w*0.7} y={h*0.28} width={w*0.16} height={h*0.06} fill="#A0724A"/>
        <rect x={w*0.74} y={h*0.38} width={w*0.08} height={h*0.06} rx="1" fill="#FFE082"/>
      </g>
    ),
    kitchen: (
      <g>
        <rect width={w} height={h} fill="#F0EFE7"/>
        <rect x="0" y={h*0.55} width={w} height={h*0.45} fill="#CCC5B9"/>
        <rect x="0" y={h*0.55} width={w} height={h*0.05} fill="#A8A09A"/>
        {[0.05,0.28,0.52,0.75].map((x,i)=>(
          <g key={i}>
            <rect x={w*x} y={h*0.6} width={w*0.2} height={h*0.4} fill="#DDD6CC"/>
            <circle cx={w*(x+0.1)} cy={h*0.78} r={h*0.02} fill="#888"/>
          </g>
        ))}
        <rect x={w*0.6} y={h*0.08} width={w*0.35} height={h*0.42} rx="2" fill="#E8E4DC" stroke="#CCC5B9" strokeWidth="1"/>
        <circle cx={w*0.7} cy={h*0.2} r={w*0.04} fill="#555"/>
        <circle cx={w*0.82} cy={h*0.2} r={w*0.04} fill="#555"/>
        <circle cx={w*0.7} cy={h*0.35} r={w*0.04} fill="#555"/>
        <circle cx={w*0.82} cy={h*0.35} r={w*0.04} fill="#555"/>
      </g>
    ),
    castle: (
      <g>
        <defs>
          <linearGradient id={`castle-sky-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6B8CCA"/>
            <stop offset="100%" stopColor="#9DB4CC"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#castle-sky-${entry.id})`}/>
        <rect x="0" y={h*0.82} width={w} height={h*0.18} fill="#4A5568"/>
        <rect x={w*0.3} y={h*0.3} width={w*0.4} height={h*0.52} fill="#718096"/>
        <rect x={w*0.1} y={h*0.42} width={w*0.2} height={h*0.4} fill="#718096"/>
        <rect x={w*0.7} y={h*0.42} width={w*0.2} height={h*0.4} fill="#718096"/>
        {[0.3,0.42,0.54,0.66].map((x,i)=>(
          <rect key={i} x={w*x} y={h*0.22} width={w*0.1} height={h*0.12} fill="#718096"/>
        ))}
        {[0.1,0.22].map((x,i)=>(
          <rect key={i} x={w*x} y={h*0.34} width={w*0.1} height={h*0.12} fill="#718096"/>
        ))}
        {[0.7,0.82].map((x,i)=>(
          <rect key={i} x={w*x} y={h*0.34} width={w*0.1} height={h*0.12} fill="#718096"/>
        ))}
        <rect x={w*0.43} y={h*0.55} width={w*0.14} height={h*0.27} fill="#4A5568"/>
        <ellipse cx={w*0.5} cy={h*0.55} rx={w*0.07} ry={w*0.06} fill="#4A5568"/>
      </g>
    ),
    cave: (
      <g>
        <rect width={w} height={h} fill="#2D3748"/>
        <rect x="0" y={h*0.7} width={w} height={h*0.3} fill="#1A202C"/>
        <ellipse cx={w*0.5} cy={h*0.05} rx={w*0.35} ry={h*0.4} fill="#1A202C"/>
        {[0.2,0.35,0.6,0.75].map((x,i)=>(
          <rect key={i} x={w*x} y={h*0.0} width={w*0.04} height={h*(0.15+i*0.07)} rx={h*0.04} fill="#1A202C" transform="rotate(180, 0, 0)" style={{transformOrigin: `${w*x+w*0.02}px 0px`}}/>
        ))}
        {[0.15,0.45,0.7,0.85].map((x,i)=>(
          <polygon key={i} points={`${w*x},${h} ${w*(x+0.04)},${h} ${w*(x+0.02)},${h*(0.75-i*0.05)}`} fill="#2D3748"/>
        ))}
        <circle cx={w*0.15} cy={h*0.6} r={h*0.04} fill="#FFCA28" opacity="0.5"/>
        <circle cx={w*0.75} cy={h*0.5} r={h*0.03} fill="#FFCA28" opacity="0.4"/>
      </g>
    ),
    jungle: (
      <g>
        <rect width={w} height={h} fill="#1B4332"/>
        {[0,0.15,0.3,0.5,0.65,0.8,0.95].map((x,i)=>(
          <g key={i}>
            <rect x={w*x} y={h*0.4} width={w*0.08} height={h*0.6} fill="#2D6A4F"/>
            {[0,1,2].map((j)=>(
              <ellipse key={j} cx={w*(x+0.04)} cy={h*(0.4-j*0.12)} rx={w*0.12} ry={h*0.08} fill="#40916C" transform={`rotate(${-30+j*30} ${w*(x+0.04)} ${h*(0.4-j*0.12)})`}/>
            ))}
          </g>
        ))}
      </g>
    ),
    moon: (
      <g>
        <rect width={w} height={h} fill="#1C1C3A"/>
        {Array.from({length: 25}).map((_, i) => (
          <circle key={i} cx={Math.sin(i*137.5)*w*0.45+w*0.5} cy={Math.cos(i*137.5)*h*0.45+h*0.5} r={Math.random()*1.5+0.3} fill="#fff" opacity={Math.random()*0.8+0.2}/>
        ))}
        <circle cx={w*0.5} cy={h*0.42} r={w*0.28} fill="#8B8B9E"/>
        <circle cx={w*0.4} cy={h*0.36} r={w*0.08} fill="#7A7A8E" opacity="0.5"/>
        <circle cx={w*0.6} cy={h*0.5} r={w*0.06} fill="#7A7A8E" opacity="0.4"/>
        <circle cx={w*0.52} cy={h*0.3} r={w*0.04} fill="#7A7A8E" opacity="0.5"/>
        <rect x="0" y={h*0.82} width={w} height={h*0.18} fill="#111128"/>
      </g>
    ),
    volcano: (
      <g>
        <defs>
          <linearGradient id={`vol-sky-${entry.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A1A00"/>
            <stop offset="100%" stopColor="#8B2500"/>
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#vol-sky-${entry.id})`}/>
        <polygon points={`${w*0.5},${h*0.08} ${w*0.1},${h*0.85} ${w*0.9},${h*0.85}`} fill="#6B2D0E"/>
        <polygon points={`${w*0.5},${h*0.08} ${w*0.44},${h*0.28} ${w*0.56},${h*0.28}`} fill="#1A0A00"/>
        <rect x="0" y={h*0.85} width={w} height={h*0.15} fill="#3D1500"/>
        {[0.38,0.44,0.5,0.56,0.62].map((x,i)=>(
          <ellipse key={i} cx={w*x} cy={h*(0.28+i*0.06)} rx={w*0.04} ry={h*0.08} fill="#FF6B00" opacity={0.8-i*0.1}/>
        ))}
      </g>
    ),
    rainbow: (
      <g>
        <rect width={w} height={h} fill="#87CEEB"/>
        {['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#8F00FF'].reverse().map((color, i) => (
          <path key={i} d={`M ${w*0.05} ${h*0.75} Q ${w*0.5} ${h*(0.08-i*0.07)} ${w*0.95} ${h*0.75}`} fill="none" stroke={color} strokeWidth={h*0.06} opacity="0.7"/>
        ))}
        <rect x="0" y={h*0.82} width={w} height={h*0.18} fill="#7EC850"/>
        <ellipse cx={w*0.2} cy={h*0.35} rx={w*0.12} ry={h*0.1} fill="#fff" opacity="0.9"/>
        <ellipse cx={w*0.75} cy={h*0.28} rx={w*0.1} ry={h*0.09} fill="#fff" opacity="0.9"/>
      </g>
    ),
  };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      {patterns[entry.pattern] || <rect width={w} height={h} fill={entry.colors[0]}/>}
    </svg>
  );
}

// ─── Main BackdropLibrary Component ─────────────────────────────────────────

export default function BackdropLibrary() {
  const { backdropLibraryOpen, setBackdropLibraryOpen } = useEditorStore();
  const { sprites, updateSprite } = useSpriteStore();
  const { t } = useTranslation();
  const stage = sprites.find((s) => s.isStage);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    let items = BACKDROP_LIBRARY;
    if (activeCategory !== 'All') {
      items = items.filter((b) => b.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((b) => b.name.toLowerCase().includes(q));
    }
    return items;
  }, [search, activeCategory]);

  const handleSelect = (entry: BackdropEntry) => {
    if (!stage) return;
    const newBackdrop = {
      id: `backdrop-${Date.now()}`,
      name: entry.name,
      url: '',
      width: 480,
      height: 360,
      backdropPattern: entry.pattern,
      backdropColors: entry.colors,
    };
    updateSprite(stage.id, {
      costumes: [...stage.costumes, newBackdrop],
      currentCostume: stage.costumes.length,
    });
    setBackdropLibraryOpen(false);
  };

  if (!backdropLibraryOpen) return null;

  return (
    <div className="lib-overlay" onClick={() => setBackdropLibraryOpen(false)}>
      <div className="lib-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lib-modal__header">
          <span className="lib-modal__title">{t('chooseBackdropTitle')}</span>
          <div className="lib-modal__search-wrap">
            <svg className="lib-modal__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#999" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className="lib-modal__search"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <button className="lib-modal__close" onClick={() => setBackdropLibraryOpen(false)}>✕</button>
        </div>

        {/* Categories */}
        <div className="lib-modal__categories">
          {BACKDROP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`lib-modal__cat-btn ${activeCategory === cat ? 'lib-modal__cat-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? (useSpriteStore.getState().language === 'mr' ? 'सर्व' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="lib-modal__grid lib-modal__grid--backdrops">
          {filtered.length === 0 && (
            <div className="lib-modal__empty">{t('noBackdropsFound')}</div>
          )}
          {filtered.map((entry) => (
            <button
              key={entry.id}
              className="lib-modal__item lib-modal__item--backdrop"
              onClick={() => handleSelect(entry)}
              title={entry.name}
            >
              <div className="lib-modal__item-preview lib-modal__item-preview--backdrop">
                <BackdropSVG entry={entry} width={120} height={90} />
              </div>
              <div className="lib-modal__item-name">{entry.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { BackdropSVG, BACKDROP_LIBRARY, type BackdropEntry };
