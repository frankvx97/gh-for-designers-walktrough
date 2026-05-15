import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './IsometricStack.module.css';

// ─── Geometry ────────────────────────────────────────────────────────────
const W = 600;
const H = 640;
const RHOMB_W = 360;
const RHOMB_H = RHOMB_W / 2;
const THICKNESS = 28;

const cx = W / 2;
// Stack order: GitHub on top, Git below — with breathing room between them
// so the flow arrows have a runway to travel.
const GH_BACK_Y  = 60;
const GH_CY      = GH_BACK_Y + RHOMB_H / 2;
const GIT_BACK_Y = 360;
const GIT_CY     = GIT_BACK_Y + RHOMB_H / 2;

function platformPolys(backY: number) {
  const top = `${cx},${backY} ${cx + RHOMB_W / 2},${backY + RHOMB_H / 2} ${cx},${backY + RHOMB_H} ${cx - RHOMB_W / 2},${backY + RHOMB_H / 2}`;
  const right = `${cx + RHOMB_W / 2},${backY + RHOMB_H / 2} ${cx + RHOMB_W / 2},${backY + RHOMB_H / 2 + THICKNESS} ${cx},${backY + RHOMB_H + THICKNESS} ${cx},${backY + RHOMB_H}`;
  const left  = `${cx - RHOMB_W / 2},${backY + RHOMB_H / 2} ${cx},${backY + RHOMB_H} ${cx},${backY + RHOMB_H + THICKNESS} ${cx - RHOMB_W / 2},${backY + RHOMB_H / 2 + THICKNESS}`;
  return { top, right, left };
}

const GH  = platformPolys(GH_BACK_Y);
const GIT = platformPolys(GIT_BACK_Y);

// ─── Logos ────────────────────────────────────────────────────────────────
const GIT_PATH = 'M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.235-4.27-21.336l-26.462-26.462-.003 69.637a19.82 19.82 0 0 1 5.188 3.71c7.663 7.66 7.663 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.663-7.671-7.663-20.086 0-27.746a19.654 19.654 0 0 1 6.421-4.281V94.196a19.378 19.378 0 0 1-6.421-4.281c-5.806-5.798-7.202-14.317-4.227-21.446L81.47 39.442l-76.64 76.635c-6.44 6.443-6.44 16.884 0 23.322l111.774 111.768c6.435 6.438 16.873 6.438 23.316 0l111.251-111.249c6.438-6.44 6.438-16.887 0-23.324';
const GH_PATH = `M50 1.2c-27.6 0-50 22.4-50 50 0 22.1 14.3 40.8 34.2 47.4 2.5.5 3.4-1.1 3.4-2.4 0-1.2 0-4.3-.1-8.5-13.9 3-16.8-6.7-16.8-6.7-2.3-5.8-5.5-7.3-5.5-7.3-4.5-3.1.3-3 .3-3 5 .3 7.7 5.2 7.7 5.2 4.5 7.6 11.7 5.4 14.6 4.2.5-3.2 1.7-5.4 3.2-6.7-11.1-1.3-22.8-5.6-22.8-24.7 0-5.5 2-9.9 5.1-13.4-.5-1.3-2.2-6.3.5-13.2 0 0 4.2-1.3 13.8 5.1 4-1.1 8.2-1.7 12.5-1.7 4.2 0 8.4.6 12.5 1.7 9.5-6.5 13.7-5.1 13.7-5.1 2.7 6.9 1 11.9.5 13.2 3.2 3.5 5.1 8 5.1 13.4 0 19.2-11.7 23.4-22.8 24.7 1.8 1.5 3.4 4.6 3.4 9.2 0 6.7-.1 12.1-.1 13.7 0 1.3.9 2.9 3.4 2.4 19.9-6.6 34.2-25.3 34.2-47.4 0-27.6-22.4-50-50-50z`;

const GIT_HALF = 124;
const GIT_FILL = 0.62;
const GIT_SX = (RHOMB_W / 2 / GIT_HALF) * GIT_FILL;
const GIT_SY = GIT_SX / 2;

const GH_HALF = 50;
const GH_FILL = 0.58;
const GH_SX  = (RHOMB_W / 2 / GH_HALF) * GH_FILL;
const GH_SY  = GH_SX / 2;

// ─── Flow arrow paths ─────────────────────────────────────────────────────
// Each arrow is a short stick rendered at the origin (y=0..ARROW_LEN). The
// containing <g> translates the arrow along the gap between platforms.
const ARROW_LEN = 22;
// The gap between GH bottom (GH_BACK_Y + RHOMB_H + THICKNESS) and Git top
// (GIT_BACK_Y) becomes the runway.
const GAP_TOP    = GH_BACK_Y + RHOMB_H + THICKNESS;   // ~268
const GAP_BOTTOM = GIT_BACK_Y;                         // 360
const ARROW_X_LEFT  = cx - 56;
const ARROW_X_RIGHT = cx + 56;

