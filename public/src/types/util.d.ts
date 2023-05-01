declare const _ = {
    cloneDeep<T>(value: T): T;
}

type ICallback = (response: { error?: { msg: string }, data?: string }) => void

type TDependence = "production" | "development"