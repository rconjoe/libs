/* eslint-disable @typescript-eslint/no-unused-vars */
// ets_tracing: off
/* eslint-disable import/no-duplicates */
import type * as ARR from "@effect-ts/core/Collections/Immutable/Array"
import type * as CNK from "@effect-ts/core/Collections/Immutable/Chunk"
import type * as NA from "@effect-ts/core/Collections/Immutable/NonEmptyArray"
import type { Either } from "@effect-ts/core/Either"
import type * as Eq from "@effect-ts/core/Equal"
import type { Predicate, Refinement } from "@effect-ts/core/Function"
import type { Option } from "@effect-ts/core/Option"
import type * as Ord from "@effect-ts/core/Ord"
import type { Effect } from "@effect-ts-app/core/Effect"
import type { Sync } from "@effect-ts-app/core/Sync"

interface ArrayOps {
  /**
   * @ets_rewrite_method map_ from "@effect-ts/core/Collections/Immutable/NonEmptyArray"
   */
  mapRA<A, B>(this: NA.NonEmptyArray<A>, f: (a: A) => B): NA.NonEmptyArray<B>
  /**
   * @ets_rewrite_method map_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapRA<A, B>(this: readonly A[], f: (a: A) => B): readonly B[]

  /**
   * @ets_rewrite_method mapWithIndex_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapWithIndex<A, B>(
    this: NA.NonEmptyArray<A>,
    f: (idx: number, a: A) => B
  ): NA.NonEmptyArray<B>
  /**
   * @ets_rewrite_method mapWithIndex_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapWithIndex<A, B>(this: readonly A[], f: (idx: number, a: A) => B): readonly B[]

  /**
   * @ets_rewrite_method concat_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  concatRA<A, A1>(this: NA.NonEmptyArray<A>, y: readonly A1[]): NA.NonEmptyArray<A | A1>

  /**
   * @ets_rewrite_method concat_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  concatRA<A, A1>(this: readonly A[], y: NA.NonEmptyArray<A1>): NA.NonEmptyArray<A | A1>
  /**
   * @ets_rewrite_method concat_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  concatRA<A, A1>(this: readonly A[], y: readonly A1[]): readonly (A | A1)[]

  /**
   * @ets_rewrite_method sort_ from "@effect-ts-app/fluent/_ext/Array"
   */
  sortWith<A>(this: NA.NonEmptyArray<A>, o: Ord.Ord<A>): NA.NonEmptyArray<A>

  /**
   * @ets_rewrite_method sort_ from "@effect-ts-app/fluent/_ext/Array"
   */
  sortWith<A>(this: readonly A[], o: Ord.Ord<A>): readonly A[]

  /**
   * @ets_rewrite_method sortBy_ from "@effect-ts-app/fluent/_ext/Array"
   */
  sortBy<A>(this: NA.NonEmptyArray<A>, ords: readonly Ord.Ord<A>[]): NA.NonEmptyArray<A>
  /**
   * @ets_rewrite_method sortBy_ from "@effect-ts-app/fluent/_ext/Array"
   */
  sortBy<A>(this: readonly A[], ords: readonly Ord.Ord<A>[]): readonly A[]

  /**
   * @ets_rewrite_method append_ from "@effect-ts-app/core/Array"
   */
  append<AX>(this: NA.NonEmptyArray<AX>, end: AX): NA.NonEmptyArray<AX>

  /**
   * @ets_rewrite_method append_ from "@effect-ts-app/core/Array"
   */
  append<AX>(this: ARR.Array<AX>, end: AX): ARR.Array<AX>

