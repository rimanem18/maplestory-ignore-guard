"use strict";

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


const elementList = [ignoreGuard, selectMob, pressure, pressureEnhance, coreUpgrade, addIgnoreIf, damageReflect];

// クッキーのイニシャライズ
const CookiesInit = () => {
    ignoreGuard.value = model.getCookie('ignore', "100");
    cookiesList.forEach(element => {
        element['input'].checked = model.toBoolean(<string>model.getCookie(element['name'], "false"));
    });
}


CookiesInit();

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

    model.resetCookies(cookiesList, elementList);
    

    // 入力可能な範囲を0-100に
    const inputList = [ignoreGuard, addIgnoreIf];
    inputList.forEach(element => {
        element.value = model.rangeControl(Number(element.value), 0, 100).toString();
    });

    viewDamage.textContent = model.damageCalc(Number(selectMob.value), elementList).toString();
    ignoreGuardIf.textContent = model.addIf(Number(addIgnoreIf.value), Number(ignoreGuard.value)).toString();
};



elementList.forEach(element => {
    element.addEventListener('change', () => {
        viewAll();
    })
});

viewAll();