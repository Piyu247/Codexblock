import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useSpriteStore } from '../stores/spriteStore';
import { useEditorStore } from '../stores/editorStore';
import { engine } from '../engine/ExecutionEngine';
import { BackdropSVG, BACKDROP_LIBRARY } from './BackdropLibrary';
import { SpriteSVG, SPRITE_LIBRARY } from './SpriteLibrary';

const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 360;

function getSvgString(entry: any, size = 100): string {
  const s = size;
  const c = entry.color;
  const d = entry.secondaryColor;

  const shapes: Record<string, string> = {
    cat: `
      <g>
        <ellipse cx="${s/2}" cy="${s*0.58}" rx="${s*0.3}" ry="${s*0.28}" fill="${c}"/>
        <circle cx="${s/2}" cy="${s*0.42}" r="${s*0.22}" fill="${c}"/>
        <polygon points="${s*0.3},${s*0.28} ${s*0.22},${s*0.1} ${s*0.38},${s*0.22}" fill="${c}"/>
        <polygon points="${s*0.7},${s*0.28} ${s*0.78},${s*0.1} ${s*0.62},${s*0.22}" fill="${c}"/>
        <circle cx="${s*0.42}" cy="${s*0.4}" r="${s*0.04}" fill="#222"/>
        <circle cx="${s*0.58}" cy="${s*0.4}" r="${s*0.04}" fill="#222"/>
        <ellipse cx="${s/2}" cy="${s*0.46}" rx="${s*0.06}" ry="${s*0.04}" fill="${d}"/>
        <path d="M ${s*0.4},${s*0.5} Q ${s*0.5},${s*0.54} ${s*0.6},${s*0.5}" stroke="#222" stroke-width="1.5" fill="none"/>
      </g>
    `,
    circle: `
      <circle cx="${s/2}" cy="${s/2}" r="${s*0.4}" fill="${c}" stroke="${d}" stroke-width="${s*0.03}"/>
    `,
    star: `
      <polygon points="${s/2},${s*0.08} ${s*0.61},${s*0.36} ${s*0.92},${s*0.36} ${s*0.68},${s*0.56} ${s*0.79},${s*0.87} ${s/2},${s*0.68} ${s*0.21},${s*0.87} ${s*0.32},${s*0.56} ${s*0.08},${s*0.36} ${s*0.39},${s*0.36}" fill="${c}" stroke="${d}" stroke-width="${s*0.02}"/>
    `,
    heart: `
      <path d="M ${s/2} ${s*0.72} C ${s*0.1} ${s*0.48} ${s*0.1} ${s*0.18} ${s/2} ${s*0.32} C ${s*0.9} ${s*0.18} ${s*0.9} ${s*0.48} ${s/2} ${s*0.72} Z" fill="${c}"/>
    `,
    triangle: `
      <polygon points="${s/2},${s*0.1} ${s*0.9},${s*0.88} ${s*0.1},${s*0.88}" fill="${c}" stroke="${d}" stroke-width="${s*0.02}"/>
    `,
    diamond: `
      <polygon points="${s/2},${s*0.08} ${s*0.9},${s/2} ${s/2},${s*0.92} ${s*0.1},${s/2}" fill="${c}" stroke="${d}" stroke-width="${s*0.02}"/>
    `,
    hexagon: `
      <polygon points="${s*0.5},${s*0.08} ${s*0.88},${s*0.29} ${s*0.88},${s*0.71} ${s*0.5},${s*0.92} ${s*0.12},${s*0.71} ${s*0.12},${s*0.29}" fill="${c}" stroke="${d}" stroke-width="${s*0.02}"/>
    `,
    cloud: `
      <g>
        <ellipse cx="${s*0.35}" cy="${s*0.58}" rx="${s*0.25}" ry="${s*0.2}" fill="${c}"/>
        <ellipse cx="${s*0.6}" cy="${s*0.52}" rx="${s*0.28}" ry="${s*0.23}" fill="${c}"/>
        <ellipse cx="${s*0.45}" cy="${s*0.46}" rx="${s*0.22}" ry="${s*0.19}" fill="${c}"/>
        <rect x="${s*0.1}" y="${s*0.58}" width="${s*0.8}" height="${s*0.2}" rx="${s*0.1}" fill="${c}"/>
      </g>
    `,
    lightning: `
      <polygon points="${s*0.58},${s*0.08} ${s*0.28},${s*0.52} ${s*0.5},${s*0.52} ${s*0.42},${s*0.92} ${s*0.72},${s*0.48} ${s*0.5},${s*0.48}" fill="${c}" stroke="${d}" stroke-width="${s*0.02}"/>
    `,
    fish: `
      <g>
        <ellipse cx="${s*0.45}" cy="${s/2}" rx="${s*0.3}" ry="${s*0.18}" fill="${c}"/>
        <polygon points="${s*0.75},${s*0.35} ${s*0.92},${s*0.28} ${s*0.92},${s*0.72} ${s*0.75},${s*0.65}" fill="${d}"/>
        <circle cx="${s*0.28}" cy="${s*0.47}" r="${s*0.04}" fill="#fff"/>
        <circle cx="${s*0.29}" cy="${s*0.47}" r="${s*0.02}" fill="#222"/>
      </g>
    `,
    butterfly: `
      <g>
        <ellipse cx="${s*0.3}" cy="${s*0.38}" rx="${s*0.2}" ry="${s*0.25}" fill="${c}" opacity="0.85"/>
        <ellipse cx="${s*0.7}" cy="${s*0.38}" rx="${s*0.2}" ry="${s*0.25}" fill="${c}" opacity="0.85"/>
        <ellipse cx="${s*0.3}" cy="${s*0.65}" rx="${s*0.15}" ry="${s*0.18}" fill="${d}" opacity="0.85"/>
        <ellipse cx="${s*0.7}" cy="${s*0.65}" rx="${s*0.15}" ry="${s*0.18}" fill="${d}" opacity="0.85"/>
        <rect x="${s*0.47}" y="${s*0.2}" width="${s*0.06}" height="${s*0.6}" rx="${s*0.03}" fill="#333"/>
      </g>
    `,
    rocket: `
      <g>
        <ellipse cx="${s/2}" cy="${s*0.32}" rx="${s*0.16}" ry="${s*0.28}" fill="${c}"/>
        <rect x="${s*0.34}" y="${s*0.45}" width="${s*0.32}" height="${s*0.3}" fill="${d}"/>
        <polygon points="${s*0.34},${s*0.7} ${s*0.22},${s*0.88} ${s*0.34},${s*0.78}" fill="#EF5350"/>
        <polygon points="${s*0.66},${s*0.7} ${s*0.78},${s*0.88} ${s*0.66},${s*0.78}" fill="#EF5350"/>
        <circle cx="${s/2}" cy="${s*0.44}" r="${s*0.09}" fill="#E3F2FD"/>
      </g>
    `,
    flower: `
      <g>
        ${[0,60,120,180,240,300].map((angle) => `
          <ellipse cx="${s/2 + Math.cos(angle*Math.PI/180)*s*0.24}" cy="${s/2 + Math.sin(angle*Math.PI/180)*s*0.24}" rx="${s*0.14}" ry="${s*0.1}" fill="${c}" transform="rotate(${angle} ${s/2} ${s/2})"/>
        `).join('')}
        <circle cx="${s/2}" cy="${s/2}" r="${s*0.16}" fill="#FFCA28"/>
        <rect x="${s*0.47}" y="${s*0.62}" width="${s*0.06}" height="${s*0.28}" rx="${s*0.03}" fill="#43A047"/>
      </g>
    `,
    tree: `
      <g>
        <polygon points="${s/2},${s*0.08} ${s*0.15},${s*0.55} ${s*0.85},${s*0.55}" fill="${c}"/>
        <polygon points="${s/2},${s*0.25} ${s*0.18},${s*0.66} ${s*0.82},${s*0.66}" fill="${c}"/>
        <polygon points="${s/2},${s*0.42} ${s*0.22},${s*0.78} ${s*0.78},${s*0.78}" fill="${c}"/>
        <rect x="${s*0.44}" y="${s*0.76}" width="${s*0.12}" height="${s*0.18}" fill="${d}"/>
      </g>
    `,
    house: `
      <g>
        <polygon points="${s/2},${s*0.1} ${s*0.9},${s*0.45} ${s*0.1},${s*0.45}" fill="#EF5350"/>
        <rect x="${s*0.15}" y="${s*0.44}" width="${s*0.7}" height="${s*0.46}" fill="${c}"/>
        <rect x="${s*0.4}" y="${s*0.64}" width="${s*0.2}" height="${s*0.26}" rx="${s*0.02}" fill="${d}"/>
        <rect x="${s*0.22}" y="${s*0.54}" width="${s*0.14}" height="${s*0.12}" rx="${s*0.02}" fill="#E3F2FD"/>
        <rect x="${s*0.64}" y="${s*0.54}" width="${s*0.14}" height="${s*0.12}" rx="${s*0.02}" fill="#E3F2FD"/>
      </g>
    `,
    car: `
      <g>
        <rect x="${s*0.08}" y="${s*0.52}" width="${s*0.84}" height="${s*0.28}" rx="${s*0.06}" fill="${c}"/>
        <path d="M ${s*0.2},${s*0.52} L ${s*0.28},${s*0.32} L ${s*0.72},${s*0.32} L ${s*0.8},${s*0.52}" fill="${d}"/>
        <rect x="${s*0.3}" y="${s*0.34}" width="${s*0.4}" height="${s*0.16}" rx="${s*0.04}" fill="#E3F2FD"/>
        <circle cx="${s*0.25}" cy="${s*0.8}" r="${s*0.1}" fill="#37474F"/>
        <circle cx="${s*0.25}" cy="${s*0.8}" r="${s*0.06}" fill="#90A4AE"/>
        <circle cx="${s*0.75}" cy="${s*0.8}" r="${s*0.1}" fill="#37474F"/>
        <circle cx="${s*0.75}" cy="${s*0.8}" r="${s*0.06}" fill="#90A4AE"/>
      </g>
    `,
    airplane: `
      <g>
        <ellipse cx="${s/2}" cy="${s/2}" rx="${s*0.38}" ry="${s*0.12}" fill="${c}"/>
        <polygon points="${s*0.2},${s*0.42} ${s*0.5},${s*0.28} ${s*0.8},${s*0.42}" fill="${d}"/>
        <polygon points="${s*0.62},${s*0.52} ${s*0.82},${s*0.72} ${s*0.92},${s*0.58}" fill="${d}"/>
        <circle cx="${s*0.25}" cy="${s/2}" r="${s*0.06}" fill="#E3F2FD"/>
      </g>
    `,
    robot: `
      <g>
        <rect x="${s*0.3}" y="${s*0.08}" width="${s*0.4}" height="${s*0.3}" rx="${s*0.06}" fill="${c}"/>
        <rect x="${s*0.22}" y="${s*0.38}" width="${s*0.56}" height="${s*0.38}" rx="${s*0.06}" fill="${d}"/>
        <rect x="${s*0.08}" y="${s*0.42}" width="${s*0.14}" height="${s*0.26}" rx="${s*0.04}" fill="${c}"/>
        <rect x="${s*0.78}" y="${s*0.42}" width="${s*0.14}" height="${s*0.26}" rx="${s*0.04}" fill="${c}"/>
        <rect x="${s*0.34}" y="${s*0.76}" width="${s*0.12}" height="${s*0.2}" rx="${s*0.04}" fill="${c}"/>
        <rect x="${s*0.54}" y="${s*0.76}" width="${s*0.12}" height="${s*0.2}" rx="${s*0.04}" fill="${c}"/>
        <circle cx="${s*0.41}" cy="${s*0.23}" r="${s*0.07}" fill="#E3F2FD"/>
        <circle cx="${s*0.59}" cy="${s*0.23}" r="${s*0.07}" fill="#E3F2FD"/>
        <circle cx="${s*0.41}" cy="${s*0.23}" r="${s*0.04}" fill="#1565C0"/>
        <circle cx="${s*0.59}" cy="${s*0.23}" r="${s*0.04}" fill="#1565C0"/>
        <rect x="${s*0.34}" y="${s*0.5}" width="${s*0.32}" height="${s*0.08}" rx="${s*0.03}" fill="#4FC3F7"/>
        <rect x="${s*0.46}" y="${s*0.06}" width="${s*0.08}" height="${s*0.06}" rx="${s*0.02}" fill="#78909C"/>
      </g>
    `,
    dragon: `
      <g>
        <ellipse cx="${s*0.5}" cy="${s*0.58}" rx="${s*0.28}" ry="${s*0.22}" fill="${c}"/>
        <polygon points="${s*0.32},${s*0.32} ${s*0.18},${s*0.14} ${s*0.38},${s*0.28}" fill="${d}"/>
        <polygon points="${s*0.68},${s*0.32} ${s*0.82},${s*0.14} ${s*0.62},${s*0.28}" fill="${d}"/>
        <circle cx="${s/2}" cy="${s*0.38}" r="${s*0.2}" fill="${c}"/>
        <circle cx="${s*0.42}" cy="${s*0.35}" r="${s*0.05}" fill="#fff"/>
        <circle cx="${s*0.42}" cy="${s*0.35}" r="${s*0.03}" fill="#222"/>
        <circle cx="${s*0.58}" cy="${s*0.35}" r="${s*0.05}" fill="#fff"/>
        <circle cx="${s*0.58}" cy="${s*0.35}" r="${s*0.03}" fill="#222"/>
        <ellipse cx="${s*0.72}" cy="${s*0.52}" rx="${s*0.2}" ry="${s*0.1}" fill="${d}" transform="rotate(-20 ${s*0.72} ${s*0.52})"/>
      </g>
    `,
    ghost: `
      <g>
        <path d="M ${s*0.2},${s*0.85} L ${s*0.2},${s*0.42} Q ${s*0.2},${s*0.1} ${s*0.5},${s*0.1} Q ${s*0.8},${s*0.1} ${s*0.8},${s*0.42} L ${s*0.8},${s*0.85} L ${s*0.68},${s*0.72} L ${s*0.56},${s*0.85} L ${s*0.44},${s*0.72} L ${s*0.32},${s*0.85} Z" fill="${c}"/>
        <circle cx="${s*0.38}" cy="${s*0.44}" r="${s*0.07}" fill="#fff"/>
        <circle cx="${s*0.38}" cy="${s*0.44}" r="${s*0.04}" fill="#333"/>
        <circle cx="${s*0.62}" cy="${s*0.44}" r="${s*0.07}" fill="#fff"/>
        <circle cx="${s*0.62}" cy="${s*0.44}" r="${s*0.04}" fill="#333"/>
      </g>
    `,
    bear: `
      <g>
        <circle cx="${s*0.32}" cy="${s*0.28}" r="${s*0.14}" fill="${c}"/>
        <circle cx="${s*0.68}" cy="${s*0.28}" r="${s*0.14}" fill="${c}"/>
        <circle cx="${s*0.5}" cy="${s*0.54}" r="${s*0.32}" fill="${c}"/>
        <circle cx="${s*0.5}" cy="${s*0.58}" r="${s*0.18}" fill="${d}"/>
        <circle cx="${s*0.42}" cy="${s*0.46}" r="${s*0.05}" fill="#333"/>
        <circle cx="${s*0.58}" cy="${s*0.46}" r="${s*0.05}" fill="#333"/>
        <ellipse cx="${s*0.5}" cy="${s*0.58}" rx="${s*0.06}" ry="${s*0.04}" fill="#555"/>
      </g>
    `,
    owl: `
      <g>
        <ellipse cx="${s*0.5}" cy="${s*0.56}" rx="${s*0.28}" ry="${s*0.34}" fill="${c}"/>
        <circle cx="${s*0.38}" cy="${s*0.38}" r="${s*0.14}" fill="${d}"/>
        <circle cx="${s*0.62}" cy="${s*0.38}" r="${s*0.14}" fill="${d}"/>
        <circle cx="${s*0.38}" cy="${s*0.38}" r="${s*0.08}" fill="#fff"/>
        <circle cx="${s*0.62}" cy="${s*0.38}" r="${s*0.08}" fill="#fff"/>
        <circle cx="${s*0.38}" cy="${s*0.38}" r="${s*0.05}" fill="#333"/>
        <circle cx="${s*0.62}" cy="${s*0.38}" r="${s*0.05}" fill="#333"/>
        <polygon points="${s*0.5},${s*0.5} ${s*0.44},${s*0.57} ${s*0.56},${s*0.57}" fill="#FFCA28"/>
        <polygon points="${s*0.32},${s*0.7} ${s*0.28},${s*0.82} ${s*0.36},${s*0.82}" fill="#FFCA28"/>
        <polygon points="${s*0.68},${s*0.7} ${s*0.64},${s*0.82} ${s*0.72},${s*0.82}" fill="#FFCA28"/>
      </g>
    `,
    turtle: `
      <g>
        <ellipse cx="${s*0.5}" cy="${s*0.52}" rx="${s*0.34}" ry="${s*0.26}" fill="${c}"/>
        <ellipse cx="${s*0.5}" cy="${s*0.52}" rx="${s*0.22}" ry="${s*0.18}" fill="${d}"/>
        <circle cx="${s*0.5}" cy="${s*0.28}" r="${s*0.12}" fill="${c}"/>
        <circle cx="${s*0.68}" cy="${s*0.56}" r="${s*0.07}" fill="${c}"/>
        <circle cx="${s*0.32}" cy="${s*0.56}" r="${s*0.07}" fill="${c}"/>
        <circle cx="${s*0.6}" cy="${s*0.7}" r="${s*0.07}" fill="${c}"/>
        <circle cx="${s*0.4}" cy="${s*0.7}" r="${s*0.07}" fill="${c}"/>
        <circle cx="${s*0.45}" cy="${s*0.26}" r="${s*0.03}" fill="#333"/>
        <circle cx="${s*0.55}" cy="${s*0.26}" r="${s*0.03}" fill="#333"/>
      </g>
    `,
    shark: `
      <g>
        <ellipse cx="${s*0.48}" cy="${s*0.55}" rx="${s*0.36}" ry="${s*0.2}" fill="${c}"/>
        <polygon points="${s*0.5},${s*0.12} ${s*0.44},${s*0.38} ${s*0.56},${s*0.38}" fill="${c}"/>
        <polygon points="${s*0.82},${s*0.48} ${s*0.92},${s*0.38} ${s*0.92},${s*0.62}" fill="${d}"/>
        <ellipse cx="${s*0.38}" cy="${s*0.55}" rx="${s*0.12}" ry="${s*0.12}" fill="#fff"/>
        <circle cx="${s*0.3}" cy="${s*0.52}" r="${s*0.04}" fill="#333"/>
        <path d="M ${s*0.44},${s*0.62} L ${s*0.52},${s*0.58} L ${s*0.6},${s*0.62}" stroke="#fff" stroke-width="1.5" fill="none"/>
      </g>
    `,
    penguin: `
      <g>
        <ellipse cx="${s*0.5}" cy="${s*0.56}" rx="${s*0.24}" ry="${s*0.34}" fill="${c}"/>
        <ellipse cx="${s*0.5}" cy="${s*0.58}" rx="${s*0.16}" ry="${s*0.24}" fill="#fff"/>
        <circle cx="${s*0.5}" cy="${s*0.3}" r="${s*0.18}" fill="${c}"/>
        <circle cx="${s*0.44}" cy="${s*0.28}" r="${s*0.05}" fill="#fff"/>
        <circle cx="${s*0.44}" cy="${s*0.28}" r="${s*0.03}" fill="#333"/>
        <circle cx="${s*0.56}" cy="${s*0.28}" r="${s*0.05}" fill="#fff"/>
        <circle cx="${s*0.56}" cy="${s*0.28}" r="${s*0.03}" fill="#333"/>
        <polygon points="${s*0.5},${s*0.38} ${s*0.44},${s*0.44} ${s*0.56},${s*0.44}" fill="#FF8C42"/>
        <ellipse cx="${s*0.28}" cy="${s*0.58}" rx="${s*0.08}" ry="${s*0.18}" fill="${c}"/>
        <ellipse cx="${s*0.72}" cy="${s*0.58}" rx="${s*0.08}" ry="${s*0.18}" fill="${c}"/>
        <ellipse cx="${s*0.38}" cy="${s*0.82}" rx="${s*0.12}" ry="${s*0.05}" fill="#FF8C42"/>
        <ellipse cx="${s*0.62}" cy="${s*0.82}" rx="${s*0.12}" ry="${s*0.05}" fill="#FF8C42"/>
      </g>
    `,
    lion: `
      <g>
        ${[0,45,90,135,180,225,270,315].map((angle) => `
          <ellipse cx="${s/2 + Math.cos(angle*Math.PI/180)*s*0.3}" cy="${s/2 + Math.sin(angle*Math.PI/180)*s*0.3}" rx="${s*0.1}" ry="${s*0.14}" fill="#FF8C42" transform="rotate(${angle+90} ${s/2 + Math.cos(angle*Math.PI/180)*s*0.3} ${s/2 + Math.sin(angle*Math.PI/180)*s*0.3})"/>
        `).join('')}
        <circle cx="${s/2}" cy="${s/2}" r="${s*0.24}" fill="${c}"/>
        <circle cx="${s*0.42}" cy="${s*0.45}" r="${s*0.05}" fill="#333"/>
        <circle cx="${s*0.58}" cy="${s*0.45}" r="${s*0.05}" fill="#333"/>
        <ellipse cx="${s/2}" cy="${s*0.55}" rx="${s*0.08}" ry="${s*0.05}" fill="${d}"/>
        <path d="M ${s*0.42},${s*0.6} Q ${s*0.5},${s*0.65} ${s*0.58},${s*0.6}" stroke="#333" stroke-width="1.5" fill="none"/>
      </g>
    `,
    fox: `
      <g>
        <polygon points="${s*0.24},${s*0.22} ${s*0.14},${s*0.06} ${s*0.34},${s*0.18}" fill="${c}"/>
        <polygon points="${s*0.76},${s*0.22} ${s*0.86},${s*0.06} ${s*0.66},${s*0.18}" fill="${c}"/>
        <circle cx="${s/2}" cy="${s*0.42}" r="${s*0.26}" fill="${c}"/>
        <ellipse cx="${s*0.5}" cy="${s*0.6}" rx="${s*0.3}" ry="${s*0.24}" fill="${c}"/>
        <ellipse cx="${s*0.5}" cy="${s*0.46}" rx="${s*0.14}" ry="${s*0.12}" fill="#fff"/>
        <circle cx="${s*0.42}" cy="${s*0.38}" r="${s*0.04}" fill="#333"/>
        <circle cx="${s*0.58}" cy="${s*0.38}" r="${s*0.04}" fill="#333"/>
        <ellipse cx="${s/2}" cy="${s*0.46}" rx="${s*0.05}" ry="${s*0.04}" fill="#333"/>
      </g>
    `,
    duck: `
      <g>
        <ellipse cx="${s*0.5}" cy="${s*0.62}" rx="${s*0.3}" ry="${s*0.22}" fill="${c}"/>
        <circle cx="${s*0.36}" cy="${s*0.38}" r="${s*0.18}" fill="${c}"/>
        <ellipse cx="${s*0.22}" cy="${s*0.4}" rx="${s*0.1}" ry="${s*0.06}" fill="#FF8C42"/>
        <circle cx="${s*0.32}" cy="${s*0.35}" r="${s*0.04}" fill="#333"/>
        <ellipse cx="${s*0.72}" cy="${s*0.65}" rx="${s*0.08}" ry="${s*0.04}" fill="#FF8C42"/>
      </g>
    `
  };

  const content = shapes[entry.shape] || `<circle cx="${s/2}" cy="${s/2}" r="${s*0.4}" fill="${entry.color}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${content}</svg>`;
}

