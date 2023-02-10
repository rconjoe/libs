/* eslint-disable @typescript-eslint/no-explicit-any */

import { RequestContext } from "../../RequestContext.js"
import type { Filter, FilterJoinSelect, PersistenceModelType, Store, StoreConfig } from "./service.js"
import { StoreMaker } from "./service.js"
import { codeFilter, codeFilterJoinSelect, makeETag, makeUpdateETag } from "./utils.js"

export function memFilter<T extends { id: string }>(filter: Filter<T>, cursor?: { skip?: number; limit?: number }) {
  return ((c: Chunk<T>): Chunk<T> => {
    const skip = cursor?.skip
    const limit = cursor?.limit
    if (!skip && limit === 1) {
      return c.findFirstMap(codeFilter(filter)).map(Chunk.make).getOrElse(() => Chunk.empty())
    }
    let r = c.filterMap(codeFilter(filter))
    if (skip) {
      r = r.drop(skip)
    }
    if (limit !== undefined) {
      r = r.take(limit)
    }
    return r.toChunk
  })
}

export const storeId = FiberRef.unsafeMake("primary")
export const restoreFromRequestContext = RequestContext.Tag.accessWithEffect(ctx =>
  storeId.set(ctx.parent?.namespace ?? ctx.namespace ?? "primary")
)

export const makeMemoryStore = () => ({
  make: <Id extends string, Id2 extends Id, PM extends PersistenceModelType<Id>>(
    name: string,
    existing?: Effect<never, never, ReadonlyMap<Id2, PM>>,
    config?: StoreConfig<PM>
  ) =>
    Effect.gen(function*($) {
      const updateETag = makeUpdateETag(name)
      const items: ReadonlyMap<Id, PM> = yield* $(existing ?? Effect(new Map<Id, PM>()))
      const makeStore = (): ReadonlyMap<Id, PM> => new Map([...items.entries()].map(([id, e]) => [id, makeETag(e)]))
      const storesSem = Semaphore.unsafeMake(1)
      const stores = new Map([["primary", Ref.unsafeMake(makeStore())]])
      const getStore = storeId.get.flatMap(namespace => {
        const store = stores.get(namespace)
        if (!store) {
          if (!config?.allowNamespace || !config.allowNamespace(namespace)) {
            throw new Error(`Namespace ${namespace} not allowed!`)
          }
          return storesSem.withPermits(1)(Effect.suspendSucceed(() => {
            const store = stores.get(namespace)
            if (store) return store.get
            const newStore = Ref.unsafeMake(makeStore())
            stores.set(namespace, newStore)
            return newStore.get
          }))
        }
        return store.get
      })
      const setStore = (m: any) => storeId.get.flatMap(namespace => stores.get(namespace)!.set(m))
      const sem = Semaphore.unsafeMake(1)
      const withPermit = sem.withPermits(1)
      const values = getStore.map(s => s.values())
      const all = values.map(Chunk.fromIterable)
      const batchSet = (items: NonEmptyReadonlyArray<PM>) =>
        items
          .forEachEffect(i => s.find(i.id).flatMap(current => updateETag(i, current)))
          .tap(items =>
            getStore
              .map(m => {
                const mut = m as Map<Id, PM>
                items.forEach(e => mut.set(e.id, e))
                return mut
              })
              .flatMap(_ => setStore(_))
          )
          .map(_ => _.toReadonlyArray() as NonEmptyReadonlyArray<PM>)
          .apply(withPermit)
      const s: Store<PM, Id> = {
        all,
        find: id => getStore.map(_ => Option.fromNullable(_.get(id))),
        filter: (filter: Filter<PM>, cursor?: { skip?: number; limit?: number }) => all.map(memFilter(filter, cursor)),
        filterJoinSelect: <T extends object>(filter: FilterJoinSelect) =>
          all.map(c => c.flatMap(codeFilterJoinSelect<PM, T>(filter))),
        set: e =>
          s
            .find(e.id)
            .flatMap(current => updateETag(e, current))
            .tap(e => getStore.map(_ => new Map([..._, [e.id, e]])).flatMap(_ => setStore(_)))
            .apply(withPermit),
        batchSet,
        bulkSet: batchSet,
        remove: (e: PM) =>
          getStore.map(_ => new Map([..._].filter(([_]) => _ !== e.id)))
            .flatMap(_ => setStore(_)).apply(withPermit)
      }
      return s
    })
})

export const MemoryStoreLive = StoreMaker.makeLayer(makeMemoryStore())
