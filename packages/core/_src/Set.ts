// ets_tracing: off

import "../../../Operator/index.js"

import { not } from "@fp-ts/data/Predicate"
import { identity } from "./Function.js"

export type MutableSet<A> = globalThis.Set<A>
export type Set<A> = ReadonlySet<A>

export const empty: Set<never> = new Set()

/**
 * The set of elements which are in both the first and second set
 */
export function intersection_<A>(E: Equivalence<A>): (l: Set<A>, r: Set<A>) => Set<A> {
  const elemE = elem_(E)
  return (x, y) => {
    if (x === empty || y === empty) {
      return empty
    }
    const r = new Set<A>()
    x.forEach(e => {
      if (elemE(y, e)) {
        r.add(e)
      }
    })
    return r
  }
}

/**
 * The set of elements which are in both the first and second set
 */
export function intersection<A>(E: Equivalence<A>): (r: Set<A>) => (l: Set<A>) => Set<A> {
  const i = intersection_(E)
  return x => y => i(x, y)
}

/**
 * Convert a mutable set to a readonly one
 */
export function fromMutable<A>(s: MutableSet<A>): Set<A> {
  return new Set(s)
}

/**
 * Convert a set to a mutable one
 */
export function toMutable<A>(s: Set<A>): MutableSet<A> {
  return new Set(s)
}

// /**
//  * get Show for set given Show for values
//  */
// export function getShow<A>(S: Show<A>): Show<Set<A>> {
//   return {
//     show: (s) => {
//       let elements = ""
//       s.forEach((a) => {
//         elements += S.show(a) + ", "
//       })
//       if (elements !== "") {
//         elements = elements.substring(0, elements.length - 2)
//       }
//       return `new Set([${elements}])`
//     }
//   }
// }

/**
 * Convert a set to an Array
 */
export function toArray<A>(O: Order<A>): (set: Set<A>) => ReadonlyArray<A> {
  return x => {
    const r: Array<A> = []
    x.forEach(e => r.push(e))
    return r.sort((a, b) => O.compare(b)(a))
  }
}

/**
 * Convert a set to an Array
 */
export function toArray_<A>(x: Set<A>, O: Order<A>): ReadonlyArray<A> {
  return toArray(O)(x)
}

// /**
//  * Get Equivalence for Setgiven Equivalence for element
//  */
// export function getEquivalence<A>(E: Equivalence<A>): Equivalence<Set<A>> {
//   const subsetE = isSubset_(E)
//   return makeEquivalence((x, y) => subsetE(x, y) && subsetE(y, x))
// }

interface Next<A> {
  readonly done?: boolean
  readonly value: A
}

/**
 * true if one or more elements match predicate
 */
export function some<A>(predicate: Predicate<A>): (set: Set<A>) => boolean {
  return set => {
    const values = set.values()
    let e: Next<A>
    let found = false
    while (!found && !(e = values.next()).done) {
      found = predicate(e.value)
    }
    return found
  }
}

/**
 * true if one or more elements match predicate
 */
export function some_<A>(set: Set<A>, predicate: Predicate<A>): boolean {
  return some(predicate)(set)
}

/**
 * Projects a Set through a function
 */
export function map<B>(E: Equivalence<B>): <A>(f: (x: A) => B) => (set: Set<A>) => Set<B> {
  const m = map_(E)
  return f => set => m(set, f)
}

/**
 * Projects a Set through a function
 */
export function map_<B>(E: Equivalence<B>): <A>(set: Set<A>, f: (x: A) => B) => Set<B> {
  const elemE = elem_(E)
  return (set, f) => {
    const r = new Set<B>()
    set.forEach(e => {
      const v = f(e)
      if (!elemE(r, v)) {
        r.add(v)
      }
    })
    return r
  }
}

/**
 * true if all elements match predicate
 */
export function every<A>(predicate: Predicate<A>): (set: Set<A>) => boolean {
  return set => every_(set, predicate)
}

/**
 * true if all elements match predicate
 */
export function every_<A>(set: Set<A>, predicate: Predicate<A>): boolean {
  return not(some(not(predicate)))(set)
}

/**
 * Map + Flatten
 */
export function chain<B>(
  E: Equivalence<B>
): <A>(f: (x: A) => Set<B>) => (set: Set<A>) => Set<B> {
  const c = chain_(E)
  return f => set => c(set, f)
}