// Push arrow (green, points UP): head at the top of its local box, tail
// below. Travels from GAP_BOTTOM (just above Git) up to GAP_TOP (just under GH).
// Pull arrow (blue, points DOWN): head at bottom of local box. Travels from
// GAP_TOP down to GAP_BOTTOM.
const PUSH_START_Y = GAP_BOTTOM - ARROW_LEN - 4;   // head sits 4px above Git
const PUSH_END_Y   = GAP_TOP + 4;                  // head sits 4px below GH
const PULL_START_Y = GAP_TOP + 4;                  // head 4px below GH
const PULL_END_Y   = GAP_BOTTOM - ARROW_LEN - 4;   // head 4px above Git

// ─── Component ───────────────────────────────────────────────────────────
export default function IsometricStack() {
  const reduced = useReducedMotion();

  const flowVars = {
    ['--push-start-y' as string]: `${PUSH_START_Y}px`,
    ['--push-end-y'   as string]: `${PUSH_END_Y}px`,
    ['--pull-start-y' as string]: `${PULL_START_Y}px`,
    ['--pull-end-y'   as string]: `${PULL_END_Y}px`,
  } as React.CSSProperties;

  return (
    <div className={styles.rig}>
      <div className={reduced ? styles.inner : `${styles.inner} ${styles.float}`}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Two stacked isometric platforms — GitHub on top in electric blue, Git below in neon green, with alternating push and pull arrows between them"
          role="img"
        >
          <defs>
            <pattern id="dotsGreenTop"   patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#7CFF6B"/>
              <circle cx="2" cy="2" r="0.75" fill="#031708"/>
            </pattern>
            <pattern id="dotsGreenRight" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#2c7d23"/>
              <circle cx="2" cy="2" r="1.05" fill="#031708"/>
            </pattern>
            <pattern id="dotsGreenLeft"  patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#48b03c"/>
              <circle cx="2" cy="2" r="0.9" fill="#031708"/>
            </pattern>

            <pattern id="dotsBlueTop"   patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#5CE0FF"/>
              <circle cx="2" cy="2" r="0.75" fill="#031018"/>
            </pattern>
            <pattern id="dotsBlueRight" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#0d5d75"/>
              <circle cx="2" cy="2" r="1.05" fill="#031018"/>
            </pattern>
            <pattern id="dotsBlueLeft"  patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#2096b8"/>
              <circle cx="2" cy="2" r="0.9" fill="#031018"/>
            </pattern>

            <radialGradient id="topShade" cx="50%" cy="50%" r="65%">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.18"/>
              <stop offset="65%" stopColor="#000000" stopOpacity="0"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0.45"/>
            </radialGradient>

            <clipPath id="gitTopClip"><polygon points={GIT.top}/></clipPath>
            <clipPath id="ghTopClip"><polygon points={GH.top}/></clipPath>

            <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#7CFF6B"/>
            </marker>
            <marker id="arrowBlue"  viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#5CE0FF"/>
            </marker>

            {/* Fading tail gradients for each arrow — softens the rear so it
                reads as a comet rather than a stiff line. */}
            <linearGradient id="pushFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7CFF6B" stopOpacity="1"/>
              <stop offset="100%" stopColor="#7CFF6B" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="pullFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#5CE0FF" stopOpacity="0"/>
              <stop offset="100%" stopColor="#5CE0FF" stopOpacity="1"/>
            </linearGradient>
          </defs>

          {/* ─── Outer dotted halo around BOTH platforms ─── */}
          <g stroke="#7CFF6B" strokeOpacity="0.32" strokeDasharray="2 4" fill="none">
            <polygon
              points={`${cx},${24} ${cx + RHOMB_W / 2 + 50},${RHOMB_H / 2 + 45} ${cx + RHOMB_W / 2 + 50},${GIT_BACK_Y + RHOMB_H / 2 + 60} ${cx},${GIT_BACK_Y + RHOMB_H + THICKNESS + 40} ${cx - RHOMB_W / 2 - 50},${GIT_BACK_Y + RHOMB_H / 2 + 60} ${cx - RHOMB_W / 2 - 50},${RHOMB_H / 2 + 45}`}
            />
          </g>
          <g stroke="#5CE0FF" strokeOpacity="0.22" strokeDasharray="1 5" fill="none">
            <polygon
              points={`${cx},${42} ${cx + RHOMB_W / 2 + 24},${RHOMB_H / 2 + 52} ${cx + RHOMB_W / 2 + 24},${GIT_BACK_Y + RHOMB_H / 2 + 36} ${cx},${GIT_BACK_Y + RHOMB_H + THICKNESS + 14} ${cx - RHOMB_W / 2 - 24},${GIT_BACK_Y + RHOMB_H / 2 + 36} ${cx - RHOMB_W / 2 - 24},${RHOMB_H / 2 + 52}`}
            />
          </g>

          <line x1={cx} y1={14} x2={cx} y2={GH_BACK_Y} stroke="#5CE0FF" strokeOpacity="0.5" strokeDasharray="2 3"/>
          <circle cx={cx} cy={12} r="2.5" fill="#5CE0FF"/>

          {/* ─── GitHub platform (top) ─── */}
          <g>
            <polygon points={GH.left}  fill="url(#dotsBlueLeft)"/>
            <polygon points={GH.right} fill="url(#dotsBlueRight)"/>
            <polygon points={GH.top}   fill="url(#dotsBlueTop)"/>
            <polygon points={GH.top}   fill="url(#topShade)"/>
            <polygon points={GH.top}   fill="none" stroke="#bff0ff" strokeOpacity="0.32" strokeWidth="1"/>
            <g clipPath="url(#ghTopClip)">
              <g transform={`matrix(${GH_SX} 0 0 ${GH_SY} ${cx} ${GH_CY})`}>
                <g transform="translate(-50 -50)">
                  <path d={GH_PATH} fill="#031018"/>
                </g>
              </g>
            </g>
          </g>

          {/* ─── Push / Pull traveling arrows ─── */}
          {/* Each arrow is a short stick (length ARROW_LEN) drawn at the
              origin. The wrapping <g> translates the whole thing along the
              gap. Push (green) moves up, then pull (blue) moves down, in a
              continuous loop. */}
          <g style={flowVars}>
            <g className={reduced ? styles.staticPush : styles.pushArrow}>
              {/* tail uses a fading gradient that's strongest at the head */}
              <line
                x1={ARROW_X_LEFT} y1={ARROW_LEN}
                x2={ARROW_X_LEFT} y2={0}
                stroke="url(#pushFade)"
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd="url(#arrowGreen)"
              />
            </g>
            <g className={reduced ? styles.staticPull : styles.pullArrow}>
              <line
                x1={ARROW_X_RIGHT} y1={0}
                x2={ARROW_X_RIGHT} y2={ARROW_LEN}
                stroke="url(#pullFade)"
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd="url(#arrowBlue)"
              />
            </g>
          </g>

          {/* ─── Git platform (bottom) ─── */}
          <g>
            <polygon points={GIT.left}  fill="url(#dotsGreenLeft)"/>
            <polygon points={GIT.right} fill="url(#dotsGreenRight)"/>
            <polygon points={GIT.top}   fill="url(#dotsGreenTop)"/>
            <polygon points={GIT.top}   fill="url(#topShade)"/>
            <polygon points={GIT.top}   fill="none" stroke="#bbffaf" strokeOpacity="0.35" strokeWidth="1"/>
            <g clipPath="url(#gitTopClip)">
              <g transform={`matrix(${GIT_SX} 0 0 ${GIT_SY} ${cx} ${GIT_CY})`}>
                <g transform="translate(-128 -128)">
                  <path d={GIT_PATH} fill="#031708"/>
                </g>
              </g>
            </g>
          </g>

          {/* ─── Side decorations ─── */}
          {/* Cloud next to GitHub (top-right) — remote */}
          <g transform={`translate(540, ${GH_CY - 25})`} opacity="0.85">
            <path
              d="M -22 6 C -28 6 -28 -2 -22 -2 C -22 -8 -12 -10 -8 -6 C -6 -10 6 -10 6 -2 C 12 -2 12 6 6 6 Z"
              fill="none" stroke="#5CE0FF" strokeWidth="1.4" strokeLinejoin="round"
            />
            <g stroke="#5CE0FF" strokeDasharray="3 3" strokeWidth="1">
              <line x1="-30" y1="-4" x2="-60" y2="-4"/>
              <line x1="-30" y1="2"  x2="-54" y2="2"/>
              <line x1="-30" y1="8"  x2="-64" y2="8"/>
            </g>
          </g>

          {/* Folder next to Git (bottom-left) — local */}
          <g transform={`translate(40, ${GIT_CY - 10})`} fill="#7CFF6B" opacity="0.85">
            <path d="M 0 0 H 12 L 14 4 H 28 V 18 H 0 Z" fill="none" stroke="#7CFF6B" strokeWidth="1.4"/>
            <g stroke="#7CFF6B" strokeDasharray="3 3" strokeWidth="1">
              <line x1="34" y1="6"  x2="64" y2="6"/>
              <line x1="34" y1="11" x2="58" y2="11"/>
              <line x1="34" y1="16" x2="68" y2="16"/>
            </g>
          </g>

          <g fill="#5CE0FF" opacity="0.4">
            <circle cx="80" cy="50" r="1.2"/>
            <circle cx="92" cy="54" r="1"/>
            <circle cx="80" cy="68" r="0.8"/>
          </g>
          <g fill="#7CFF6B" opacity="0.4">
            <circle cx={W - 84} cy={H - 50} r="1.2"/>
            <circle cx={W - 72} cy={H - 54} r="1"/>
            <circle cx={W - 84} cy={H - 68} r="0.8"/>
          </g>
        </svg>
      </div>
    </div>
  );
}
