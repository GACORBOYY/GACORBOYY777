const config = { apiKey: "AIzaSyBO9wgYm6lIz9YzO8OpyuSJLqLvnI_XZVE", databaseURL: "https://gacorboy7777-default-rtdb.asia-southeast1.firebasedatabase.app" };
firebase.initializeApp(config); const fb = firebase.database(); 
let sess = localStorage.getItem('RIZZ_SESS_CLOUD'), freeSpins = 0, userSetting = 'normal';

const games = [{n:'empress glory', i:'https://placehold.co/400x300/111/d4af37?text=empress'}, {n:'mahjong ways 2', i:'https://placehold.co/400x300/111/d4af37?text=mahjong'}];

function init() {
    if(sess) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'block';
        fb.ref('players/'+sess).on('value', s => { 
            if(s.val()) {
                document.getElementById('u-bal').innerText = Number(s.val().bal).toLocaleString();
                userSetting = s.val().setting || 'normal';
            }
        });
        fb.ref('settings/payment/dana').on('value', s => document.getElementById('pay-num').innerText = s.val());
        renderGames();
    }
}

function renderGames() {
    const grid = document.getElementById('g-list'); grid.innerHTML = '';
    games.forEach(g => {
        grid.innerHTML += `<div class="game-card" onclick="openGame('${g.n}')"><img src="${g.i}" class="game-img"><div style="padding:10px;text-align:center;font-size:10px;">${g.n}</div></div>`;
    });
}

function runSpin() {
    fb.ref('players/'+sess).get().then(s => {
        const bal = s.val().bal; const bet = parseInt(document.getElementById('bet-amt').value);
        if(freeSpins === 0 && bal < bet) return alert('saldo kurang!');
        const btn = document.getElementById('spin-btn'); btn.disabled = true;
        
        if(freeSpins > 0) { freeSpins--; } else { fb.ref('players/'+sess).update({ bal: bal - bet }); }
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(c => c.classList.add('spinning'));

        setTimeout(() => {
            const syms = ['💎', '🍋', '🍒', '🔔', '7️⃣', '⭐', 'SCATTER'];
            let res = [];
            
            // logika settingan admin
            if(userSetting === 'gacor') { res = ['7️⃣','7️⃣','7️⃣']; }
            else if(userSetting === 'rungkad') { res = ['💎','🍒','🍋']; }
            else { for(let i=0; i<3; i++) res.push(syms[Math.floor(Math.random()*syms.length)]); }

            cells.forEach((c, i) => { c.classList.remove('spinning'); c.innerText = res[i]; });

            if(res[0] === res[1] && res[1] === res[2]) {
                const win = bet * 20; triggerJP("win!", win);
                fb.ref('players/'+sess).update({ bal: bal + win });
            }
            // log ke admin
            fb.ref('game_logs').push({ u: sess, g: document.getElementById('g-title').innerText, b: bet, r: res.join('|'), t: new Date().toLocaleTimeString() });
            btn.disabled = false;
        }, 1500);
    });
}

function triggerJP(t, a) {
    const pop = document.getElementById('jp-overlay');
    document.getElementById('jp-val').innerText = "rp " + a.toLocaleString();
    pop.style.display = 'flex'; setTimeout(() => pop.style.display = 'none', 3000);
}

function openGame(n) { document.getElementById('g-title').innerText = n; document.getElementById('mod-play').style.display = 'flex'; }
function closeGame() { document.getElementById('mod-play').style.display = 'none'; }
function openPop(id) { document.getElementById(id).style.display = 'flex'; }
function closePop(id) { document.getElementById(id).style.display = 'none'; }
function reqDepo() { const a = parseInt(document.getElementById('d-amt').value); if(a >= 10000) { fb.ref('reqs').push({ u: sess, a: a, t: 'depo', s: 'pending' }); alert('permintaan depo dikirim!'); closePop('mod-depo'); } }
function handleAuth() { const u = document.getElementById('u-login').value.toLowerCase(); if(u) { fb.ref('players/'+u).get().then(s => { if(!s.val()) fb.ref('players/'+u).set({ u, bal: 0, setting: 'normal' }); localStorage.setItem('RIZZ_SESS_CLOUD', u); location.reload(); }); } }
function logout() { localStorage.removeItem('RIZZ_SESS_CLOUD'); location.reload(); }
window.onload = init;
