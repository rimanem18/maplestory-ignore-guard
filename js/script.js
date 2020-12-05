const selectMonster = document.getElementById('js-monster');
const ignore = document.getElementById('js-my-ignore-guard');
const viewDamage = document.getElementById('js-damage');


if(Cookies.get('ignore') !== undefined){
    ignore.value = Cookies.get('ignore');    
}

function calc(){
    // 防御率無視が100を超過
    if(ignore.value > 100){
        ignore.value = 100;
        return;
    }
    // モブが選択されていない
    if(selectMonster.value == ""){
        return;
    }

    // 防御率無視の計算式
    // 通るダメージ(％)＝1－敵の防御率×(1－防御率無視)
    let damage = 1 - selectMonster.value * (1 - (ignore.value / 100));

    // 計算結果がマイナス
    if(damage * 100 < 0){
        damage = 0;
    }

    Cookies.set('ignore', ignore.value);

    // 計算結果を出力
    viewDamage.textContent = Math.ceil(damage * 100);
}

calc(selectMonster)
ignore.onchange = function(){
    calc(selectMonster);
}
selectMonster.onchange = function(){
    calc(selectMonster);
}