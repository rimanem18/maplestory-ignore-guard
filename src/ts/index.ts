"use strict";

const Cookies = require('js-cookie');

const selectMonster: HTMLInputElement = <HTMLInputElement>document.getElementById('js-monster');
const ignore: HTMLInputElement = <HTMLInputElement>document.getElementById('js-my-ignore-guard');
const viewDamage = document.getElementById('js-damage');
const copyUrl = document.getElementById('js-copy-url')
const coreUpgrade: HTMLInputElement = <HTMLInputElement>document.getElementById('js-core-upgrade')
const pressure: HTMLInputElement = <HTMLInputElement>document.getElementById('js-pressure')
const pressureEnhance: HTMLInputElement = <HTMLInputElement>document.getElementById('js-pressure-enhance')
const enhanceLabel: HTMLElement = document.getElementById('pressure-enhance-label');
const ignoreGuardIf = document.getElementById('ignore-guard-if')

const addIgnoreIf: HTMLInputElement = <HTMLInputElement>document.getElementById('add-ignore-if');
const damageReflect: HTMLInputElement = <HTMLInputElement>document.getElementById('js-damage-reflect');

const elementList = [ignore, selectMonster, pressure, pressureEnhance, coreUpgrade, addIgnoreIf, damageReflect];

// クッキーのリスト checkbox
const cookiesList: { name: string, input: HTMLInputElement }[] = [
    { name: "coreUpgrade", input: coreUpgrade },
    { name: "pressure", input: pressure },
    { name: "pressureEnhunce", input: pressureEnhance },
    { name: "damageReclect", input: damageReflect }
];
// 文字列の真偽値を boolean 型に変換
const toBoolean = (strBool: string): boolean => {
    if (strBool === "false") {
        return false;
    } else {
        return true;
    }
}


/**
 * cookie の名前をもとにクッキーの値を取得する
 * undefindチェックもおこなう
 * 
 * @param name クッキーの名前
 * @param defaultVal undefind だった場合に入れる値
 */
const getCookie = (name: string, defaultVal: string)
    : string => {
    let value = defaultVal;

    if (Cookies.get(name) !== undefined) {
        value = Cookies.get(name);
    }

    return value;
}

/**
 * プレッシャーによる率無視計算結果を小数点で返す
 * 
 * @param enhance エンハンスにチェックが入っているかどうか
 */
const pressureCalc = (enhance: boolean): number => {
    let ignore: number = 0;

    if (pressure.checked === true) {

        if (enhance === true) {
            ignore = 0.5;
        } else {
            ignore = 0.3;
        }
        enhanceLabel.classList.remove('disabled');
        pressureEnhance.disabled = false;
    } else {
        enhanceLabel.classList.add('disabled');
        pressureEnhance.disabled = true;
    }


    return ignore;
}


/**
 * 選択されたMOBの防御率に対してどれだけダメージが通るか
 * 
 * @param selectMonster 
 */
const damageCalc = (selectMonster): number => {
    let damage: number;
    let pressureIgnore = 0;
    let coreIgnore = 0;
    let mobGuard: number = Number(selectMonster.value);

    // モブが選択されていない
    if (selectMonster.value == "") {
        return;
    }

    // 数値が0 - 100の範囲をはみ出さないように
    let ignoreGuard: number = Number(ignore.value)
    if (ignoreGuard > 100) {
        ignore.value = (100).toString();
        return;
    }
    if (ignoreGuard < 0) {
        ignore.value = (0).toString();
        return;
    }
    let addIgnoreGuardIf = Number(addIgnoreIf.value)
    if(addIgnoreGuardIf > 100){
        addIgnoreIf.value = (100).toString();
        return;
    }
    if(addIgnoreGuardIf < 0){
        addIgnoreIf.value = (0).toString();
        return;
    }

    pressureIgnore = pressureCalc(pressureEnhance.checked);

    // 強化コアの追加効果反映にチェック
    if (coreUpgrade.checked === true) {
        coreIgnore = 0.2;
    }

    // 防御率無視の計算式
    // 通るダメージ(％)＝1－敵の防御率×(1－防御率無視)
    let ignoreAll: number[] = [ignoreGuard / 100, pressureIgnore, coreIgnore];
    if(damageReflect.checked === true){
        ignoreAll.push(Number(addIgnoreIf.value) / 100);
    }
    damage = 1 - mobGuard * (1 - ignoreGuardCalc(ignoreAll));

    // 計算結果がマイナス
    if (damage * 100 < 0) {
        damage = 0;
    }

    // クッキーの再セット
    Cookies.set('ignore', ignore.value, { expires: 7 });
    cookiesList.forEach(element => {
        Cookies.set(element['name'], element['input'].checked, { expires: 7 });
    });

    // 計算結果を返却
    damage = Math.ceil(damage * 100);

    return damage;
}


/**
 * 渡された配列の中身をもとに防御率無視を計算する
 * 
 * @param array 単体の防御率無視の小数点配列
 * @return result 防御率無視
 */
const ignoreGuardCalc = (array: number[]): number => {
    let result: number = 1;

    array.forEach(element => {
        result *= 1 - element;
    });
    result = 1 - result;

    return result;
}

/**
 * もし防御率無視が増えたらいくつになるか、という想定で計算できる関数
 * 
 * @param add 増える率無視
 * @param now 現在の率無視
 */
const addIgnoreGuard = (add: number, now: number):number => {
    let result = ignoreGuardCalc([now / 100, add / 100]);

    result = Math.ceil(result * 100)
    return result;
}


// クッキーのイニシャライズ
ignore.value = getCookie('ignore', "100");
cookiesList.forEach(element => {
    element['input'].checked = toBoolean(<string>getCookie(element['name'], "false"));
});


copyUrl.addEventListener('click', () => {
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

elementList.forEach(element => {
    element.addEventListener('change', () => {
        viewAll();
    })
});


// 計算結果を出力
const viewAll = () =>{
    if(damageReflect.checked === true){
        viewDamage.classList.add('red');
    } else {
        viewDamage.classList.remove('red');
    }
    viewDamage.textContent = damageCalc(selectMonster).toString();
    ignoreGuardIf.textContent = addIgnoreGuard(Number(addIgnoreIf.value), Number(ignore.value)).toString();    
};
viewAll();