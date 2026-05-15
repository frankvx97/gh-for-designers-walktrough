import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './CompletionBadge.module.css';

const BADGE_W = 1600;
const BADGE_H = 1000;
const QUOTE_MAX = 180;

function formatDate(d: Date): string {
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const next = current ? current + ' ' + w : w;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = w;
      if (lines.length === maxLines - 1) break;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines);
    const last = truncated[maxLines - 1];
    truncated[maxLines - 1] = (last.length > maxChars - 1
      ? last.slice(0, maxChars - 1).trimEnd()
      : last) + '…';
    return truncated;
  }
  return lines;
}

interface Fields {
  name: string;
  role: string;
  company: string;
  quote: string;
}

interface BadgeSvgProps extends Fields {
  date: string;
}

// ─── Hero visual: static IsometricStack ────────────────────────────────────
// Mirrors src/components/IsometricStack.tsx but flattened to a static fragment
// with prefixed pattern IDs (no animation, no arrows fading — the badge is
// printed, not played). Rendered inside the badge SVG via <use>/transform.
const ISO_W = 600;
const ISO_H = 640;
const ISO_RHOMB_W = 360;
const ISO_RHOMB_H = ISO_RHOMB_W / 2;
const ISO_THICK = 28;
const ISO_CX = ISO_W / 2;
const GH_BACK_Y = 60;
const GH_CY = GH_BACK_Y + ISO_RHOMB_H / 2;
const GIT_BACK_Y = 360;
const GIT_CY = GIT_BACK_Y + ISO_RHOMB_H / 2;

function isoPolys(backY: number) {
  const top = `${ISO_CX},${backY} ${ISO_CX + ISO_RHOMB_W / 2},${backY + ISO_RHOMB_H / 2} ${ISO_CX},${backY + ISO_RHOMB_H} ${ISO_CX - ISO_RHOMB_W / 2},${backY + ISO_RHOMB_H / 2}`;
  const right = `${ISO_CX + ISO_RHOMB_W / 2},${backY + ISO_RHOMB_H / 2} ${ISO_CX + ISO_RHOMB_W / 2},${backY + ISO_RHOMB_H / 2 + ISO_THICK} ${ISO_CX},${backY + ISO_RHOMB_H + ISO_THICK} ${ISO_CX},${backY + ISO_RHOMB_H}`;
  const left = `${ISO_CX - ISO_RHOMB_W / 2},${backY + ISO_RHOMB_H / 2} ${ISO_CX},${backY + ISO_RHOMB_H} ${ISO_CX},${backY + ISO_RHOMB_H + ISO_THICK} ${ISO_CX - ISO_RHOMB_W / 2},${backY + ISO_RHOMB_H / 2 + ISO_THICK}`;
  return { top, right, left };
}
const GH = isoPolys(GH_BACK_Y);
const GIT = isoPolys(GIT_BACK_Y);

const GIT_PATH = 'M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.235-4.27-21.336l-26.462-26.462-.003 69.637a19.82 19.82 0 0 1 5.188 3.71c7.663 7.66 7.663 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.663-7.671-7.663-20.086 0-27.746a19.654 19.654 0 0 1 6.421-4.281V94.196a19.378 19.378 0 0 1-6.421-4.281c-5.806-5.798-7.202-14.317-4.227-21.446L81.47 39.442l-76.64 76.635c-6.44 6.443-6.44 16.884 0 23.322l111.774 111.768c6.435 6.438 16.873 6.438 23.316 0l111.251-111.249c6.438-6.44 6.438-16.887 0-23.324';
const GH_PATH = `M50 1.2c-27.6 0-50 22.4-50 50 0 22.1 14.3 40.8 34.2 47.4 2.5.5 3.4-1.1 3.4-2.4 0-1.2 0-4.3-.1-8.5-13.9 3-16.8-6.7-16.8-6.7-2.3-5.8-5.5-7.3-5.5-7.3-4.5-3.1.3-3 .3-3 5 .3 7.7 5.2 7.7 5.2 4.5 7.6 11.7 5.4 14.6 4.2.5-3.2 1.7-5.4 3.2-6.7-11.1-1.3-22.8-5.6-22.8-24.7 0-5.5 2-9.9 5.1-13.4-.5-1.3-2.2-6.3.5-13.2 0 0 4.2-1.3 13.8 5.1 4-1.1 8.2-1.7 12.5-1.7 4.2 0 8.4.6 12.5 1.7 9.5-6.5 13.7-5.1 13.7-5.1 2.7 6.9 1 11.9.5 13.2 3.2 3.5 5.1 8 5.1 13.4 0 19.2-11.7 23.4-22.8 24.7 1.8 1.5 3.4 4.6 3.4 9.2 0 6.7-.1 12.1-.1 13.7 0 1.3.9 2.9 3.4 2.4 19.9-6.6 34.2-25.3 34.2-47.4 0-27.6-22.4-50-50-50z`;

