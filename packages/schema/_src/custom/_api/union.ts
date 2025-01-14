import * as D from "@effect-app/core/Dictionary"
import { pipe } from "@effect-app/core/Function"

import type { EnforceNonEmptyRecord, Unify } from "@effect-app/core/utils"
import * as S from "../_schema.js"
import * as Arbitrary from "../Arbitrary.js"
import * as Encoder from "../Encoder.js"
import * as Guard from "../Guard.js"
import * as Parser from "../Parser.js"
import type { ParserEnv } from "../Parser.js"
import * as Th from "../These.js"
import { isPropertyRecord, tagsFromProps } from "./properties.js"
import type { DefaultSchema } from "./withDefaults.js"
import { withDefaults } from "./withDefaults.js"

export interface MatchS<Props extends Record<PropertyKey, S.SchemaUPI>, AS> {
  <
    M extends {
      [K in keyof Props]?: (
        x0: S.ParsedShapeOf<Props[K]>,
        x1: S.ParsedShapeOf<Props[K]>
      ) => Result
    },
    Result
  >(
    mat: M,
    def: (
      x0: { [K in keyof Props]: S.ParsedShapeOf<Props[K]> }[
        Exclude<
          keyof Props,
          keyof M
        >
      ],
      x1: { [K in keyof Props]: S.ParsedShapeOf<Props[K]> }[
        Exclude<
          keyof Props,
          keyof M
        >
      ]
    ) => Result
  ): (ks: AS) => Result
  <Result>(
    mat: {
      [K in keyof Props]: (
        _: S.ParsedShapeOf<Props[K]>,
        __: S.ParsedShapeOf<Props[K]>
      ) => Result
    }
  ): (ks: AS) => Result
}

export interface MatchW<Props extends Record<PropertyKey, S.SchemaUPI>, AS> {
  <
    M extends {
      [K in keyof Props]?: (
        _: S.ParsedShapeOf<Props[K]>,
        __: S.ParsedShapeOf<Props[K]>
      ) => any
    },
    Result
  >(
    mat: M,
    def: (
      x0: { [K in keyof Props]: S.ParsedShapeOf<Props[K]> }[
        Exclude<
          keyof Props,
          keyof M
        >
      ],
      x1: { [K in keyof Props]: S.ParsedShapeOf<Props[K]> }[
        Exclude<
          keyof Props,
          keyof M
        >
      ]
    ) => Result
  ): (ks: AS) => Unify<
    | {
      [K in keyof M]: M[K] extends (
        _: S.ParsedShapeOf<Props[K]>,
        __: S.ParsedShapeOf<Props[K]>
      ) => any ? ReturnType<M[K]>
        : never
    }[keyof M]
    | Result
  >
  <
    M extends {
      [K in keyof Props]: (
        _: S.ParsedShapeOf<Props[K]>,
        __: S.ParsedShapeOf<Props[K]>
      ) => any
    }
  >(
    _: M
  ): (ks: AS) => Unify<
    {
      [K in keyof M]: ReturnType<M[K]>
    }[keyof M]
  >
}

export interface UnionApi<Props extends Record<PropertyKey, S.SchemaUPI>> extends S.ApiSelfType<unknown> {
  readonly matchS: MatchS<
    Props,
    S.GetApiSelfType<
      this,
      {
        [k in keyof Props]: S.ParsedShapeOf<Props[k]>
      }[keyof Props]
    >
  >
  readonly matchW: MatchW<
    Props,
    S.GetApiSelfType<
      this,
      {
        [k in keyof Props]: S.ParsedShapeOf<Props[k]>
      }[keyof Props]
    >
  >
}

/** tsplus type ets/Schema/SchemaUnion */
export type SchemaUnion<Props extends Record<PropertyKey, S.SchemaUPI>> = DefaultSchema<
  unknown,
  {
    [k in keyof Props]: S.ParsedShapeOf<Props[k]>
  }[keyof Props],
  {
    [k in keyof Props]: S.ParsedShapeOf<Props[k]>
  }[keyof Props],
  {
    [k in keyof Props]: S.EncodedOf<Props[k]>
  }[keyof Props],
  UnionApi<Props>
>

export const unionIdentifier = S.makeAnnotation<{
  props: Record<PropertyKey, S.SchemaUPI>
  tag: Option<{
    key: string
    index: D.Dictionary<string>
    reverse: D.Dictionary<string>
    values: readonly string[]
  }>
}>()

