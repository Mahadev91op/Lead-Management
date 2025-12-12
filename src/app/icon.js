// src/app/icon.js
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Container with Gradient Background
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Brand Gradient (Cyan to Blue)
          background: 'linear-gradient(135deg, #0891b2, #2563eb)', 
          borderRadius: '8px', // Soft rounded corners for modern look
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle depth
        }}
      >
        {/* SVG Funnel Icon (representing Leads/Pipeline) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: 'white', width: '20px', height: '20px' }}
        >
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}