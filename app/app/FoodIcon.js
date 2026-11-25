// Little cartoon foods for the cooking animation, drawn in their real colors.
// Each grocery line is matched to an icon by keyword; anything unknown gets a grocery bag.

const RULES = [
  [/green bean|asparagus/, 'leaf'],
  [/peanut butter|jar|sauce|marinara|salsa|paste|pesto|jam|mayo|mustard|ketchup|dressing|honey|syrup/, 'jar'],
  [/\bcans?\b|canned|beans|chickpea|coconut milk|broth|stock|crushed tomato|diced tomato|artichoke/, 'can'],
  [/wine|oil|vinegar|bottle|soy/, 'bottle'],
  [/salmon/, 'salmon'],
  [/shrimp|prawn/, 'shrimp'],
  [/fish|tilapia|\bcod\b|tuna|halibut|trout/, 'fish'],
  [/bacon/, 'bacon'],
  [/sausage|chorizo|hot dog|brat|kielbasa|pepperoni/, 'sausage'],
  [/ground/, 'ground'],
  [/chicken|turkey|drumstick|wings?\b/, 'drumstick'],
  [/steak|beef|pork|lamb|tenderloin|\bchops?\b|roast|ribs?\b|brisket/, 'steak'],
  [/\beggs?\b/, 'egg'],
  [/cheese|feta|mozzarella|parmesan|cheddar|ricotta/, 'cheese'],
  [/milk|yogurt|cream/, 'carton'],
  [/butter/, 'butter'],
  [/sweet potato|yam/, 'sweetpotato'],
  [/potato/, 'potato'],
  [/carrot/, 'carrot'],
  [/broccoli/, 'broccoli'],
  [/cauliflower/, 'cauliflower'],
  [/tomato/, 'tomato'],
  [/onion|shallot|scallion|leek/, 'onion'],
  [/garlic/, 'garlic'],
  [/pepper|jalape/, 'pepper'],
  [/lemon/, 'lemon'],
  [/\blimes?\b/, 'lime'],
  [/avocado/, 'avocado'],
  [/zucchini|cucumber|squash/, 'zucchini'],
  [/corn/, 'corn'],
  [/mushroom/, 'mushroom'],
  [/spinach|lettuce|kale|greens|cilantro|parsley|basil|herb|arugula|cabbage|celery/, 'leaf'],
  [/tortilla|wrap|pita|naan/, 'tortilla'],
  [/bread|\bbuns?\b|loaf|sourdough|bagel|\brolls?\b|baguette/, 'bread'],
  [/pasta|spaghetti|penne|noodle|macaroni|linguine|fettuccine|rigatoni/, 'pasta'],
  [/rice|quinoa|couscous/, 'rice'],
  [/apple/, 'apple'],
  [/berr/, 'berries'],
];

export function foodFor(name) {
  const n = String(name || '').toLowerCase();
  for (const [re, icon] of RULES) if (re.test(n)) return icon;
  return 'bag';
}

const S = { strokeLinejoin: 'round', strokeLinecap: 'round' };

