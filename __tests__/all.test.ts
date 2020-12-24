import * as model from '../src/ts/modules/indexModel'

test('ignoreCalc', ()=> {
    expect(model.ignoreGuardCalc([0.3, 0.3, 0.3])).toBe(1 - (1 - 0.3) * (1 - 0.3) * (1 - 0.3));
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

test('rangeControl', ()=>{
    expect(model.damageCalc(3, 0.89, 0.5)).toBe(73);
});
