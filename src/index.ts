type Effect = WatchEffect<any> | ComputedEffect<any>;

const currentEffectStack:Effect[]  = []

export type Ref<T> = {
  value: T
  effects: Map<any, any>
}

export function ref<T>(value: T): Ref<T> {

  const _target = <Ref<T>>{
    value,
    effects: new Map()
  }

  return new Proxy(_target, {
    get: (target, p: string | symbol, receiver: any) => {

      //Getting active the effects and subscribing for them

      currentEffectStack.forEach((effect) => {
        target.effects.set(effect, effect)
      })

      return Reflect.get(target, p, receiver)
    },
    set(target, p: string | symbol, newValue: any, receiver: any): boolean {

      Reflect.set(target, p, newValue, receiver)

      //Running them, after setting the value so reactive dependencies like computed
      //get updated value
      target.effects.forEach((effect) => {
        effect(newValue)
      })

      return true;
    }
  })
}


export type ComputedRef<T> = {
  value: T
  effects: Map<any, any>
}


export type ComputedEffect<T> = () => T;
export function computed<T>(getter: ComputedEffect<T>) {

  const effect = () => {
    currentEffectStack.push(effect)
    const value = getter();
    currentEffectStack.pop()
    return value;
  }


  return {
    get value() {
      const effectResult = effect();

      return effectResult;
    },
    set value(value) {
      throw new Error("Computed property is read-only")
    }
  }
}

export type WatchEffect<T> = () => T;

export function watchEffect<T>(callback: WatchEffect<T>){

  // let unwatch: () => void | null = null;
  const effect = () => {
    currentEffectStack.push(effect)
    const value = callback();
    currentEffectStack.pop()
    return value;
  }

  //TODO: Should be able to release effect
}

export interface WatcherEffect<T> {
  (newValue?: T): void;
  (oldValue: T, newValue: T): void;
}

export type WatchOptions = {
  deep?: boolean;
  immediate?: boolean
}
export function watch<T>(source: Ref<T> | ComputedRef<T>, callback: WatcherEffect<T>, options?: WatchOptions) {

  const effect = (newValue: T) => {
    callback(newValue)
  }
    source.effects.set(effect, effect)
}