/**
 * Map + Flatten
 */
export function chain_<B>(
  E: Equivalence<B>
): <A>(set: Set<A>, f: (x: A) => Set<B>) => Set<B> {
  const elemE = elem_(E)
  return (set, f) => {
    const r = new Set<B>()
    set.forEach(e => {
      f(e).forEach(e => {
        if (!elemE(r, e)) {
          r.add(e)
        }
      })
    })
    return r
  }
}

/**
 * `true` if and only if every element in the first set is an element of the second set
 */
export function isSubset<A>(E: Equivalence<A>): (y: Set<A>) => (x: Set<A>) => boolean {
  const i = isSubset_(E)
  return y => x => i(y, x)
}

/**
 * `true` if and only if every element in the first set is an element of the second set
 */
export function isSubset_<A>(E: Equivalence<A>): (x: Set<A>, y: Set<A>) => boolean {
  const elemE = elem_(E)
  return (x, y) => every((a: A) => elemE(y, a))(x)
}

/**
 * Filter set values using predicate
 */
export function filter<A, B extends A>(
  refinement: Refinement<A, B>
): (set: Set<A>) => Set<B>
export function filter<A>(predicate: Predicate<A>): (set: Set<A>) => Set<A>
export function filter<A>(predicate: Predicate<A>): (set: Set<A>) => Set<A> {
  return set => filter_(set, predicate)
}

/**
 * Filter set values using predicate
 */
export function filter_<A, B extends A>(
  set: Set<A>,
  refinement: Refinement<A, B>
): Set<B>
export function filter_<A>(set: Set<A>, predicate: Predicate<A>): Set<A>
export function filter_<A>(set: Set<A>, predicate: Predicate<A>): Set<A> {
  const values = set.values()
  let e: Next<A>
  const r = new Set<A>()
  while (!(e = values.next()).done) {
    const value = e.value
    if (predicate(value)) {
      r.add(value)
    }
  }
  return r
}

/**
 * Partition set values using predicate
 */
export function partition<A, B extends A>(
  refinement: Refinement<A, B>
): (set: Set<A>) => readonly [Set<A>, Set<B>]
export function partition<A>(
  predicate: Predicate<A>
): (set: Set<A>) => readonly [Set<A>, Set<A>]
export function partition<A>(
  predicate: Predicate<A>
): (set: Set<A>) => readonly [Set<A>, Set<A>] {
  return set => partition_(set, predicate)
}

/**
 * Partition set values using predicate
 */
export function partition_<A, B extends A>(
  set: Set<A>,
  refinement: Refinement<A, B>
): readonly [Set<A>, Set<B>]
export function partition_<A>(
  set: Set<A>,
  predicate: Predicate<A>
): readonly [Set<A>, Set<A>]
export function partition_<A>(
  set: Set<A>,
  predicate: Predicate<A>
): readonly [Set<A>, Set<A>] {
  const values = set.values()
  let e: Next<A>
  const right = new Set<A>()
  const left = new Set<A>()
  while (!(e = values.next()).done) {
    const value = e.value
    if (predicate(value)) {
      right.add(value)
    } else {
      left.add(value)
    }
  }
  return tuple(left, right)
}

/**
 * Test if a value is a member of a set
 */
export function elem_<A>(E: Equivalence<A>): (set: Set<A>, a: A) => boolean {
  return (set, a) => {
    const values = set.values()
    let e: Next<A>
    let found = false
    while (!found && !(e = values.next()).done) {
      found = E(e.value)(a)
    }
    return found
  }
}

/**
 * Test if a value is a member of a set
 */
export function elem<A>(E: Equivalence<A>): (a: A) => (set: Set<A>) => boolean {
  const e = elem_(E)
  return a => set => e(set, a)
}

/**
 * Partition elements according to f
 */
export function partitionMap<B, C>(
  EB: Equivalence<B>,
  EC: Equivalence<C>
): <A>(f: (a: A) => Either<B, C>) => (set: Set<A>) => readonly [Set<B>, Set<C>] {
  const pm = partitionMap_(EB, EC)
  return <A>(f: (a: A) => Either<B, C>) => (set: Set<A>) => pm(set, f)
}

/**
 * Partition elements according to f
 */
