import TexasMap from '@/components/texasMap/TexasMap';
import React from 'react';

/**
 * Texas Page Component
 * 
 * This page displays the interactive Texas map at the /texas route.
 * 
 * @returns {React.JSX.Element} The Texas page with the interactive map
 */
export default function TexasPage(): React.JSX.Element {
  return (
    <main>
      <TexasMap />
    </main>
  );
} 