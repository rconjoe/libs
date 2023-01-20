import type { Http } from "@effect-app/core/http/http-client"
import * as HF from "@effect-app/core/http/http-client-fetch"
import { ApiConfig } from "@effect-app/prelude/client"
import { fetch } from "cross-fetch"
import { initRuntime } from "./internal.js"

export { initRuntime } from "./internal.js"

const DefaultApiConfig = Config.struct({
  apiUrl: Config.string("apiUrl").withDefault("/api"),
  headers: Config.string()
    .table("headers").optional
})

export function makeApiLayers(config: Config<ApiConfig> = DefaultApiConfig) {
  return HF.Client(fetch) + ApiConfig.Live(config)
}

export function makeAppRuntime<R, E, A>(layer: Layer<R, E, A>) {
  return Effect.gen(function*($) {
    const scope = yield* $(Scope.make())
    const env = yield* $(layer.buildWithScope(scope))
    const runtime = yield* $(Effect.runtime<A>().scoped.provideEnvironment(env))

    return {
      runtime,
      clean: scope.close(Exit.unit)
    }
  })
}

export function initializeSync<E, A>(layer: Layer<never, E, A | ApiConfig | Http>) {
  const { clean, runtime } = makeAppRuntime(layer).unsafeRunSync
  initRuntime(runtime)
  return {
    runtime,
    clean: () => clean.unsafeRunSync
  }
}

export function initializeAsync<E, A>(layer: Layer<never, E, A | ApiConfig | Http>) {
  return makeAppRuntime(layer).unsafeRunPromise
    .then(({ clean, runtime }) => {
      initRuntime(runtime)
      return {
        runtime,
        clean: () => clean.unsafeRunPromise
      }
    })
}