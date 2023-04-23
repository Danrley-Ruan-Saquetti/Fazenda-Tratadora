function RouterControl() {
    const apiRouter = {
        "production": (router: TRouter, callback: ICallback) => {
            const response = fetch(`${router}`).then(res => {
                return res.text()
            }).then(res => {
                return { data: res }
            }).catch(error => {
                return { error: { msg: "Rout not found" } }
            })

            response.then(callback)

            return response
        },
        "development": (router: TRouter, callback: ICallback) => {
            const routerResponse: string = GLOBAL_ROUTERS_ROUTER[`${router}`]

            if (routerResponse) return callback({ data: routerResponse })

            callback({ error: { msg: "Rout not found" } })
        },
    }

    const fetchRouter = (router: TRouter, callback: ICallback) => {
        apiRouter[GLOBAL_DEPENDENCE](router, ({ data, error }) => {
            if (!data || error) return apiRouter[GLOBAL_DEPENDENCE]("routers/panel-404.html", callback)

            callback({ data })
        })
    }

    const getRouter = ({ router, name, script }: { router?: TRouter, name?: TRouterName, script?: TRouterScript }) => {
        return GLOBAL_ROUTERS.find(_router => { return _router.router == router || _router.name == name || _router.script == script }) || null
    }

    const query = ({ router }: { router: TRouter }, callback: ICallback) => {
        fetchRouter(`${router}`, callback)
    }

    return {
        getRouter,
        query
    }
}