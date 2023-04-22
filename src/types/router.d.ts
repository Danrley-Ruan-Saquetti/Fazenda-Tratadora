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

type TDefineRouter = "routers/panel-history.html" | "routers/panel-test.html" | "routers/panel-farm.html" | "routers/panel-404.html" | "routers/panel.feature.html" | "routers/panel-setting.html" | "routers/panel-guide.html"

type TDependenceRouter = {
    "routers/panel-history.html": string
    "routers/panel-test.html": string
    "routers/panel-farm.html": string
    "routers/panel-guide.html": string
    "routers/panel-setting.html": string
    "routers/panel.feature.html": string
    "routers/panel-404.html": string
}