function getBackdropSvgString(entry: any, colors: string[], width = 480, height = 360): string {
  const w = width;
  const h = height;
  const [c1, c2, c3] = colors;

  const patterns: Record<string, string> = {
    gradient: `
      <defs>
        <linearGradient id="grad-${entry.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#grad-${entry.id})"/>
    `,
    sky: `
      <defs>
        <linearGradient id="sky-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4FC3F7"/>
          <stop offset="100%" stop-color="#E0F7FA"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#sky-${entry.id})"/>
      <ellipse cx="${w*0.25}" cy="${h*0.25}" rx="${w*0.12}" ry="${h*0.1}" fill="#fff" opacity="0.9"/>
      <ellipse cx="${w*0.35}" cy="${h*0.22}" rx="${w*0.16}" ry="${h*0.12}" fill="#fff" opacity="0.9"/>
      <ellipse cx="${w*0.45}" cy="${h*0.25}" rx="${w*0.12}" ry="${h*0.1}" fill="#fff" opacity="0.9"/>
      <ellipse cx="${w*0.72}" cy="${h*0.18}" rx="${w*0.1}" ry="${h*0.08}" fill="#fff" opacity="0.9"/>
      <ellipse cx="${w*0.8}" cy="${h*0.16}" rx="${w*0.13}" ry="${h*0.1}" fill="#fff" opacity="0.9"/>
      <rect x="0" y="${h*0.85}" width="${w}" height="${h*0.15}" fill="#7EC850"/>
    `,
    sunset: `
      <defs>
        <linearGradient id="sunset-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FF6B35"/>
          <stop offset="50%" stop-color="#FFD166"/>
          <stop offset="100%" stop-color="#06D6A0"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#sunset-${entry.id})"/>
      <circle cx="${w*0.5}" cy="${h*0.62}" r="${w*0.14}" fill="#FF8C00" opacity="0.9"/>
      <rect x="0" y="${h*0.82}" width="${w}" height="${h*0.18}" fill="#2D6A4F"/>
    `,
    night: `
      <rect width="${w}" height="${h}" fill="#0A0A2E"/>
      ${Array.from({length: 20}).map((_, i) => {
        const cx = (i * 17 + 11) % w;
        const cy = (i * 23 + 7) % (h * 0.7);
        const r = ((i % 3) + 1) * 0.5 + 0.5;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" opacity="0.8"/>`;
      }).join('')}
      <circle cx="${w*0.75}" cy="${h*0.2}" r="${w*0.1}" fill="#FFFDE7"/>
      <rect x="0" y="${h*0.82}" width="${w}" height="${h*0.18}" fill="#1A1A3E"/>
    `,
    underwater: `
      <defs>
        <linearGradient id="under-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0099CC"/>
          <stop offset="100%" stop-color="#003344"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#under-${entry.id})"/>
      ${[0.2,0.4,0.6,0.8].map((x, i) => `
        <ellipse cx="${w*x}" cy="${h*0.9}" rx="${w*0.04}" ry="${h*0.12}" fill="#2D6A4F" opacity="0.7"/>
      `).join('')}
      <circle cx="${w*0.3}" cy="${h*0.4}" r="${w*0.04}" fill="#fff" opacity="0.3"/>
      <circle cx="${w*0.7}" cy="${h*0.3}" r="${w*0.03}" fill="#fff" opacity="0.3"/>
    `,
    forest: `
      <rect width="${w}" height="${h}" fill="#87CEEB"/>
      ${[0.1,0.25,0.45,0.6,0.75,0.9].map((x, i) => `
        <g>
          <rect x="${w*x-w*0.02}" y="${h*0.55}" width="${w*0.04}" height="${h*0.35}" fill="#5D4037"/>
          <polygon points="${w*x},${h*0.28} ${w*(x-0.08)},${h*0.6} ${w*(x+0.08)},${h*0.6}" fill="#2D6A4F"/>
          <polygon points="${w*x},${h*0.18} ${w*(x-0.06)},${h*0.45} ${w*(x+0.06)},${h*0.45}" fill="#40916C"/>
        </g>
      `).join('')}
      <rect x="0" y="${h*0.85}" width="${w}" height="${h*0.15}" fill="#4A7C59"/>
    `,
    city: `
      <defs>
        <linearGradient id="city-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1a1a2e"/>
          <stop offset="100%" stop-color="#4a4a6a"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#city-${entry.id})"/>
      ${[0.05,0.18,0.3,0.45,0.58,0.7,0.82,0.9].map((x, i) => {
        const bh = (i * 27 + 43) % (h * 0.4) + h * 0.2;
        const bw = w * 0.1;
        return `
          <g>
            <rect x="${w*x}" y="${h-bh}" width="${bw}" height="${bh}" fill="hsl(${220+i*10},30%,${25+i*3}%)"/>
            <rect x="${w*x+bw*0.2}" y="${h-bh+h*0.08}" width="${bw*0.15}" height="${h*0.07}" fill="#FFFF00" opacity="0.8"/>
            <rect x="${w*x+bw*0.6}" y="${h-bh+h*0.08}" width="${bw*0.15}" height="${h*0.07}" fill="#FFFF00" opacity="0.8"/>
            <rect x="${w*x+bw*0.2}" y="${h-bh+h*0.2}" width="${bw*0.15}" height="${h*0.07}" fill="#FFFF00" opacity="0.8"/>
            <rect x="${w*x+bw*0.6}" y="${h-bh+h*0.2}" width="${bw*0.15}" height="${h*0.07}" fill="#FFFF00" opacity="0.8"/>
          </g>
        `;
      }).join('')}
    `,
    space: `
      <rect width="${w}" height="${h}" fill="#0D0D2B"/>
      ${Array.from({length: 30}).map((_, i) => {
        const cx = (i * 19 + 7) % w;
        const cy = (i * 31 + 13) % h;
        const r = (i % 2) * 0.5 + 0.5;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" opacity="0.8"/>`;
      }).join('')}
      <circle cx="${w*0.2}" cy="${h*0.25}" r="${w*0.08}" fill="#8B7FE8" opacity="0.7"/>
      <circle cx="${w*0.7}" cy="${h*0.6}" r="${w*0.06}" fill="#E8A47F" opacity="0.6"/>
    `,
    beach: `
      <defs>
        <linearGradient id="beach-sky-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#87CEEB"/>
          <stop offset="100%" stop-color="#B0E0E6"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#beach-sky-${entry.id})"/>
      <circle cx="${w*0.85}" cy="${h*0.18}" r="${w*0.1}" fill="#FFD700"/>
      <rect x="0" y="${h*0.55}" width="${w}" height="${h*0.2}" fill="#06A77D" opacity="0.7"/>
      <rect x="0" y="${h*0.7}" width="${w}" height="${h*0.3}" fill="#F4D35E"/>
    `,
    snow: `
      <defs>
        <linearGradient id="snow-sky-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#B0C4DE"/>
          <stop offset="100%" stop-color="#E8F4FD"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#snow-sky-${entry.id})"/>
      ${Array.from({length: 15}).map((_, i) => {
        const cx = (i * 29 + 17) % w;
        const cy = (i * 17 + 5) % (h * 0.7);
        return `<circle cx="${cx}" cy="${cy}" r="3" fill="#fff" opacity="0.8"/>`;
      }).join('')}
      <rect x="0" y="${h*0.78}" width="${w}" height="${h*0.22}" fill="#FFFFFF"/>
      <polygon points="${w*0.3},${h*0.78} ${w*0.18},${h*0.55} ${w*0.42},${h*0.55}" fill="#FFFFFF"/>
      <polygon points="${w*0.65},${h*0.78} ${w*0.53},${h*0.48} ${w*0.77},${h*0.48}" fill="#FFFFFF"/>
    `,
    desert: `
      <defs>
        <linearGradient id="desert-sky-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#87CEEB"/>
          <stop offset="100%" stop-color="#FDB97D"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#desert-sky-${entry.id})"/>
      <circle cx="${w*0.8}" cy="${h*0.2}" r="${w*0.1}" fill="#FFD700"/>
      <rect x="0" y="${h*0.65}" width="${w}" height="${h*0.35}" fill="#F4A261"/>
      <ellipse cx="${w*0.25}" cy="${h*0.65}" rx="${w*0.06}" ry="${h*0.18}" fill="#8B5E3C"/>
      <ellipse cx="${w*0.23}" cy="${h*0.54}" rx="${w*0.05}" ry="${h*0.08}" fill="#2D6A4F"/>
      <ellipse cx="${w*0.75}" cy="${h*0.65}" rx="${w*0.05}" ry="${h*0.14}" fill="#8B5E3C"/>
      <ellipse cx="${w*0.73}" cy="${h*0.56}" rx="${w*0.04}" ry="${h*0.06}" fill="#2D6A4F"/>
    `,
    classroom: `
      <rect width="${w}" height="${h}" fill="#F5F0E8"/>
      <rect x="0" y="${h*0.05}" width="${w*0.65}" height="${h*0.55}" rx="2" fill="#2C2C2C" stroke="#1a1a1a" stroke-width="3"/>
      <rect x="${w*0.72}" y="${h*0.15}" width="${w*0.22}" height="${h*0.4}" rx="2" fill="#87CEEB" stroke="#5A9BB5" stroke-width="1"/>
      <rect x="0" y="${h*0.8}" width="${w}" height="${h*0.2}" fill="#D4A843"/>
      ${[0.2,0.35,0.5].map((x) => `
        <g>
          <rect x="${w*x}" y="${h*0.55}" width="${w*0.12}" height="${h*0.25}" rx="1" fill="#8B6347"/>
          <rect x="${w*(x-0.03)}" y="${h*0.72}" width="${w*0.18}" height="${h*0.08}" rx="1" fill="#A0784A"/>
        </g>
      `).join('')}
    `,
    stage: `
      <rect width="${w}" height="${h}" fill="#1A0033"/>
      <rect x="${w*0.1}" y="${h*0.7}" width="${w*0.8}" height="${h*0.3}" fill="#2D0052"/>
      ${[0.15,0.35,0.5,0.65,0.85].map((x, i) => `
        <circle cx="${w*x}" cy="${h*0.08}" r="${h*0.06}" fill="${['#FF0','#F0F','#0FF','#FF0','#F0F'][i]}" opacity="0.9"/>
      `).join('')}
      <rect x="0" y="${h*0.08}" width="${w*0.1}" height="${h*0.62}" fill="#3D0066"/>
      <rect x="${w*0.9}" y="${h*0.08}" width="${w*0.1}" height="${h*0.62}" fill="#3D0066"/>
    `,
    gym: `
      <rect width="${w}" height="${h}" fill="#4A4A4A"/>
      <rect x="0" y="${h*0.75}" width="${w}" height="${h*0.25}" fill="#5A3E28"/>
      ${[0.2,0.5,0.8].map((x) => `
        <g>
          <rect x="${w*(x-0.02)}" y="${h*0.15}" width="${w*0.04}" height="${h*0.6}" fill="#888"/>
          <rect x="${w*(x-0.1)}" y="${h*0.18}" width="${w*0.2}" height="${h*0.06}" rx="3" fill="#555"/>
          <rect x="${w*(x-0.1)}" y="${h*0.65}" width="${w*0.2}" height="${h*0.06}" rx="3" fill="#555"/>
        </g>
      `).join('')}
    `,
    bedroom: `
      <rect width="${w}" height="${h}" fill="#FFE0E6"/>
      <rect x="0" y="${h*0.65}" width="${w}" height="${h*0.35}" fill="#FFC2CC"/>
      <rect x="${w*0.1}" y="${h*0.28}" width="${w*0.55}" height="${h*0.37}" rx="3" fill="#F8BBD9"/>
      <rect x="${w*0.1}" y="${h*0.18}" width="${w*0.55}" height="${h*0.14}" rx="3" fill="#F48FB1"/>
      <rect x="${w*0.15}" y="${h*0.2}" width="${w*0.18}" height="${h*0.1}" rx="${h*0.05}" fill="#FCE4EC"/>
      <rect x="${w*0.42}" y="${h*0.2}" width="${w*0.18}" height="${h*0.1}" rx="${h*0.05}" fill="#FCE4EC"/>
      <rect x="${w*0.72}" y="${h*0.3}" width="${w*0.12}" height="${h*0.35}" fill="#C8956C"/>
      <rect x="${w*0.7}" y="${h*0.28}" width="${w*0.16}" height="${h*0.06}" fill="#A0724A"/>
      <rect x="${w*0.74}" y="${h*0.38}" width="${w*0.08}" height="${h*0.06}" rx="1" fill="#FFE082"/>
    `,
    kitchen: `
      <rect width="${w}" height="${h}" fill="#F0EFE7"/>
      <rect x="0" y="${h*0.55}" width="${w}" height="${h*0.45}" fill="#CCC5B9" stroke="#A8A09A" stroke-width="5"/>
      ${[0.05,0.28,0.52,0.75].map((x) => `
        <g>
          <rect x="${w*x}" y="${h*0.6}" width="${w*0.2}" height="${h*0.4}" fill="#DDD6CC"/>
          <circle cx="${w*(x+0.1)}" cy="${h*0.78}" r="${h*0.02}" fill="#888"/>
        </g>
      `).join('')}
      <rect x="${w*0.6}" y="${h*0.08}" width="${w*0.35}" height="${h*0.42}" rx="2" fill="#E8E4DC" stroke="#CCC5B9" stroke-width="1"/>
      <circle cx="${w*0.7}" cy="${h*0.2}" r="${w*0.04}" fill="#555"/>
      <circle cx="${w*0.82}" cy="${h*0.2}" r="${w*0.04}" fill="#555"/>
      <circle cx="${w*0.7}" cy="${h*0.35}" r="${w*0.04}" fill="#555"/>
      <circle cx="${w*0.82}" cy="${h*0.35}" r="${w*0.04}" fill="#555"/>
    `,
    castle: `
      <defs>
        <linearGradient id="castle-sky-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#6B8CCA"/>
          <stop offset="100%" stop-color="#9DB4CC"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#castle-sky-${entry.id})"/>
      <rect x="0" y="${h*0.82}" width="${w}" height="${h*0.18}" fill="#4A5568"/>
      <rect x="${w*0.3}" y="${h*0.3}" width="${w*0.4}" height="${h*0.52}" fill="#718096"/>
      <rect x="${w*0.1}" y="${h*0.42}" width="${w*0.2}" height="${h*0.4}" fill="#718096"/>
      <rect x="${w*0.7}" y="${h*0.42}" width="${w*0.2}" height="${h*0.4}" fill="#718096"/>
      ${[0.3,0.42,0.54,0.66].map((x) => `<rect x="${w*x}" y="${h*0.22}" width="${w*0.1}" height="${h*0.12}" fill="#718096"/>`).join('')}
      ${[0.1,0.22].map((x) => `<rect x="${w*x}" y="${h*0.34}" width="${w*0.1}" height="${h*0.12}" fill="#718096"/>`).join('')}
      ${[0.7,0.82].map((x) => `<rect x="${w*x}" y="${h*0.34}" width="${w*0.1}" height="${h*0.12}" fill="#718096"/>`).join('')}
      <rect x="${w*0.43}" y="${h*0.55}" width="${w*0.14}" height="${h*0.27}" fill="#4A5568"/>
      <ellipse cx="${w*0.5}" cy="${h*0.55}" rx="${w*0.07}" ry="${w*0.06}" fill="#4A5568"/>
    `,
    cave: `
      <rect width="${w}" height="${h}" fill="#2D3748"/>
      <rect x="0" y="${h*0.7}" width="${w}" height="${h*0.3}" fill="#1A202C"/>
      <ellipse cx="${w*0.5}" cy="${h*0.05}" rx="${w*0.35}" ry="${h*0.4}" fill="#1A202C"/>
      ${[0.2,0.35,0.6,0.75].map((x, i) => `
        <rect x="${w*x}" y="0" width="${w*0.04}" height="${h*(0.15+i*0.07)}" rx="${h*0.04}" fill="#1A202C" transform="rotate(180, ${w*x+w*0.02}, 0)"/>
      `).join('')}
      ${[0.15,0.45,0.7,0.85].map((x, i) => `
        <polygon points="${w*x},${h} ${w*(x+0.04)},${h} ${w*(x+0.02)},${h*(0.75-i*0.05)}" fill="#2D3748"/>
      `).join('')}
      <circle cx="${w*0.15}" cy="${h*0.6}" r="${h*0.04}" fill="#FFCA28" opacity="0.5"/>
      <circle cx="${w*0.75}" cy="${h*0.5}" r="${h*0.03}" fill="#FFCA28" opacity="0.4"/>
    `,
    jungle: `
      <rect width="${w}" height="${h}" fill="#1B4332"/>
      ${[0,0.15,0.3,0.5,0.65,0.8,0.95].map((x) => `
        <g>
          <rect x="${w*x}" y="${h*0.4}" width="${w*0.08}" height="${h*0.6}" fill="#2D6A4F"/>
          <ellipse cx="${w*(x+0.04)}" cy="${h*0.4}" rx="${w*0.12}" ry="${h*0.08}" fill="#40916C" transform="rotate(-30, ${w*(x+0.04)}, ${h*0.4})"/>
          <ellipse cx="${w*(x+0.04)}" cy="${h*0.28}" rx="${w*0.12}" ry="${h*0.08}" fill="#40916C"/>
          <ellipse cx="${w*(x+0.04)}" cy="${h*0.16}" rx="${w*0.12}" ry="${h*0.08}" fill="#40916C" transform="rotate(30, ${w*(x+0.04)}, ${h*0.16})"/>
        </g>
      `).join('')}
    `,
    moon: `
      <rect width="${w}" height="${h}" fill="#1C1C3A"/>
      ${Array.from({length: 25}).map((_, i) => {
        const cx = (Math.sin(i*137.5)*w*0.45+w*0.5);
        const cy = (Math.cos(i*137.5)*h*0.45+h*0.5);
        return `<circle cx="${cx}" cy="${cy}" r="1.5" fill="#fff" opacity="0.8"/>`;
      }).join('')}
      <circle cx="${w*0.5}" cy="${h*0.42}" r="${w*0.28}" fill="#8B8B9E"/>
      <circle cx="${w*0.4}" cy="${h*0.36}" r="${w*0.08}" fill="#7A7A8E" opacity="0.5"/>
      <circle cx="${w*0.6}" cy="${h*0.5}" r="${w*0.06}" fill="#7A7A8E" opacity="0.4"/>
      <circle cx="${w*0.52}" cy="${h*0.3}" r="${w*0.04}" fill="#7A7A8E" opacity="0.5"/>
      <rect x="0" y="${h*0.82}" width="${w}" height="${h*0.18}" fill="#111128"/>
    `,
    volcano: `
      <defs>
        <linearGradient id="vol-sky-${entry.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4A1A00"/>
          <stop offset="100%" stop-color="#8B2500"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#vol-sky-${entry.id})"/>
      <polygon points="${w*0.5},${h*0.08} ${w*0.1},${h*0.85} ${w*0.9},${h*0.85}" fill="#6B2D0E"/>
      <polygon points="${w*0.5},${h*0.08} ${w*0.44},${h*0.28} ${w*0.56},${h*0.28}" fill="#1A0A00"/>
      <rect x="0" y="${h*0.85}" width="${w}" height="${h*0.15}" fill="#3D1500"/>
      ${[0.38,0.44,0.5,0.56,0.62].map((x, i) => `
        <ellipse cx="${w*x}" cy="${h*(0.28+i*0.06)}" rx="${w*0.04}" ry="${h*0.08}" fill="#FF6B00" opacity="${0.8-i*0.1}"/>
      `).join('')}
    `,
    rainbow: `
      <rect width="${w}" height="${h}" fill="#87CEEB"/>
      ${['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#8F00FF'].reverse().map((color, i) => `
        <path d="M ${w*0.05} ${h*0.75} Q ${w*0.5} ${h*(0.08-i*0.07)} ${w*0.95} ${h*0.75}" fill="none" stroke="${color}" stroke-width="${h*0.06}" opacity="0.7"/>
      `).join('')}
      <rect x="0" y="${h*0.82}" width="${w}" height="${h*0.18}" fill="#7EC850"/>
      <ellipse cx="${w*0.2}" cy="${h*0.35}" rx="${w*0.12}" ry="${h*0.1}" fill="#fff" opacity="0.9"/>
      <ellipse cx="${w*0.75}" cy="${h*0.28}" rx="${w*0.1}" ry="${h*0.09}" fill="#fff" opacity="0.9"/>
    `
  };

  const content = patterns[entry.pattern] || `<rect width="${w}" height="${h}" fill="${colors[0]}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${content}</svg>`;
}