  // replacement for mapM
  /**
   * @ets_rewrite_method mapEffect_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapEffect<AX, R, E, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Effect<R, E, B>
  ): Effect<R, E, NA.NonEmptyArray<B>>
  /**
   * @ets_rewrite_method mapEffect_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapEffect<AX, R, E, B>(
    this: ARR.Array<AX>,
    f: (a: AX) => Effect<R, E, B>
  ): Effect<R, E, readonly B[]>

  /**
   * @ets_rewrite_method mapSync_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapSync<AX, R, E, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Sync<R, E, B>
  ): Sync<R, E, NA.NonEmptyArray<B>>
  /**
   * @ets_rewrite_method mapSync_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapSync<AX, R, E, B>(
    this: ARR.Array<AX>,
    f: (a: AX) => Sync<R, E, B>
  ): Sync<R, E, readonly B[]>

  /**
   * @ets_rewrite_method mapEither_ from "@effect-ts/fluent/Fx/Array"
   */
  mapEither<AX, E, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Either<E, B>
  ): Either<E, NA.NonEmptyArray<B>>

  /**
   * @ets_rewrite_method mapEither_ from "@effect-ts/fluent/Fx/Array"
   */
  mapEither<AX, E, B>(
    this: ARR.Array<AX>,
    f: (a: AX) => Either<E, B>
  ): Either<E, ARR.Array<B>>

  /**
   * @ets_rewrite_method mapOption_ from "@effect-ts/fluent/Fx/Array"
   */
  mapOption<AX, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Option<B>
  ): Option<ARR.Array<B>>

  /**
   * @ets_rewrite_method mapOption_ from "@effect-ts/fluent/Fx/Array"
   */
  mapOption<AX, B>(this: ARR.Array<AX>, f: (a: AX) => Option<B>): Option<ARR.Array<B>>

  /**
   * @ets_rewrite_method mapEffect_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapM<AX, R, E, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Effect<R, E, B>
  ): Effect<R, E, NA.NonEmptyArray<B>>

  /**
   * @ets_rewrite_method mapEffect_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapM<AX, R, E, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Sync<R, E, B>
  ): Effect<R, E, NA.NonEmptyArray<B>> // Maps to Effect always

  /**
   * @ets_rewrite_method mapM_ from "@effect-ts-app/fluent/_ext/mapM"
   */
  mapM<AX, E, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Either<E, B>
  ): Effect<unkown, E, NA.NonEmptyArray<B>>

  /**
   * @ets_rewrite_method mapM_ from "@effect-ts-app/fluent/_ext/mapM"
   */
  mapM<AX, B>(
    this: NA.NonEmptyArray<AX>,
    f: (a: AX) => Option<B>
  ): Effect<unkown, Option<never>, NA.NonEmptyArray<B>>

  /**
   * @ets_rewrite_method mapEffect_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapM<AX, R, E, B>(
    this: ARR.Array<AX>,
    f: (a: AX) => Effect<R, E, B>
  ): Effect<R, E, readonly B[]>

  /**
   * @ets_rewrite_method mapEffect_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  mapM<AX, R, E, B>(
    this: ARR.Array<AX>,
    f: (a: AX) => Sync<R, E, B>
  ): Effect<R, E, readonly B[]> // Maps to Effect always

  /**
   * @ets_rewrite_method mapM_ from "@effect-ts-app/fluent/_ext/mapM"
   */
  mapM<AX, E, B>(
    this: ARR.Array<AX>,
    f: (a: AX) => Either<E, B>
  ): Effect<unkown, E, readonly B[]>

  /**
   * @ets_rewrite_method mapM_ from "@effect-ts-app/fluent/_ext/mapM"
   */
  mapM<AX, B>(
    this: ARR.Array<AX>,
    f: (a: AX) => Option<B>
  ): Effect<unkown, Option<never>, readonly B[]>

  /**
   * @ets_rewrite_method flatten from "@effect-ts/core/Collections/Immutable/Array"
   */
  flatten<A>(this: ARR.Array<ARR.Array<A>>): ARR.Array<A>

  /**
   * @ets_rewrite_method filterMap_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  filterMap<A, B>(this: readonly A[], f: (a: A) => Option<B>): readonly B[]

  /**
   * @ets_rewrite_method findFirst_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  findFirst<A>(this: readonly A[], predicate: Predicate<A>): Option<A>

  /**
   * @ets_rewrite_method findFirstMap_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  findFirstMap<A, B>(this: readonly A[], f: (a: A) => Option<B>): Option<B>

  /**
   * @ets_rewrite_method filter_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  filterRA<A, S extends A>(this: readonly A[], f: (a: A) => a is S): readonly S[]

  /**
   * @ets_rewrite_method filter_ from "@effect-ts/core/Collections/Immutable/Array"
   */
  filterRA<A>(this: readonly A[], f: (a: A) => boolean): readonly A[]

  /**
   * @ets_rewrite_method uniq_ from "@effect-ts-app/fluent/_ext/Array"
   */
  uniq<A>(this: readonly A[], E: Eq.Equal<A>): readonly A[]
}

