/* MythShare sprite sheet — 16x16 pixel art drawn from ASCII maps.
   Each character maps to a palette colour; '.' is transparent. */
(function () {
    'use strict';

    var PALETTE = {
        k: '#1b1410', // peat (outline)
        b: '#5a3d2b', // bark
        B: '#2e2219', // bog oak
        o: '#d69a3a', // ochre
        y: '#f2c94c', // gold
        w: '#efe3c2', // bone
        r: '#b3302c', // dragon red
        R: '#6e1a1a', // old blood
        g: '#3f6b35', // moss
        G: '#8fb05a', // lichen
        s: '#8a857a', // stone
        S: '#5f615c', // dark stone
        u: '#2f4f7a', // woad
        m: '#9fb3b5', // mist
        p: '#d9a877'  // skin
    };

    var SPRITES = {
        wyrm: [
            '................',
            '.........kkkk...',
            '........krrrrk..',
            '..k.....krykrrk.',
            '.kok...krrrrrrrk',
            '.kook..krrkkkkk.',
            '..kook.krrk.....',
            '...koookrrk.....',
            '....kookrrrk....',
            '.....kkrrrrrk...',
            '......krRkkrrk..',
            '.....krRk..krk..',
            '....krRk...krk..',
            '...krRk...krrk..',
            '..krrrrrrrrrk...',
            '...kkkkkkkkk....'
        ],
        hound: [
            '................',
            '................',
            '................',
            '...........kk...',
            '..........krk...',
            '.........kwwwk..',
            '........kwwwRkk.',
            '.k......kwwwwwwk',
            'kwk....kwwwwkkk.',
            '.kwkkkkwwwwk....',
            '..kwwwwwwwwk....',
            '...kwwwwwwwk....',
            '...kwwkkkwwk....',
            '..kwk.....kwk...',
            '..kk.......kk...',
            '................'
        ],
        owl: [
            '................',
            '...k........k...',
            '...kok....kok...',
            '...kookkkkook...',
            '...kooooooook...',
            '..koowwwwwwook..',
            '..kowykwwkywok..',
            '..koowwkkwwook..',
            '..koooookoooook.',
            '..koobbobbbook..',
            '..kobobobobook..',
            '..koobobobbook..',
            '...kooobboook...',
            '....kkoooookk...',
            '.....kykkyk.....',
            '................'
        ],
        cauldron: [
            '......G..G......',
            '.....G..G.G.....',
            '.......G..G.....',
            '................',
            '..kkkkkkkkkkkk..',
            '.kssssssssssssk.',
            '..kGGgGGGgGGGk..',
            '.kSkkkkkkkkkkSk.',
            'kSSSSSSSSSSSSSSk',
            'kSsSSSSSSSSSSSSk',
            'kSsSSSSSSSSSSSSk',
            'kSSsSSSSSSSSSSSk',
            '.kSSSSSSSSSSSSk.',
            '..kkSSSSSSSSkk..',
            '..ok.kkkkkk.ko..',
            '.ooyo.o..o.oyoo.'
        ],
        harp: [
            '................',
            '..kkk...........',
            '..kbbk..........',
            '..kbbbkkk.......',
            '..kbkkkbbkkk....',
            '..kbkw.wkbbbkk..',
            '..kbkw.w.wkkbbk.',
            '..kbkw.w.w.w.kbk',
            '..kbkw.w.w.w.kbk',
            '..kbkw.w.w.w.kbk',
            '..kbkw.w.w.wkbk.',
            '..kbkw.w.wkbk...',
            '..kbkw.wkbk.....',
            '..kbkwkbk.......',
            '..kbbbbk........',
            '..kkkkk.........'
        ],
        stag: [
            '................',
            '.k.k........k.k.',
            '.kwk.k....k.kwk.',
            '..kwkwk..kwkwk..',
            '...kwwk..kwwk...',
            '....kwwkkwwk....',
            '.....kwwwwk.....',
            '....kwwwwwwk....',
            '....kwRwwRwk....',
            '....kwwwwwwk....',
            '.....kwwwwk.....',
            '.....kwmmwk.....',
            '......kwwk......',
            '......kmmk......',
            '.......kk.......',
            '................'
        ],
        book: [
            '................',
            '................',
            '..kkkkk..kkkkk..',
            '.kwwwwwkkwwwwwk.',
            '.krbbbwkkwbbbwk.',
            '.krrwwwkkwwwwwk.',
            '.kwbbwwkkwbbbwk.',
            '.kwwwwwkkwwwwwk.',
            '.kwbbbwkkwbbwwk.',
            '.kwwwwwkkwwwwwk.',
            '.kwbbwwkkwbbbwk.',
            '.kkkkkkkkkkkkkk.',
            '.kRRRRRRRRRRRRk.',
            '..kkkkkkkkkkkk..',
            '................',
            '................'
        ],
        dolmen: [
            '................',
            '................',
            '.kkkkkkkkkkkkkk.',
            'kssssssssssssssk',
            'kSSSSSSSSSSSSSSk',
            '.kkkkkkkkkkkkkk.',
            '..ksk......ksk..',
            '..kSsk.mmm.kSk..',
            '..kSsk.mum.kSk..',
            '..kSsk.mmm.kSk..',
            '..kSsk.mum.kSk..',
            '..kSsk.mmm.kSk..',
            '..kSsk.mum.kSk..',
            '.gkSskgGGGgkSkg.',
            'gggggggggggggggg',
            '................'
        ],
        toadstool: [
            '................',
            '.....kkkkkk.....',
            '...kkrrwrrrkk...',
            '..krrrrrrwrrrk..',
            '.krwrrrrrrrrwrk.',
            '.krrrrwrrrrrrrk.',
            '.kkkkkkkkkkkkkk.',
            '.....kwwwwk.....',
            '.....kwwwwk.....',
            '.....kwwwwk.....',
            '....kwwwwwwk....',
            '...gkkkkkkkkg...',
            '..gGgggGgggGgg..',
            '................',
            '................',
            '................'
        ],
        bard: [
            '................',
            '.....kkkkkk.....',
            '....kbbbbbbk....',
            '...kbbbbbbbbk...',
            '..kbbkkkkkkbbk..',
            '..kbkppppppkbk..',
            '..kbkpkppkpkbk..',
            '..kbkppppppkbk..',
            '..kbkwwppwwkbk..',
            '..kbbkwwwwkbbk..',
            '.kbbbkwwwwkbbbk.',
            '.kbbbbkwwkbbbbk.',
            'kbbbbbbkkbbbbbbk',
            'kbbbbobbbbobbbbk',
            'kbbbbbbbbbbbbbbk',
            'kkkkkkkkkkkkkkkk'
        ]
    };

    function drawSprite(ctx, name, ox, oy, scale, flip) {
        var map = SPRITES[name];
        if (!map) return;
        scale = scale || 1;
        for (var y = 0; y < map.length; y++) {
            var row = map[y];
            for (var x = 0; x < row.length; x++) {
                var colour = PALETTE[row[x]];
                if (!colour) continue;
                var px = flip ? row.length - 1 - x : x;
                ctx.fillStyle = colour;
                ctx.fillRect(ox + px * scale, oy + y * scale, scale, scale);
            }
        }
    }

    function paintCanvases(root) {
        var nodes = (root || document).querySelectorAll('canvas[data-sprite]');
        for (var i = 0; i < nodes.length; i++) {
            var c = nodes[i];
            c.width = 16;
            c.height = 16;
            var ctx = c.getContext('2d');
            ctx.clearRect(0, 0, 16, 16);
            drawSprite(ctx, c.getAttribute('data-sprite'), 0, 0, 1, c.hasAttribute('data-flip'));
        }
    }

    window.MythSprites = { PALETTE: PALETTE, SPRITES: SPRITES, draw: drawSprite, paint: paintCanvases };
})();
