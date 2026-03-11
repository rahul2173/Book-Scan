export function parseAIJson(content) {
  // Log raw response for debugging
  console.log("[BookLens] Raw content:", content);
  
  let clean = content.trim();
  
  // Remove ALL possible fence variations
  clean = clean.replace(/^```json\s*/im, "");
  clean = clean.replace(/^```\s*/im, "");
  clean = clean.replace(/```\s*$/im, "");
  clean = clean.trim();
  
  // Extract JSON if buried in surrounding text
  // Look for first { or [ and last } or ]
  const firstBrace = clean.indexOf("{");
  const firstBracket = clean.indexOf("[");
  const lastBrace = clean.lastIndexOf("}");
  const lastBracket = clean.lastIndexOf("]");
  
  // Determine if object or array
  if (firstBracket !== -1 && 
      (firstBrace === -1 || firstBracket < firstBrace)) {
    // It's an array
    if (lastBracket !== -1) {
      clean = clean.slice(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1) {
    // It's an object
    if (lastBrace !== -1) {
      clean = clean.slice(firstBrace, lastBrace + 1);
    }
  }
  
  console.log("[BookLens] Cleaned content:", clean);
  return JSON.parse(clean);
}