const GIT_SX = (ISO_RHOMB_W / 2 / 124) * 0.62;
const GIT_SY = GIT_SX / 2;
const GH_SX = (ISO_RHOMB_W / 2 / 50) * 0.58;
const GH_SY = GH_SX / 2;

function IsometricStackStatic() {
  return (
    <g>
      <defs>
        <pattern id="bGT" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#7CFF6B" />
          <circle cx="2" cy="2" r="0.75" fill="#031708" />
        </pattern>
        <pattern id="bGR" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#2c7d23" />
          <circle cx="2" cy="2" r="1.05" fill="#031708" />
        </pattern>
        <pattern id="bGL" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#48b03c" />
          <circle cx="2" cy="2" r="0.9" fill="#031708" />
        </pattern>
        <pattern id="bBT" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#5CE0FF" />
          <circle cx="2" cy="2" r="0.75" fill="#031018" />
        </pattern>
        <pattern id="bBR" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#0d5d75" />
          <circle cx="2" cy="2" r="1.05" fill="#031018" />
        </pattern>
        <pattern id="bBL" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#2096b8" />
          <circle cx="2" cy="2" r="0.9" fill="#031018" />
        </pattern>
        <radialGradient id="bShade" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="65%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>
        <clipPath id="bGitClip"><polygon points={GIT.top} /></clipPath>
        <clipPath id="bGhClip"><polygon points={GH.top} /></clipPath>
        <marker id="bArrG" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#7CFF6B" />
        </marker>
        <marker id="bArrB" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#5CE0FF" />
        </marker>
      </defs>

      <g stroke="#7CFF6B" strokeOpacity="0.32" strokeDasharray="2 4" fill="none">
        <polygon
          points={`${ISO_CX},${24} ${ISO_CX + ISO_RHOMB_W / 2 + 50},${ISO_RHOMB_H / 2 + 45} ${ISO_CX + ISO_RHOMB_W / 2 + 50},${GIT_BACK_Y + ISO_RHOMB_H / 2 + 60} ${ISO_CX},${GIT_BACK_Y + ISO_RHOMB_H + ISO_THICK + 40} ${ISO_CX - ISO_RHOMB_W / 2 - 50},${GIT_BACK_Y + ISO_RHOMB_H / 2 + 60} ${ISO_CX - ISO_RHOMB_W / 2 - 50},${ISO_RHOMB_H / 2 + 45}`}
        />
      </g>
      <g stroke="#5CE0FF" strokeOpacity="0.22" strokeDasharray="1 5" fill="none">
        <polygon
          points={`${ISO_CX},${42} ${ISO_CX + ISO_RHOMB_W / 2 + 24},${ISO_RHOMB_H / 2 + 52} ${ISO_CX + ISO_RHOMB_W / 2 + 24},${GIT_BACK_Y + ISO_RHOMB_H / 2 + 36} ${ISO_CX},${GIT_BACK_Y + ISO_RHOMB_H + ISO_THICK + 14} ${ISO_CX - ISO_RHOMB_W / 2 - 24},${GIT_BACK_Y + ISO_RHOMB_H / 2 + 36} ${ISO_CX - ISO_RHOMB_W / 2 - 24},${ISO_RHOMB_H / 2 + 52}`}
        />
      </g>

      <line x1={ISO_CX} y1={14} x2={ISO_CX} y2={GH_BACK_Y} stroke="#5CE0FF" strokeOpacity="0.5" strokeDasharray="2 3" />
      <circle cx={ISO_CX} cy={12} r="2.5" fill="#5CE0FF" />

      {/* GitHub platform */}
      <g>
        <polygon points={GH.left} fill="url(#bBL)" />
        <polygon points={GH.right} fill="url(#bBR)" />
        <polygon points={GH.top} fill="url(#bBT)" />
        <polygon points={GH.top} fill="url(#bShade)" />
        <polygon points={GH.top} fill="none" stroke="#bff0ff" strokeOpacity="0.32" strokeWidth="1" />
        <g clipPath="url(#bGhClip)">
          <g transform={`matrix(${GH_SX} 0 0 ${GH_SY} ${ISO_CX} ${GH_CY})`}>
            <g transform="translate(-50 -50)">
              <path d={GH_PATH} fill="#031018" />
            </g>
          </g>
        </g>
      </g>

      {/* Static push/pull arrows mid-gap */}
      <g>
        <line
          x1={ISO_CX - 56} y1={GH_BACK_Y + ISO_RHOMB_H + ISO_THICK + 30}
          x2={ISO_CX - 56} y2={GH_BACK_Y + ISO_RHOMB_H + ISO_THICK + 8}
          stroke="#7CFF6B" strokeWidth="2" strokeLinecap="round" markerEnd="url(#bArrG)"
        />
        <line
          x1={ISO_CX + 56} y1={GH_BACK_Y + ISO_RHOMB_H + ISO_THICK + 8}
          x2={ISO_CX + 56} y2={GH_BACK_Y + ISO_RHOMB_H + ISO_THICK + 30}
          stroke="#5CE0FF" strokeWidth="2" strokeLinecap="round" markerEnd="url(#bArrB)"
        />
      </g>

      {/* Git platform */}
      <g>
        <polygon points={GIT.left} fill="url(#bGL)" />
        <polygon points={GIT.right} fill="url(#bGR)" />
        <polygon points={GIT.top} fill="url(#bGT)" />
        <polygon points={GIT.top} fill="url(#bShade)" />
        <polygon points={GIT.top} fill="none" stroke="#bbffaf" strokeOpacity="0.35" strokeWidth="1" />
        <g clipPath="url(#bGitClip)">
          <g transform={`matrix(${GIT_SX} 0 0 ${GIT_SY} ${ISO_CX} ${GIT_CY})`}>
            <g transform="translate(-128 -128)">
              <path d={GIT_PATH} fill="#031708" />
            </g>
          </g>
        </g>
      </g>

      {/* Side decorations */}
      <g transform={`translate(540, ${GH_CY - 25})`} opacity="0.85">
        <path
          d="M -22 6 C -28 6 -28 -2 -22 -2 C -22 -8 -12 -10 -8 -6 C -6 -10 6 -10 6 -2 C 12 -2 12 6 6 6 Z"
          fill="none" stroke="#5CE0FF" strokeWidth="1.4" strokeLinejoin="round"
        />
        <g stroke="#5CE0FF" strokeDasharray="3 3" strokeWidth="1">
          <line x1="-30" y1="-4" x2="-60" y2="-4" />
          <line x1="-30" y1="2" x2="-54" y2="2" />
          <line x1="-30" y1="8" x2="-64" y2="8" />
        </g>
      </g>
      <g transform={`translate(40, ${GIT_CY - 10})`} opacity="0.85">
        <path d="M 0 0 H 12 L 14 4 H 28 V 18 H 0 Z" fill="none" stroke="#7CFF6B" strokeWidth="1.4" />
        <g stroke="#7CFF6B" strokeDasharray="3 3" strokeWidth="1">
          <line x1="34" y1="6" x2="64" y2="6" />
          <line x1="34" y1="11" x2="58" y2="11" />
          <line x1="34" y1="16" x2="68" y2="16" />
        </g>
      </g>
    </g>
  );
}

