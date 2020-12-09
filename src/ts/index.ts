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
// const damageReflect: HTMLInputElement = <HTMLInputElement>document.getElementById('js-damage-reflect');

const elementList = [ignore, selectMonster, pressure, pressureEnhance, coreUpgrade, addIgnoreIf];
elementList.forEach(element => {
    element.addEventListener('change', () => {
        calc(selectMonster);
        addIgnoreGuard(Number(addIgnoreIf.value), Number(ignore.value));
    })
});


// クッキーのリスト checkbox
const cookiesList: { name: string, input: HTMLInputElement }[] = [
    { name: "coreUpgrade", input: coreUpgrade },
    { name: "pressure", input: pressure },
    { name: "pressureEnhunce", input: pressureEnhance },
    // { name: "damageReclect", input: damageReflect }
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
    let ignore: number = 1;

    if (pressure.checked === true) {

        if (enhance === true) {
            ignore = 1 - 0.5;
        } else {
            ignore = 1 - 0.3;
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
const calc = (selectMonster) => {
    let damage: number;
    let pressureIgnore = 1;
    let coreIgnore = 1;
    let mobGuard: number = Number(selectMonster.value);

    // 防御率無視が100を超過
    let ignoreGuard: number = Number(ignore.value)
    if (ignoreGuard > 100) {
        ignoreGuard = 100;
        return;
    }
    // モブが選択されていない
    if (selectMonster.value == "") {
        return;
    }

    // 防御率無視の計算式
    // 通るダメージ(％)＝1－敵の防御率×(1－防御率無視)

    pressureIgnore = pressureCalc(pressureEnhance.checked)

    if (coreUpgrade.checked === true) {
        coreIgnore = 1 - 0.2;
    }

    damage = 1 - mobGuard * (1 - (ignoreGuard / 100)) * pressureIgnore * coreIgnore;




    // 計算結果がマイナス
    if (damage * 100 < 0) {
        damage = 0;
    }

    // クッキーの再セット
    Cookies.set('ignore', ignore.value, { expires: 7 });
    cookiesList.forEach(element => {
        Cookies.set(element['name'], element['input'].checked, { expires: 7 });
    });


    // 計算結果を出力
    damage = Math.ceil(damage * 100);
    viewDamage.textContent = damage.toString();
}


/**
 * もし防御率無視が増えたらいくつになるか、という想定で計算できる関数
 * 
 * @param add 増える率無視
 * @param now 現在の率無視
 */
const addIgnoreGuard = (add: number, now: number) => {
    let result = 1 - (1 - (now / 100)) * (1 - (add / 100));

    result = Math.ceil(result * 100)
    ignoreGuardIf.textContent = result.toString();
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

calc(selectMonster);
addIgnoreGuard(Number(addIgnoreIf.value), Number(ignore.value));
