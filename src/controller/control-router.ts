function RouterControl() {
    const dependence: "development" | "production" = "development"

    const apiRouter = {
        "production": (router: TRouter, callback: (res: { error: unknown } | { response: string }) => void) => {
            fetch(`${router}`).then(response => response.text()).then(response => callback({ response })).catch(error => callback({ error: "Rout not found" }))
        },
        "development": (router: TRouter, callback: (res: { error: unknown } | { response: string }) => void) => {
            // @ts-expect-error
            const routerResponse = GLOBAL_ROUTES_ROUTER[`${router}`]

            if (routerResponse) return routerResponse

            return callback({ error: "Rout not found" })
        },
    }

    const fetchRouter = (router: TRouter, callback: (res: { error: unknown } | { response: string }) => void) => {
        apiRouter[dependence](router, callback)
    }

    const getRouter = ({ router, name, script }: { router?: TRouter, name?: TRouterName, script?: TRouterScript }) => {
        return GLOBAL_ROUTES.find(_router => { return _router.router == router || _router.name == name || _router.script == script }) || null
    }

    const query = ({ router }: { router: TRouter }, callback: (res: { error: unknown } | { response: string }) => void) => {
        fetchRouter(`${router}`, callback)
    }

    return {
        getRouter,
        query
    }
}