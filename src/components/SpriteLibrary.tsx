import React, { useState, useMemo } from 'react';
import { useSpriteStore, type Sprite } from '../stores/spriteStore';
import { useEditorStore } from '../stores/editorStore';
import { useTranslation } from '../stores/translations';

// ─── Built-in sprite definitions ────────────────────────────────────────────

interface SpriteEntry {
  id: string;
  name: string;
  category: string;
  color: string;
  secondaryColor: string;
  shape: 'cat' | 'circle' | 'star' | 'heart' | 'triangle' | 'diamond' | 'hexagon' | 'cloud' | 'lightning' | 'fish' | 'butterfly' | 'rocket' | 'flower' | 'tree' | 'house' | 'car' | 'airplane' | 'robot' | 'dragon' | 'ghost' | 'bear' | 'owl' | 'turtle' | 'shark' | 'penguin' | 'lion' | 'fox' | 'duck';
}

const SPRITE_LIBRARY: SpriteEntry[] = [
  // Animals
  { id: 'cat', name: 'Cat', category: 'Animals', color: '#FF8C42', secondaryColor: '#FF6B1A', shape: 'cat' },
  { id: 'bear', name: 'Bear', category: 'Animals', color: '#8B6347', secondaryColor: '#6B4A33', shape: 'bear' },
  { id: 'owl', name: 'Owl', category: 'Animals', color: '#7B68EE', secondaryColor: '#5A4FCC', shape: 'owl' },
  { id: 'turtle', name: 'Turtle', category: 'Animals', color: '#4CAF50', secondaryColor: '#388E3C', shape: 'turtle' },
  { id: 'shark', name: 'Shark', category: 'Animals', color: '#607D8B', secondaryColor: '#455A64', shape: 'shark' },
  { id: 'penguin', name: 'Penguin', category: 'Animals', color: '#37474F', secondaryColor: '#263238', shape: 'penguin' },
  { id: 'lion', name: 'Lion', category: 'Animals', color: '#FFA726', secondaryColor: '#F57C00', shape: 'lion' },
  { id: 'fox', name: 'Fox', category: 'Animals', color: '#FF7043', secondaryColor: '#E64A19', shape: 'fox' },
  { id: 'duck', name: 'Duck', category: 'Animals', color: '#FFEE58', secondaryColor: '#F9A825', shape: 'duck' },
  { id: 'fish', name: 'Fish', category: 'Animals', color: '#29B6F6', secondaryColor: '#0288D1', shape: 'fish' },
  { id: 'butterfly', name: 'Butterfly', category: 'Animals', color: '#CE93D8', secondaryColor: '#AB47BC', shape: 'butterfly' },
  // Fantasy
  { id: 'dragon', name: 'Dragon', category: 'Fantasy', color: '#EF5350', secondaryColor: '#C62828', shape: 'dragon' },
  { id: 'ghost', name: 'Ghost', category: 'Fantasy', color: '#B0BEC5', secondaryColor: '#78909C', shape: 'ghost' },
  // Space
  { id: 'rocket', name: 'Rocket', category: 'Space', color: '#5C6BC0', secondaryColor: '#3949AB', shape: 'rocket' },
  // Shapes
  { id: 'star', name: 'Star', category: 'Shapes', color: '#FFCA28', secondaryColor: '#F9A825', shape: 'star' },
  { id: 'heart', name: 'Heart', category: 'Shapes', color: '#EF5350', secondaryColor: '#C62828', shape: 'heart' },
  { id: 'circle', name: 'Ball', category: 'Shapes', color: '#42A5F5', secondaryColor: '#1976D2', shape: 'circle' },
  { id: 'diamond', name: 'Diamond', category: 'Shapes', color: '#26C6DA', secondaryColor: '#00ACC1', shape: 'diamond' },
  { id: 'hexagon', name: 'Hexagon', category: 'Shapes', color: '#66BB6A', secondaryColor: '#43A047', shape: 'hexagon' },
  { id: 'lightning', name: 'Lightning', category: 'Shapes', color: '#FFCA28', secondaryColor: '#F57F17', shape: 'lightning' },
  { id: 'cloud', name: 'Cloud', category: 'Shapes', color: '#ECEFF1', secondaryColor: '#B0BEC5', shape: 'cloud' },
  { id: 'triangle', name: 'Triangle', category: 'Shapes', color: '#FF7043', secondaryColor: '#E64A19', shape: 'triangle' },
  // Nature
  { id: 'flower', name: 'Flower', category: 'Nature', color: '#F06292', secondaryColor: '#E91E63', shape: 'flower' },
  { id: 'tree', name: 'Tree', category: 'Nature', color: '#43A047', secondaryColor: '#2E7D32', shape: 'tree' },
  // Things
  { id: 'house', name: 'House', category: 'Things', color: '#8D6E63', secondaryColor: '#6D4C41', shape: 'house' },
  { id: 'car', name: 'Car', category: 'Things', color: '#EF5350', secondaryColor: '#C62828', shape: 'car' },
  { id: 'airplane', name: 'Airplane', category: 'Things', color: '#64B5F6', secondaryColor: '#2196F3', shape: 'airplane' },
  { id: 'robot', name: 'Robot', category: 'Things', color: '#78909C', secondaryColor: '#546E7A', shape: 'robot' },
];

