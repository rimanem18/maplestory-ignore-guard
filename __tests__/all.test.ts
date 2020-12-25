import * as model from '../src/ts/modules/indexModel'

test('ignoreCalc', ()=> {
    expect(model.ignoreGuardCalc([0.3, 0.3, 0.3])).toBe(1 - (1 - 0.3) * (1 - 0.3) * (1 - 0.3));
});

test('pressureCalc', ()=>{
    document.body.innerHTML = '<div>'+
        '<label for="js-core-upgrade" id="core-upgrade-label">'+
            '<input type="checkbox" name="core-upgrade" id="js-core-upgrade"> 強化コアの防御率無視20%増加効果込み </label><br>'+
        '<label for="js-pressure" id="pressure-label">'+
            '<input type="checkbox" name="pressure" id="js-pressure"> プレッシャーのデバフ効果込み </label><br>'+
        '<label for="js-pressure-enhance" id="pressure-enhance-label">'+
            '<input type="checkbox" name="pressure-enhance" id="js-pressure-enhance"> ハイパースキル プレッシャー - エンハンス の効果込み </label><br><br>'+
    '</div>';

    const d = document;
    const pressure = <HTMLInputElement>d.getElementById('js-pressure');
    const enhance = <HTMLInputElement>d.getElementById('js-pressure-enhance');
    const label = d.getElementById('pressure-enhance-label');

    // 両方にチェックが入っている
    pressure.checked = true;
    enhance.checked = true;
    let be = 0.5;
    expect(model.pressureCalc(pressure, enhance, label)).toBe(be);

    // プレッシャーのみチェックが入っている
    pressure.checked = true;
    enhance.checked = false;
    be = 0.3;
    expect(model.pressureCalc(pressure, enhance, label)).toBe(be);

    // どちらにもチェックが入っていない
    pressure.checked = false;
    enhance.checked = false;
    be = 0.0;
    expect(model.pressureCalc(pressure, enhance, label)).toBe(be);

    // エンハンスのみチェックが入っている
    pressure.checked = false;
    enhance.checked = true;
    be = 0.0;
    expect(model.pressureCalc(pressure, enhance, label)).toBe(be);
});

test('addIf', ()=>{
    expect(model.addIf(0.89, 0.3)).toBe(model.ignoreGuardCalc([0.3, 0.89]));
});

test('toBoolean', ()=>{
    expect(model.toBoolean("true")).toBe(true);
    expect(model.toBoolean("false")).toBe(false);
    expect(model.toBoolean("abc")).toBe(false);
});

test('rangeControl', ()=>{
    expect(model.rangeControl(5, 0, 100)).toBe(5);
    expect(model.rangeControl(-12, 0, 100)).toBe(0);
    expect(model.rangeControl(155, 0, 100)).toBe(100);
});

test('ignoreAllCalc', ()=>{
    expect(model.ignoreAllCalc(0.89, false, false, 0.3))
    .toStrictEqual([0.89, 0]);
    expect(model.ignoreAllCalc(0.89, true, true, 0.3))
    .toStrictEqual([0.89, 0.2, 0.3]);
    expect(model.ignoreAllCalc(0.89, true, false, 0.3))
    .toStrictEqual([0.89, 0.2]);
});

test('damageCalc', ()=>{
    expect(model.damageCalc(3, 0.89, 0.5)).toBe(73);
});
