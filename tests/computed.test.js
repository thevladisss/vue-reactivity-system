const {ref, computed} = require("../src")
// const assert = require('node:assert');
// const {describe, it} = require('node:test');
const {it, describe, expect, jest} = require("@jest/globals")


describe('computed', () => {
  it('computed re-runs effect upon reactive dependency change', () => {

    const counter = ref(0)

    const effect = jest.fn(() => {
      return counter.value
    })

   computed(effect);

    counter.value = 1;

    expect(effect).toHaveBeenCalledTimes(2)
  })
})
