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

const GLOBAL_HISTORY: IHistoryTable = []

const GLOBAL_ROUTERS: TItemRoute[] = [
    { icon: "house-door", title: "Fazenda", name: "farm", router: "routers/panel-farm.html", script: "FarmScript" },
    { icon: "ui-radios", title: "Histórico", name: "history", router: "routers/panel-history.html", script: "HistoryScript" },
    { icon: "calculator", title: "Testes", name: "test", router: "routers/panel-test.html", script: "TestScript" },
    { icon: "journal-bookmark", title: "Guide", name: "guide", router: "routers/panel-guide.html", script: "GuideScript" },
    { icon: "gear", title: "Configurações", name: "setting", router: "routers/panel-setting.html", script: "SettingScript" },
    { icon: "signpost-split", title: "Features", name: "feature", router: "routers/panel.feature.html", script: "FeatureScript" },
]

const GLOBAL_ROUTER_NOT_FOUND = `<h1>Router not found</h1>`

const GLOBAL_ROUTERS_ROUTER: TDependenceRouter = {
    "routers/panel.feature.html": GLOBAL_ROUTER_NOT_FOUND,
    "routers/panel-history.html": `<button class="load-table">Load</button>
    <div class="table" table-parent>
        <table table="history"></table>
    </div>`,
    "routers/panel-test.html": `<h1>Teste</h1>`,
    "routers/panel-farm.html": `<label for="input-file-plant-price">Selecione o arquivo de Preço</label>
    <input type="file" name="input-file-plant-price" id="input-file-plant-price">
    <label for="input-file-plant-deadline">Selecione o arquivo de Prazo</label>
    <input type="file" name="input-file-plant-deadline" id="input-file-plant-deadline">
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
    <input type="text" name="param-name-farm" id="param-name-farm">
    <button id="upload-files-plant">Upload</button>
    <a href="#" id="download-files" download>Download</a>
    <button id="save-farm">Salvar</button>
    <button id="get-data">Fazenda</button>
    <button id="clear-ls">Limpar Histórico</button>
    <button id="clear-farm">Limpar Fazenda</button>
    <button id="clear-settings">Limpar Configurações</button>`,
    "routers/panel-404.html": GLOBAL_ROUTER_NOT_FOUND,
    "routers/panel-guide.html": GLOBAL_ROUTER_NOT_FOUND,
    "routers/panel-setting.html": GLOBAL_ROUTER_NOT_FOUND
}