const CATEGORIES = ['All', ...Array.from(new Set(SPRITE_LIBRARY.map((s) => s.category)))];

// ─── SVG renderers per shape ─────────────────────────────────────────────────

function SpriteSVG({ entry, size = 80 }: { entry: SpriteEntry; size?: number }) {
  const s = size;
  const c = entry.color;
  const d = entry.secondaryColor;

  const shapes: Record<string, React.ReactNode> = {
    cat: (
      <g>
        <ellipse cx={s/2} cy={s*0.58} rx={s*0.3} ry={s*0.28} fill={c}/>
        <circle cx={s/2} cy={s*0.42} r={s*0.22} fill={c}/>
        <polygon points={`${s*0.3},${s*0.28} ${s*0.22},${s*0.1} ${s*0.38},${s*0.22}`} fill={c}/>
        <polygon points={`${s*0.7},${s*0.28} ${s*0.78},${s*0.1} ${s*0.62},${s*0.22}`} fill={c}/>
        <circle cx={s*0.42} cy={s*0.4} r={s*0.04} fill="#222"/>
        <circle cx={s*0.58} cy={s*0.4} r={s*0.04} fill="#222"/>
        <ellipse cx={s/2} cy={s*0.46} rx={s*0.06} ry={s*0.04} fill={d}/>
        <path d={`M ${s*0.4},${s*0.5} Q ${s*0.5},${s*0.54} ${s*0.6},${s*0.5}`} stroke="#222" strokeWidth="1.5" fill="none"/>
      </g>
    ),
    circle: (
      <circle cx={s/2} cy={s/2} r={s*0.4} fill={c} stroke={d} strokeWidth={s*0.03}/>
    ),
    star: (
      <polygon points={`${s/2},${s*0.08} ${s*0.61},${s*0.36} ${s*0.92},${s*0.36} ${s*0.68},${s*0.56} ${s*0.79},${s*0.87} ${s/2},${s*0.68} ${s*0.21},${s*0.87} ${s*0.32},${s*0.56} ${s*0.08},${s*0.36} ${s*0.39},${s*0.36}`} fill={c} stroke={d} strokeWidth={s*0.02}/>
    ),
    heart: (
      <path d={`M ${s/2} ${s*0.72} C ${s*0.1} ${s*0.48} ${s*0.1} ${s*0.18} ${s/2} ${s*0.32} C ${s*0.9} ${s*0.18} ${s*0.9} ${s*0.48} ${s/2} ${s*0.72} Z`} fill={c}/>
    ),
    triangle: (
      <polygon points={`${s/2},${s*0.1} ${s*0.9},${s*0.88} ${s*0.1},${s*0.88}`} fill={c} stroke={d} strokeWidth={s*0.02}/>
    ),
    diamond: (
      <polygon points={`${s/2},${s*0.08} ${s*0.9},${s/2} ${s/2},${s*0.92} ${s*0.1},${s/2}`} fill={c} stroke={d} strokeWidth={s*0.02}/>
    ),
    hexagon: (
      <polygon points={`${s*0.5},${s*0.08} ${s*0.88},${s*0.29} ${s*0.88},${s*0.71} ${s*0.5},${s*0.92} ${s*0.12},${s*0.71} ${s*0.12},${s*0.29}`} fill={c} stroke={d} strokeWidth={s*0.02}/>
    ),
    cloud: (
      <g>
        <ellipse cx={s*0.35} cy={s*0.58} rx={s*0.25} ry={s*0.2} fill={c}/>
        <ellipse cx={s*0.6} cy={s*0.52} rx={s*0.28} ry={s*0.23} fill={c}/>
        <ellipse cx={s*0.45} cy={s*0.46} rx={s*0.22} ry={s*0.19} fill={c}/>
        <rect x={s*0.1} y={s*0.58} width={s*0.8} height={s*0.2} rx={s*0.1} fill={c}/>
      </g>
    ),
    lightning: (
      <polygon points={`${s*0.58},${s*0.08} ${s*0.28},${s*0.52} ${s*0.5},${s*0.52} ${s*0.42},${s*0.92} ${s*0.72},${s*0.48} ${s*0.5},${s*0.48}`} fill={c} stroke={d} strokeWidth={s*0.02}/>
    ),
    fish: (
      <g>
        <ellipse cx={s*0.45} cy={s/2} rx={s*0.3} ry={s*0.18} fill={c}/>
        <polygon points={`${s*0.75},${s*0.35} ${s*0.92},${s*0.28} ${s*0.92},${s*0.72} ${s*0.75},${s*0.65}`} fill={d}/>
        <circle cx={s*0.28} cy={s*0.47} r={s*0.04} fill="#fff"/>
        <circle cx={s*0.29} cy={s*0.47} r={s*0.02} fill="#222"/>
      </g>
    ),
    butterfly: (
      <g>
        <ellipse cx={s*0.3} cy={s*0.38} rx={s*0.2} ry={s*0.25} fill={c} opacity="0.85"/>
        <ellipse cx={s*0.7} cy={s*0.38} rx={s*0.2} ry={s*0.25} fill={c} opacity="0.85"/>
        <ellipse cx={s*0.3} cy={s*0.65} rx={s*0.15} ry={s*0.18} fill={d} opacity="0.85"/>
        <ellipse cx={s*0.7} cy={s*0.65} rx={s*0.15} ry={s*0.18} fill={d} opacity="0.85"/>
        <rect x={s*0.47} y={s*0.2} width={s*0.06} height={s*0.6} rx={s*0.03} fill="#333"/>
      </g>
    ),
    rocket: (
      <g>
        <ellipse cx={s/2} cy={s*0.32} rx={s*0.16} ry={s*0.28} fill={c}/>
        <rect x={s*0.34} y={s*0.45} width={s*0.32} height={s*0.3} fill={d}/>
        <polygon points={`${s*0.34},${s*0.7} ${s*0.22},${s*0.88} ${s*0.34},${s*0.78}`} fill="#EF5350"/>
        <polygon points={`${s*0.66},${s*0.7} ${s*0.78},${s*0.88} ${s*0.66},${s*0.78}`} fill="#EF5350"/>
        <circle cx={s/2} cy={s*0.44} r={s*0.09} fill="#E3F2FD"/>
      </g>
    ),
    flower: (
      <g>
        {[0,60,120,180,240,300].map((angle, i) => (
          <ellipse key={i} cx={s/2 + Math.cos(angle*Math.PI/180)*s*0.24} cy={s/2 + Math.sin(angle*Math.PI/180)*s*0.24} rx={s*0.14} ry={s*0.1} fill={c} transform={`rotate(${angle} ${s/2} ${s/2})`}/>
        ))}
        <circle cx={s/2} cy={s/2} r={s*0.16} fill="#FFCA28"/>
        <rect x={s*0.47} y={s*0.62} width={s*0.06} height={s*0.28} rx={s*0.03} fill="#43A047"/>
      </g>
    ),
    tree: (
      <g>
        <polygon points={`${s/2},${s*0.08} ${s*0.15},${s*0.55} ${s*0.85},${s*0.55}`} fill={c}/>
        <polygon points={`${s/2},${s*0.25} ${s*0.18},${s*0.66} ${s*0.82},${s*0.66}`} fill={c}/>
        <polygon points={`${s/2},${s*0.42} ${s*0.22},${s*0.78} ${s*0.78},${s*0.78}`} fill={c}/>
        <rect x={s*0.44} y={s*0.76} width={s*0.12} height={s*0.18} fill={d}/>
      </g>
    ),
    house: (
      <g>
        <polygon points={`${s/2},${s*0.1} ${s*0.9},${s*0.45} ${s*0.1},${s*0.45}`} fill="#EF5350"/>
        <rect x={s*0.15} y={s*0.44} width={s*0.7} height={s*0.46} fill={c}/>
        <rect x={s*0.4} y={s*0.64} width={s*0.2} height={s*0.26} rx={s*0.02} fill={d}/>
        <rect x={s*0.22} y={s*0.54} width={s*0.14} height={s*0.12} rx={s*0.02} fill="#E3F2FD"/>
        <rect x={s*0.64} y={s*0.54} width={s*0.14} height={s*0.12} rx={s*0.02} fill="#E3F2FD"/>
      </g>
    ),
    car: (
      <g>
        <rect x={s*0.08} y={s*0.52} width={s*0.84} height={s*0.28} rx={s*0.06} fill={c}/>
        <path d={`M ${s*0.2},${s*0.52} L ${s*0.28},${s*0.32} L ${s*0.72},${s*0.32} L ${s*0.8},${s*0.52}`} fill={d}/>
        <rect x={s*0.3} y={s*0.34} width={s*0.4} height={s*0.16} rx={s*0.04} fill="#E3F2FD"/>
        <circle cx={s*0.25} cy={s*0.8} r={s*0.1} fill="#37474F"/>
        <circle cx={s*0.25} cy={s*0.8} r={s*0.06} fill="#90A4AE"/>
        <circle cx={s*0.75} cy={s*0.8} r={s*0.1} fill="#37474F"/>
        <circle cx={s*0.75} cy={s*0.8} r={s*0.06} fill="#90A4AE"/>
      </g>
    ),
    airplane: (
      <g>
        <ellipse cx={s/2} cy={s/2} rx={s*0.38} ry={s*0.12} fill={c}/>
        <polygon points={`${s*0.2},${s*0.42} ${s*0.5},${s*0.28} ${s*0.8},${s*0.42}`} fill={d}/>
        <polygon points={`${s*0.62},${s*0.52} ${s*0.82},${s*0.72} ${s*0.92},${s*0.58}`} fill={d}/>
        <circle cx={s*0.25} cy={s/2} r={s*0.06} fill="#E3F2FD"/>
      </g>
    ),
    robot: (
      <g>
        <rect x={s*0.3} y={s*0.08} width={s*0.4} height={s*0.3} rx={s*0.06} fill={c}/>
        <rect x={s*0.22} y={s*0.38} width={s*0.56} height={s*0.38} rx={s*0.06} fill={d}/>
        <rect x={s*0.08} y={s*0.42} width={s*0.14} height={s*0.26} rx={s*0.04} fill={c}/>
        <rect x={s*0.78} y={s*0.42} width={s*0.14} height={s*0.26} rx={s*0.04} fill={c}/>
        <rect x={s*0.34} y={s*0.76} width={s*0.12} height={s*0.2} rx={s*0.04} fill={c}/>
        <rect x={s*0.54} y={s*0.76} width={s*0.12} height={s*0.2} rx={s*0.04} fill={c}/>
        <circle cx={s*0.41} cy={s*0.23} r={s*0.07} fill="#E3F2FD"/>
        <circle cx={s*0.59} cy={s*0.23} r={s*0.07} fill="#E3F2FD"/>
        <circle cx={s*0.41} cy={s*0.23} r={s*0.04} fill="#1565C0"/>
        <circle cx={s*0.59} cy={s*0.23} r={s*0.04} fill="#1565C0"/>
        <rect x={s*0.34} y={s*0.5} width={s*0.32} height={s*0.08} rx={s*0.03} fill="#4FC3F7"/>
        <rect x={s*0.46} y={s*0.06} width={s*0.08} height={s*0.06} rx={s*0.02} fill="#78909C"/>
      </g>
    ),
    dragon: (
      <g>
        <ellipse cx={s*0.5} cy={s*0.58} rx={s*0.28} ry={s*0.22} fill={c}/>
        <polygon points={`${s*0.32},${s*0.32} ${s*0.18},${s*0.14} ${s*0.38},${s*0.28}`} fill={d}/>
        <polygon points={`${s*0.68},${s*0.32} ${s*0.82},${s*0.14} ${s*0.62},${s*0.28}`} fill={d}/>
        <circle cx={s/2} cy={s*0.38} r={s*0.2} fill={c}/>
        <circle cx={s*0.42} cy={s*0.35} r={s*0.05} fill="#fff"/>
        <circle cx={s*0.42} cy={s*0.35} r={s*0.03} fill="#222"/>
        <circle cx={s*0.58} cy={s*0.35} r={s*0.05} fill="#fff"/>
        <circle cx={s*0.58} cy={s*0.35} r={s*0.03} fill="#222"/>
        <ellipse cx={s*0.72} cy={s*0.52} rx={s*0.2} ry={s*0.1} fill={d} transform={`rotate(-20 ${s*0.72} ${s*0.52})`}/>
      </g>
    ),
    ghost: (
      <g>
        <path d={`M ${s*0.2},${s*0.85} L ${s*0.2},${s*0.42} Q ${s*0.2},${s*0.1} ${s*0.5},${s*0.1} Q ${s*0.8},${s*0.1} ${s*0.8},${s*0.42} L ${s*0.8},${s*0.85} L ${s*0.68},${s*0.72} L ${s*0.56},${s*0.85} L ${s*0.44},${s*0.72} L ${s*0.32},${s*0.85} Z`} fill={c}/>
        <circle cx={s*0.38} cy={s*0.44} r={s*0.07} fill="#fff"/>
        <circle cx={s*0.38} cy={s*0.44} r={s*0.04} fill="#333"/>
        <circle cx={s*0.62} cy={s*0.44} r={s*0.07} fill="#fff"/>
        <circle cx={s*0.62} cy={s*0.44} r={s*0.04} fill="#333"/>
      </g>
    ),
    bear: (
      <g>
        <circle cx={s*0.32} cy={s*0.28} r={s*0.14} fill={c}/>
        <circle cx={s*0.68} cy={s*0.28} r={s*0.14} fill={c}/>
        <circle cx={s*0.5} cy={s*0.54} r={s*0.32} fill={c}/>
        <circle cx={s*0.5} cy={s*0.58} r={s*0.18} fill={d}/>
        <circle cx={s*0.42} cy={s*0.46} r={s*0.05} fill="#333"/>
        <circle cx={s*0.58} cy={s*0.46} r={s*0.05} fill="#333"/>
        <ellipse cx={s*0.5} cy={s*0.58} rx={s*0.06} ry={s*0.04} fill="#555"/>
      </g>
    ),
    owl: (
      <g>
        <ellipse cx={s*0.5} cy={s*0.56} rx={s*0.28} ry={s*0.34} fill={c}/>
        <circle cx={s*0.38} cy={s*0.38} r={s*0.14} fill={d}/>
        <circle cx={s*0.62} cy={s*0.38} r={s*0.14} fill={d}/>
        <circle cx={s*0.38} cy={s*0.38} r={s*0.08} fill="#fff"/>
        <circle cx={s*0.62} cy={s*0.38} r={s*0.08} fill="#fff"/>
        <circle cx={s*0.38} cy={s*0.38} r={s*0.05} fill="#333"/>
        <circle cx={s*0.62} cy={s*0.38} r={s*0.05} fill="#333"/>
        <polygon points={`${s*0.5},${s*0.5} ${s*0.44},${s*0.57} ${s*0.56},${s*0.57}`} fill="#FFCA28"/>
        <polygon points={`${s*0.32},${s*0.7} ${s*0.28},${s*0.82} ${s*0.36},${s*0.82}`} fill="#FFCA28"/>
        <polygon points={`${s*0.68},${s*0.7} ${s*0.64},${s*0.82} ${s*0.72},${s*0.82}`} fill="#FFCA28"/>
      </g>
    ),
    turtle: (
      <g>
        <ellipse cx={s*0.5} cy={s*0.52} rx={s*0.34} ry={s*0.26} fill={c}/>
        <ellipse cx={s*0.5} cy={s*0.52} rx={s*0.22} ry={s*0.18} fill={d}/>
        <circle cx={s*0.5} cy={s*0.28} r={s*0.12} fill={c}/>
        <circle cx={s*0.68} cy={s*0.56} r={s*0.07} fill={c}/>
        <circle cx={s*0.32} cy={s*0.56} r={s*0.07} fill={c}/>
        <circle cx={s*0.6} cy={s*0.7} r={s*0.07} fill={c}/>
        <circle cx={s*0.4} cy={s*0.7} r={s*0.07} fill={c}/>
        <circle cx={s*0.45} cy={s*0.26} r={s*0.03} fill="#333"/>
        <circle cx={s*0.55} cy={s*0.26} r={s*0.03} fill="#333"/>
      </g>
    ),
    shark: (
      <g>
        <ellipse cx={s*0.48} cy={s*0.55} rx={s*0.36} ry={s*0.2} fill={c}/>
        <polygon points={`${s*0.5},${s*0.12} ${s*0.44},${s*0.38} ${s*0.56},${s*0.38}`} fill={c}/>
        <polygon points={`${s*0.82},${s*0.48} ${s*0.92},${s*0.38} ${s*0.92},${s*0.62}`} fill={d}/>
        <ellipse cx={s*0.38} cy={s*0.55} rx={s*0.12} ry={s*0.12} fill="#fff"/>
        <circle cx={s*0.3} cy={s*0.52} r={s*0.04} fill="#333"/>
        <path d={`M ${s*0.44},${s*0.62} L ${s*0.52},${s*0.58} L ${s*0.6},${s*0.62}`} stroke="#fff" strokeWidth="1.5" fill="none"/>
      </g>
    ),
    penguin: (
      <g>
        <ellipse cx={s*0.5} cy={s*0.56} rx={s*0.24} ry={s*0.34} fill={c}/>
        <ellipse cx={s*0.5} cy={s*0.58} rx={s*0.16} ry={s*0.24} fill="#fff"/>
        <circle cx={s*0.5} cy={s*0.3} r={s*0.18} fill={c}/>
        <circle cx={s*0.44} cy={s*0.28} r={s*0.05} fill="#fff"/>
        <circle cx={s*0.44} cy={s*0.28} r={s*0.03} fill="#333"/>
        <circle cx={s*0.56} cy={s*0.28} r={s*0.05} fill="#fff"/>
        <circle cx={s*0.56} cy={s*0.28} r={s*0.03} fill="#333"/>
        <polygon points={`${s*0.5},${s*0.38} ${s*0.44},${s*0.44} ${s*0.56},${s*0.44}`} fill="#FF8C42"/>
        <ellipse cx={s*0.28} cy={s*0.58} rx={s*0.08} ry={s*0.18} fill={c}/>
        <ellipse cx={s*0.72} cy={s*0.58} rx={s*0.08} ry={s*0.18} fill={c}/>
        <ellipse cx={s*0.38} cy={s*0.82} rx={s*0.12} ry={s*0.05} fill="#FF8C42"/>
        <ellipse cx={s*0.62} cy={s*0.82} rx={s*0.12} ry={s*0.05} fill="#FF8C42"/>
      </g>
    ),
    lion: (
      <g>
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <ellipse key={i} cx={s/2 + Math.cos(angle*Math.PI/180)*s*0.3} cy={s/2 + Math.sin(angle*Math.PI/180)*s*0.3} rx={s*0.1} ry={s*0.14} fill="#FF8C42" transform={`rotate(${angle+90} ${s/2 + Math.cos(angle*Math.PI/180)*s*0.3} ${s/2 + Math.sin(angle*Math.PI/180)*s*0.3})`}/>
        ))}
        <circle cx={s/2} cy={s/2} r={s*0.24} fill={c}/>
        <circle cx={s*0.42} cy={s*0.45} r={s*0.05} fill="#333"/>
        <circle cx={s*0.58} cy={s*0.45} r={s*0.05} fill="#333"/>
        <ellipse cx={s/2} cy={s*0.55} rx={s*0.08} ry={s*0.05} fill={d}/>
        <path d={`M ${s*0.42},${s*0.6} Q ${s*0.5},${s*0.65} ${s*0.58},${s*0.6}`} stroke="#333" strokeWidth="1.5" fill="none"/>
      </g>
    ),
    fox: (
      <g>
        <polygon points={`${s*0.24},${s*0.22} ${s*0.14},${s*0.06} ${s*0.34},${s*0.18}`} fill={c}/>
        <polygon points={`${s*0.76},${s*0.22} ${s*0.86},${s*0.06} ${s*0.66},${s*0.18}`} fill={c}/>
        <circle cx={s/2} cy={s*0.42} r={s*0.26} fill={c}/>
        <ellipse cx={s*0.5} cy={s*0.6} rx={s*0.3} ry={s*0.24} fill={c}/>
        <ellipse cx={s*0.5} cy={s*0.46} rx={s*0.14} ry={s*0.12} fill="#fff"/>
        <circle cx={s*0.42} cy={s*0.38} r={s*0.04} fill="#333"/>
        <circle cx={s*0.58} cy={s*0.38} r={s*0.04} fill="#333"/>
        <ellipse cx={s/2} cy={s*0.46} rx={s*0.05} ry={s*0.04} fill="#333"/>
      </g>
    ),
    duck: (
      <g>
        <ellipse cx={s*0.5} cy={s*0.62} rx={s*0.3} ry={s*0.22} fill={c}/>
        <circle cx={s*0.36} cy={s*0.38} r={s*0.18} fill={c}/>
        <ellipse cx={s*0.22} cy={s*0.4} rx={s*0.1} ry={s*0.06} fill="#FF8C42"/>
        <circle cx={s*0.32} cy={s*0.35} r={s*0.04} fill="#333"/>
        <ellipse cx={s*0.72} cy={s*0.65} rx={s*0.08} ry={s*0.04} fill="#FF8C42"/>
      </g>
    ),
  };

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
      {shapes[entry.shape] || <circle cx={s/2} cy={s/2} r={s*0.4} fill={entry.color}/>}
    </svg>
  );
}

