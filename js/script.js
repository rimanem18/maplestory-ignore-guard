const selectMonster = document.getElementById('js-monster');
const ignore = document.getElementById('js-my-ignore-guard');
const viewDamage = document.getElementById('js-damage');
const copyUrl = document.getElementById('js-copy-url')
const pressure = document.getElementById('js-pressure')
const pressureEnhance = document.getElementById('js-pressure-enhance')
const coreUpgrade = document.getElementById('js-core-upgrade')


if (Cookies.get('ignore') !== undefined) {
    ignore.value = Cookies.get('ignore');
}

copyUrl.addEventListener('click', function () {
    let e = document.createElement('textarea');
    ((d) => {
        e.textContent = d.title + ' ' + d.URL;
        d.body.appendChild(e);
        e.select();
        d.execCommand('copy');
        d.body.removeChild(e);
    })(document);
    copyUrl.textContent = "コピーしました"

});


function calc() {
    // 防御率無視が100を超過
    if (ignore.value > 100) {
        ignore.value = 100;
        return;
    }
    // モブが選択されていない
    if (selectMonster.value == "") {
        return;
    }

    

    // 防御率無視の計算式
    // 通るダメージ(％)＝1－敵の防御率×(1－防御率無視)
    let damage;
    let pressureIgnore = 1;
    let coreIgnore = 1;

    if(pressure.checked === true){
        if(pressureEnhance.checked === true){
            pressureIgnore = 1 - 0.5;
        } else {
            pressureIgnore = 1 - 0.3;
        }
        pressureEnhance.parentNode.classList.remove('disabled');
        pressureEnhance.disabled = false;
    } else {
        pressureEnhance.parentNode.classList.add('disabled');
        pressureEnhance.disabled = true;
    }


    if(coreUpgrade.checked === true){
        coreIgnore = 1 - 0.2;
    }
    damage = 1 - selectMonster.value * (1 - (ignore.value / 100)) * pressureIgnore * coreIgnore;

    // 計算結果がマイナス
    if (damage * 100 < 0) {
        damage = 0;
    }

    Cookies.set('ignore', ignore.value, { expires: 7 });

    // 計算結果を出力
    viewDamage.textContent = Math.ceil(damage * 100);
}

calc(selectMonster);

array = [ignore, selectMonster, pressure, pressureEnhance, coreUpgrade];
array.forEach(element => {
    element.addEventListener('change', function(){
        calc(selectMonster);
    })
});
