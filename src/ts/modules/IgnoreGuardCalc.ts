"use strict";

/**
 * 渡された配列の中身をもとに防御率無視を計算する
 * 
 * @param array 単体の防御率無視の小数点配列
 * @return result 防御率無視
 */
export const main = (array: number[]): number => {
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
export const addIf = (add: number, now: number):number => {
    let result: number = main([now / 100, add / 100]);

    result = Math.ceil(result * 100)
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
export const pressure = (pressure: HTMLInputElement, enhance: HTMLInputElement, label: HTMLElement): number => {
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
