import {computed, ref, watch} from "./lib";

const counter = ref(0)

watch(counter, (newValue) => {
  console.log(`Changed value to ${newValue}`)
})