// ─── FP logo (16x16) inline ────────────────────────────────────────────────
function FpLogo({ color = '#7a93ad' }: { color?: string }) {
  return (
    <g fill={color}>
      <path d="M3.3729 13.3334L1.0625 11.9991L1.06449 7.99962L7.99169 4.00012V6.66668L3.3729 9.3339V13.3334Z" />
      <path d="M7.99169 2.66656L1.0625 6.66739L1.06449 3.9995L7.99169 0L11.4556 2.00008V4.66664L7.99169 2.66656Z" />
      <path d="M7.98638 13.3374L14.9289 9.33256L14.9269 12.0004L7.99967 15.9999L4.5271 13.9999V11.334L12.6185 6.66601V2.6665L14.9289 4.00078L14.9269 8.00028L6.83683 12.6669L7.98638 13.3374Z" />
    </g>
  );
}

const BadgeSvg = forwardRef<SVGSVGElement, BadgeSvgProps>(function BadgeSvg(
  { name, role, company, quote, date },
  ref
) {
  const safeName = (name.trim() || 'Your Name').toUpperCase().slice(0, 22);
  const roleCompany =
    [role.trim(), company.trim()].filter(Boolean).join(' @ ') || 'Designer @ Studio';
  const quoteLines = wrap(
    quote.trim() || 'I finally understand what a branch actually is.',
    44,
    3
  );
  const lastIdx = quoteLines.length - 1;

  const ink = '#d6e6f5';
  const inkMute = '#7a93ad';
  const inkDim = '#4a637c';
  const green = '#7CFF6B';
  const blue = '#5CE0FF';
  const amber = '#FFB347';
  const bg = '#060a0e';
  const panel = '#0f1924';
  const hairline = '#1d2c3d';

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${BADGE_W} ${BADGE_H}`}
      width={BADGE_W}
      height={BADGE_H}
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        <pattern id="bgDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill={hairline} />
        </pattern>
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg} stopOpacity="0" />
          <stop offset="100%" stopColor={bg} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Surface */}
      <rect width={BADGE_W} height={BADGE_H} fill={bg} />
      <rect width={BADGE_W} height={BADGE_H} fill="url(#bgDots)" />
      <rect width={BADGE_W} height={BADGE_H} fill="url(#vignette)" />

      {/* Hero visual — static isometric stack */}
      <g transform={`translate(950, 130) scale(1.05)`}>
        <IsometricStackStatic />
      </g>

      {/* Frame */}
      <rect
        x="20" y="20"
        width={BADGE_W - 40} height={BADGE_H - 40}
        fill="none" stroke={hairline} strokeWidth="1"
      />

      {/* Top: mission complete */}
      <text
        x="80" y="118"
        fill={green}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize="28" letterSpacing="6"
      >
        ▸ MISSION COMPLETE · 08 / 08
      </text>

      {/* Eyebrow tag — text is locked to a fixed render width via textLength so
          the rect always wraps it tightly regardless of which font ends up
          rendering (system fallback vs. embedded JetBrains Mono). */}
      <g transform="translate(80, 155)" fontFamily="'JetBrains Mono', ui-monospace, monospace">
        <rect x="0" y="0" width="636" height="44" fill={panel} stroke={hairline} />
        <text
          x="16" y="30"
          fill={amber}
          fontSize="22"
          letterSpacing="3"
          textLength="604"
          lengthAdjust="spacingAndGlyphs"
        >
          GIT &amp; GITHUB · FOR DESIGNERS · v0.1.0
        </text>
      </g>

      {/* Name */}
      <text
        x="80" y="380"
        fill={ink}
        fontFamily="'VT323', ui-monospace, monospace"
        fontSize="200" letterSpacing="2"
      >
        {safeName}
      </text>

      {/* Role @ Company */}
      <text
        x="80" y="450"
        fill={blue}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize="34" letterSpacing="2"
      >
        {roleCompany}
      </text>

      {/* Quote block */}
      <g fontFamily="'JetBrains Mono', ui-monospace, monospace">
        <text x="80" y="600" fill={green} fontSize="22" letterSpacing="3">
          &gt; what_i_liked_most.md
        </text>
        <line x1="80" y1="625" x2="900" y2="625" stroke={hairline} />
        {quoteLines.map((line, i) => {
          const prefix = i === 0 ? '“' : ' ';
          const suffix = i === lastIdx ? '”' : '';
          return (
            <text key={i} x="80" y={680 + i * 44} fill={ink} fontSize="30">
              {prefix}{line}{suffix}
            </text>
          );
        })}
      </g>

      {/* Footer divider */}
      <line
        x1="80" y1={BADGE_H - 120}
        x2={BADGE_W - 80} y2={BADGE_H - 120}
        stroke={hairline}
      />

      {/* Bottom-left: date */}
      <text
        x="80" y={BADGE_H - 60}
        fill={inkMute}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize="22" letterSpacing="4"
      >
        CERT · {date}
      </text>

      {/* Bottom-right: workshop credit. FP logo sits inline after "FRANKLIN
          PEREZ" — right-aligned anchor on the text, logo positioned just past
          the text's end. */}
      <text
        x={BADGE_W - 80} y={BADGE_H - 78}
        textAnchor="end"
        fill={inkMute}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize="22" letterSpacing="3"
      >
        GITHUB FOR DESIGNERS WORKSHOP
      </text>
      <g transform={`translate(${BADGE_W - 80 - 26}, ${BADGE_H - 66})`}>
        <text
          x="0" y="22"
          textAnchor="end"
          fill={inkMute}
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="18" letterSpacing="2"
        >
          FACILITATED BY FRANKLIN PEREZ
        </text>
        <g transform="translate(6, 8) scale(1.6)">
          <FpLogo color={inkMute} />
        </g>
      </g>
    </svg>
  );
});

// ─── Font embedding for PNG export ─────────────────────────────────────────
// SVGs loaded into an <img> for canvas rasterization run in a separate
// document context that can't see the page's @font-face declarations. To get
// VT323 / JetBrains Mono into the PNG, we fetch the Google Fonts CSS, replace
// each woff2 URL with a base64 data: URL, and inject the result as an inline
// <style> inside the cloned SVG before serializing.
let fontCssPromise: Promise<string | null> | null = null;
function loadEmbeddedFontCss(): Promise<string | null> {
  if (fontCssPromise) return fontCssPromise;
  fontCssPromise = (async () => {
    try {
      const cssUrl =
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=VT323&display=swap';
      const css = await fetch(cssUrl).then((r) => {
        if (!r.ok) throw new Error(`fonts css ${r.status}`);
        return r.text();
      });
      const urls = Array.from(
        new Set(
          Array.from(css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)).map((m) => m[1])
        )
      );
      const replacements = new Map<string, string>();
      await Promise.all(
        urls.map(async (u) => {
          const buf = await fetch(u).then((r) => {
            if (!r.ok) throw new Error(`font ${r.status}`);
            return r.arrayBuffer();
          });
          const bytes = new Uint8Array(buf);
          let bin = '';
          const chunk = 0x8000;
          for (let i = 0; i < bytes.length; i += chunk) {
            bin += String.fromCharCode.apply(
              null,
              Array.from(bytes.subarray(i, i + chunk))
            );
          }
          replacements.set(u, `data:font/woff2;base64,${btoa(bin)}`);
        })
      );
      let out = css;
      for (const [orig, b64] of replacements) out = out.split(orig).join(b64);
      return out;
    } catch (err) {
      console.warn('font embed failed, falling back to system fonts', err);
      return null;
    }
  })();
  return fontCssPromise;
}

async function svgNodeToPngBlob(svg: SVGSVGElement, scale = 1): Promise<Blob> {
  const fontCss = await loadEmbeddedFontCss();
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  if (fontCss) {
    // Prepend a <style> inside <defs> so the SVG document carries its fonts.
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.setAttribute('type', 'text/css');
    styleEl.textContent = fontCss;
    const defs = clone.querySelector('defs');
    if (defs) defs.insertBefore(styleEl, defs.firstChild);
    else clone.insertBefore(styleEl, clone.firstChild);
  }

  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('image load failed'));
      i.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(BADGE_W * scale);
    canvas.height = Math.round(BADGE_H * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas 2d unavailable');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
        'image/png'
      )
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function CompletionBadge() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Fields>({
    name: '',
    role: '',
    company: '',
    quote: '',
  });
  const [downloading, setDownloading] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const date = useMemo(() => formatDate(new Date()), []);

  // Warm the font cache as soon as the modal opens so the first download is fast.
  useEffect(() => {
    if (open) void loadEmbeddedFontCss();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const canDownload = fields.name.trim().length > 0;

  async function handleDownload() {
    if (!svgRef.current || !canDownload) return;
    setDownloading(true);
    try {
      const blob = await svgNodeToPngBlob(svgRef.current, 1.5);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const slug =
        fields.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'badge';
      a.href = url;
      a.download = `gh-for-designers-${slug}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('badge export failed', err);
      alert('Could not generate the PNG. Try a different browser.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        ◆ Claim completion badge
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-label="Generate completion badge"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className={styles.titleBar}>
                <span className={styles.dots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span>~ / badge / generate.sh</span>
                <button
                  className={styles.closeBtn}
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  [esc] close
                </button>
              </div>

              <div className={styles.body}>
                <form
                  className={styles.form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDownload();
                  }}
                >
                  <div className={styles.prompt}>
                    $ <b>./generate-badge</b> --interactive
                  </div>

                  <label className={styles.field}>
                    <span className={styles.label}>name</span>
                    <input
                      className={styles.input}
                      type="text"
                      maxLength={40}
                      placeholder="Ada Lovelace"
                      value={fields.name}
                      onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                      autoFocus
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>role</span>
                    <input
                      className={styles.input}
                      type="text"
                      maxLength={40}
                      placeholder="Product Designer"
                      value={fields.role}
                      onChange={(e) => setFields((f) => ({ ...f, role: e.target.value }))}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>company</span>
                    <input
                      className={styles.input}
                      type="text"
                      maxLength={40}
                      placeholder="Analytical Engines Inc."
                      value={fields.company}
                      onChange={(e) =>
                        setFields((f) => ({ ...f, company: e.target.value }))
                      }
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>what you liked most</span>
                    <textarea
                      className={styles.textarea}
                      maxLength={QUOTE_MAX}
                      placeholder="The branches-as-parallel-universes scene finally made it click."
                      value={fields.quote}
                      onChange={(e) =>
                        setFields((f) => ({ ...f, quote: e.target.value }))
                      }
                    />
                    <span className={styles.counter}>
                      {fields.quote.length} / {QUOTE_MAX}
                    </span>
                  </label>
                </form>

                <div className={styles.preview}>
                  <div className={styles.previewInner}>
                    <BadgeSvg ref={svgRef} {...fields} date={date} />
                  </div>
                </div>
              </div>

              <div className={styles.footerBar}>
                <span className={styles.hint}>
                  <b>tip:</b> preview updates as you type · downloads as PNG
                </span>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.alt}`}
                    onClick={() => setOpen(false)}
                  >
                    cancel
                  </button>
                  <button
                    type="button"
                    className={styles.btn}
                    disabled={!canDownload || downloading}
                    onClick={handleDownload}
                  >
                    {downloading ? '↻ rendering…' : '↓ download .png'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
