type TRouter = string
type TRouterScript = string
type TRouterName = string

interface IRouter {
    name: TRouterName
    router: TRouter
    script: TScript
}

type TItemRoute = IRouter & {
    icon: string
    title: string
}

type TDefineRouter = "routes/panel-history.html" | "routes/panel-test.html" | "routes/panel-farm.html" | "routes/panel-404.html"

type TDependenceRouter = {
    "routes/panel-history.html": string
    "routes/panel-test.html": string
    "routes/panel-farm.html": string
    "routes/panel-404.html": string
}