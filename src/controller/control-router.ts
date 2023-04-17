function RouterControl() {
    const dependence: "development" | "production" = "production"

    const apiRouter = {
        "production": async (router: TRouter) => {
            const response: { data?: string, error?: string } = await fetch(`${router}`).then(response => response.text()).then(response => {
                return { data: response }
            }).catch(error => {
                return { error: "Rout not found" }
            })

            return response
        },
        "development": (router: TDefineRouter) => {
            const routerResponse: string = GLOBAL_ROUTES_ROUTER[`${router}`]

            if (routerResponse) return { data: routerResponse }

            return { error: "Rout not found" }
        },
    }

    const fetchRouter = async (router: TRouter) => {
        const response = await apiRouter[dependence](router)

        if (!response.data || response.error) {
            const errorRouterData = await apiRouter[dependence]("routes/panel-404.html")

            return { data: errorRouterData.data || "Server Error" }
        }

        return { data: response.data }
    }

    const getRouter = ({ router, name, script }: { router?: TRouter, name?: TRouterName, script?: TRouterScript }) => {
        return GLOBAL_ROUTES.find(_router => { return _router.router == router || _router.name == name || _router.script == script }) || null
    }

    const query = async ({ router }: { router: TRouter }) => {
        const response = await fetchRouter(`${router}`)

        return response
    }

    return {
        getRouter,
        query
    }
}