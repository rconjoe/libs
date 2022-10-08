/**
 * @tsplus fluent ets/Array forEachPar
 * @tsplus fluent ets/Chunk forEachPar
 * @tsplus fluent ets/Set forEachPar
 */
export function ext_forEachPar<A, R, E, B>(
  as: Iterable<A>,
  f: (a: A) => Effect<R, E, B>
) {
  return Effect.forEachPar(Collection(...as), f)
}

/**
 * @tsplus fluent ets/Array forEachEffect
 * @tsplus fluent ets/Chunk forEachEffect
 * @tsplus fluent ets/Set forEachEffect
 */
export function ext_forEach<A, R, E, B>(as: Iterable<A>, f: (a: A) => Effect<R, E, B>) {
  return Effect.forEach(Collection(...as), f)
}

/**
 * @tsplus fluent ets/Array collectAll
 * @tsplus fluent ets/Chunk collectAll
 * @tsplus fluent ets/Set collectAll
 */
export function ext_collectAll<A, R, E>(as: Iterable<Effect<R, E, A>>) {
  return Effect.collectAll(Collection(...as))
}

// /**
//  * @tsplus fluent ets/Array forEachSync
//  * @tsplus fluent ets/Chunk forEachSync
//  * @tsplus fluent ets/Set forEachSync
//  */
// export const ext_forEachSync_ = forEachSync_

// /**
//  * @tsplus fluent ets/Array collectAllSync
//  * @tsplus fluent ets/Chunk collectAllSync
//  * @tsplus fluent ets/Set collectAllSync
//  */
// export const ext_collectAllSync = collectAllSync

/**
 * @tsplus fluent ets/Array toChunk
 * @tsplus fluent ets/Set toChunk
 */
export const ext_from = Chunk.from
