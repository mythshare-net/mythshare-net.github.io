/* MythShare title screen — a small night scene painted at low resolution
   and scaled up with nearest-neighbour filtering: dithered dusk sky, moon,
   hills, a stone circle, a campfire, the Tylwyth Teg's lights, and the
   occasional wyrm crossing the moon. */
(function () {
    'use strict';

    var canvas = document.getElementById('scene');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var Sprites = window.MythSprites;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var H = 150;
    var W = 300;
    var backdrop = null;
    var stars = [];
    var flies = [];
    var hunt = null;
    var frame = 0;
    var running = false;
    var visible = true;
    var last = 0;

    var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    var SKY = ['#0b0d1c', '#121a2e', '#1d2342', '#2e2a4f', '#4a2f4f', '#6e3b45'];

    function rng(seed) {
        return function () {
            seed |= 0; seed = seed + 0x6D2B79F5 | 0;
            var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    function hex(c) {
        var n = parseInt(c.slice(1), 16);
        // ImageData on little-endian: ABGR
        return (255 << 24) | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | (n >> 16);
    }

    function dither(x, y, t) {
        return t * 16 > BAYER[(y & 3) * 4 + (x & 3)];
    }

    var horizon, circleX, fireX;
    function farRidge(x) { return horizon - 16 - 9 * Math.sin(x * 0.021 + 1) - 5 * Math.sin(x * 0.057); }
    function midRidge(x) { return horizon + 4 - 6 * Math.sin((x - circleX) * 0.018 + 1.57) - 2 * Math.sin(x * 0.083); }
    function ground(x) { return H - 18 - 2 * Math.sin(x * 0.05) - 1.5 * Math.sin(x * 0.13); }

    function buildBackdrop() {
        backdrop = document.createElement('canvas');
        backdrop.width = W;
        backdrop.height = H;
        var bctx = backdrop.getContext('2d');
        var img = bctx.createImageData(W, H);
        var buf = new Uint32Array(img.data.buffer);
        var skyCols = SKY.map(hex);
        var farCol = hex('#27304a'), farHi = hex('#3a4566');
        var midCol = hex('#1a2b1e'), midHi = hex('#2c4a26');
        var fgCol = hex('#120d0a'), fgHi = hex('#2e2219');
        var x, y;

        horizon = Math.round(H * (W > H ? 0.7 : 0.8));
        circleX = Math.round(W * (W > H * 1.4 ? 0.72 : 0.58));
        fireX = Math.round(W * (W > H * 1.4 ? 0.2 : 0.18));

        for (y = 0; y < H; y++) {
            var t = Math.min(y / horizon, 1) * (SKY.length - 1);
            var band = Math.floor(t);
            var next = Math.min(band + 1, SKY.length - 1);
            var frac = t - band;
            for (x = 0; x < W; x++) {
                buf[y * W + x] = dither(x, y, frac) ? skyCols[next] : skyCols[band];
            }
        }

        for (x = 0; x < W; x++) {
            var f = Math.round(farRidge(x));
            var m = Math.round(midRidge(x));
            var g = Math.round(ground(x));
            for (y = f; y < H; y++) buf[y * W + x] = (y - f < 2 && dither(x, y, 0.5)) ? farHi : farCol;
            for (y = m; y < H; y++) buf[y * W + x] = (y - m < 3 && dither(x, y, 0.6 - (y - m) * 0.2)) ? midHi : midCol;
            for (y = g; y < H; y++) buf[y * W + x] = (y - g < 2 && dither(x, y, 0.5)) ? fgHi : fgCol;
        }
        bctx.putImageData(img, 0, 0);

        // Moon with a dithered halo
        var mx = Math.round(W * (W > H * 1.4 ? 0.87 : 0.8)), my = Math.round(H * (W > H * 1.4 ? 0.16 : 0.1)), r = 11;
        for (y = -r - 6; y <= r + 6; y++) {
            for (x = -r - 6; x <= r + 6; x++) {
                var d = Math.sqrt(x * x + y * y);
                if (d <= r) {
                    bctx.fillStyle = (x + y > r * 0.9 && dither(mx + x, my + y, 0.5)) ? '#c9bf9f' : '#efe3c2';
                    bctx.fillRect(mx + x, my + y, 1, 1);
                } else if (d <= r + 6 && dither(mx + x, my + y, 0.35 * (1 - (d - r) / 6))) {
                    bctx.fillStyle = '#5a4d6e';
                    bctx.fillRect(mx + x, my + y, 1, 1);
                }
            }
        }
        bctx.fillStyle = '#c9bf9f';
        [[-4, -3, 3], [3, 2, 2], [-1, 5, 2], [5, -5, 1]].forEach(function (c) {
            bctx.fillRect(mx + c[0], my + c[1], c[2], c[2]);
        });

        // Stone circle on the middle hill
        var stones = [-26, -17, -8, 1, 10, 19, 27];
        var heights = [8, 11, 9, 13, 10, 12, 7];
        stones.forEach(function (dx, i) {
            var sx = circleX + dx;
            var base = Math.round(midRidge(sx + 1)) + 2;
            var h = heights[i];
            var w = i === 3 ? 5 : 4;
            bctx.fillStyle = '#1b1410';
            bctx.fillRect(sx - 1, base - h - 1, w + 2, h + 1);
            bctx.fillStyle = '#6b6a66';
            bctx.fillRect(sx, base - h, w, h);
            bctx.fillStyle = '#8a857a';
            bctx.fillRect(sx, base - h, 1, h);
            bctx.fillStyle = '#4a4d4b';
            bctx.fillRect(sx + w - 1, base - h + 2, 1, h - 2);
        });
        // Lintel over the tallest pair
        var lx = circleX - 9, ly = Math.round(midRidge(circleX)) - 13;
        bctx.fillStyle = '#1b1410';
        bctx.fillRect(lx - 1, ly - 2, 17, 4);
        bctx.fillStyle = '#7d7f7a';
        bctx.fillRect(lx, ly - 1, 15, 2);

        // Grass tufts in the foreground
        var rand = rng(11);
        bctx.fillStyle = '#2c4a26';
        for (x = 2; x < W; x += 3 + Math.floor(rand() * 6)) {
            var gy = Math.round(ground(x));
            bctx.fillRect(x, gy - 2, 1, 2);
            bctx.fillRect(x + 1, gy - 3, 1, 3);
            if (rand() > 0.5) bctx.fillRect(x + 2, gy - 1, 1, 1);
        }

        // Stars
        stars = [];
        var srand = rng(42);
        var count = Math.round(W * horizon / 110);
        for (var i = 0; i < count; i++) {
            var sx2 = Math.floor(srand() * W);
            var sy2 = Math.floor(srand() * (horizon - 30));
            if (Math.abs(sx2 - mx) < r + 7 && Math.abs(sy2 - my) < r + 7) continue;
            stars.push({ x: sx2, y: sy2, p: srand() * 6.28, big: srand() > 0.9 });
        }

        flies = [];
        var frand = rng(7);
        for (var j = 0; j < 9; j++) {
            flies.push({ x: circleX - 40 + frand() * 80, y: horizon - 6 + frand() * 22, p: frand() * 6.28, s: 0.3 + frand() * 0.4 });
        }
    }

    function drawFire(t) {
        var gx = fireX, gy = Math.round(ground(fireX)) + 1;
        // Warm glow on the ground
        var pulse = 0.16 + 0.05 * Math.sin(t * 0.9);
        ctx.fillStyle = '#6e3b1f';
        for (var y = -10; y <= 6; y++) {
            for (var x = -26; x <= 26; x++) {
                var d = Math.sqrt(x * x / 4 + y * y);
                if (d < 10 && dither(gx + x, gy + y, pulse * (1 - d / 10) * 2) && gy + y >= ground(gx + x)) {
                    ctx.fillRect(gx + x, gy + y, 1, 1);
                }
            }
        }
        // Logs
        ctx.fillStyle = '#1b1410';
        ctx.fillRect(gx - 7, gy - 2, 15, 3);
        ctx.fillStyle = '#5a3d2b';
        ctx.fillRect(gx - 6, gy - 1, 6, 1);
        ctx.fillRect(gx + 1, gy - 2, 6, 1);
        // Flames
        var cols = ['#b3302c', '#d69a3a', '#f2c94c', '#fff4c2'];
        for (var fx = -4; fx <= 4; fx++) {
            var hgt = Math.max(1, Math.round(9 - Math.abs(fx) * 1.8 + Math.sin(t * 7 + fx * 1.7) * 2 + Math.sin(t * 13 + fx) * 1.2));
            for (var fy = 0; fy < hgt; fy++) {
                var level = Math.min(3, Math.floor((1 - fy / hgt) * 3 + (Math.abs(fx) < 2 ? 1 : 0)));
                ctx.fillStyle = cols[level];
                ctx.fillRect(gx + fx, gy - 3 - fy, 1, 1);
            }
        }
        // Sparks
        ctx.fillStyle = '#f2c94c';
        for (var s = 0; s < 3; s++) {
            var life = (t * 0.8 + s / 3) % 1;
            ctx.fillRect(gx + Math.round(Math.sin(t * 2 + s * 2) * 3 + s - 1), gy - 12 - Math.round(life * 18), 1, 1);
        }
    }

    function render(time) {
        var t = time / 1000;
        ctx.drawImage(backdrop, 0, 0);

        stars.forEach(function (s) {
            var tw = Math.sin(t * 1.5 + s.p);
            if (tw < -0.6) return;
            ctx.fillStyle = tw > 0.7 ? '#ffffff' : '#9fb3b5';
            ctx.fillRect(s.x, s.y, 1, 1);
            if (s.big && tw > 0.5) {
                ctx.fillStyle = '#5a6a8a';
                ctx.fillRect(s.x - 1, s.y, 1, 1); ctx.fillRect(s.x + 1, s.y, 1, 1);
                ctx.fillRect(s.x, s.y - 1, 1, 1); ctx.fillRect(s.x, s.y + 1, 1, 1);
            }
        });

        // A wyrm crosses the sky every 20 seconds
        var cycle = (t % 20) / 20;
        if (!reduceMotion && cycle < 0.55) {
            var wx = Math.round(-20 + (W + 40) * (cycle / 0.55));
            var wy = Math.round(H * 0.16 + Math.sin(t * 2.2) * 4);
            Sprites.draw(ctx, 'wyrm', wx, wy, 1, false);
        }

        flies.forEach(function (f) {
            var on = Math.sin(t * 2 * f.s * 3 + f.p);
            if (on < 0) return;
            ctx.fillStyle = on > 0.6 ? '#e8f7a0' : '#8fb05a';
            ctx.fillRect(Math.round(f.x + Math.sin(t * f.s + f.p) * 6), Math.round(f.y + Math.cos(t * f.s * 1.3 + f.p) * 3), 1, 1);
        });

        drawFire(t);

        if (hunt) {
            var elapsed = t - hunt.start;
            var hx = Math.round(-80 + elapsed * 70);
            var hy = Math.round(ground(Math.max(0, hx)) - 15);
            ['hound', 'hound', 'hound', 'stag'].forEach(function (name, i) {
                var bob = (Math.floor(t * 10 + i) % 2);
                Sprites.draw(ctx, name, hx - i * 20, hy - bob - (name === 'stag' ? 2 : 0), 1, false);
            });
            if (hx - 80 > W) hunt = null;
        }
    }

    function loop(time) {
        if (!running) return;
        // Step at ~12fps for a chunky, cartridge-era cadence
        if (time - last > 80) {
            last = time;
            frame++;
            render(time);
        }
        requestAnimationFrame(loop);
    }

    function resize() {
        var rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        H = rect.height > 620 ? 170 : 150;
        W = Math.max(40, Math.round(H * rect.width / rect.height));
        canvas.width = W;
        canvas.height = H;
        buildBackdrop();
        render(performance.now());
    }

    function start() {
        if (reduceMotion || running || !visible) return;
        running = true;
        requestAnimationFrame(loop);
    }

    var resizeTimer;
    function queueResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 120);
    }
    if ('ResizeObserver' in window) new ResizeObserver(queueResize).observe(canvas);
    else window.addEventListener('resize', queueResize);

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible) start(); else running = false;
        }).observe(canvas);
    }

    resize();
    start();

    window.MythScene = {
        wildHunt: function () {
            if (!reduceMotion) hunt = { start: performance.now() / 1000 };
        }
    };
})();
