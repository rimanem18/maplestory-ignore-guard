"use strict";

const Cookies = require('js-cookie');

/**
 * 渡された配列の中身をもとに防御率無視を計算する
 * 
 * @param array 単体の防御率無視の小数点配列
 * @return result 防御率無視
 */
export const ignoreGuardCalc = (array: number[]): number => {
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
export const addIf = (add: number, now: number): number => {
    let result: number = ignoreGuardCalc([now, add]);
    return result;
}

/**
 * プレッシャーの計算
 * 
 * @param pressure プレッシャーのチェックボックス
 * @param enhance エンハンスのチェックボックス
 * @param label プレッシャーのラベル
 * @return プレッシャーによる減少値
 */
export const pressureCalc = (pressure: HTMLInputElement, enhance: HTMLInputElement, label: HTMLElement): number => {
    let result: number = 0;

    if (pressure.checked === true) {

        if (enhance.checked === true) {
            result = 0.5;
        } else {
            result = 0.3;
        }
        label.classList.remove('disabled');
        enhance.disabled = false;
    } else {
        label.classList.add('disabled');
        enhance.disabled = true;
    }

    return result;
}




/**
 * 文字列の真偽値を boolean 型に変換
 * 
 * @param strBool 文字列の true / false
 * @return true or false
 */
export const toBoolean = (strBool: string): boolean => {
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
export const getCookie = (name: string, defaultVal: string)
    : string => {
    let value = defaultVal;

    if (Cookies.get(name) !== undefined) {
        value = Cookies.get(name);
    }

    return value;
}


/**
 * 入力可能な範囲を指定する
 * 
 * @param value 現時点での値
 * @param min 最低値
 * @param max 最大値
 */
export const rangeControl = (value: number, min: number, max: number): number => {
    if (value > max) {
        return max;
    }
    if (value < min) {
        return min;
    }
    return value;
}

/**
 * 強化コア分や想定反映をふくめた最終率無視を計算、配列にして返す
 * 
 * @param ignoreGuard 防御率無視
 * @param coreUpgrade 強化コアのチェックボックス
 * @param damageReflect 想定反映するかどうか
 * @param addIgnoreIf 想定率無視
 */
export const ignoreAllCalc = (ignoreGuardVal:number, coreUpgradeBool:boolean, reflectBool:boolean, addIgnoreIfVal:number):number[] =>{
    let coreIgnore: number = 0;

    // 強化コアの追加効果反映にチェック
    if (coreUpgradeBool === true) {
        coreIgnore = 0.2;
    }

    // 防御率無視の計算式
    // 通るダメージ(％)＝1－敵の防御率×(1－防御率無視)
    let result: number[] = [ignoreGuardVal, coreIgnore];

    // 想定率無視をダメージに反映する場合
    if (reflectBool === true) {
        result.push(addIgnoreIfVal);
    }

    return result;
}


/**
 * 選択されたMOBの防御率に対してどれだけダメージが通るか
 * 
 * @param mobGuard 
 * @param ignoreGuardVal 
 * @param pressureResult 
 */
export const damageCalc = (mobGuard: number, ignoreGuardVal: number, pressureResult: number): number => {
    let damage: number;

    // プレッシャーにチェックが入っている場合は防御率減少
    mobGuard = mobGuard - pressureResult;
    if (mobGuard < 0) {
        // マイナスになってしまう場合は0
        mobGuard = 0;
    }

    // 与えられるダメージ
    damage = 1 - mobGuard * (1 - ignoreGuardVal);

    // 計算結果がマイナス
    if (damage * 100 < 0) {
        damage = 0;
    }

    // 計算結果を切り捨て返却
    damage = Math.floor(damage * 100);

    return damage;
}

/**
 * クッキーのイニシャライズ
 * 
 * @param cookiesList 
 * @param elementList 
 */
export const initCookies = (cookiesList : { name: string, input: HTMLInputElement }[], ignoreGuard) =>{
    ignoreGuard.value = getCookie('ignore', "100");
    cookiesList.forEach(element => {
        element.input.checked = toBoolean(<string>getCookie(element.name, "false"));
    });
}

/**
 * クッキーに値を再セット
 * 
 * @param CookiesList 
 * @param elementList 
 */
export const resetCookies = (cookiesList : { name: string, input: HTMLInputElement }[], ignoreGuard) =>{
    Cookies.set('ignore', ignoreGuard.value, { expires: 7 });
    cookiesList.forEach(element => {
        Cookies.set(element.name, element.input.checked, { expires: 7 });
    });
}

