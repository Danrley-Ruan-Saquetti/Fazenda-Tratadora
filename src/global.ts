const GLOBAL_TEMPLATE: ISettingsTemplate = {
    "settings": {
        "table": {
            "cep.initial": "",
            "cep.final": "",
            "deadline": "",
            "excess": "",
            "rate": {
                "deadline": "",
                "price": ""
            },
            "selection.criteria": {
                "price": "",
                "deadline": ""
            }
        },
        "process": {
            "deadline+D": 1,
            "criteria.selection": {
                "join": " "
            },
            "converterStringTable": {
                "separatorLine": /\r?\n/,
                "separatorColumn": ";",
                "configSeparatorColumn": {
                    "separator": ",",
                    "searchValue": ",",
                    "replaceValue": "?",
                    "betweenText": "\""
                }
            }
        },
        "template": {
            "rateValue": {
                "cep.origin.initial": "1000000",
                "cep.origin.final": "99999999"
            },
            "headerName": {
                "cep.origin.initial": "Inicio  Origem",
                "cep.origin.final": "Fim  Origem",
                "cep.initial": "Inicio  Destino",
                "cep.final": "Fim  Destino",
                "deadline+D": "Dias",
                "excess": "Excedente"
            },
            "cepOriginValue": {
                "cep.origin.final": "",
                "cep.origin.initial": ""
            }
        }
    },
    "process": [
        "create-farm",
        "insert-values",
        "deadline+D",
        "contained-cep",
        "procv",
        "template",
        "rate"
    ]
}

const GLOBAL_SETTINGS: ISettingsGeneral = {
    "table": {
        "cep.initial": "",
        "cep.final": "",
        "deadline": "",
        "excess": "",
        "rate": {
            "deadline": "",
            "price": ""
        },
        "selection.criteria": {
            "price": "",
            "deadline": ""
        }
    },
    "process": {
        "deadline+D": 1,
        "criteria.selection": {
            "join": " "
        },
        "converterStringTable": {
            "separatorLine": /\r?\n/,
            "separatorColumn": ";",
            "configSeparatorColumn": {
                "separator": ",",
                "searchValue": ",",
                "replaceValue": "?",
                "betweenText": "\""
            }
        },
    },
    "template": {
        "rateValue": {
            "cep.origin.initial": "1000000",
            "cep.origin.final": "99999999"
        },
        "headerName": {
            "cep.origin.initial": "Inicio  Origem",
            "cep.origin.final": "Fim  Origem",
            "cep.initial": "Inicio  Destino",
            "cep.final": "Fim  Destino",
            "deadline+D": "Dias",
            "excess": "Excedente"
        },
        "cepOriginValue": {
            "cep.origin.final": "",
            "cep.origin.initial": ""
        }
    }
}

const GLOBAL_SETTINGS_RESET = {
    table: {
        "cep.final": "",
        "cep.initial": "",
        "selection.criteria": {
            deadline: "",
            price: ""
        },
        deadline: "",
        excess: "",
        rate: {
            deadline: "",
            price: ""
        }
    },
    process: {
        "criteria.selection": {
            join: ""
        },
        "deadline+D": 0,
        converterStringTable: {
            configSeparatorColumn: {
                betweenText: "",
                replaceValue: "",
                searchValue: "",
                separator: ""
            },
            separatorColumn: "",
            separatorLine: ""
        },
    },
    template: {
        headerName: {
            "cep.final": "",
            "cep.initial": "",
            "cep.origin.final": "",
            "cep.origin.initial": "",
            "deadline+D": "",
            excess: ""
        },
        rateValue: {
            "cep.origin.final": "",
            "cep.origin.initial": ""
        },
        "cepOriginValue": {
            "cep.origin.final": "",
            "cep.origin.initial": ""
        }
    }
}

const isDev = ControlDataBase().getItem<Boolean>("dev.edition") || false

const GLOBAL_DEPENDENCE: TDependence = !isDev ? "production" : "development"

ControlDataBase().updateItem("dev.edition", false)

const GLOBAL_HISTORY: IHistoryTable = []

