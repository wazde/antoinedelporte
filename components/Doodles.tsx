import type { SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement>;

// Petits objets dessinés au trait épais, fond 100 % transparent, zéro personnage humanisé.

export function SparkDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <path
        d="M32 6 C33.5 21 43 30.5 58 32 C43 33.5 33.5 43 32 58 C30.5 43 21 33.5 6 32 C21 30.5 30.5 21 32 6 Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 10 L52 18 M48 14 L56 14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="14" cy="49" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function PencilDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden {...props}>
      <path
        d="M52 14 L66 28 L30 64 L13 67 L16 50 Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M46 20 L60 34" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M16 50 L30 64" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M42 66 C48 61 54 70 61 65 C65 62 68 65 71 64"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MagnifierDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden {...props}>
      <circle
        cx="34"
        cy="34"
        r="20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M24 27 C27 22 33 20 39 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M49 49 L65 65"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NodesDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden {...props}>
      <rect
        x="12"
        y="16"
        width="22"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2.8"
      />
      <rect
        x="46"
        y="46"
        width="22"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2.8"
      />
      <circle cx="57" cy="24" r="7" stroke="currentColor" strokeWidth="2.8" />
      <path
        d="M34 25 L50 25 M57 31 L57 46 M23 34 L23 55 L46 55"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
