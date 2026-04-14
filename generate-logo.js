const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

function generateLogo(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background: rounded square with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#4f46e5"); // indigo-600
  gradient.addColorStop(0.5, "#6366f1"); // indigo-500
  gradient.addColorStop(1, "#4338ca"); // indigo-700

  // Draw rounded rectangle
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Add subtle inner glow
  const innerGlow = ctx.createRadialGradient(
    size * 0.3, size * 0.3, 0,
    size * 0.5, size * 0.5, size * 0.7
  );
  innerGlow.addColorStop(0, "rgba(255,255,255,0.15)");
  innerGlow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = innerGlow;
  ctx.fill();

  // Draw the document/page icon shape (white, slightly offset)
  const docX = size * 0.25;
  const docY = size * 0.18;
  const docW = size * 0.42;
  const docH = size * 0.58;
  const foldSize = size * 0.12;
  const docRadius = size * 0.04;

  ctx.beginPath();
  ctx.moveTo(docX + docRadius, docY);
  ctx.lineTo(docX + docW - foldSize, docY);
  ctx.lineTo(docX + docW, docY + foldSize);
  ctx.lineTo(docX + docW, docY + docH - docRadius);
  ctx.quadraticCurveTo(docX + docW, docY + docH, docX + docW - docRadius, docY + docH);
  ctx.lineTo(docX + docRadius, docY + docH);
  ctx.quadraticCurveTo(docX, docY + docH, docX, docY + docH - docRadius);
  ctx.lineTo(docX, docY + docRadius);
  ctx.quadraticCurveTo(docX, docY, docX + docRadius, docY);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();

  // Doc fold triangle
  ctx.beginPath();
  ctx.moveTo(docX + docW - foldSize, docY);
  ctx.lineTo(docX + docW - foldSize, docY + foldSize);
  ctx.lineTo(docX + docW, docY + foldSize);
  ctx.closePath();
  ctx.fillStyle = "rgba(79,70,229,0.3)";
  ctx.fill();

  // Lines on the document
  ctx.fillStyle = "#c7d2fe"; // indigo-200
  const lineY = docY + foldSize + size * 0.06;
  const lineH = size * 0.028;
  const lineGap = size * 0.055;
  for (let i = 0; i < 4; i++) {
    const lw = i === 2 ? docW * 0.5 : docW * 0.7;
    const rx = size * 0.015;
    const ly = lineY + i * lineGap;
    ctx.beginPath();
    ctx.roundRect(docX + size * 0.05, ly, lw, lineH, rx);
    ctx.fill();
  }

  // Spark / AI element - a small lightning bolt or sparkle on upper right
  const sparkX = size * 0.6;
  const sparkY = size * 0.22;
  const sparkSize = size * 0.28;

  // Outer glow for spark
  const sparkGlow = ctx.createRadialGradient(
    sparkX + sparkSize * 0.4, sparkY + sparkSize * 0.4, 0,
    sparkX + sparkSize * 0.4, sparkY + sparkSize * 0.4, sparkSize * 0.6
  );
  sparkGlow.addColorStop(0, "rgba(253,224,71,0.4)");
  sparkGlow.addColorStop(1, "rgba(253,224,71,0)");
  ctx.fillStyle = sparkGlow;
  ctx.fillRect(sparkX - sparkSize * 0.2, sparkY - sparkSize * 0.2, sparkSize * 1.4, sparkSize * 1.4);

  // Lightning bolt
  ctx.beginPath();
  ctx.moveTo(sparkX + sparkSize * 0.55, sparkY);
  ctx.lineTo(sparkX + sparkSize * 0.2, sparkY + sparkSize * 0.45);
  ctx.lineTo(sparkX + sparkSize * 0.45, sparkY + sparkSize * 0.45);
  ctx.lineTo(sparkX + sparkSize * 0.3, sparkY + sparkSize * 0.85);
  ctx.lineTo(sparkX + sparkSize * 0.7, sparkY + sparkSize * 0.35);
  ctx.lineTo(sparkX + sparkSize * 0.48, sparkY + sparkSize * 0.35);
  ctx.lineTo(sparkX + sparkSize * 0.55, sparkY);
  ctx.closePath();

  const boltGrad = ctx.createLinearGradient(sparkX, sparkY, sparkX + sparkSize, sparkY + sparkSize);
  boltGrad.addColorStop(0, "#fde047"); // yellow-300
  boltGrad.addColorStop(1, "#f59e0b"); // amber-500
  ctx.fillStyle = boltGrad;
  ctx.fill();

  // Small sparkle dots
  ctx.fillStyle = "#fde047";
  const dots = [
    [sparkX + sparkSize * 0.85, sparkY + sparkSize * 0.15, size * 0.018],
    [sparkX + sparkSize * 0.1, sparkY + sparkSize * 0.05, size * 0.012],
    [sparkX + sparkSize * 0.9, sparkY + sparkSize * 0.6, size * 0.014],
  ];
  for (const [dx, dy, dr] of dots) {
    ctx.beginPath();
    ctx.arc(dx, dy, dr, 0, Math.PI * 2);
    ctx.fill();
  }

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath} (${size}x${size})`);
}

// Also generate a wide logo with text
function generateFullLogo(outputPath) {
  const width = 800;
  const height = 200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Transparent background
  ctx.clearRect(0, 0, width, height);

  // Draw icon (reuse mini version)
  const iconSize = 160;
  const iconX = 20;
  const iconY = 20;

  // Icon background
  const gradient = ctx.createLinearGradient(iconX, iconY, iconX + iconSize, iconY + iconSize);
  gradient.addColorStop(0, "#4f46e5");
  gradient.addColorStop(0.5, "#6366f1");
  gradient.addColorStop(1, "#4338ca");

  const r = iconSize * 0.2;
  ctx.beginPath();
  ctx.moveTo(iconX + r, iconY);
  ctx.lineTo(iconX + iconSize - r, iconY);
  ctx.quadraticCurveTo(iconX + iconSize, iconY, iconX + iconSize, iconY + r);
  ctx.lineTo(iconX + iconSize, iconY + iconSize - r);
  ctx.quadraticCurveTo(iconX + iconSize, iconY + iconSize, iconX + iconSize - r, iconY + iconSize);
  ctx.lineTo(iconX + r, iconY + iconSize);
  ctx.quadraticCurveTo(iconX, iconY + iconSize, iconX, iconY + iconSize - r);
  ctx.lineTo(iconX, iconY + r);
  ctx.quadraticCurveTo(iconX, iconY, iconX + r, iconY);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Inner glow
  const ig = ctx.createRadialGradient(
    iconX + iconSize * 0.3, iconY + iconSize * 0.3, 0,
    iconX + iconSize * 0.5, iconY + iconSize * 0.5, iconSize * 0.7
  );
  ig.addColorStop(0, "rgba(255,255,255,0.15)");
  ig.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = ig;
  ctx.fill();

  // Doc shape inside icon
  const dX = iconX + iconSize * 0.25;
  const dY = iconY + iconSize * 0.18;
  const dW = iconSize * 0.42;
  const dH = iconSize * 0.58;
  const fold = iconSize * 0.12;
  const dr = iconSize * 0.04;

  ctx.beginPath();
  ctx.moveTo(dX + dr, dY);
  ctx.lineTo(dX + dW - fold, dY);
  ctx.lineTo(dX + dW, dY + fold);
  ctx.lineTo(dX + dW, dY + dH - dr);
  ctx.quadraticCurveTo(dX + dW, dY + dH, dX + dW - dr, dY + dH);
  ctx.lineTo(dX + dr, dY + dH);
  ctx.quadraticCurveTo(dX, dY + dH, dX, dY + dH - dr);
  ctx.lineTo(dX, dY + dr);
  ctx.quadraticCurveTo(dX, dY, dX + dr, dY);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();

  // Fold
  ctx.beginPath();
  ctx.moveTo(dX + dW - fold, dY);
  ctx.lineTo(dX + dW - fold, dY + fold);
  ctx.lineTo(dX + dW, dY + fold);
  ctx.closePath();
  ctx.fillStyle = "rgba(79,70,229,0.3)";
  ctx.fill();

  // Lines
  ctx.fillStyle = "#c7d2fe";
  const lStart = dY + fold + iconSize * 0.06;
  const lH = iconSize * 0.028;
  const lGap = iconSize * 0.055;
  for (let i = 0; i < 4; i++) {
    const lw = i === 2 ? dW * 0.5 : dW * 0.7;
    ctx.beginPath();
    ctx.roundRect(dX + iconSize * 0.05, lStart + i * lGap, lw, lH, iconSize * 0.015);
    ctx.fill();
  }

  // Lightning bolt
  const sX = iconX + iconSize * 0.6;
  const sY = iconY + iconSize * 0.22;
  const sS = iconSize * 0.28;

  const sGlow = ctx.createRadialGradient(
    sX + sS * 0.4, sY + sS * 0.4, 0,
    sX + sS * 0.4, sY + sS * 0.4, sS * 0.6
  );
  sGlow.addColorStop(0, "rgba(253,224,71,0.4)");
  sGlow.addColorStop(1, "rgba(253,224,71,0)");
  ctx.fillStyle = sGlow;
  ctx.fillRect(sX - sS * 0.2, sY - sS * 0.2, sS * 1.4, sS * 1.4);

  ctx.beginPath();
  ctx.moveTo(sX + sS * 0.55, sY);
  ctx.lineTo(sX + sS * 0.2, sY + sS * 0.45);
  ctx.lineTo(sX + sS * 0.45, sY + sS * 0.45);
  ctx.lineTo(sX + sS * 0.3, sY + sS * 0.85);
  ctx.lineTo(sX + sS * 0.7, sY + sS * 0.35);
  ctx.lineTo(sX + sS * 0.48, sY + sS * 0.35);
  ctx.lineTo(sX + sS * 0.55, sY);
  ctx.closePath();

  const bG = ctx.createLinearGradient(sX, sY, sX + sS, sY + sS);
  bG.addColorStop(0, "#fde047");
  bG.addColorStop(1, "#f59e0b");
  ctx.fillStyle = bG;
  ctx.fill();

  // Sparkle dots
  ctx.fillStyle = "#fde047";
  [[sX + sS * 0.85, sY + sS * 0.15, 3], [sX + sS * 0.1, sY + sS * 0.05, 2], [sX + sS * 0.9, sY + sS * 0.6, 2.5]].forEach(([x, y, rr]) => {
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fill();
  });

  // Text: "ResumeForge"
  const textX = iconX + iconSize + 24;
  ctx.fillStyle = "#111827";
  ctx.font = "bold 56px sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("Resume", textX, height * 0.42);

  const resumeWidth = ctx.measureText("Resume").width;
  ctx.fillStyle = "#4f46e5";
  ctx.fillText("Forge", textX + resumeWidth, height * 0.42);

  // Subtext "AI"
  const forgeEnd = textX + resumeWidth + ctx.measureText("Forge").width;
  ctx.font = "600 28px sans-serif";
  ctx.fillStyle = "#6366f1";
  ctx.fillText(" AI", forgeEnd, height * 0.42);

  // Tagline
  ctx.font = "400 18px sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("AI-Powered Resume Optimizer", textX, height * 0.72);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath} (${width}x${height})`);
}

// Generate all sizes
const publicDir = path.join(__dirname, "public");

generateLogo(512, path.join(publicDir, "logo-512.png"));
generateLogo(192, path.join(publicDir, "logo-192.png"));
generateLogo(64, path.join(publicDir, "favicon.png"));
generateLogo(180, path.join(publicDir, "apple-touch-icon.png"));
generateFullLogo(path.join(publicDir, "logo-full.png"));

console.log("\nAll logos generated!");