const GLOBAL_ROUTERS: TItemRoute[] = [
    { icon: "house-door", title: "Fazenda", name: "farm", router: "routers/panel-farm.html", script: "FarmScript", active: true },
    { icon: "ui-radios", title: "Histórico", name: "history", router: "routers/panel-history.html", script: "HistoryScript", active: true },
    { icon: "calculator", title: "Testes", name: "test", router: "routers/panel-test.html", script: "TestScript", active: false },
    { icon: "journal-bookmark", title: "Guide", name: "guide", router: "routers/panel-guide.html", script: "GuideScript", active: false },
    { icon: "gear", title: "Configurações", name: "setting", router: "routers/panel-setting.html", script: "SettingScript", active: false },
    { icon: "code", title: "null", name: "feature", router: "routers/panel.feature.html", script: "FeatureScript", __dev: true, active: false }
]

const GLOBAL_ROUTER_NOT_FOUND = `<h1>Router not found</h1>`

const GLOBAL_ROUTERS_ROUTER: TDependenceRouter = {
    "routers/panel.feature.html": GLOBAL_ROUTER_NOT_FOUND,
    "routers/panel-history.html": `<div button-container>
    <button action="_confirm" class="load-table"><i class="bi-arrow-clockwise" icon></i>Atualizar</button>
    <button action="_new" class="new-farm"><i class="bi-plus-lg" icon></i>Nova Fazenda</button>
    <button action="_confirm" class="download"><i class="bi-download" icon></i>Download</button>
</div>

<div class="table" table-parent>
    <table table="history"></table>
</div>

<script src="../src/bundle.js"></script>`,
    "routers/panel-test.html": `<h1>Teste</h1>`,
    "routers/panel-farm.html": `<div button-container>
    <button action="_new" id="upload-files-plant">Upload</button>
    <button action="_view" id="get-data">Fazenda</button>
    <a action="_new" href="#" id="download-files" class="bt" download>Download</a>
    <button action="_new" id="save-farm">Salvar</button>
    <button action="_new" id="clear-ls">Limpar Histórico</button>
    <button action="_new" id="clear-farm">Limpar Fazenda</button>
    <button action="_new" id="clear-settings">Limpar Configurações</button>
</div>

<div line="horizontal" line-width="margin"></div>

<label for="input-file-plant-price">Selecione o arquivo de Preço</label>
<input type="file" name="input-file-plant-price" id="input-file-plant-price">
<label for="input-file-plant-deadline">Selecione o arquivo de Prazo</label>
<input type="file" name="input-file-plant-deadline" id="input-file-plant-deadline">
<label for="input-file-farm">Selecione o arquivo de Fazenda</label>
<input type="file" name="input-file-farm" id="input-file-farm">
<label for="input-file-settings">Selecione o arquivo de Configurações</label>
<input type="file" name="input-file-settings" id="input-file-settings">
<label for="param-cep-initial">Informe o Cep Inicial</label>
<input type="text" name="param-cep-initial" id="param-cep-initial">
<label for="param-cep-final">Informe o Cep Final</label>
<input type="text" name="param-cep-final" id="param-cep-final">
<label for="param-cep-origin-initial">Informe o Cep de Origem Inicial</label>
<input type="text" name="param-cep-origin-initial" id="param-cep-origin-initial">
<label for="param-cep-origin-final">Informe o Cep de Origem Final</label>
<input type="text" name="param-cep-origin-final" id="param-cep-origin-final">
<label for="param-deadline">Informe o cabeçalho de Prazo</label>
<input type="text" name="param-deadline" id="param-deadline">
<label for="param-rate-price">Informe o cabeçalho de Taxa do Preço</label>
<input type="text" name="param-rate-price" id="param-rate-price">
<label for="param-rate-deadline">Informe o cabeçalho de Taxa do Prazo</label>
<input type="text" name="param-rate-deadline" id="param-rate-deadline">
<label for="param-selection-criteria-price">Informe o cabeçalho de Critério de Seleção do Preço</label>
<input type="text" name="param-selection-criteria-price" id="param-selection-criteria-price">
<label for="param-selection-criteria-deadline">Informe o cabeçalho de Critério de Seleção do Prazo</label>
<input type="text" name="param-selection-criteria-deadline" id="param-selection-criteria-deadline">
<label for="param-excess">Informe o cabeçalho de Excesso</label>
<input type="text" name="param-excess" id="param-excess">
<label for="param-name-farm">Informe o nome da Fazenda</label>
<input type="text" name="param-name-farm" id="param-name-farm">`,
    "routers/panel-404.html": GLOBAL_ROUTER_NOT_FOUND,
    "routers/panel-guide.html": GLOBAL_ROUTER_NOT_FOUND,
    "routers/panel-setting.html": GLOBAL_ROUTER_NOT_FOUND
}