export default function StageArea() {
  const { isPlaying, setIsPlaying } = useProjectStore();
  const sprites = useSpriteStore((s) => s.sprites);
  const { setBackdropLibraryOpen } = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [stageSize, setStageSize] = useState<'normal' | 'large'>('normal');

  // Image cache to avoid repeated construction
  const imgCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const getImg = useCallback((url: string): HTMLImageElement => {
    if (!imgCache.current.has(url)) {
      const img = new Image();
      img.src = url;
      imgCache.current.set(url, img);
    }
    return imgCache.current.get(url)!;
  }, []);

  useEffect(() => {
    const draw = () => {
      drawStage();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sprites]);

  const drawStage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    const currentSprites = useSpriteStore.getState().sprites;
    const stage = currentSprites.find((s) => s.isStage);

    // Draw backdrop
    if (stage) {
      const costume = stage.costumes[stage.currentCostume];
      if (costume?.url) {
        const img = getImg(costume.url);
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        }
      } else if (costume?.backdropPattern) {
        const backdropEntry = BACKDROP_LIBRARY.find(b => b.pattern === costume.backdropPattern);
        if (backdropEntry) {
          const colors = costume.backdropColors || backdropEntry.colors;
          const cacheKey = `backdrop-${costume.backdropPattern}-${colors.join('-')}`;
          let img = imgCache.current.get(cacheKey);
          if (!img) {
            img = new Image();
            // Build the SVG string for the backdrop
            const svgString = getBackdropSvgString(backdropEntry, colors, STAGE_WIDTH, STAGE_HEIGHT);
            img.onload = () => {
              drawStage();
            };
            img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
            imgCache.current.set(cacheKey, img);
          }
          if (img.complete) {
            ctx.drawImage(img, 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
          }
        }
      }
    }

    // Draw sprites
    for (const sprite of currentSprites) {
      if (sprite.isStage || !sprite.visible) continue;

      const screenX = STAGE_WIDTH / 2 + sprite.x;
      const screenY = STAGE_HEIGHT / 2 - sprite.y;

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate(((sprite.direction - 90) * Math.PI) / 180);

      const scale = sprite.size / 100;
      const costume = sprite.costumes[sprite.currentCostume];

      if (costume?.url) {
        const img = getImg(costume.url);
        const w = (costume.width || 100) * scale;
        const h = (costume.height || 100) * scale;
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
        }
      } else if (costume?.svgShape) {
        // Render SVG sprite by searching the library or rendering SVG
        const libraryEntry = SPRITE_LIBRARY.find(s => s.shape === costume.svgShape);
        if (libraryEntry) {
          // Render SVG by creating a data URI or rendering onto offscreen/cache
          const cacheKey = `svg-${costume.svgShape}-${libraryEntry.color}-${libraryEntry.secondaryColor}`;
          let img = imgCache.current.get(cacheKey);
          if (!img) {
            img = new Image();
            // Let's build a quick XML string for the SVG path/group from SpriteSVG definitions
            // To do this simply, we can fetch the SVG from a function or build it.
            // Wait, we can render the SVG structure to a data URL.
            // We can export or construct the SVG path. Let's see if we can convert the React components into raw SVG strings.
            // Let's write a helper function to get SVG string for the shape.
            const svgString = getSvgString(libraryEntry, 100);
            img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
            imgCache.current.set(cacheKey, img);
          }
          const w = 100 * scale;
          const h = 100 * scale;
          if (img.complete) {
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
          }
        }
      } else {
        // Draw colored circle placeholder
        const radius = 24 * scale;
        ctx.fillStyle = '#4C97FF';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, 14 * scale)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sprite.name[0], 0, 0);
      }

      ctx.restore();
    }
  }, [getImg]);

  return (
    <div className={`stage-area ${stageSize === 'large' ? 'stage-area--large' : ''}`}>
      {/* Controls bar — matches Scratch 3 top bar above stage */}
      <div className="stage-area__controls">
        {/* Green flag */}
        <button
          id="btn-green-flag"
          className={`stage-area__flag-btn ${isPlaying ? 'stage-area__flag-btn--active' : ''}`}
          onClick={() => { setIsPlaying(true); engine.start(); }}
          title="Green Flag — Start (Space)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" fill={isPlaying ? '#4CBF56' : '#4CBF56'} stroke="#389B40" strokeWidth="1"/>
            <path d="M8 6l7 4-7 4V6z" fill="#fff"/>
          </svg>
        </button>

        {/* Stop */}
        <button
          id="btn-stop"
          className="stage-area__stop-btn"
          onClick={() => { setIsPlaying(false); engine.stop(); }}
          title="Stop"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" fill="#EC5959" stroke="#D94A4A" strokeWidth="1"/>
            <rect x="7" y="7" width="6" height="6" rx="1" fill="#fff"/>
          </svg>
        </button>

        {/* Turbo */}
        {turboMode && (
          <div className="stage-area__turbo-badge">⚡ Turbo Mode</div>
        )}

        <div className="stage-area__spacer" />

        {/* Stage size controls */}
        <button
          className={`stage-area__size-btn ${stageSize === 'normal' ? 'stage-area__size-btn--active' : ''}`}
          onClick={() => setStageSize('normal')}
          title="Small stage"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0.5" y="0.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <rect x="2" y="2" width="5" height="4" rx="0.5" fill="currentColor" opacity="0.5"/>
          </svg>
        </button>
        <button
          className={`stage-area__size-btn ${stageSize === 'large' ? 'stage-area__size-btn--active' : ''}`}
          onClick={() => setStageSize('large')}
          title="Large stage"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0.5" y="0.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
            <rect x="1" y="1" width="14" height="10" rx="1" fill="currentColor" opacity="0.15"/>
          </svg>
        </button>
        <button
          className="stage-area__fullscreen-btn"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Full screen"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Stage canvas */}
      <div className={`stage-area__stage ${isFullscreen ? 'stage-area__stage--fullscreen' : ''}`}>
        <canvas
          ref={canvasRef}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          className="stage-area__canvas"
          onMouseDown={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            // Translate client mouse coordinates to Scratch stage coordinates
            // Scratch center is (0,0), canvas top-left is (0,0)
            const canvasX = e.clientX - rect.left;
            const canvasY = e.clientY - rect.top;
            const scratchX = canvasX - STAGE_WIDTH / 2;
            const scratchY = STAGE_HEIGHT / 2 - canvasY;

            // Find clicked sprite from top to bottom (reverse order)
            const currentSprites = [...useSpriteStore.getState().sprites].reverse();
            const clickedSprite = currentSprites.find((s) => {
              if (s.isStage || !s.visible) return false;
              const scale = s.size / 100;
              const costumeWidth = 100 * scale;
              const costumeHeight = 100 * scale;
              const halfW = costumeWidth / 2;
              const halfH = costumeHeight / 2;
              return (
                scratchX >= s.x - halfW &&
                scratchX <= s.x + halfW &&
                scratchY >= s.y - halfH &&
                scratchY <= s.y + halfH
              );
            });

            if (clickedSprite) {
              const selectSprite = useSpriteStore.getState().selectSprite;
              const updateSprite = useSpriteStore.getState().updateSprite;
              selectSprite(clickedSprite.id);

              const startX = clickedSprite.x;
              const startY = clickedSprite.y;
              const startMouseX = e.clientX;
              const startMouseY = e.clientY;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const dx = moveEvent.clientX - startMouseX;
                const dy = moveEvent.clientY - startMouseY;
                // Dy is inverted since canvas Y goes down but Scratch Y goes up
                updateSprite(clickedSprite.id, {
                  x: startX + dx,
                  y: startY - dy,
                });
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }
          }}
        />
        {isFullscreen && (
          <button className="stage-area__exit-fullscreen" onClick={() => setIsFullscreen(false)}>✕</button>
        )}

        {/* Turbo mode toggle overlay button */}
        <button
          className={`stage-area__turbo-toggle ${turboMode ? 'stage-area__turbo-toggle--active' : ''}`}
          onClick={() => setTurboMode(!turboMode)}
          title="Toggle Turbo Mode"
        >
          ⚡
        </button>
      </div>
    </div>
  );
}