export function union<Props extends Record<PropertyKey, S.SchemaUPI>>(
  props: Props & EnforceNonEmptyRecord<Props>
): SchemaUnion<Props> {
  const parsers = D.map_(props, Parser.for)
  const guards = D.map_(props, Guard.for)
  const encoders = D.map_(props, Encoder.for)
  const arbitraries = D.map_(props, Arbitrary.for)

  const keys = Object.keys(props)

  const entries = D.collect_(props, (k, v) => [k, v] as const)

  const entriesTags = entries.map(
    ([k, s]) =>
      [
        k,
        "props" in s.Api && isPropertyRecord(s.Api["props"])
          ? tagsFromProps(s.Api["props"])
          : {}
      ] as const
  )

  const firstMemberTags = entriesTags[0]![1]

  const tag: Option<{
    key: string
    index: D.Dictionary<string>
    reverse: D.Dictionary<string>
    values: readonly string[]
  }> = Object.keys(firstMemberTags).findFirstMap((tagField) => {
    const tags = entriesTags
      .filterMap(
        ([member, tags]) => {
          if (tagField in tags) {
            return Option.some([tags[tagField], member])
          }
          return Option.none
        }
      )
      .uniq((x, y) => x[0] === y[0])

    if (tags.length === entries.length) {
      return Option.some({
        key: tagField,
        index: D.fromArray(tags.map(([a, b]) => tuple(a, b))),
        reverse: D.fromArray(tags.map(([a, b]) => tuple(b, a))),
        values: tags.map((_) => _[0])
      })
    }

    return Option.none
  })

  function guard(u: unknown): u is {
    [k in keyof Props]: S.ParsedShapeOf<Props[k]>
  }[keyof Props] {
    if (tag.isSome()) {
      if (
        typeof u !== "object"
        || u === null
        || !(tag.value.key in u)
        || typeof u[tag.value.key] !== "string"
        || !(u[tag.value.key] in tag.value.index)
      ) {
        return false
      } else {
        return guards[tag.value.index[u[tag.value.key]]](u)
      }
    }
    for (const k of keys) {
      if (guards[k](u)) {
        return true
      }
    }
    return false
  }

  function encoder(
    u: {
      [k in keyof Props]: S.ParsedShapeOf<Props[k]>
    }[keyof Props]
  ): {
    [k in keyof Props]: S.EncodedOf<Props[k]>
  }[keyof Props] {
    if (tag.isSome()) {
      return encoders[tag.value.index[u[tag.value.key]]](u)
    }
    for (const k of keys) {
      if (guards[k](u)) {
        return encoders[k](u)
      }
    }
    throw new Error(`bug: can't find any valid encoder`)
  }

  function parser(
    u: unknown,
    env?: ParserEnv
  ): Th.These<
    S.CompositionE<
      | S.PrevE<S.LeafE<S.ExtractKeyE>>
      | S.NextE<
        S.UnionE<
          {
            [k in keyof Props]: S.MemberE<k, S.ParserErrorOf<Props[k]>>
          }[keyof Props]
        >
      >
    >,
    {
      [k in keyof Props]: S.ParsedShapeOf<Props[k]>
    }[keyof Props]
  > {
    const parsersv2 = env?.cache ? env.cache.getOrSetParsers(parsers) : parsers

    if (tag.isSome()) {
      if (
        typeof u !== "object"
        || u === null
        || !(tag.value.key in u)
        || typeof u[tag.value.key] !== "string"
        || !(u[tag.value.key] in tag.value.index)
      ) {
        return Th.fail(
          S.compositionE(
            Chunk(
              S.prevE(S.leafE(S.extractKeyE(tag.value.key, tag.value.values, u)))
            )
          )
        )
      } else {
        // // @ts-expect-error
        return Th.mapError_(parsersv2[tag.value.index[u[tag.value.key]]](u), (e) =>
          S.compositionE(
            Chunk(
              S.nextE(
                S.unionE(Chunk(S.memberE(tag.value.index[u[tag.value.key]], e)))
              )
            )
          ))
      }
    }

    let errors = Chunk.empty<S.MemberE<string, any>>()

    for (const k of keys) {
      const res = parsersv2[k](u)

      if (res.effect._tag === "Right") {
        return Th.mapError_(
          res,
          (e) => S.compositionE(Chunk(S.nextE(S.unionE(Chunk(S.memberE(k, e))))))
        )
      } else {
        errors = errors.append(S.memberE(k, res.effect.left))
      }
    }

    return Th.fail(S.compositionE(Chunk(S.nextE(S.unionE(errors)))))
  }

  return pipe(
    S.identity(guard),
    S.parser(parser),
    S.encoder(encoder),
    S.arbitrary((fc) => fc.oneof(...D.collect_(arbitraries, (_, g) => g(fc)))),
    S.mapApi(
      () => ({
        // @ts-ignore
        matchS: (matcher, def) => (ks) => {
          if (tag.isSome()) {
            return (matcher[tag.value.index[ks[tag.value.key]]] ?? def)(ks, ks)
          }
          for (const k of keys) {
            if (guards[k](ks)) {
              return (matcher[k] ?? def)(ks, ks)
            }
          }
          throw new Error(`bug: can't find any valid matcher`)
        },
        // @ts-ignore
        matchW: (matcher, def) => (ks) => {
          if (tag.isSome()) {
            return (matcher[tag.value.index[ks[tag.value.key]]] ?? def)(ks, ks)
          }
          for (const k of keys) {
            if (guards[k](ks)) {
              return (matcher[k] ?? def)(ks, ks)
            }
          }
          throw new Error(`bug: can't find any valid matcher`)
        }
      } as UnionApi<Props>)
    ),
    withDefaults,
    S.annotate(unionIdentifier, { props, tag })
  )
}
