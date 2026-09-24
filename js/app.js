(function () {
    'use strict';

    if (window.MythSprites) window.MythSprites.paint();

    var years = document.querySelectorAll('.js-year');
    for (var i = 0; i < years.length; i++) years[i].textContent = new Date().getFullYear();

    // ↑ ↑ ↓ ↓ ← → ← → B A — Arawn rewards the faithful.
    var code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var pos = 0;
    var toast = document.getElementById('toast');
    var toastTimer;

    document.addEventListener('keydown', function (e) {
        var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        pos = key === code[pos] ? pos + 1 : (key === code[0] ? 1 : 0);
        if (pos < code.length) return;
        pos = 0;
        if (window.MythScene) window.MythScene.wildHunt();
        if (toast) {
            toast.hidden = false;
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { toast.hidden = true; }, 5000);
        }
    });
})();