export function partitionMap_<B, C>(
  EB: Equivalence<B>,
  EC: Equivalence<C>
): <A>(set: Set<A>, f: (a: A) => Either<B, C>) => readonly [Set<B>, Set<C>] {
  return <A>(set: Set<A>, f: (a: A) => Either<B, C>) => {
    const values = set.values()
    let e: Next<A>
    const left = new Set<B>()
    const right = new Set<C>()
    const hasB = elem_(EB)
    const hasC = elem_(EC)
    while (!(e = values.next()).done) {
      const v = f(e.value)
      switch (v._tag) {
        case "Left":
          if (!hasB(left, v.left)) {
            left.add(v.left)
          }
          break
        case "Right":
          if (!hasC(right, v.right)) {
            right.add(v.right)
          }
          break
      }
    }
    return tuple(left, right)
  }
}

/**
 * Form the set difference (`x` - `y`)
 */
export function difference_<A>(E: Equivalence<A>): (l: Set<A>, r: Set<A>) => Set<A> {
  const elemE = elem_(E)
  return (x, y) => filter((a: A) => !elemE(y, a))(x)
}

/**
 * Form the set difference (`x` - `y`)
 */
export function difference<A>(E: Equivalence<A>): (y: Set<A>) => (x: Set<A>) => Set<A> {
  const diff = difference_(E)
  return y => x => diff(x, y)
}

/**
 * Reduce over the set values
 */
export function reduce<A>(
  O: Order<A>
): <B>(b: B, f: (b: B, a: A) => B) => (fa: Set<A>) => B {
  const red = reduce_(O)
  return (b, f) => fa => red(fa, b, f)
}

/**
 * Reduce over the set values
 */
export function reduce_<A>(
  O: Order<A>
): <B>(fa: Set<A>, b: B, f: (b: B, a: A) => B) => B {
  const toArrayO = toArray(O)
  return (fa, b, f) => toArrayO(fa).reduce(f, b)
}

// /**
//  * Fold + Map
//  */
// export function foldMap<A, M>(
//   O: Order<A>,
//   M: Identity<M>
// ): (f: (a: A) => M) => (fa: Set<A>) => M {
//   const fm = foldMap_(O, M)
//   return (f) => (fa) => fm(fa, f)
// }

// /**
//  * Fold + Map
//  */
// export function foldMap_<A, M>(
//   O: Order<A>,
//   M: Identity<M>
// ): (fa: Set<A>, f: (a: A) => M) => M {
//   const toArrayO = toArray(O)
//   return (fa, f) => toArrayO(fa).reduce((b, a) => M.combine(b, f(a)), M.identity)
// }

/**
 * Create a set with one element
 */
export function singleton<A>(a: A): Set<A> {
  return new Set([a])
}

/**
 * Insert a value into a set
 */
export function insert<A>(E: Equivalence<A>): (a: A) => (set: Set<A>) => Set<A> {
  const i = insert_(E)
  return a => set => i(set, a)
}

/**
 * Insert a value into a set
 */
export function insert_<A>(E: Equivalence<A>): (set: Set<A>, a: A) => Set<A> {
  const elemE = elem_(E)
  return (set, a) => {
    if (!elemE(set, a)) {
      const r = new Set(set)
      r.add(a)
      return r
    } else {
      return set
    }
  }
}

/**
 * Delete a value from a set
 */
export function remove<A>(E: Equivalence<A>): (a: A) => (set: Set<A>) => Set<A> {
  const rem = remove_(E)
  return a => set => rem(set, a)
}

/**
 * Delete a value from a set
 */
export function remove_<A>(E: Equivalence<A>): (set: Set<A>, a: A) => Set<A> {
  return (set, a) => filter((ax: A) => !E(ax)(a))(set)
}

/**
 * If element is present remove it, if not add it
 */
export function toggle<A>(E: Equivalence<A>): (a: A) => (set: Set<A>) => Set<A> {
  const t = toggle_(E)
  return a => set => t(set, a)
}

/**
 * If element is present remove it, if not add it
 */
export function toggle_<A>(E: Equivalence<A>): (set: Set<A>, a: A) => Set<A> {
  const elemE = elem_(E)
  const removeE = remove(E)
  const insertE = insert(E)
  return (set, a) => (elemE(set, a) ? removeE : insertE)(a)(set)
}

/**
 * Create a set from an array
 */
