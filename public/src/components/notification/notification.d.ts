type TypesNotification = "_success" | "_error" | "_warning" | "_info" | "_extra"

interface INotification {
    title: string
    body: string
    type: TypesNotification
}