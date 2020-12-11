"use strict";

const IgnoreGuardCalc = require('./modules/IgnoreGuardCalc.ts');

const Cookies = require('js-cookie');

const selectMonster: HTMLInputElement = <HTMLInputElement>document.getElementById('js-monster');
const ignore: HTMLInputElement = <HTMLInputElement>document.getElementById('js-my-ignore-guard');
const viewDamage: HTMLElement = <HTMLElement>document.getElementById('js-damage');
const copyUrl: HTMLElement = <HTMLElement>document.getElementById('js-copy-url')
const coreUpgrade: HTMLInputElement = <HTMLInputElement>document.getElementById('js-core-upgrade')
const pressure: HTMLInputElement = <HTMLInputElement>document.getElementById('js-pressure')
const pressureEnhance: HTMLInputElement = <HTMLInputElement>document.getElementById('js-pressure-enhance')
const enhanceLabel: HTMLElement = <HTMLElement>document.getElementById('pressure-enhance-label');
const ignoreGuardIf: HTMLElement = <HTMLElement>document.getElementById('ignore-guard-if')

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
    if (strBool === "true") {
        return true;
    } else {
        return false;
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

let damage: number;
/**
 * 選択されたMOBの防御率に対してどれだけダメージが通るか
 * 
 * @param selectMonster 
 */
const damageCalc = (mobGuard: number): number => {
    let coreIgnore = 0;

    // プレッシャーにチェックが入っている場合は防御率減少
    mobGuard = mobGuard - IgnoreGuardCalc.pressure(pressure, pressureEnhance, enhanceLabel);
    if (mobGuard < 0) {
        // マイナスになってしまう場合は0
        mobGuard = 0;
    }

    // 強化コアの追加効果反映にチェック
    if (coreUpgrade.checked === true) {
        coreIgnore = 0.2;
    }

    // 防御率無視の計算式
    // 通るダメージ(％)＝1－敵の防御率×(1－防御率無視)
    let ignoreAll: number[] = [Number(ignore.value) / 100, coreIgnore];

    // 想定率無視をダメージに反映する場合
    if (damageReflect.checked === true) {
        ignoreAll.push(Number(addIgnoreIf.value) / 100);
    }

    damage = 1 - mobGuard * (1 - IgnoreGuardCalc.main(ignoreAll));

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


/**
 * 入力可能な範囲を指定する
 * 
 * @param value 現時点での値
 * @param min 最低値
 * @param max 最大値
 */
const rangeControl = (value: number, min: number, max: number):number =>{
    if (value > max) {
        return  max;
    }
    if (value < min) {
        return min;
    }
    return value;
}


// 計算結果を出力
const viewAll = () => {
    if (damageReflect.checked === true) {
        viewDamage.classList.add('red');
    } else {
        viewDamage.classList.remove('red');
    }

    // 入力可能な範囲を0-100に
    const inputList = [ignore, addIgnoreIf];
    inputList.forEach(element => {
        element.value = rangeControl(Number(element.value), 0, 100).toString();
    });

    viewDamage.textContent = damageCalc(Number(selectMonster.value)).toString();
    ignoreGuardIf.textContent = IgnoreGuardCalc.addIf(Number(addIgnoreIf.value), Number(ignore.value)).toString();
};
viewAll();