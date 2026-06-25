export default function HonuLogo({ size = 36, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="Honu Bowls logo"
    >
      {/* bowl */}
      <path
        d="M10 36 H54 L50 49 a7 7 0 0 1 -6 4 H20 a7 7 0 0 1 -6 -4 Z"
        fill="#EE6A4D"
      />
      {/* bowl rim */}
      <rect x="8" y="33.5" width="48" height="3.6" rx="1.8" fill="#15403B" />
      {/* shell dome */}
      <path d="M18 35 a14 14 0 0 1 28 0 Z" fill="#15403B" />
      {/* shell scutes */}
      <g stroke="#9FC0A8" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M32 22 V34" />
        <path d="M23.5 25 L25.5 34" />
        <path d="M40.5 25 L38.5 34" />
      </g>
      {/* neck */}
      <path
        d="M41 34 C44 29 47 25 50 22"
        stroke="#15403B"
        strokeWidth="6.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* head */}
      <circle cx="51" cy="20" r="4.6" fill="#15403B" />
      {/* eye */}
      <circle cx="52.6" cy="18.8" r="1.15" fill="#F7F3E8" />
      {/* front flipper */}
      <ellipse
        cx="18"
        cy="37"
        rx="5.2"
        ry="2.9"
        transform="rotate(20 18 37)"
        fill="#15403B"
      />
    </svg>
  );
}
