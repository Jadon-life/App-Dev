/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ThreeElements } from "@react-three/fiber";

declare global {
  namespace JSX {
    // Extend JSX with Three.js elements
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
