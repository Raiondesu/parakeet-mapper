import { Converter } from './util';

export type StripPromises<O> = O[keyof O] extends Promise<any> ? {
  [key in keyof O]:
    | O[key] extends Promise<infer OK>
      ? OK
    : O[key] extends Array<Promise<infer OK>>
      ? Array<OK>
    : O[key];
} : O;

export type FlattenPromises<T> = T[keyof T] extends Promise<any> ? Promise<StripPromises<T>> : T;

const isPromise = (v: any): v is Promise<any> => v instanceof Promise;
const isPromiseArr = (v: any): v is Promise<any>[] => Array.isArray(v) && v.some(isPromise);

export function flattenPromises<T>(obj: T): FlattenPromises<T> {
  const promises: Promise<void>[] = [];

  for (const key in obj) {
    const value = obj[key];
    const resolve = (
      promise: Promise<any>
    ) => promise.then(res => {
      obj[key] = res;
    });

    if (isPromise(value)) {
      promises.push(resolve(value));
    } else if (isPromiseArr(value)) {
      promises.push(resolve(Promise.all(value)));
    }
  }

  if (promises.length === 0) {
    return obj as FlattenPromises<T>;
  }

  return Promise.all(promises)
    .then(_ => obj) as FlattenPromises<T>;
}

export function wait<I, O>(convert: Converter<I, O>): Converter<I, FlattenPromises<O>> {
  return input => flattenPromises(convert(input));
}
