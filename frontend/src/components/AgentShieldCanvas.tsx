import React, { useEffect, useRef } from 'react';

export const AgentShieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let time = 0;
    let mouseX = -999;
    const ripples: Array<{ x: number; y: number; r: number; life: number }> = [];

    const handleResize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    };

    const onMouseLeave = () => {
      mouseX = -999;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 0,
        life: 1,
      });
    };

    window.addEventListener('resize', handleResize);
    const parentEl = canvas.parentElement;
    if (parentEl) {
      parentEl.addEventListener('mousemove', onMouseMove);
      parentEl.addEventListener('mouseleave', onMouseLeave);
      parentEl.addEventListener('click', onClick);
    }

    // Sinusoidal organic ribbon with cubic bezier smoothing
    function drawWave(
      baseY: number,
      amp: number,
      freqMod: number,
      stepFreq: number,
      speed: number,
      phase: number,
      fillColor: string,
      strokeColor: string,
      mouseInfluence: number
    ) {
      if (!ctx) return;
      const currentAmp = amp * (1 + freqMod * Math.sin(time * 0.4 + phase));
      const step = width > 1200 ? 12 : 8;
      const points: [number, number][] = [];

      for (let x = 0; x <= width; x += step) {
        let mouseDisplacement = 0;
        if (mouseX > -900) {
          const dist = x - mouseX;
          const spread = width * 0.18;
          mouseDisplacement = mouseInfluence * Math.exp(-(dist * dist) / (2 * spread * spread));
        }

        let rippleDisplacement = 0;
        for (const rip of ripples) {
          const dist = Math.abs(x - rip.x);
          if (dist < 300) {
            rippleDisplacement += rip.life * 9 * Math.sin(dist / 26 - time * 7) * Math.exp(-dist / 110);
          }
        }

        const y =
          baseY +
          mouseDisplacement +
          rippleDisplacement +
          Math.sin(x * stepFreq + phase + time * speed) * currentAmp +
          Math.sin(x * stepFreq * 0.53 - phase * 0.7 - time * speed * 0.62) * currentAmp * 0.36 +
          Math.sin(x * stepFreq * 1.7 + phase * 0.3 + time * speed * 1.1) * currentAmp * 0.12;

        points.push([x, y]);
      }

      if (points.length < 2) return;

      // Fill Path
      const fillPath = new Path2D();
      fillPath.moveTo(0, height);
      fillPath.lineTo(points[0][0], points[0][1]);

      for (let i = 0; i < points.length - 1; i++) {
        const pPrev = points[Math.max(i - 1, 0)];
        const pCurr = points[i];
        const pNext = points[i + 1];
        const pNextNext = points[Math.min(i + 2, points.length - 1)];

        const tension = 0.5;
        const cp1x = pCurr[0] + ((pNext[0] - pPrev[0]) * tension) / 3;
        const cp1y = pCurr[1] + ((pNext[1] - pPrev[1]) * tension) / 3;
        const cp2x = pNext[0] - ((pNextNext[0] - pCurr[0]) * tension) / 3;
        const cp2y = pNext[1] - ((pNextNext[1] - pCurr[1]) * tension) / 3;

        fillPath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pNext[0], pNext[1]);
      }

      fillPath.lineTo(width, height);
      fillPath.closePath();

      const gradient = ctx.createLinearGradient(0, baseY - currentAmp * 1.2, 0, height);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(0.6, fillColor.replace(/[\d.]+\)$/, '0.05)'));
      gradient.addColorStop(1, 'rgba(250, 250, 248, 0)');
      ctx.fillStyle = gradient;
      ctx.fill(fillPath);

      // Stroke Path
      const strokePath = new Path2D();
      strokePath.moveTo(points[0][0], points[0][1]);

      for (let i = 0; i < points.length - 1; i++) {
        const pPrev = points[Math.max(i - 1, 0)];
        const pCurr = points[i];
        const pNext = points[i + 1];
        const pNextNext = points[Math.min(i + 2, points.length - 1)];

        const tension = 0.5;
        const cp1x = pCurr[0] + ((pNext[0] - pPrev[0]) * tension) / 3;
        const cp1y = pCurr[1] + ((pNext[1] - pPrev[1]) * tension) / 3;
        const cp2x = pNext[0] - ((pNextNext[0] - pCurr[0]) * tension) / 3;
        const cp2y = pNext[1] - ((pNextNext[1] - pCurr[1]) * tension) / 3;

        strokePath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pNext[0], pNext[1]);
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(strokePath);
    }

    function drawRipples() {
      if (!ctx) return;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += 4;
        rip.life -= 0.016;
        if (rip.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${(rip.life * 0.38).toFixed(2)})`;
        ctx.lineWidth = 2.2 * rip.life;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(167, 139, 250, ${(rip.life * 0.22).toFixed(2)})`;
        ctx.lineWidth = 1.6 * rip.life;
        ctx.stroke();
      }
    }

    function render() {
      if (!ctx) return;
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 4 Organic Ribbon Layers from AgentShield
      drawWave(height * 0.52, height * 0.03, 0.18, 0.0038, 0.4, 1.0, 'rgba(251, 191, 36, 0.10)', 'rgba(245, 158, 11, 0.24)', 3);
      drawWave(height * 0.59, height * 0.046, 0.14, 0.0050, 0.58, 0.0, 'rgba(251, 191, 36, 0.18)', 'rgba(245, 158, 11, 0.46)', 4);
      drawWave(height * 0.66, height * 0.04, 0.12, 0.0065, 0.75, 2.1, 'rgba(125, 211, 252, 0.24)', 'rgba(56, 189, 248, 0.54)', 5);
      drawWave(height * 0.73, height * 0.034, 0.1, 0.0082, 0.92, 4.4, 'rgba(196, 181, 253, 0.22)', 'rgba(167, 139, 250, 0.50)', 5);

      drawRipples();
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (parentEl) {
        parentEl.removeEventListener('mousemove', onMouseMove);
        parentEl.removeEventListener('mouseleave', onMouseLeave);
        parentEl.removeEventListener('click', onClick);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
    />
  );
};
