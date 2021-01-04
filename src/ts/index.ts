"use strict";

// import * as model from './modules/indexModel'
const model = require('./modules/indexModel.ts')


const viewDamage: HTMLElement = <HTMLElement>document.getElementById('js-damage');
const copyUrl: HTMLElement = <HTMLElement>document.getElementById('js-copy-url')
const ignoreGuardIf: HTMLElement = <HTMLElement>document.getElementById('ignore-guard-if')
const enhanceLabel: HTMLElement = <HTMLElement>document.getElementById('pressure-enhance-label');

const selectMob: HTMLInputElement = <HTMLInputElement>document.getElementById('js-monster');
const ignoreGuard: HTMLInputElement = <HTMLInputElement>document.getElementById('js-my-ignore-guard');
const coreUpgrade: HTMLInputElement = <HTMLInputElement>document.getElementById('js-core-upgrade')
const pressure: HTMLInputElement = <HTMLInputElement>document.getElementById('js-pressure')
const pressureEnhance: HTMLInputElement = <HTMLInputElement>document.getElementById('js-pressure-enhance')
const addIgnoreIf: HTMLInputElement = <HTMLInputElement>document.getElementById('add-ignore-if');
const damageReflect: HTMLInputElement = <HTMLInputElement>document.getElementById('js-damage-reflect');

// クッキーのリスト checkbox
const cookiesList: { name: string, input: HTMLInputElement }[] = [
    { name: "coreUpgrade", input: coreUpgrade },
    { name: "pressure", input: pressure },
    { name: "pressureEnhunce", input: pressureEnhance },
    { name: "damageReflect", input: damageReflect }
];

// チェックボックス以外の要素もふくめて定義
const elementList: HTMLInputElement[] = [
    ignoreGuard, selectMob, pressure, pressureEnhance, coreUpgrade, addIgnoreIf, damageReflect
];


model.initCookies(cookiesList, ignoreGuard);

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

// 計算結果を出力
const viewAll = (): void => {
    if (damageReflect.checked === true) {
        viewDamage.classList.add('red');
    } else {
        viewDamage.classList.remove('red');
    }

    model.resetCookies(cookiesList, ignoreGuard);

    // 入力可能な範囲を0-100に
    const inputList = [ignoreGuard, addIgnoreIf];
    inputList.forEach(element => {
        element.value = model.rangeControl(Number(element.value), 0, 100).toString();
    });

    // 百分率の入力値を取得して小数に
    const ignoreGuardVal: number = Number(ignoreGuard.value) / 100;
    const addIgnoreIfVal: number = Number(addIgnoreIf.value) / 100;

    // 取得した値をもとに防御率無視の合計を計算
    const ignoreAll: number[] = model.ignoreAllCalc(ignoreGuardVal, coreUpgrade.checked, damageReflect.checked, addIgnoreIfVal);
    const ignoreGuardAllVal: number = model.ignoreGuardCalc(ignoreAll);

    // プレッシャーによる防御率減少を計算
    const pressureResult: number = model.pressureCalc(pressure, pressureEnhance, enhanceLabel);

    // MOBの防御率の型変換
    const mobGuard:number = Number(selectMob.value);

    viewDamage.textContent = model.damageCalc(mobGuard, ignoreGuardAllVal, pressureResult).toString();

    // 小数で取得後、切り捨てしてパーセントに変換
    ignoreGuardIf.textContent = Math.floor(
        (model.addIf(addIgnoreIfVal, ignoreGuardVal)) * 100)
        .toString();
};



elementList.forEach(element => {
    element.addEventListener('change', () => {
        viewAll();
    })
});

viewAll();



// tests
console.log('/** tests **/');
console.log('--- ignoreGuardCalc:');
console.log(model.ignoreGuardCalc([0.3, 0.3, 0.3, 0.3, 0.3, 0.3]));
console.log('--- addIf:');
console.log(model.addIf(0.89, 0.30));
console.log('--- pressureCalc:');
console.log(model.pressureCalc(pressure, pressureEnhance, enhanceLabel));
console.log('--- toBoolean:');
console.log(model.toBoolean("true"));
console.log(model.toBoolean("false"));
console.log(model.toBoolean("abc"));
console.log('--- getCookie:');
console.log(model.getCookie('hoge', "100"));
console.log(model.getCookie('ignore', "100"));
console.log('--- rangeControl:');
console.log(model.rangeControl(5, 0, 100));
console.log(model.rangeControl(-5, 0, 100));
console.log(model.rangeControl(150, 0, 100));
console.log('--- ignoreAllCalc:');
console.log(model.ignoreAllCalc(0.89, false, false, 0.3));
console.log(model.ignoreAllCalc(0.89, false, true, undefined));
console.log(model.ignoreAllCalc(0.89, true, true, 0.3));
console.log(model.ignoreAllCalc(0.89, true, false, 0.3));
console.log('--- damageCalc:');
console.log(model.damageCalc(3, 0.89, 0.5));




