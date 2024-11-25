const {ref, computed} = require("../dist")
const {it, describe, expect, jest} = require("@jest/globals")


describe('computed', () => {

  it('computed property returns updated computed value', async () => {

    const counter = ref(0)

    const counterPlusOne = computed(() => {
      return counter.value + 1;
    });

    expect(counterPlusOne.value).toStrictEqual(1)

    counter.value = 1;

    expect(counterPlusOne.value).toStrictEqual(2)
  })

  it('computed re-runs effect upon reactive dependency change', () => {

    const counter = ref(0)

    const effect = jest.fn(() => {
      return counter.value
    })

   const computedRef =computed(effect);

    computedRef.value

    counter.value = 1;

    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('cannot write to computed property', () => {

    const initial = 1;

    const computedRef = computed(() => {
      return initial;
    })

    expect(() => {
      computedRef.value = 2;
    }).toThrowError()

    expect(computedRef.value).toStrictEqual(initial)
  })


  it.todo('can be tracked as reactive dependency')
})