export function fromArray<A>(E: Equivalence<A>): (as: ReadonlyArray<A>) => Set<A> {
  return as => {
    const len = as.length
    const r = new Set<A>()
    const has = elem_(E)
    for (let i = 0; i < len; i++) {
      const a = as[i]!
      if (!has(r, a)) {
        r.add(a)
      }
    }
    return r
  }
}

/**
 * Set compaction, remove none
 */
export function compact<A>(E: Equivalence<A>): (fa: Set<Opt<A>>) => Set<A> {
  return filterMap(E)(identity)
}

/**
 * Separate elements
 */
export function separate<E, A>(
  EE: Equivalence<E>,
  EA: Equivalence<A>
): (fa: Set<Either<E, A>>) => readonly [Set<E>, Set<A>] {
  return fa => {
    const elemEE = elem_(EE)
    const elemEA = elem_(EA)
    const left: MutableSet<E> = new Set()
    const right: MutableSet<A> = new Set()
    fa.forEach(e => {
      switch (e._tag) {
        case "Left":
          if (!elemEE(left, e.left)) {
            left.add(e.left)
          }
          break
        case "Right":
          if (!elemEA(right, e.right)) {
            right.add(e.right)
          }
          break
      }
    })
    return tuple(left, right)
  }
}

/**
 * Filter + Map
 */
export function filterMap<B>(
  E: Equivalence<B>
): <A>(f: (a: A) => Opt<B>) => (fa: Set<A>) => Set<B> {
  const fm = filterMap_(E)
  return f => fa => fm(fa, f)
}

/**
 * Filter + Map
 */
export function filterMap_<B>(
  E: Equivalence<B>
): <A>(fa: Set<A>, f: (a: A) => Opt<B>) => Set<B> {
  const elemE = elem_(E)
  return (fa, f) => {
    const r: MutableSet<B> = new Set()
    fa.forEach(a => {
      const ob = f(a)
      if (ob._tag === "Some" && !elemE(r, ob.value)) {
        r.add(ob.value)
      }
    })
    return r
  }
}

/**
 * Form the union of two sets
 */
export function union_<A>(E: Equivalence<A>): (set: Set<A>, y: Set<A>) => Set<A> {
  const elemE = elem_(E)
  return (x, y) => {
    if (x === empty) {
      return y
    }
    if (y === empty) {
      return x
    }
    const r = new Set(x)
    y.forEach(e => {
      if (!elemE(r, e)) {
        r.add(e)
      }
    })
    return r
  }
}

/**
 * Form the union of two sets
 */
export function union<A>(E: Equivalence<A>): (y: Set<A>) => (set: Set<A>) => Set<A> {
  const u = union_(E)
  return y => x => u(x, y)
}

function make_<A>(ord: Order<A>, eq_?: Equivalence<A>) {
  const eq = eq_ ?? (y => x => ord.compare(y)(x) === 0)

  const fromArray_ = fromArray(eq)
  const concat_ = (set: Set<A>, it: Iterable<A>) => fromArray_([...set, ...it])
  const insert__ = insert(eq)

  function replace_(set: Set<A>, a: A) {
    return filter_(set, x => !eq(a)(x)) >= insert__(a)
  }

  return {
    insert: insert__,
    insert_: insert_(eq),
    remove: remove(eq),
    remove_: remove_(eq),
    reduce: reduce(ord),
    reduce_: reduce_(ord),
    replace: (a: A) => (set: Set<A>) => replace_(set, a),
    replace_,
    toArray: toArray(ord),
    fromArray,
    from: (it: Iterable<A>) => fromArray_([...it]),
    empty: () => new Set<A>(),
    concat_,
    concat: (it: Iterable<A>) => (set: Set<A>) => concat_(set, it),

    // A and B the same, useful when editing elements.
    map: map(eq),
    map_: map_(eq),
    filterMap: filterMap(eq),
    filterMap_: filterMap_(eq)
  }
  // TODO: extend
}

class Wrapper<A> {
  wrapped(ord: Order<A>, eq: Equivalence<A>) {
    return make_(ord, eq)
  }
}

export interface SetSchemaExtensions<A> extends ReturnType<Wrapper<A>["wrapped"]> {}

export const make: <A>(
  ord: Order<A>,
  eq?: Equivalence<A>
) => SetSchemaExtensions<A> = make_