interface IterableOps {
  /**
   * @ets_rewrite_method forEachParN_ from "@effect-ts-app/core/Effect"
   */
  forEachParN<R, E, A, B>(
    this: Iterable<A>,
    n: number,
    f: (a: A) => Effect<R, E, B>,
    __trace?: string
  ): Effect<R, E, CNK.Chunk<B>>

  /**
   * @ets_rewrite_method forEachPar_ from "@effect-ts-app/core/Effect"
   */
  forEachPar<R, E, A, B>(
    this: Iterable<A>,
    f: (a: A) => Effect<R, E, B>,
    __trace?: string
  ): Effect<R, E, CNK.Chunk<B>>

  /**
   * @ets_rewrite_method forEach_ from "@effect-ts-app/core/Effect"
   */
  forEachEff<R, E, A, B>(
    this: Iterable<A>,
    f: (a: A) => Effect<R, E, B>,
    __trace?: string
  ): Effect<R, E, CNK.Chunk<B>>

  /**
   * @ets_rewrite_method collectAll from "@effect-ts-app/core/Effect"
   */
  collectAll<R, E, A>(
    this: Iterable<Effect<R, E, A>>,
    __trace?: string
  ): Effect<R, E, CNK.Chunk<A>>

  /**
   * @ets_rewrite_method from from "@effect-ts/core/Collections/Immutable/Chunk""
   */
  toChunk<A>(this: Iterable<A>): CNK.Chunk<A>
}

declare module "@effect-ts/system/Collections/Immutable/Chunk" {
  export interface Chunk<A> extends IterableOps {
    /**
     * @ets_rewrite_method filter_ from "@effect-ts/core/Collections/Immutable/Chunk"
     */
    filter<A, S extends A>(this: CNK.Chunk<A>, f: (a: A) => a is S): CNK.Chunk<S>

    /**
     * @ets_rewrite_method filter_ from "@effect-ts/core/Collections/Immutable/Chunk"
     */
    filter<A>(this: CNK.Chunk<A>, f: (a: A) => boolean): CNK.Chunk<A>

    /**
     * @ets_rewrite_method map_ from "@effect-ts/core/Collections/Immutable/Chunk"
     */
    map<A, B>(this: CNK.Chunk<A>, f: (a: A) => B): CNK.Chunk<B>

    /**
     * @ets_rewrite_method filterMap_ from "@effect-ts/core/Collections/Immutable/Chunk"
     */
    filterMap<A, B>(this: CNK.Chunk<A>, f: (a: A) => Option<B>): CNK.Chunk<B>

    /**
     * @ets_rewrite_method toArray from "@effect-ts/core/Collections/Immutable/Chunk"
     */
    toArray<A>(this: CNK.Chunk<A>): ARR.Array<A>

    /**
     * @ets_rewrite_method find_ from "@effect-ts/core/Collections/Immutable/Chunk"
     */
    find<A, B extends A>(this: CNK.Chunk<A>, f: Refinement<A, B>): O.Option<B>

    /**
     * @ets_rewrite_method find from "@effect-ts/core/Collections/Immutable/Chunk"
     */
    find<A>(this: CNK.Chunk<A>, f: (a: A) => boolean): O.Option<A>
  }
}

declare global {
  interface Array<T> extends ArrayOps, IterableOps {}
  interface ReadonlyArray<T> extends ArrayOps, IterableOps {
    // undo the global overwrite in ETS
    /**
     * @ets_rewrite_method mapOriginal_ from "@effect-ts-app/fluent/_ext/Array"
     */
    map<AX, B>(this: ARR.Array<AX>, f: (a: AX, i: number) => B): ARR.Array<B>
  }

  // interface Iterable<T> extends IterableOps {}
  // interface IterableIterator<T> extends IterableOps {}
  // interface Generator<T, A, B> extends IterableOps {}
}