const ICONS = {
  drumstick: (
    <g {...S}>
      <path d="M30 26 L40 36" stroke="#EFE3CF" strokeWidth="5" />
      <circle cx="41" cy="35" r="3.2" fill="#F4EBDD" stroke="#D9CAB2" strokeWidth="1.2" />
      <circle cx="38" cy="39" r="3.2" fill="#F4EBDD" stroke="#D9CAB2" strokeWidth="1.2" />
      <path d="M10 20 C10 10 22 6 29 13 C35 19 33 29 24 31 C16 33 10 28 10 20 Z" fill="#C97B3D" stroke="#9A5524" strokeWidth="1.5" />
      <path d="M16 15 C19 12 24 12 26 14" stroke="#E3A46A" strokeWidth="2" fill="none" />
    </g>
  ),
  steak: (
    <g {...S}>
      <path d="M8 24 C8 13 20 9 30 11 C40 13 42 22 38 30 C34 38 22 40 14 36 C9 33 8 29 8 24 Z" fill="#B8322A" stroke="#7E1F19" strokeWidth="1.5" />
      <path d="M12 26 C16 30 24 31 30 27" stroke="#F3D3C4" strokeWidth="3" fill="none" />
      <path d="M17 18 C21 16 26 17 29 20" stroke="#F3D3C4" strokeWidth="2" fill="none" />
      <circle cx="31" cy="25" r="3" fill="#F6E7DD" stroke="#E2C9BB" strokeWidth="1" />
    </g>
  ),
  ground: (
    <g {...S}>
      <ellipse cx="24" cy="38" rx="17" ry="4" fill="#E7E2DA" />
      <path d="M9 36 C9 24 16 16 24 16 C32 16 39 24 39 36 Z" fill="#B4513E" stroke="#843626" strokeWidth="1.5" />
      <path d="M15 30 q2 -2 4 0 M22 24 q2 -2 4 0 M27 31 q2 -2 4 0 M18 35 q2 -2 4 0" stroke="#D98872" strokeWidth="1.6" fill="none" />
    </g>
  ),
  bacon: (
    <g {...S}>
      <path d="M8 16 q5 -5 10 0 t10 0 t10 0 l2 6 q-5 -5 -10 0 t-10 0 t-10 0 z" fill="#C2453C" stroke="#8C2C26" strokeWidth="1.3" />
      <path d="M9 19 q5 -4 10 0 t10 0 t10 0" stroke="#F4CDBE" strokeWidth="1.6" fill="none" />
      <path d="M8 28 q5 -5 10 0 t10 0 t10 0 l2 6 q-5 -5 -10 0 t-10 0 t-10 0 z" fill="#C2453C" stroke="#8C2C26" strokeWidth="1.3" />
      <path d="M9 31 q5 -4 10 0 t10 0 t10 0" stroke="#F4CDBE" strokeWidth="1.6" fill="none" />
    </g>
  ),
  sausage: (
    <g {...S}>
      <path d="M9 30 C9 22 16 16 26 16 L34 16 C40 16 41 24 36 25 L26 25 C20 25 17 28 17 32 C17 37 9 37 9 30 Z" fill="#A4522F" stroke="#6F3519" strokeWidth="1.5" />
      <path d="M22 19 L31 19" stroke="#C97B55" strokeWidth="2" />
    </g>
  ),
  salmon: (
    <g {...S}>
      <path d="M7 30 C10 18 24 13 41 16 C42 24 36 34 22 36 C14 37 8 35 7 30 Z" fill="#F58A63" stroke="#C9603D" strokeWidth="1.5" />
      <path d="M16 20 C14 25 15 30 18 34 M24 17 C22 23 23 29 26 35 M32 16 C30 22 31 27 34 32" stroke="#FFD8C7" strokeWidth="2" fill="none" />
      <path d="M7 30 C10 33 15 35 22 36" stroke="#B9B9B9" strokeWidth="2.2" fill="none" />
    </g>
  ),
  fish: (
    <g {...S}>
      <path d="M6 24 C12 13 28 12 36 24 C28 36 12 35 6 24 Z" fill="#7FA6C6" stroke="#4E7593" strokeWidth="1.5" />
      <path d="M36 24 L44 16 L44 32 Z" fill="#6B93B3" stroke="#4E7593" strokeWidth="1.5" />
      <circle cx="14" cy="22" r="1.8" fill="#1F2B36" />
      <path d="M22 18 C24 22 24 26 22 30" stroke="#A9C6DD" strokeWidth="1.6" fill="none" />
    </g>
  ),
  shrimp: (
    <g {...S}>
      <path d="M34 12 C42 18 42 32 32 37 C24 41 15 38 12 32 L18 30 C21 34 27 34 30 31 C34 27 33 20 28 17 Z" fill="#F59A6B" stroke="#C8653A" strokeWidth="1.5" />
      <path d="M31 15 L27 20 M36 21 L30 23 M36 29 L30 28 M30 35 L27 31" stroke="#C8653A" strokeWidth="1.4" />
      <path d="M12 32 L6 30 L9 36 Z" fill="#F7B48D" stroke="#C8653A" strokeWidth="1.3" />
      <circle cx="35" cy="16" r="1.2" fill="#3A2A20" />
    </g>
  ),
  egg: (
    <g {...S}>
      <path d="M24 7 C33 7 38 21 38 28 C38 36 32 41 24 41 C16 41 10 36 10 28 C10 21 15 7 24 7 Z" fill="#FFF8EC" stroke="#D8CBB5" strokeWidth="1.6" />
      <path d="M17 18 C18 15 20 13 22 12" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
    </g>
  ),
  cheese: (
    <g {...S}>
      <path d="M6 32 L40 18 L42 34 L8 38 Z" fill="#F7C948" stroke="#C99A1E" strokeWidth="1.5" />
      <path d="M6 32 L40 18 L34 14 Z" fill="#FBDB72" stroke="#C99A1E" strokeWidth="1.5" />
      <circle cx="18" cy="33" r="2.4" fill="#E0AE2C" />
      <circle cx="30" cy="30" r="1.8" fill="#E0AE2C" />
      <circle cx="36" cy="33" r="1.4" fill="#E0AE2C" />
    </g>
  ),
  carton: (
    <g {...S}>
      <path d="M14 16 L24 8 L34 16 L34 42 L14 42 Z" fill="#FFFFFF" stroke="#B9C3CC" strokeWidth="1.5" />
      <path d="M14 16 L34 16" stroke="#B9C3CC" strokeWidth="1.5" />
      <rect x="14" y="24" width="20" height="10" fill="#4D8FD1" />
      <path d="M18 29 q3 -3 6 0 t6 0" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
    </g>
  ),
  butter: (
    <g {...S}>
      <path d="M8 26 L30 18 L42 22 L20 30 Z" fill="#FCEBA0" stroke="#D6B94F" strokeWidth="1.4" />
      <path d="M8 26 L20 30 L20 38 L8 34 Z" fill="#F4D96B" stroke="#D6B94F" strokeWidth="1.4" />
      <path d="M20 30 L42 22 L42 30 L20 38 Z" fill="#F8E58A" stroke="#D6B94F" strokeWidth="1.4" />
    </g>
  ),
  carrot: (
    <g {...S}>
      <path d="M30 14 C34 16 36 19 34 22 L12 42 C10 43 8 41 9 39 L26 15 C27 13 28 13 30 14 Z" fill="#F28A21" stroke="#C0660D" strokeWidth="1.5" />
      <path d="M20 27 L23 29 M16 33 L19 35 M24 21 L27 23" stroke="#C0660D" strokeWidth="1.3" />
      <path d="M31 14 C30 8 33 5 35 5 C35 9 34 12 32 14 M33 16 C37 12 41 12 43 13 C40 16 37 17 34 17 M32 15 C33 10 38 8 40 9" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.4" />
    </g>
  ),
  broccoli: (
    <g {...S}>
      <path d="M21 26 L19 42 L29 42 L27 26 Z" fill="#8BBF5A" stroke="#5E8F35" strokeWidth="1.5" />
      <circle cx="16" cy="20" r="7" fill="#3E8E41" stroke="#25652A" strokeWidth="1.5" />
      <circle cx="32" cy="20" r="7" fill="#3E8E41" stroke="#25652A" strokeWidth="1.5" />
      <circle cx="24" cy="14" r="8" fill="#47A04A" stroke="#25652A" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="6" fill="#3E8E41" stroke="#25652A" strokeWidth="1.5" />
    </g>
  ),
  cauliflower: (
    <g {...S}>
      <path d="M8 30 C10 38 18 42 24 42 C30 42 38 38 40 30 C34 34 28 34 24 32 C20 34 14 34 8 30 Z" fill="#6DAA4C" stroke="#457A2D" strokeWidth="1.5" />
      <circle cx="17" cy="24" r="7" fill="#F7F3E8" stroke="#D3CCBB" strokeWidth="1.5" />
      <circle cx="31" cy="24" r="7" fill="#F7F3E8" stroke="#D3CCBB" strokeWidth="1.5" />
      <circle cx="24" cy="17" r="8" fill="#FBF8EF" stroke="#D3CCBB" strokeWidth="1.5" />
      <circle cx="24" cy="27" r="6" fill="#F7F3E8" stroke="#D3CCBB" strokeWidth="1.5" />
    </g>
  ),
  tomato: (
    <g {...S}>
      <circle cx="24" cy="27" r="14" fill="#E53935" stroke="#A62420" strokeWidth="1.5" />
      <path d="M24 14 L20 10 M24 14 L28 10 M24 14 L17 15 M24 14 L31 15" stroke="#3B8E3E" strokeWidth="2.4" />
      <path d="M24 14 L24 9" stroke="#2E7D32" strokeWidth="2" />
      <ellipse cx="18" cy="22" rx="3" ry="2" fill="#F07A76" />
    </g>
  ),
  onion: (
    <g {...S}>
      <path d="M24 10 C31 16 38 22 38 30 C38 37 32 42 24 42 C16 42 10 37 10 30 C10 22 17 16 24 10 Z" fill="#E7B66B" stroke="#B5823A" strokeWidth="1.5" />
      <path d="M24 12 C20 20 18 28 20 40 M24 12 C28 20 30 28 28 40" stroke="#C99550" strokeWidth="1.4" fill="none" />
      <path d="M24 10 L24 5" stroke="#8A6A3A" strokeWidth="1.8" />
    </g>
  ),
  garlic: (
    <g {...S}>
      <path d="M24 9 C26 14 34 18 36 26 C38 35 32 41 24 41 C16 41 10 35 12 26 C14 18 22 14 24 9 Z" fill="#F6F1E7" stroke="#CFC3AE" strokeWidth="1.5" />
      <path d="M24 14 C21 22 20 30 22 40 M24 14 C27 22 28 30 26 40 M18 22 C16 28 16 34 18 39 M30 22 C32 28 32 34 30 39" stroke="#DCD1BE" strokeWidth="1.3" fill="none" />
      <path d="M24 9 L24 5" stroke="#B9A98C" strokeWidth="1.8" />
    </g>
  ),
  pepper: (
    <g {...S}>
      <path d="M12 20 C12 14 18 13 24 15 C30 13 36 14 36 20 C37 30 33 41 27 41 C25 41 24 39 24 39 C24 39 23 41 21 41 C15 41 11 30 12 20 Z" fill="#D7261E" stroke="#9B1813" strokeWidth="1.5" />
      <path d="M24 15 L24 9 C24 7 27 6 28 7" stroke="#2E7D32" strokeWidth="2.4" fill="none" />
      <path d="M17 19 C16 24 17 30 19 34" stroke="#EE6A63" strokeWidth="2" fill="none" />
    </g>
  ),
  lemon: (
    <g {...S}>
      <ellipse cx="24" cy="25" rx="15" ry="11" fill="#F7D73A" stroke="#C9A80E" strokeWidth="1.5" />
      <path d="M9 25 L5 24 M39 25 L43 26" stroke="#C9A80E" strokeWidth="2.2" />
      <ellipse cx="19" cy="21" rx="4" ry="2" fill="#FBE98A" />
    </g>
  ),
  lime: (
    <g {...S}>
      <circle cx="24" cy="25" r="13" fill="#7CB342" stroke="#4E7F22" strokeWidth="1.5" />
      <circle cx="24" cy="25" r="9" fill="#C5E1A5" stroke="#8BB65C" strokeWidth="1.2" />
      <path d="M24 16 L24 34 M15 25 L33 25 M18 19 L30 31 M30 19 L18 31" stroke="#A7CF7C" strokeWidth="1.2" />
    </g>
  ),
  avocado: (
    <g {...S}>
      <path d="M24 6 C31 6 33 16 37 24 C41 33 34 42 24 42 C14 42 7 33 11 24 C15 16 17 6 24 6 Z" fill="#3F6B2A" stroke="#2A4A1B" strokeWidth="1.5" />
      <path d="M24 10 C29 10 30 18 33 25 C36 32 31 38 24 38 C17 38 12 32 15 25 C18 18 19 10 24 10 Z" fill="#D4E68F" />
      <circle cx="24" cy="29" r="6" fill="#8A5A36" stroke="#5E3C22" strokeWidth="1.3" />
    </g>
  ),
  potato: (
    <g {...S}>
      <path d="M9 26 C9 17 19 12 28 13 C37 14 41 21 39 29 C37 37 28 39 20 38 C13 37 9 32 9 26 Z" fill="#C9A06A" stroke="#93703E" strokeWidth="1.5" />
      <circle cx="18" cy="23" r="1.3" fill="#93703E" /><circle cx="28" cy="20" r="1.3" fill="#93703E" /><circle cx="31" cy="30" r="1.3" fill="#93703E" /><circle cx="20" cy="32" r="1.3" fill="#93703E" />
    </g>
  ),
  sweetpotato: (
    <g {...S}>
      <path d="M6 26 C10 16 22 13 32 15 C40 17 43 24 40 29 C37 34 27 37 18 35 C10 33 5 31 6 26 Z" fill="#C2603A" stroke="#8A3E21" strokeWidth="1.5" />
      <path d="M16 22 C19 21 22 21 24 22 M26 29 C29 29 32 28 34 27" stroke="#E08A63" strokeWidth="1.6" fill="none" />
    </g>
  ),
  zucchini: (
    <g {...S}>
      <path d="M8 34 C14 24 26 14 36 10 C40 9 42 12 40 15 C34 24 22 34 12 38 C9 39 7 36 8 34 Z" fill="#4E8B3A" stroke="#2F5D22" strokeWidth="1.5" />
      <path d="M14 33 C20 27 28 20 35 14" stroke="#7FB563" strokeWidth="1.6" fill="none" />
      <path d="M38 11 L42 7" stroke="#8A7A3A" strokeWidth="2.4" />
    </g>
  ),
  corn: (
    <g {...S}>
      <path d="M24 6 C31 6 33 20 32 30 C31 38 28 42 24 42 C20 42 17 38 16 30 C15 20 17 6 24 6 Z" fill="#F5C842" stroke="#C99A16" strokeWidth="1.5" />
      <path d="M20 12 L28 12 M18 18 L30 18 M18 24 L30 24 M18 30 L30 30 M20 36 L28 36 M24 8 L24 40" stroke="#DDAA22" strokeWidth="1.2" />
      <path d="M16 30 C12 34 10 40 12 44 C16 42 20 40 22 36 M32 30 C36 34 38 40 36 44 C32 42 28 40 26 36" fill="#7CB342" stroke="#4E7F22" strokeWidth="1.4" />
    </g>
  ),
  mushroom: (
    <g {...S}>
      <path d="M8 24 C8 14 16 9 24 9 C32 9 40 14 40 24 Z" fill="#B98B62" stroke="#85603D" strokeWidth="1.5" />
      <path d="M18 24 L17 38 C17 40 31 40 31 38 L30 24 Z" fill="#F3EADB" stroke="#CDBEA6" strokeWidth="1.5" />
    </g>
  ),
  leaf: (
    <g {...S}>
      <path d="M10 38 C8 24 16 10 38 8 C40 28 30 40 10 38 Z" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      <path d="M10 38 C18 30 26 20 34 12 M18 30 L18 22 M24 24 L30 24 M22 27 L22 20" stroke="#A5D6A7" strokeWidth="1.6" fill="none" />
    </g>
  ),
  tortilla: (
    <g {...S}>
      <ellipse cx="24" cy="26" rx="17" ry="14" fill="#F2DCA8" stroke="#C9AA67" strokeWidth="1.5" />
      <circle cx="16" cy="22" r="1.8" fill="#D9B46A" /><circle cx="28" cy="19" r="1.4" fill="#D9B46A" /><circle cx="31" cy="30" r="2" fill="#D9B46A" /><circle cx="20" cy="32" r="1.4" fill="#D9B46A" />
    </g>
  ),
  bread: (
    <g {...S}>
      <path d="M8 22 C8 14 16 11 24 11 C32 11 40 14 40 22 C40 26 37 27 36 27 L36 38 L12 38 L12 27 C11 27 8 26 8 22 Z" fill="#D9984E" stroke="#A0652A" strokeWidth="1.5" />
      <path d="M16 18 L19 22 M23 16 L26 20 M30 18 L33 22" stroke="#F2C58A" strokeWidth="2" />
    </g>
  ),
  pasta: (
    <g {...S}>
      <path d="M14 10 L18 40 M19 9 L21 40 M24 9 L24 40 M29 9 L27 40 M34 10 L30 40" stroke="#F0C860" strokeWidth="2.6" />
      <rect x="15" y="22" width="18" height="6" rx="2" fill="#C0392B" stroke="#8E2A20" strokeWidth="1.2" />
    </g>
  ),
  rice: (
    <g {...S}>
      <path d="M10 20 C12 12 36 12 38 20 Z" fill="#FFFFFF" stroke="#D9D4CA" strokeWidth="1.4" />
      <path d="M8 21 L40 21 C40 31 33 38 24 38 C15 38 8 31 8 21 Z" fill="#6FA3D6" stroke="#3F79B1" strokeWidth="1.5" />
      <path d="M14 16 l2 -1 M20 14 l2 1 M27 14 l2 -1 M33 17 l2 1 M24 17 l2 0" stroke="#D9D4CA" strokeWidth="1.4" />
      <path d="M14 28 C18 30 30 30 34 28" stroke="#9EC2E6" strokeWidth="1.6" fill="none" />
    </g>
  ),
  can: (
    <g {...S}>
      <rect x="13" y="10" width="22" height="30" rx="3" fill="#B9C0C7" stroke="#7D868F" strokeWidth="1.5" />
      <rect x="13" y="17" width="22" height="16" fill="#C84B31" />
      <ellipse cx="24" cy="10" rx="11" ry="3" fill="#D6DCE1" stroke="#7D868F" strokeWidth="1.3" />
      <circle cx="24" cy="25" r="4" fill="#F2D5A3" />
    </g>
  ),
  jar: (
    <g {...S}>
      <rect x="15" y="8" width="18" height="6" rx="2" fill="#5A5F66" stroke="#3B3F44" strokeWidth="1.3" />
      <path d="M13 16 C13 14 35 14 35 16 L35 38 C35 41 33 42 30 42 L18 42 C15 42 13 41 13 38 Z" fill="#C0392B" stroke="#8E2A20" strokeWidth="1.5" />
      <rect x="16" y="24" width="16" height="9" rx="2" fill="#F7F1E3" />
      <path d="M16 18 L16 22" stroke="#E57369" strokeWidth="2" />
    </g>
  ),
  bottle: (
    <g {...S}>
      <path d="M20 6 L28 6 L28 15 C33 18 34 22 34 26 L34 40 C34 42 32 43 30 43 L18 43 C16 43 14 42 14 40 L14 26 C14 22 15 18 20 15 Z" fill="#3D5A3A" stroke="#243822" strokeWidth="1.5" />
      <rect x="16" y="27" width="16" height="10" rx="1.5" fill="#F3EAD7" />
      <rect x="19" y="4" width="10" height="4" rx="1" fill="#8C2F39" />
    </g>
  ),
  apple: (
    <g {...S}>
      <path d="M24 14 C30 10 39 13 39 23 C39 33 32 41 27 41 C25 41 24 40 24 40 C24 40 23 41 21 41 C16 41 9 33 9 23 C9 13 18 10 24 14 Z" fill="#D93A2E" stroke="#9E2219" strokeWidth="1.5" />
      <path d="M24 14 L25 7" stroke="#6D4C2B" strokeWidth="2" />
      <path d="M26 10 C29 6 33 6 35 7 C33 10 29 11 26 10 Z" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.2" />
    </g>
  ),
  berries: (
    <g {...S}>
      <circle cx="17" cy="28" r="8" fill="#3F51B5" stroke="#283593" strokeWidth="1.4" />
      <circle cx="30" cy="26" r="8" fill="#5C6BC0" stroke="#283593" strokeWidth="1.4" />
      <circle cx="24" cy="18" r="7" fill="#3949AB" stroke="#283593" strokeWidth="1.4" />
      <path d="M15 26 l2 2 l2 -2 M28 24 l2 2 l2 -2 M22 16 l2 2 l2 -2" stroke="#9FA8DA" strokeWidth="1.2" fill="none" />
    </g>
  ),
  bag: (
    <g {...S}>
      <path d="M18 12 C16 7 22 4 24 9 C26 4 32 7 30 12" fill="#5FA046" stroke="#3B6E2A" strokeWidth="1.4" />
      <path d="M11 14 L37 14 L35 42 L13 42 Z" fill="#C99C66" stroke="#8F6A3C" strokeWidth="1.5" />
      <path d="M11 14 L15 18 L19 14 L23 18 L27 14 L31 18 L35 14 L37 14" stroke="#8F6A3C" strokeWidth="1.3" fill="none" />
    </g>
  ),
};

export default function FoodIcon({ name, size = 46 }) {
  const icon = ICONS[foodFor(name)] || ICONS.bag;
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      {icon}
    </svg>
  );
}

export const ALL_FOODS = Object.keys(ICONS);
export { ICONS };
