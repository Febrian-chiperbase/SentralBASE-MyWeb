// Emergency Text Visibility Fix for Dashboard
// Run this in browser console if text is still not visible

console.log('🔧 Applying emergency text visibility fix...');

// Create emergency CSS
const emergencyCSS = `
/* Emergency Text Visibility Fix */
.bg-white * {
  color: #111827 !important;
}

.bg-white .text-gray-600,
.bg-white .text-gray-700,
.bg-white .text-gray-900 {
  color: #111827 !important;
}

/* Force all spans in white cards to be dark */
.bg-white.rounded-xl span {
  color: #111827 !important;
  font-weight: 500 !important;
}

/* Specific fixes for order details */
.bg-white .font-mono {
  color: #111827 !important;
  font-weight: 600 !important;
}

.bg-white .font-medium {
  color: #111827 !important;
  font-weight: 600 !important;
}

.bg-white .font-semibold {
  color: #111827 !important;
  font-weight: 700 !important;
}

/* Headers */
.bg-white h3 {
  color: #111827 !important;
  font-weight: 700 !important;
}

/* Debug highlight */
.debug-highlight {
  background-color: yellow !important;
  color: black !important;
  padding: 2px 4px;
  border-radius: 2px;
}
`;

// Apply emergency CSS
const style = document.createElement('style');
style.textContent = emergencyCSS;
document.head.appendChild(style);

console.log('✅ Emergency CSS applied');

// Debug function to highlight problematic elements
window.debugTextVisibility = function() {
  console.log('🔍 Debugging text visibility...');
  
  // Find all potentially invisible text elements
  const whiteCards = document.querySelectorAll('.bg-white.rounded-xl');
  
  whiteCards.forEach((card, index) => {
    console.log(`Card ${index + 1}:`, card);
    
    const spans = card.querySelectorAll('span');
    spans.forEach((span, spanIndex) => {
      const computedStyle = window.getComputedStyle(span);
      const color = computedStyle.color;
      
      console.log(`  Span ${spanIndex + 1}: "${span.textContent}" - Color: ${color}`);
      
      // Highlight potentially invisible text
      if (color === 'rgb(255, 255, 255)' || color === 'rgba(255, 255, 255, 1)') {
        span.classList.add('debug-highlight');
        console.log(`    ⚠️ Potentially invisible text found!`);
      }
    });
  });
};

// Auto-run debug
window.debugTextVisibility();

// Force refresh styles
document.querySelectorAll('.bg-white.rounded-xl span').forEach(span => {
  span.style.color = '#111827';
  span.style.fontWeight = '500';
});

console.log('🎉 Emergency fix complete! All text should now be visible.');
console.log('💡 Run debugTextVisibility() to check for remaining issues.');
