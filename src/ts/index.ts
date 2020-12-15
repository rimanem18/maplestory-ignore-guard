"use strict";

import { ignoreAllCalc } from "./modules/indexModel";

const model = require('./modules/indexModel.ts');


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

    const ignoreAll: number[] = model.ignoreAllCalc(ignoreGuard, coreUpgrade, damageReflect, addIgnoreIf);
    const ignoreGuardVal:number = model.ignoreGuardCalc(ignoreAll);

    // 入力可能な範囲を0-100に
    const inputList = [ignoreGuard, addIgnoreIf];
    inputList.forEach(element => {
        element.value = model.rangeControl(Number(element.value), 0, 100).toString();
    });

    const pressureResult: number = model.pressureCalc(pressure, pressureEnhance, enhanceLabel);

    viewDamage.textContent = model.damageCalc(Number(selectMob.value), ignoreGuardVal,pressure, pressureResult, coreUpgrade ).toString();
    ignoreGuardIf.textContent = model.addIf(Number(addIgnoreIf.value), Number(ignoreGuard.value)).toString();
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
console.log(model.ignoreGuardCalc([0.3,0.3,0.3,0.3,0.3,0.3]));
console.log('--- addIf:');
console.log(model.addIf(0.89,0.30));
console.log('--- pressureCalc:');
console.log(model.pressureCalc(pressure,pressureEnhance, enhanceLabel));
console.log('--- toBoolean:');
console.log(model.toBoolean("true"));
console.log(model.toBoolean("false"));
console.log(model.toBoolean("abc"));
console.log('--- getCookie:');
console.log(model.getCookie('hoge', "100"));
console.log(model.getCookie('ignore', "100"));
console.log('--- rangeControl:');
console.log(model.rangeControl(5,0,100));
console.log(model.rangeControl(-5,0,100));
console.log(model.rangeControl(150,0,100));
console.log('--- ignoreAllCalc:');
console.log(model.ignoreAllCalc(0.89, false, false, 0.3));
console.log(model.ignoreAllCalc(0.89, false, true, undefined));
console.log(model.ignoreAllCalc(0.89, true, true, 0.3));
console.log(model.ignoreAllCalc(0.89, true, false, 0.3));
console.log('--- damageCalc:');
console.log(model.damageCalc(3, 0.89, 0.5));




