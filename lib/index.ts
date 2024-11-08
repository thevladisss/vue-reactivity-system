type Effect = WatchEffect<any> | ComputedEffect<any>;

const currentEffectStack:Effect[]  = []

export type Ref<T> = {
  value: T
  _effects: Map<any, any>
}

export function ref<T>(value: T): Ref<T> {

  const _target = <Ref<T>>{
    value,
    _effects: new Map()
  }

  return new Proxy(_target, {
    get: (target, p: string | symbol, receiver: any) => {

      return Reflect.get(target, p, receiver)
    },
    set(target, p: string | symbol, newValue: any, receiver: any): boolean {

      //Running them
      target._effects.forEach((effect) => {
        effect(newValue)
      })

      Reflect.set(target, p, newValue, receiver)

      return true;
    }
  })
}


export type ComputedRef<T> = {
  value: T
  _effects: Map<any, any>
}


export type ComputedEffect<T> = () => T;
export function computed<T>(getter: ComputedEffect<T>) {

  const effect = () => {
    currentEffectStack.push(effect)
    const value = getter();
    currentEffectStack.pop()
    return value;
  }

  return effect()
}

export interface WatchEffect<T> {
  (newValue?: T): void;
  (oldValue: T, newValue: T): void;
}

export type WatchOptions = {
  deep?: boolean;
  immediate?: boolean
}
export function watch<T>(source: Ref<T> | ComputedRef<T>, callback: WatchEffect<T>, options?: WatchOptions) {
    source._effects.set('1', (newValue: T) => {
      callback(newValue)
    })
}
