// ─────────────────────────────────────────────
//  textures.ts — High-Fidelity Procedural PBR Textures
//  Generates realistic wood grain, cast-iron bump, banana peel spots, leaf veins & metal sheen
// ─────────────────────────────────────────────
import * as THREE from 'three';

// Cache generated textures so canvas is rendered only once
const textureCache = new Map<string, THREE.CanvasTexture>();

function createTexture(name: string, size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  if (textureCache.has(name)) {
    return textureCache.get(name)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    draw(ctx, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(name, texture);
  return texture;
}

// 1. Cast Iron Bump & Roughness Map (Dark Charcoal Matte Seasoned Cast Iron)
export function getCastIronTexture(): THREE.CanvasTexture {
  return createTexture('cast_iron', 512, (ctx, s) => {
    ctx.fillStyle = '#242322';
    ctx.fillRect(0, 0, s, s);

    // Fine metallurgical micro-grit and cast-iron porous grain
    for (let i = 0; i < 45000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const radius = 0.4 + Math.random() * 1.5;
      const brightness = Math.floor((Math.random() - 0.5) * 30);
      const val = Math.max(20, Math.min(55, 36 + brightness));
      ctx.fillStyle = `rgba(${val}, ${val - 2}, ${val - 3}, 0.65)`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle seasoning patina streaks
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 20 + Math.random() * 50;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(48, 44, 40, 0.2)');
      grad.addColorStop(1, 'rgba(34, 32, 30, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// 1B. Realistic Seasoned Kuzhi Cavity Texture (Concentric Seasoning Rings & Patina)
export function getSeasonedKuzhiTexture(): THREE.CanvasTexture {
  return createTexture('seasoned_kuzhi', 512, (ctx, s) => {
    // Base dark charcoal cast-iron tone
    const grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, '#1c1b1a'); // Dark seasoned center
    grad.addColorStop(0.5, '#242322');
    grad.addColorStop(0.85, '#2b2a28'); // Subtle seasoning highlight
    grad.addColorStop(1.0, '#222120');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);

    // Concentric lathe-turning & seasoning rings
    ctx.lineWidth = 1.0;
    for (let r = 8; r < s / 2; r += 5 + Math.random() * 7) {
      ctx.strokeStyle = `rgba(60, 56, 52, ${0.12 + Math.random() * 0.15})`;
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Micro-grit speckles
    for (let i = 0; i < 25000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 0.4 + Math.random() * 1.2;
      const b = Math.floor((Math.random() - 0.5) * 28);
      const val = Math.max(18, Math.min(55, 36 + b));
      ctx.fillStyle = `rgba(${val}, ${val - 2}, ${val - 3}, 0.5)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// 1C. Fried Unniyappam Caramelized Crust Texture
export function getFriedCrustTexture(): THREE.CanvasTexture {
  return createTexture('fried_crust', 512, (ctx, s) => {
    // Warm golden-brown base
    ctx.fillStyle = '#6e3814';
    ctx.fillRect(0, 0, s, s);

    // Deep caramelized jaggery splotches
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 10 + Math.random() * 45;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(65, 25, 6, 0.7)');
      grad.addColorStop(0.7, 'rgba(110, 50, 16, 0.4)');
      grad.addColorStop(1, 'rgba(140, 75, 28, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fried bubble pores & micro-crisp blisters
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 1.0 + Math.random() * 3.5;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(50, 18, 4, 0.8)' : 'rgba(220, 150, 70, 0.6)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fine roasted sesame flecks
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      ctx.fillStyle = '#1e1008';
      ctx.beginPath();
      ctx.ellipse(x, y, 1.8, 3.2, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// 2. Realistic Teakwood Grain Texture
export function getWoodGrainTexture(): THREE.CanvasTexture {
  return createTexture('wood_grain', 1024, (ctx, s) => {
    // Base warm teak tone
    ctx.fillStyle = '#946138';
    ctx.fillRect(0, 0, s, s);

    // Natural wood grain rings & long fibers
    for (let y = 0; y < s; y += 2) {
      const alpha = 0.08 + Math.sin(y * 0.04 + Math.sin(y * 0.01) * 3) * 0.06;
      ctx.fillStyle = `rgba(60, 32, 12, ${Math.max(0, alpha)})`;
      ctx.fillRect(0, y, s, 2);
    }

    // Wood pores & color striations
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const w = 40 + Math.random() * 180;
      ctx.fillStyle = 'rgba(74, 38, 16, 0.18)';
      ctx.fillRect(x, y, w, 1.5);
    }
  });
}

// 3. Realistic Kerala Nendran Banana Peel Texture
export function getBananaTexture(): THREE.CanvasTexture {
  return createTexture('banana_peel', 512, (ctx, s) => {
    const grad = ctx.createLinearGradient(0, 0, 0, s);
    grad.addColorStop(0, '#557a2b'); // Green stem
    grad.addColorStop(0.12, '#eab308'); // Golden yellow
    grad.addColorStop(0.88, '#facc15'); // Bright ripe yellow
    grad.addColorStop(1, '#654321'); // Brown tip
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);

    // Brown sugar freckles / ripeness spots
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * s;
      const y = 60 + Math.random() * (s - 120);
      const r = 0.6 + Math.random() * 2.2;
      ctx.fillStyle = 'rgba(74, 44, 18, 0.75)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// 4. Fresh Banana Leaf Texture with Veins
export function getBananaLeafTexture(): THREE.CanvasTexture {
  return createTexture('banana_leaf', 512, (ctx, s) => {
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, s, s);

    // Central Midrib Stem
    ctx.fillStyle = '#43a047';
    ctx.fillRect(s / 2 - 4, 0, 8, s);

    // Parallel angled leaf veins
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 1.2;
    for (let y = 0; y < s; y += 6) {
      // Left veins
      ctx.beginPath();
      ctx.moveTo(s / 2, y);
      ctx.lineTo(0, y - 25);
      ctx.stroke();

      // Right veins
      ctx.beginPath();
      ctx.moveTo(s / 2, y);
      ctx.lineTo(s, y - 25);
      ctx.stroke();
    }
  });
}

// 5. Brushed Stainless Steel Texture
export function getBrushedMetalTexture(): THREE.CanvasTexture {
  return createTexture('brushed_metal', 512, (ctx, s) => {
    ctx.fillStyle = '#d6d6d6';
    ctx.fillRect(0, 0, s, s);

    for (let y = 0; y < s; y += 1) {
      const v = Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgba(${190 + v}, ${190 + v}, ${190 + v}, 0.45)`;
      ctx.fillRect(0, y, s, 1);
    }
  });
}

// 6. Sugarcane Jaggery Texture
export function getJaggeryTexture(): THREE.CanvasTexture {
  return createTexture('jaggery', 512, (ctx, s) => {
    ctx.fillStyle = '#3a1905';
    ctx.fillRect(0, 0, s, s);

    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 0.5 + Math.random() * 2;
      const c = Math.random() > 0.5 ? 'rgba(74, 34, 8, 0.6)' : 'rgba(38, 16, 3, 0.7)';
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
