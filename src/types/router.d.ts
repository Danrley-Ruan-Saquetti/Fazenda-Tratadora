type TRouter = string
type TRouterScript = string
type TRouterName = string

interface IRouter {
    name: TRouterName
    router: TRouter
    script: TRouterScript
}

type TItemRoute = IRouter & {
    icon: string
    title: string
}