// ─── Main SpriteLibrary Component ────────────────────────────────────────────

function createSpriteFromEntry(entry: SpriteEntry): Sprite {
  const id = `sprite-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
  return {
    id,
    name: entry.name,
    isStage: false,
    x: Math.round(Math.random() * 100 - 50),
    y: Math.round(Math.random() * 100 - 50),
    size: 100,
    direction: 90,
    visible: true,
    rotationStyle: 'all around',
    draggable: false,
    costumes: [{
      id: `costume-${id}`,
      name: 'costume1',
      url: '',
      width: 100,
      height: 100,
      svgColor: entry.color,
      svgShape: entry.shape,
    }],
    currentCostume: 0,
    sounds: [],
    blocks: {},
    variables: {},
    lists: {},
  };
}

export default function SpriteLibrary() {
  const { spriteLibraryOpen, setSpriteLibraryOpen } = useEditorStore();
  const { addSprite, selectSprite } = useSpriteStore();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    let items = SPRITE_LIBRARY;
    if (activeCategory !== 'All') {
      items = items.filter((s) => s.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((s) => s.name.toLowerCase().includes(q));
    }
    return items;
  }, [search, activeCategory]);

  const handleSelect = (entry: SpriteEntry) => {
    const sprite = createSpriteFromEntry(entry);
    addSprite(sprite);
    selectSprite(sprite.id);
    setSpriteLibraryOpen(false);
  };

  if (!spriteLibraryOpen) return null;

  return (
    <div className="lib-overlay" onClick={() => setSpriteLibraryOpen(false)}>
      <div className="lib-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lib-modal__header">
          <span className="lib-modal__title">{t('chooseSpriteTitle')}</span>
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
          <button className="lib-modal__close" onClick={() => setSpriteLibraryOpen(false)}>✕</button>
        </div>

        {/* Categories */}
        <div className="lib-modal__categories">
          {CATEGORIES.map((cat) => (
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
        <div className="lib-modal__grid">
          {filtered.length === 0 && (
            <div className="lib-modal__empty">{t('noSpritesFound')}</div>
          )}
          {filtered.map((entry) => (
            <button
              key={entry.id}
              className="lib-modal__item"
              onClick={() => handleSelect(entry)}
              title={entry.name}
            >
              <div className="lib-modal__item-preview">
                <SpriteSVG entry={entry} size={80} />
              </div>
              <div className="lib-modal__item-name">{entry.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { SpriteSVG, SPRITE_LIBRARY, type SpriteEntry };
