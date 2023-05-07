"use strict";
const dataLocal = (function () {
    const storage = [];
    let length = storage.length;
    const clear = () => {
        storage.splice(0, storage.length);
        length = storage.length;
    };
    const getItem = (key) => { return storage.find(d => { return d.key == key; })?.value; };
    const removeItem = (key) => {
        const index = (function () {
            for (let i = 0; i < storage.length; i++) {
                const element = storage[i];
                if (element.key == key) {
                    return i;
                }
            }
            return -1;
        }());
        if (index < 0) {
            return;
        }
        storage.splice(index, 1);
        length = storage.length;
    };
    const setItem = (key, value) => {
        removeItem(key);
        storage.push({ key, value });
        length = storage.length;
    };
    const key = (i) => {
        return storage[i].value;
    };
    return {
        clear,
        getItem,
        removeItem,
        setItem,
        length: length,
        key
    };
}());
const dependencies = {
    production: localStorage,
    development: dataLocal
};
const ls = dependencies["production"];
function ControlDataBase() {
    const createItem = (key, value) => {
        try {
            removeItem(key);
            ls.setItem(key, converterJSONToString(value) || "");
            return true;
        }
        catch (err) {
            return false;
        }
    };
    const updateItem = (key, value) => {
        try {
            removeItem(key);
            createItem(key, value);
            return true;
        }
        catch (err) {
            return false;
        }
    };
    const removeItem = (key, clear = false) => {
        try {
            !clear ? ls.removeItem(key) : ls.clear();
            return true;
        }
        catch (err) {
            return false;
        }
    };
    const getItem = (key, keysRegExp) => {
        try {
            const value = ls.getItem(key);
            if (!value) {
                return null;
            }
            return converterStringToJSON(value, keysRegExp);
        }
        catch (err) {
            return null;
        }
    };
    return {
        createItem,
        updateItem,
        removeItem,
        getItem,
    };
}
const GLOBAL_TEMPLATE = {
    "settings": {
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
        },
        "plants": []
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
};
const GLOBAL_SETTINGS = {
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
    },
    "plants": []
};
const GLOBAL_SETTINGS_RESET = {
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
    },
    plants: []
};
const isDev = ControlDataBase().getItem("dev.edition") || false;
const GLOBAL_DEPENDENCE = !isDev ? "production" : "development";
const GLOBAL_HISTORY = [];
const GLOBAL_ROUTERS = [
    { icon: "house-door", title: "Fazenda", name: "farm", router: "routers/panel-farm.html", script: "FarmScript", active: true },
    { icon: "ui-radios", title: "Histórico", name: "history", router: "routers/panel-history.html", script: "HistoryScript", active: true },
    { icon: "calculator", title: "Testes", name: "test", router: "routers/panel-test.html", script: "TestScript", active: false },
    { icon: "journal-bookmark", title: "Guide", name: "guide", router: "routers/panel-guide.html", script: "GuideScript", active: false },
    { icon: "gear", title: "Configurações", name: "setting", router: "routers/panel-setting.html", script: "SettingScript", active: false },
    { icon: "code", title: "null", name: "feature", router: "routers/panel.feature.html", script: "FeatureScript", __dev: true, active: false }
];
const GLOBAL_ROUTERS_OPEN = ["feature"];
const GLOBAL_ROUTER_NOT_FOUND = `<h1>Router not found</h1>`;
const GLOBAL_ROUTERS_ROUTER = {
    "routers/panel.feature.html": `<form>
    <div button-container>
        <button type="button" action="_new" id="upload-files-plant">Upload</button>
        <button type="button" action="_view" id="get-data">Fazenda</button>
        <a action="_new" href="#" id="download-files" class="bt" download>Download</a>
        <button type="button" action="_new" id="save-farm">Salvar</button>
        <button type="button" action="_new" id="clear-ls">Limpar Histórico</button>
        <button type="button" action="_new" id="clear-farm">Limpar Fazenda</button>
        <button type="button" action="_new" id="clear-settings">Limpar Configurações</button>
    </div>

    <h2># Tabelas</h2>
    <div class="select-group plants" list-content></div>

    <div line="horizontal" line-width="margin"></div>

    <h2># Processos</h2>
    <div class="select-group process" list-content></div>

    <div line="horizontal" line-width="margin"></div>
</form>`,
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
};
function isNumber(str) { return !isNaN(parseFloat(str)); }
function generatedId() {
    const VALUE_MAX = 9999;
    const now = new Date();
    return `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, "0")}${`${Math.floor(Math.random() * VALUE_MAX)}`.padStart(`${VALUE_MAX}`.length, "0")}`;
}
function replaceText({ replaceValue, searchValue, val, betweenText }) {
    let value = val;
    if (!value) {
        return "";
    }
    if (!betweenText) {
        do {
            value = value.replace(searchValue, replaceValue);
        } while (value.indexOf(searchValue) >= 0);
        return value;
    }
    let i = 0;
    let isOpenQuote = false;
    do {
        const index = value.indexOf(betweenText, i);
        if (index < 0) {
            break;
        }
        if (!isOpenQuote)
            isOpenQuote = true;
        else {
            value = value.substring(0, i) + value.substring(i, index).replace(searchValue, replaceValue) + value.substring(index);
            isOpenQuote = false;
        }
        i = index + 1;
    } while (i < value.length);
    return value;
}
function processObjToJSON(obj) {
    const newObj = _.cloneDeep(obj);
    for (const key in newObj) {
        if (newObj[key] instanceof RegExp) {
            newObj[key] = converterReGexpToString(newObj[key]);
            continue;
        }
        if (typeof newObj[key] === "object" && newObj[key] !== null) {
            newObj[key] = processObjToJSON(newObj[key]);
        }
    }
    return newObj;
}
function processJSONToObj(obj, keysRegExp = []) {
    const newObj = _.cloneDeep(obj);
    for (const key in newObj) {
        if (keysRegExp.includes(`${key}`) && typeof newObj[key] === "string") {
            try {
                newObj[key] = converterStringToRegExp(newObj[key]);
            }
            catch (e) { }
        }
        if (typeof newObj[key] === "object" && newObj[key] !== null) {
            newObj[key] = processJSONToObj(newObj[key], keysRegExp);
        }
    }
    return newObj;
}
function converterReGexpToString(value) {
    return `${value}`;
}
function converterStringToRegExp(value) {
    return new RegExp(value.slice(1, -1));
}
function converterStringToJSON(str, keysRegExp) {
    try {
        return processJSONToObj(JSON.parse(str), keysRegExp);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
function converterJSONToString(str) {
    try {
        return JSON.stringify(processObjToJSON(str));
    }
    catch (err) {
        return null;
    }
}
function deepEqual(obj1, obj2, exclude = []) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    keys1.sort();
    keys2.sort();
    for (let i = 0; i < keys1.length; i++) {
        if (exclude.includes(keys1[i])) {
            continue;
        }
        if (keys1[i] != keys2[i]) {
            return false;
        }
    }
    return true;
}
const createIcon = (name, type = "bi") => {
    const iconEl = document.createElement("i");
    iconEl.classList.add(`${type}-${name}`);
    iconEl.setAttribute("icon", "");
    return iconEl;
};
const getRouter = async (route, callback, onerror = (err) => { }) => {
    try {
        const response = await fetch(route);
        const data = await response.text();
        callback(data);
    }
    catch (error) {
        onerror(error);
    }
};
function tableComponent({ table: tableEl, headers }, onSelection, colResizableProps = { dragCursor: "ew-resize", headerOnly: true, hoverCursor: "ew-resize", liveDrag: true, resizeMode: 'flex', minWidth: 64, onResize: () => { }, draggingClass: "anchor-drag-column-table", gripInnerHtml: "" }) {
    const listSelected = [];
    const insertColumnSelect = () => {
        headers.unshift({ content: "<i class=\"bi-check2-square bt bt-select-all-data\" icon></i>", header: "_data-select", "data-select": "<input type=\"checkbox\"></input>" });
    };
    const updateListSelected = (id, isCtrl, saveOld = false) => {
        const idAlreadyExist = listSelected.find(_id => { return _id == id; });
        if (!isCtrl) {
            listSelected.splice(0, listSelected.length);
            if (!idAlreadyExist) {
                listSelected.push(id);
            }
        }
        else {
            if (idAlreadyExist) {
                const index = listSelected.indexOf(idAlreadyExist);
                if (!saveOld) {
                    index >= 0 && listSelected.splice(index, 1);
                }
            }
            else {
                listSelected.push(id);
            }
        }
    };
    const activeDataSelected = () => {
        const linesSelected = tableEl.querySelectorAll("tr[data-id].selected");
        linesSelected.forEach(_l => {
            const input = _l.querySelector(`input[type="checkbox"]`);
            if (input) {
                input.checked = false;
            }
            _l.classList.remove("selected");
        });
        listSelected.forEach(id => {
            const data = tableEl.querySelector(`tr[data-id="${id}"]`);
            const input = data.querySelector(`input[type="checkbox"]`);
            if (!data || !input) {
                return;
            }
            input.checked = true;
            data.classList.toggle("selected", true);
        });
    };
    const selectAllData = () => {
        const dataList = tableEl.querySelectorAll("tr[data-id]");
        const saveOld = !(dataList.length == listSelected.length);
        dataList.forEach(_data => {
            const id = _data.getAttribute("data-id");
            id && updateListSelected(id, true, saveOld);
        });
        activeDataSelected();
        onSelection(listSelected);
    };
    const addEventSelect = (el, id) => {
        el.addEventListener("click", ({ ctrlKey: isCtrl }) => {
            updateListSelected(id, isCtrl);
            activeDataSelected();
            onSelection(listSelected);
        });
    };
    const loadHeaderTable = () => {
        const header = document.createElement("thead");
        const body = document.createElement("tbody");
        header.setAttribute("table-header", "");
        body.setAttribute("table-data", "");
        const lineHeader = document.createElement("tr");
        headers.forEach(_header => {
            const cell = document.createElement("th");
            cell.innerHTML = _header.content;
            if (_header["data-select"]) {
                cell.setAttribute("data-table-select", "");
                const inputSelectAll = cell.querySelector(".bt-select-all-data");
                inputSelectAll && inputSelectAll.addEventListener("click", selectAllData);
            }
            lineHeader.appendChild(cell);
        });
        header.appendChild(lineHeader);
        tableEl.appendChild(header);
        tableEl.appendChild(body);
    };
    const loadDataTable = (data) => {
        const body = tableEl.querySelector("[table-data]");
        if (data.length == 0) {
            const cell = document.createElement("th");
            cell.setAttribute("colspan", `${headers.length}`);
            cell.textContent = "Nenhum resultado encontrado";
            return body.appendChild(cell);
        }
        body.innerHTML = "";
        data.forEach(_data => {
            const lineData = document.createElement("tr");
            const cell = document.createElement("td");
            if (headers[0]["data-select"])
                cell.innerHTML = headers[0]["data-select"];
            lineData.appendChild(cell);
            const headerId = headers.find(_header => { return _header.id; });
            lineData.setAttribute("data-id", headerId ? _data[`${headerId.header}`] : "");
            headerId && addEventSelect(lineData, _data[`${headerId.header}`]);
            headers.forEach(_header => {
                if (_header["data-select"]) {
                    return;
                }
                const cell = document.createElement("td");
                cell.textContent = _data[`${_header.header}`];
                lineData.appendChild(cell);
            });
            body.appendChild(lineData);
        });
    };
    const colResizable = () => {
        $(document).ready(function () {
            $('[table]').colResizable({
                ...colResizableProps, onResize: function () {
                    $('[table] th:nth-child(1)').css('max-width', '1.75rem');
                    colResizableProps.onResize();
                }
            });
        });
    };
    const setup = () => {
        insertColumnSelect();
        loadHeaderTable();
        colResizable();
    };
    setup();
    return {
        onLoad: loadDataTable
    };
}
function SelectionGroupComponent(form, props, pre) {
    const MAP_OPTIONS = [
        { type: "_newOne", icon: "plus-lg", _action: "_new", content: "Novo" },
        { type: "_newAll", icon: "list-ul", _action: "_new", content: "Adicionar Tudo", },
        { type: "_clear", icon: "x-lg", _action: "_cancel", content: "Limpar" },
    ];
    const GET_INPUT_VALUE = {
        text: (el) => { return el.value || ""; },
        "select-one": (el) => { return el.value || ""; },
        file: (el) => { return el.files ? el.files[0] || null : null; },
    };
    if (typeof props.isParent == "undefined") {
        props.isParent = true;
    }
    if (typeof props.updateList == "undefined") {
        props.updateList = true;
    }
    const getDataList = () => {
        const listSelected = [];
        const baseEl = form.querySelectorAll(`${props.basePath}`);
        baseEl.forEach((_base) => {
            const listBases = [];
            props.pathsValue.forEach((_path) => {
                const inputsEl = _base.querySelectorAll(`${_path.path}`);
                const values = [];
                inputsEl.forEach((_inputsEl) => {
                    const inputGroups = [];
                    _path.inputs.forEach((_input) => {
                        const inputEl = _inputsEl.querySelector(`${_input.path}`);
                        if (GET_INPUT_VALUE[`${inputEl.type}`]) {
                            const value = GET_INPUT_VALUE[`${inputEl.type}`](inputEl);
                            inputGroups.push({ value, type: _input.type });
                        }
                    });
                    values.push(inputGroups);
                });
                if (!_path.children) {
                    listBases.push({ values });
                }
                else {
                    listBases.push({ subMenu: values });
                }
            });
            listSelected.push(listBases);
        });
        return listSelected;
    };
    const MAP_OPTIONS_FUNCTION = {
        _newOne: (actionProcessActive = "") => {
            props.templates._new(actionProcessActive, form);
        },
        _newAll: () => {
            props.options.forEach((_option) => {
                MAP_OPTIONS_FUNCTION["_newOne"](_option.action);
            });
        },
        _clear: () => {
            const listEl = form.querySelectorAll("." + props.classBox);
            listEl.forEach((_el) => _el.remove());
        },
    };
    const createContainerActions = () => {
        const container = document.createElement("div");
        container.setAttribute("button-container", "");
        container.classList.add("select-group-actions");
        MAP_OPTIONS.forEach((_option) => {
            if (!props.actions.includes(_option.type)) {
                return;
            }
            const bt = document.createElement("button");
            const span = document.createElement("span");
            const icon = createIcon(_option.icon);
            bt.onclick = () => MAP_OPTIONS_FUNCTION[_option.type]();
            bt.setAttribute("action", _option._action);
            span.textContent = _option.content;
            bt.appendChild(icon);
            bt.appendChild(span);
            container.appendChild(bt);
        });
        form.appendChild(container);
    };
    const createListOptions = () => {
        const list = document.createElement("div");
        list.setAttribute("list-type", "vertical");
        list.classList.add(...props.classMenu);
        form.appendChild(list);
    };
    const setup = () => {
        createContainerActions();
        createListOptions();
        pre && pre.forEach((_preFunc) => MAP_OPTIONS_FUNCTION[_preFunc]());
    };
    const getData = () => { return getDataList(); };
    setup();
    return {
        getData,
    };
}
function NotificationControl(listNotificationEl) {
    const MAP_TYPES_NOTIFICATIONS = {
        "_success": {
            icon: "check-lg"
        },
        "_error": {
            icon: "dash-circle"
        },
        "_warning": {
            icon: "exclamation-circle"
        },
        "_info": {
            icon: "info-lg"
        },
        "_extra": {
            icon: "stars"
        },
    };
    function createNotification({ body, title, type }) {
        const notificationContent = document.createElement("div");
        const notification = document.createElement("div");
        const contentEl = document.createElement("div");
        const titleEl = document.createElement("span");
        const bodyEl = document.createElement("span");
        const actionEl = document.createElement("div");
        const icon = createIcon(MAP_TYPES_NOTIFICATIONS[type].icon);
        const loading = document.createElement("i");
        contentEl.classList.add("content");
        notificationContent.classList.add("notification-content");
        notification.classList.add("notification");
        actionEl.classList.add("status");
        actionEl.setAttribute("action", type);
        loading.classList.add("timer");
        titleEl.classList.add("title");
        bodyEl.classList.add("body");
        titleEl.innerHTML = title;
        bodyEl.innerHTML = body;
        actionEl.appendChild(icon);
        contentEl.appendChild(titleEl);
        contentEl.appendChild(bodyEl);
        notification.appendChild(loading);
        notification.appendChild(actionEl);
        notification.appendChild(contentEl);
        notificationContent.appendChild(notification);
        listNotificationEl.appendChild(notificationContent);
        const max = 1000 * 3;
        const update = 10;
        let cont = 0;
        let stopCont = false;
        let timerCont;
        notification.onmouseover = () => {
            stopCont = true;
        };
        notification.onmouseout = () => {
            stopCont = false;
        };
        notification.onclick = () => {
            clearInterval(timerCont);
            removeNotification(notificationContent);
        };
        timerCont = setInterval(() => {
            if (stopCont) {
                return;
            }
            if (cont >= max) {
                clearInterval(timerCont);
                removeNotification(notificationContent);
            }
            cont += update;
            let perc = Math.round((cont * 100) / max);
            loading.style.width = perc + "%";
        }, update);
    }
    function removeNotification(notification) {
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    const createIcon = (name, type = "bi") => {
        const iconEl = document.createElement("i");
        iconEl.classList.add(`${type}-${name}`);
        iconEl.setAttribute("icon", "");
        return iconEl;
    };
    const newNotification = (props) => {
        createNotification(props);
    };
    return {
        newNotification
    };
}
function ModelWindowComponent() {
    const createModel = (children, title = "", move = true) => {
        const model = document.createElement("div");
        const modelBody = document.createElement("div");
        model.setAttribute("model-window", "enabled");
        modelBody.setAttribute("model-body", "");
        setupModel(model, title, move);
        modelBody.appendChild(children);
        model.appendChild(modelBody);
        model.style.width = "80%";
        model.style.height = "450px";
        model.style.top = "20px";
        model.style.left = "50%";
        model.style.transform = "translateX(-50%)";
        return model;
    };
    const setupModel = (model, title, move = true) => {
        const headerModel = document.createElement("div");
        const titleEl = document.createElement("span");
        const btClose = document.createElement("button");
        titleEl.innerHTML = title;
        headerModel.classList.add("model-header");
        btClose.onclick = () => closeModel(model);
        btClose.appendChild(createIcon("x-lg"));
        headerModel.appendChild(titleEl);
        headerModel.appendChild(btClose);
        model.appendChild(headerModel);
        move && activeMoveModel(headerModel, model);
        openModel(model);
    };
    const activeMoveModel = (header, model) => {
        let mouseX, mouseY, elementX, elementY;
        let isPressed = false;
        const move = (ev) => {
            if (!isPressed) {
                return;
            }
            const parent = model.parentElement;
            const deltaX = ev.clientX - mouseX;
            const deltaY = ev.clientY - mouseY;
            const newElementX = elementX + deltaX;
            const newElementY = elementY + deltaY;
            const width = model.clientWidth;
            const height = model.clientHeight;
            const x = newElementX <= 0 ? 0 : parent ? newElementX + width >= parent.clientWidth ? parent.clientWidth - width : newElementX : newElementX;
            const y = newElementY <= 0 ? 0 : parent ? newElementY + height >= parent.clientHeight ? parent.clientHeight - height : newElementY : newElementY;
            model.style.left = x + "px";
            model.style.top = y + "px";
            model.style.transform = "none";
        };
        header.addEventListener("mousedown", (ev) => {
            ev.preventDefault();
            if (model.getAttribute("model-window") != "enabled") {
                return;
            }
            mouseX = ev.clientX;
            mouseY = ev.clientY;
            elementX = model.offsetLeft;
            elementY = model.offsetTop;
            isPressed = true;
        });
        window.addEventListener("mouseup", () => {
            isPressed = false;
        });
        window.addEventListener("mousemove", move);
        header.style.cursor = "move";
    };
    const openModel = (model) => {
        model.setAttribute("model-window", "enabled");
        const headerModel = model.querySelector(".header");
        if (!headerModel) {
            return;
        }
    };
    const closeModel = (model) => {
        model.remove();
    };
    return {
        createModel,
        activeMoveModel
    };
}
function FarmRepository() {
    const data = {
        tables: [], id: null, settings: _.cloneDeep({ ...GLOBAL_SETTINGS_RESET, isActive: false }),
        process: []
    };
    const setup = (props) => {
        props.tables.forEach(_modelTable => {
            addTable(_modelTable, _modelTable.code == "template.rate");
        });
        data.id = props.id;
        data.settings = { ..._.cloneDeep(props.settings), isActive: true };
        data.process = [..._.cloneDeep(props.process)];
    };
    const reset = () => {
        data.tables.splice(0, data.tables.length);
        data.process.splice(0, data.process.length);
        data.id = null;
        data.settings = _.cloneDeep({ ...GLOBAL_SETTINGS_RESET, isActive: false });
    };
    const addTable = (tableModel, saveOld = false) => {
        !saveOld && removeTable(tableModel);
        data.tables.push(tableModel);
    };
    const getTable = ({ code }) => {
        return _.cloneDeep(data.tables.reduce((acc, _table, index) => {
            if (_table.code == code) {
                acc.push({ ..._table, index });
            }
            return acc;
        }, []));
    };
    const removeTable = ({ code }) => {
        const modelTable = getTable({ code })[0];
        if (!modelTable) {
            return false;
        }
        data.tables.splice(modelTable.index, 1);
        return true;
    };
    const updateTable = ({ code, headers: newHeaders, table: newTable }) => {
        const modelTable = getTable({ code })[0];
        if (!modelTable) {
            return false;
        }
        if (newHeaders) {
            data.tables[modelTable.index].headers = newHeaders;
        }
        data.tables[modelTable.index].table = newTable;
        return true;
    };
    const updateHeaders = ({ code, headers: newHeaders }) => {
        const modelTable = getTable({ code })[0];
        if (!modelTable) {
            return false;
        }
        return updateTable({ code, table: modelTable.table, headers: newHeaders });
    };
    const getHeaders = ({ code, types = [], hasValue = true }) => {
        const modelTable = getTable({ code })[0];
        if (!modelTable) {
            return [];
        }
        if (types.length == 0) {
            return modelTable.headers;
        }
        return _.cloneDeep(modelTable.headers.filter(_header => {
            if (!hasValue && _header.value) {
                return false;
            }
            return types.includes(_header.type);
        }));
    };
    const updateSetting = (settings) => {
        data.settings = { ..._.cloneDeep(settings), isActive: true };
    };
    const getSettings = () => {
        return _.cloneDeep(data.settings);
    };
    const setupProcess = (process) => {
        data.process = _.cloneDeep(process);
    };
    const updateProcess = (process) => {
        const index = data.process.findIndex(_process => {
            return _process.type == process.type;
        });
        if (index < 0) {
            return;
        }
        data.process[index] = process;
    };
    const getProcess = ({ types } = { types: [] }) => {
        if (types.length > 0) {
            return _.cloneDeep(data.process).filter(_process => { return types.find(_type => { return _process.type == _type; }); });
        }
        return _.cloneDeep(data.process);
    };
    return {
        data,
        setup,
        reset,
        addTable,
        getTable,
        removeTable,
        updateTable,
        updateHeaders,
        getHeaders,
        updateSetting,
        getSettings,
        getProcess,
        updateProcess,
        setupProcess,
    };
}
function FarmControl(farmRepository) {
    const fileControl = FileControl(farmRepository);
    const tableControl = TableControl();
    const settingControl = SettingControl(farmRepository);
    const getHeadersWeight = ({ table }) => {
        const headersWeight = [];
        for (let j = 0; j < table[0].length; j++) {
            const column = table[0][j];
            const _column = replaceText({ val: column, searchValue: '"', replaceValue: '' });
            if (isNumber(_column)) {
                headersWeight.push({ header: column, type: "weight" });
            }
        }
        return headersWeight;
    };
    const uploadFilesPlants = ({ plants }, callback) => {
        let contFiles = 0;
        const updateContFiles = () => {
            contFiles++;
            if (contFiles == plants.length)
                callback && callback();
        };
        plants.forEach(plant => uploadFilePlant(plant, updateContFiles));
    };
    const uploadFilePlant = ({ code, file, headers, name }, callback) => {
        const { process: { converterStringTable: { separatorLine, separatorColumn, configSeparatorColumn } } } = settingControl.getSettings({ farm: true }, true).settings || settingControl.getSettings({ storage: true }, true).settings || _.cloneDeep(GLOBAL_SETTINGS);
        fileControl.getContentFile(file, result => {
            const table = tableControl.converterStringForTable({ value: result, separatorLine, separatorColumn, configSeparatorColumn });
            const tableModel = createPlant({ code, headers, table, name });
            addTable({ tableModel });
            callback();
        });
    };
    const createPlant = ({ headers, table, code, name }) => {
        const headersM = [];
        for (let i = 0; i < headers.length; i++) {
            const _header = headers[i];
            if (!_header.header) {
                continue;
            }
            if (_header.type != "selection-criteria" && _header.type != "rate") {
                headersM.push(_header);
                continue;
            }
            _header.header.split(",").forEach(a => headersM.push({ header: a, type: _header.type }));
        }
        const modelTable = { table, headers: headersM, code, name };
        return modelTable;
    };
    const createFarm = ({ plant, headers, name }) => {
        const logs = [];
        const table = new Array(plant.length).fill("").map(() => []);
        for (let i = 0; i < headers.length; i++) {
            tableControl.addColumn({ table, header: headers[i].header });
        }
        const modelTable = { table, headers, code: "farm", name };
        logs.push({ date: new Date(Date.now()), type: "success", message: `Create table farm successfully` });
        return { modelTable, logs };
    };
    const createTemplate = ({ tableBase, headers, code, name, settings }) => {
        const logs = [];
        const table = new Array(tableBase.length).fill("").map(() => []);
        for (let k = 0; k < headers.length; k++) {
            const headerName = settings.template.headerName[headers[k].type] || headers[k].header;
            tableControl.addColumn({ table, header: headerName, value: headers[k].value });
            if (headers[k].value) {
                continue;
            }
            const indexHeaderBase = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: tableBase[0] } });
            if (indexHeaderBase < 0) {
                continue;
            }
            for (let i = 1; i < tableBase.length; i++) {
                table[i][table[0].length - 1] = tableBase[i][indexHeaderBase];
            }
        }
        const modelTable = { table, headers, code, name };
        logs.push({ date: new Date(Date.now()), type: "success", message: `Create template "${code == "template.deadline" ? "deadline" : code == "template.price" ? "price" : ""}" successfully` });
        return { modelTable, logs };
    };
    const createTemplateRate = ({ tableBase, headers, value, code, name, settings }) => {
        const logs = [];
        const headerRate = getHeaders({ tableModel: { table: tableBase, headers: headers }, types: ["rate"] })[0];
        if (!headerRate) {
            logs.push({ type: "warning", message: `Column rate not found in "${name}"` });
            return { modelTable: null, logs };
        }
        headers.splice(tableControl.getIndex({ valueSearch: headerRate.header, where: { array: headers.map(_header => { return _header.header; }) } }), 1);
        const table = [];
        table.push([]);
        const indexHeaders = [];
        for (let c = 0; c < headers.length; c++) {
            const _header = headers[c];
            table[0].push(settings.template.headerName[_header.type] || _header.header);
            const indexHeader = tableControl.getIndex({ valueSearch: _header.header, where: { array: tableBase[0] } });
            if (indexHeader < 0) {
                if (headers[c].value) {
                    indexHeaders.push({ jB: -1, jT: table[0].length - 1, value: headers[c].value });
                }
                continue;
            }
            indexHeaders.push({ jB: indexHeader, jT: table[0].length - 1 });
        }
        const indexHeaderRate = tableControl.getIndex({ valueSearch: headerRate.header, where: { array: tableBase[0] } });
        if (indexHeaderRate < 0) {
            return { modelTable: null, logs };
        }
        for (let i = 1; i < tableBase.length; i++) {
            const cellRate = tableBase[i][indexHeaderRate];
            if (cellRate != value) {
                continue;
            }
            table.push([]);
            for (let j = 0; j < tableBase[i].length; j++) {
                for (let k = 0; k < indexHeaders.length; k++) {
                    const indexHeader = indexHeaders[k];
                    table[table.length - 1][indexHeader.jT] = indexHeader.value || tableBase[i][indexHeader.jB];
                }
            }
        }
        const modelTable = { table, headers, code, name };
        logs.push({ date: new Date(Date.now()), type: "success", message: `Create template rate "${name}" successfully` });
        return { modelTable: modelTable, logs };
    };
    const processFarm = ({ modelTables, settings, process }) => {
        const repoControl = FarmControl(FarmRepository());
        repoControl.setup({ id: null, settings, tables: modelTables, process });
        const PROCESS = {
            "process-plant": () => {
                const modelTablePlantPrice = repoControl.getTable({ code: "plant.price" })[0];
                const modelTablePlantDeadline = repoControl.getTable({ code: "plant.deadline" })[0];
                const headersPlantDeadline = modelTablePlantDeadline ? [
                    ...repoControl.getHeaders({ tableModel: modelTablePlantDeadline, types: ["cep.initial", "cep.final", "deadline", "excess", "rate", "selection-criteria"] }),
                ] : [];
                const headersPlantPrice = modelTablePlantPrice ? [
                    ...repoControl.getHeaders({ tableModel: modelTablePlantPrice }),
                    ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] }),
                ] : [];
                modelTablePlantPrice && repoControl.updateHeaders({ code: "plant.price", headers: headersPlantPrice });
                modelTablePlantDeadline && repoControl.updateHeaders({ code: "plant.deadline", headers: headersPlantDeadline });
                return { result: null };
            },
            "prepare-environment": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm) {
                    return { result: null };
                }
                const isProcessDeadline = repoControl.getProcess({ types: ["deadline+D"] })[0];
                const headerDeadline = repoControl.getHeaders({ code: "farm", types: ["deadline"] })[0];
                const headersFarm = isProcessDeadline ? [
                    ...repoControl.getHeaders({ code: "farm", types: ["cep.initial", "cep.final", "deadline"] }),
                    { header: `${headerDeadline.header}+${settings.process["deadline+D"]}`, type: "deadline+D" },
                    ...repoControl.getHeaders({ code: "farm", types: ["selection-criteria", "excess", "rate", "extra"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTableFarm.table[0]] })
                ] : [
                    ...repoControl.getHeaders({ code: "farm", types: ["cep.initial", "cep.final", "deadline"] }),
                    ...repoControl.getHeaders({ code: "farm", types: ["selection-criteria", "excess", "rate", "extra"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTableFarm.table[0]] })
                ];
                if (isProcessDeadline) {
                    const indexHeaderDeadline = tableControl.getIndex({ valueSearch: headerDeadline.header, where: { array: modelTableFarm.table[0] } });
                    if (indexHeaderDeadline < 0) {
                        return { result: null };
                    }
                    tableControl.addColumn({ table: modelTableFarm.table, header: `${headerDeadline.header}+${settings.process["deadline+D"]}`, index: indexHeaderDeadline + 1 });
                }
                repoControl.updateTable({ table: modelTableFarm.table, code: "farm", headers: headersFarm });
                return { result: null };
            },
            "create-farm": () => {
                const modelTablePlantPrice = repoControl.getTable({ code: "plant.price" })[0];
                const modelTablePlantDeadline = repoControl.getTable({ code: "plant.deadline" })[0];
                if (!modelTablePlantPrice || !modelTablePlantDeadline) {
                    return { result: null };
                }
                const isProcessDeadline = repoControl.getProcess({ types: ["deadline+D"] })[0];
                const isProcessProcv = repoControl.getProcess({ types: ["procv"] })[0];
                const headerDeadline = repoControl.getHeaders({ code: "plant.deadline", types: ["deadline"] })[0];
                let headersFarm = isProcessDeadline ? [
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["cep.initial", "cep.final", "deadline"] }),
                    { header: `${headerDeadline ? headerDeadline.header : "D"}+${settings.process["deadline+D"]}`, type: "deadline+D" },
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["selection-criteria", "rate"] }),
                ] : [
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["cep.initial", "cep.final", "deadline"] }),
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["selection-criteria", "rate"] }),
                ];
                if (isProcessProcv) {
                    headersFarm = [
                        ...headersFarm,
                        ...repoControl.getHeaders({ code: "plant.price", types: ["excess", "rate"] }),
                        ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
                    ];
                }
                const { modelTable: modelTableFarm, logs: logsCreateFarm } = createFarm({ headers: headersFarm, plant: modelTablePlantDeadline.table, name: "Fazenda" });
                const processResult = { logs: logsCreateFarm, type: "create-farm", situation: "finalized" };
                repoControl.addTable({ tableModel: modelTableFarm });
                return { result: processResult };
            },
            "insert-values": () => {
                if (!repoControl.getProcess({ types: ["create-farm"] })) {
                    return { result: null };
                }
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                const modelTablePlantDeadline = repoControl.getTable({ code: "plant.deadline" })[0];
                const modelTablePlantPrice = repoControl.getTable({ code: "plant.price" })[0];
                if (!modelTableFarm || !modelTablePlantDeadline || !modelTablePlantPrice) {
                    return { result: null };
                }
                const headerPlantValueDeadlineToFarm = [
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["cep.initial", "cep.final", "deadline"] }),
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["selection-criteria", "excess", "rate"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
                ];
                const { logs: logsInsertValues } = insertValues({ table: modelTableFarm.table, tablePlant: modelTablePlantDeadline.table, headers: headerPlantValueDeadlineToFarm });
                const processResult = { logs: logsInsertValues, type: "insert-values", situation: "finalized" };
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
                return { result: processResult };
            },
            "remove-character": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm) {
                    return { result: null };
                }
                const columns = ["cep.initial", "cep.final"];
                const characters = ["-"];
                const processResult = { logs: [], type: "insert-values" };
                columns.forEach(_column => {
                    const header = repoControl.getHeaders({ tableModel: modelTableFarm, types: [_column] })[0];
                    const indexColumn = tableControl.getIndex({ valueSearch: header?.header, where: { array: modelTableFarm.table[0] } });
                    const successRemove = tableControl.removeCharacter({ table: modelTableFarm.table, characters, options: { specific: { column: indexColumn }, excludes: { line: [0] } } });
                    processResult.logs.push({ type: successRemove ? "success" : "alert", message: `${successRemove ? `Success in removing the characters${header ? ` in header ${header.header}` : ``}` : `Unable to remove character`}` });
                });
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
                processResult.situation = "finalized";
                return { result: processResult };
            },
            "deadline+D": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm || !repoControl.getProcess({ types: ["insert-values"] })[0]) {
                    return { result: null };
                }
                const { logs: logsInsertValuesDMoreOne } = insertValuesDMoreOne({ tableModel: modelTableFarm, tableBase: _.cloneDeep(modelTableFarm), settings });
                const processResult = { logs: logsInsertValuesDMoreOne, type: "deadline+D", situation: "finalized" };
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
                return { result: processResult };
            },
            "order-table": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm) {
                    return { result: null };
                }
                const indexColumn = tableControl.getIndex({ valueSearch: repoControl.getHeaders({ tableModel: { table: modelTableFarm.table, headers: modelTableFarm.headers }, types: ["cep.initial"] })[0]?.header, where: { array: modelTableFarm.table[0] } });
                modelTableFarm.table = tableControl.orderTable({ table: modelTableFarm.table, column: indexColumn });
                const processResult = { logs: [{ type: "success", message: `Table farm ordered with successfully` }], type: "order-table", situation: "finalized" };
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
                return { result: processResult };
            },
            "contained-cep": () => {
                PROCESS["order-table"]();
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm) {
                    return { result: null };
                }
                const { logs: logsValidateContainedCEP } = validateContainedCEP({ table: modelTableFarm });
                const processResult = { logs: logsValidateContainedCEP, type: "contained-cep", situation: "finalized" };
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
                return { result: processResult };
            },
            "procv": () => {
                if (repoControl.getProcess({ types: ["create-farm", "insert-values"] }).length != 2) {
                    return { result: null };
                }
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                const modelTablePlantPrice = repoControl.getTable({ code: "plant.price" })[0];
                if (!modelTableFarm || !modelTablePlantPrice) {
                    return { result: null };
                }
                const headerPlantValuePriceToFarm = [
                    ...repoControl.getHeaders({ tableModel: modelTablePlantPrice, types: ["excess", "rate", "selection-criteria"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
                ];
                const { logs: logsInsertProcvValues } = insertProcvValues({ tableModel: modelTableFarm, tableBase: { table: modelTablePlantPrice.table, code: "plant.price", headers: headerPlantValuePriceToFarm }, headers: headerPlantValuePriceToFarm, settings });
                const processResult = { logs: logsInsertProcvValues, type: "procv", situation: "finalized" };
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
                return { result: processResult };
            },
            "template": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                const modelTableDeadline = repoControl.getTable({ code: "plant.deadline" })[0];
                const headerDeadline = repoControl.getHeaders({ tableModel: modelTableFarm, types: ["deadline+D"] })[0] || repoControl.getHeaders({ tableModel: modelTableFarm, types: ["deadline"] })[0];
                const headersTemplateDeadline = headerDeadline ? [
                    { header: settings.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: settings.template.cepOriginValue["cep.origin.initial"] },
                    { header: settings.template.headerName["cep.origin.final"], type: "cep.origin.final", value: settings.template.cepOriginValue["cep.origin.final"] },
                    ...repoControl.getHeaders({ tableModel: modelTableFarm || modelTableDeadline, types: ["cep.initial", "cep.final"] }),
                    headerDeadline
                ] : [
                    { header: settings.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: settings.template.cepOriginValue["cep.origin.initial"] },
                    { header: settings.template.headerName["cep.origin.final"], type: "cep.origin.final", value: settings.template.cepOriginValue["cep.origin.final"] },
                    ...repoControl.getHeaders({ tableModel: modelTableFarm || modelTableDeadline, types: ["cep.initial", "cep.final"] }),
                ];
                const headersTemplatePrice = modelTableFarm ? [
                    { header: settings.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: settings.template.cepOriginValue["cep.origin.initial"] },
                    { header: settings.template.headerName["cep.origin.final"], type: "cep.origin.final", value: settings.template.cepOriginValue["cep.origin.final"] },
                    ...repoControl.getHeaders({ tableModel: modelTableFarm, types: ["cep.initial", "cep.final", "excess"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTableFarm.table[0]] }),
                ] : [];
                const modelTemplates = [];
                modelTemplates.push({ code: "template.deadline", headers: headersTemplateDeadline, table: modelTableFarm.table, name: "Template Prazo" });
                headersTemplatePrice.length > 0 && modelTemplates.push({ code: "template.price", headers: headersTemplatePrice, table: modelTableFarm.table, name: "Template Preço" });
                const processResult = { logs: [], type: "template" };
                for (let i = 0; i < modelTemplates.length; i++) {
                    const { modelTable: modelTableTemplate, logs: logsTableTableTemplate } = createTemplate({ ...modelTemplates[i], settings, tableBase: modelTableFarm.table });
                    processResult.logs = [
                        ...processResult.logs,
                        ...logsTableTableTemplate
                    ];
                    repoControl.addTable({ tableModel: modelTableTemplate });
                }
                processResult.situation = "finalized";
                return { result: processResult };
            },
            "rate": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                const modelTablePlantDeadline = repoControl.getTable({ code: "plant.deadline" })[0];
                const headersTemplateRate = modelTableFarm || modelTablePlantDeadline ? [
                    { header: settings.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: settings.template.rateValue["cep.origin.initial"] },
                    { header: settings.template.headerName["cep.origin.final"], type: "cep.origin.final", value: settings.template.rateValue["cep.origin.final"] },
                    ...repoControl.getHeaders({ tableModel: modelTableFarm || modelTablePlantDeadline, types: ["cep.initial", "cep.final"] })
                ] : [];
                const modelHeadersRate = [];
                if (headersTemplateRate.length > 0) {
                    if (modelTableFarm) {
                        modelHeadersRate.push({ table: modelTableFarm.table, headers: repoControl.getHeaders({ tableModel: modelTableFarm, types: ["rate"] }) });
                    }
                    else {
                        if (modelTablePlantDeadline) {
                            modelHeadersRate.push({ table: modelTablePlantDeadline.table, headers: repoControl.getHeaders({ tableModel: modelTablePlantDeadline, types: ["rate"] }) });
                        }
                    }
                }
                const processResult = { logs: [], type: "rate" };
                for (let c = 0; c < modelHeadersRate.length; c++) {
                    const _modelHeaderRate = modelHeadersRate[c];
                    for (let d = 0; d < _modelHeaderRate.headers.length; d++) {
                        const _headerRate = _modelHeaderRate.headers[d];
                        const indexHeader = tableControl.getIndex({ valueSearch: _headerRate.header, where: { array: _modelHeaderRate.table[0] } });
                        if (indexHeader < 0) {
                            continue;
                        }
                        const rateValues = tableControl.getDistinctColumnValues({ table: _modelHeaderRate.table, columnIndex: indexHeader, excludes: { line: 0 } });
                        if (rateValues.length == 1) {
                            const name = `Template Taxa - ${_headerRate.header + ": " + rateValues[0]} _G`;
                            const modelTable = { table: [], headers: [], code: "template.rate", name };
                            repoControl.addTable({ tableModel: modelTable, saveOld: true });
                            continue;
                        }
                        for (let e = 0; e < rateValues.length; e++) {
                            const _rateValue = rateValues[e];
                            if (!_rateValue || (isNumber(_rateValue) && Number(_rateValue) <= 0)) {
                                continue;
                            }
                            const name = `Template Taxa - ${_headerRate.header + ": " + rateValues[e]} _N`;
                            const { modelTable: modelTableTemplateRate, logs: logsCreateTemplateRate } = createTemplateRate({ tableBase: _modelHeaderRate.table, code: "template.rate", name, headers: [...headersTemplateRate, _headerRate], value: _rateValue, settings });
                            processResult.logs = [
                                ...processResult.logs,
                                ...logsCreateTemplateRate
                            ];
                            if (!modelTableTemplateRate) {
                                continue;
                            }
                            repoControl.addTable({ tableModel: modelTableTemplateRate, saveOld: true });
                        }
                    }
                }
                processResult.situation = "finalized";
                return { result: processResult };
            }
        };
        if (repoControl.getData().tables.length == 0) {
            return;
        }
        PROCESS["process-plant"]();
        if (!repoControl.getProcess({ types: ["create-farm"] })[0]) {
            PROCESS["prepare-environment"]();
        }
        process.forEach(_process => {
            const result = PROCESS[_process.type]();
            if (result.result) {
                repoControl.updateProcess({
                    process: result.result
                });
            }
        });
        return repoControl.getData();
    };
    const insertValues = ({ tablePlant, table, headers }) => {
        const logs = [];
        for (let k = 0; k < headers.length; k++) {
            const indexColumnHeader = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: table[0] } });
            const indexColumnHeaderPlant = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: tablePlant[0] } });
            if (indexColumnHeader < 0 || indexColumnHeaderPlant < 0) {
                logs.push({ type: "alert", message: `Column "${headers[k].header}" not found in plant` });
                continue;
            }
            for (let i = 1; i < table.length; i++) {
                table[i][indexColumnHeader] = tablePlant[i][indexColumnHeaderPlant];
            }
        }
        logs.push({ date: new Date(Date.now()), type: logs.length == 0 ? "success" : "alert", message: `Table values inserted successfully${logs.length != 0 ? ". But no values for Cep" : ""}` });
        return { logs };
    };
    const insertValuesDMoreOne = ({ tableModel, tableBase, settings }) => {
        const logs = [];
        const headerDeadline = getHeaders({ tableModel: tableBase, types: ["deadline"] })[0];
        const indexHeaderDeadline = tableControl.getIndex({ valueSearch: headerDeadline?.header || "", where: { array: tableBase.table[0] } });
        const indexHeaderDeadlineMoreD = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: tableModel, types: ["deadline+D"] })[0]?.header || "", where: { array: tableModel.table[0] } });
        if (indexHeaderDeadline < 0 || indexHeaderDeadlineMoreD < 0) {
            !indexHeaderDeadline && logs.push({ type: "warning", message: `Column "${getHeaders({ tableModel: tableModel, types: ["deadline+D"] })[0]?.header || "Deadline"}" not found in plant deadline` });
            return { logs };
        }
        const valueD = Number(settings.process["deadline+D"]);
        for (let i = 1; i < tableModel.table.length; i++) {
            tableModel.table[i][indexHeaderDeadlineMoreD] = `${Number(tableBase.table[i][indexHeaderDeadline]) + valueD}`;
        }
        logs.push({ date: new Date(Date.now()), type: "success", message: `Deadline +${settings.process["deadline+D"]} successfully added` });
        return { logs };
    };
    const validateContainedCEP = ({ table }) => {
        const logs = [];
        const indexHeaderCepInitial = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: table, types: ["cep.initial"] })[0]?.header || "", where: { array: table.table[0] } });
        const indexHeaderCepFinal = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: table, types: ["cep.final"] })[0]?.header || "", where: { array: table.table[0] } });
        if (indexHeaderCepInitial < 0 || indexHeaderCepFinal < 0) {
            indexHeaderCepInitial < 0 && logs.push({ type: "error", message: `"${getHeaders({ tableModel: table, types: ["cep.initial"] })[0]?.header || "Cep initial"}" not found` });
            indexHeaderCepFinal < 0 && logs.push({ type: "error", message: `"${getHeaders({ tableModel: table, types: ["cep.final"] })[0]?.header || "Cep final"}" not found` });
            return { logs };
        }
        for (let i = 1; i < table.table.length; i++) {
            const matCepInitial = Number(table.table[i][indexHeaderCepInitial]);
            const matCepFinal = Number(table.table[i][indexHeaderCepFinal]);
            const calcSameRange = matCepFinal - matCepInitial;
            if (calcSameRange < 0) {
                logs.push({ type: "warning", message: `${i}: ${matCepFinal} < ${matCepInitial} != ${calcSameRange}` });
            }
            if (i > 1) {
                const calcFinalInitial = matCepInitial - Number(table.table[i - 1][indexHeaderCepFinal]);
                if (calcFinalInitial < 0) {
                    logs.push({ type: "warning", message: `${i}: ${matCepInitial} < ${i - 1}: ${table.table[i - 1][indexHeaderCepFinal]} != ${calcFinalInitial}` });
                }
            }
        }
        logs.push({ date: new Date(Date.now()), type: logs.length == 0 ? "success" : "alert", message: logs.length == 0 ? `There is no Cep contained` : `There is Cep contained` });
        return { logs };
    };
    const insertProcvValues = ({ headers, tableModel, tableBase, settings }) => {
        const logs = [];
        const headersSelectionCriteria = getHeaders({ tableModel, types: ["selection-criteria"] });
        for (let i = 1; i < tableModel.table.length; i++) {
            for (let k = 0; k < headers.length; k++) {
                const indexHeader = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: tableModel.table[0] } });
                if (indexHeader < 0) {
                    continue;
                }
                const csF = getSelectionCriteria({ table: tableModel.table, i, headers: headersSelectionCriteria, settings });
                const procvValue = procv({ valueScSearch: csF, header: headers[k].header, tableBase, settings });
                if (!procvValue) {
                    logs.push({ type: "alert", message: `Criteria selection '${csF}' not found in table "${tableBase.code == "plant.deadline" || tableBase.code == "template.deadline" ? "deadline" : tableBase.code == "template.price" || tableBase.code == "plant.price" ? "price" : tableBase.code == "template.rate" ? "rate" : tableBase.code}"` });
                }
                tableModel.table[i][indexHeader] = procvValue;
            }
        }
        logs.push({ date: new Date(Date.now()), type: logs.length == 0 ? "success" : "alert", message: `Table values inserted whit procv successfully${logs.length != 0 ? ". But there are discrepancies" : ""}` });
        return { logs };
    };
    function getSelectionCriteria({ table, i, headers, settings }) {
        const sc = [];
        headers.forEach(_header => {
            const indexColumn = table[0].indexOf(_header.header);
            indexColumn >= 0 && sc.push(table[i][indexColumn]);
        });
        return sc.join(settings.process["criteria.selection"].join);
    }
    const procv = ({ tableBase, valueScSearch, header, settings }) => {
        const indexHeaderPlant = tableControl.getIndex({ valueSearch: header, where: { array: tableBase.table[0] } });
        const headersSelectionCriteria = getHeaders({ tableModel: tableBase, types: ["selection-criteria"] });
        if (indexHeaderPlant < 0 || headersSelectionCriteria.length == 0) {
            return "";
        }
        for (let i = 1; i < tableBase.table.length; i++) {
            const csB = getSelectionCriteria({ i, headers: headersSelectionCriteria, table: tableBase.table, settings });
            if (!csB) {
                continue;
            }
            if (`${csB}` != `${valueScSearch}`) {
                continue;
            }
            return tableBase.table[i][indexHeaderPlant];
        }
        return "";
    };
    const getData = () => {
        return _.cloneDeep(farmRepository.data);
    };
    const setup = (props) => {
        farmRepository.setup(props);
    };
    const reset = () => {
        farmRepository.reset();
    };
    const addTable = (props) => {
        farmRepository.addTable(props.tableModel, props.saveOld);
    };
    const getTable = (props) => {
        return _.cloneDeep(farmRepository.getTable(props));
    };
    const removeTable = (props) => {
        return farmRepository.removeTable(props);
    };
    const updateTable = (props) => {
        return farmRepository.updateTable(props);
    };
    const updateHeaders = (props) => {
        return farmRepository.updateHeaders(props);
    };
    function getHeaders({ tableModel, code, types = [] }) {
        if (code) {
            return _.cloneDeep(farmRepository.getHeaders({ code, types }));
        }
        if (!tableModel) {
            return [];
        }
        if (types.length == 0) {
            return tableModel.code ? farmRepository.getHeaders({ code: tableModel.code }) : [];
        }
        const headers = [];
        for (let k = 0; k < types.length; k++) {
            for (let j = 0; j < tableModel.headers.length; j++) {
                const _header = tableModel.headers[j];
                if (_header.type == types[k]) {
                    headers.push(_header);
                }
            }
        }
        return headers;
    }
    const updateSetting = (props) => {
        farmRepository.updateSetting(props.settings);
    };
    const getSettings = () => {
        return _.cloneDeep(farmRepository.getSettings());
    };
    const setupProcess = (props) => {
        farmRepository.setupProcess(props.process);
    };
    const updateProcess = (props) => {
        farmRepository.updateProcess(props.process);
    };
    const getProcess = (props) => {
        return farmRepository.getProcess(props);
    };
    return {
        createFarm,
        getData,
        uploadFilesPlants,
        getSelectionCriteria,
        processFarm,
        setup,
        reset,
        addTable,
        getTable,
        removeTable,
        updateTable,
        updateHeaders,
        getHeaders,
        updateSetting,
        getSettings,
        updateProcess,
        getProcess,
        getHeadersWeight,
        insertValues,
        insertProcvValues,
        createTemplate,
        createTemplateRate,
        validateContainedCEP,
        insertValuesDMoreOne,
        setupProcess
    };
}
function FileControl(farmRepository) {
    const settingControl = SettingControl(farmRepository);
    const getContentFile = (file, onload, onerror) => {
        if (!file) {
            return { error: { msg: "File not defined" } };
        }
        const reader = new FileReader();
        reader.readAsText(file, "ISO-8859-1");
        reader.onload = ({ target: { result } }) => { onload(result); };
        reader.onerror = onerror || function (err) { console.log(err); };
    };
    const getContentInFormatCSV = (table) => {
        let csvContent = "";
        const { settings } = settingControl.getSettings({ farm: true });
        table.forEach(function (rowArray) {
            const row = rowArray.join(settings.process.converterStringTable.separatorColumn);
            csvContent += row + "\r\n";
        });
        return csvContent;
    };
    const createFile = ({ content, type = "text/csv", charset = "ISO-8859-1" }) => {
        const file = new Blob(content, {
            type: `${type};charset=${charset};`
        });
        return file;
    };
    const createObjectURL = (obj) => {
        return URL.createObjectURL(obj);
    };
    const createFileZip = ({ files }) => {
        const zip = new JSZip();
        files.forEach(({ file, name }) => {
            zip.file(`${name}.csv`, file);
        });
        return zip;
    };
    return {
        getContentFile,
        getContentInFormatCSV,
        createFile,
        createFileZip,
        createObjectURL,
    };
}
function HistoryTableControl() {
    const controlDB = ControlDataBase();
    const KEY = "history";
    const setup = (value) => {
        controlDB.updateItem(KEY, value);
    };
    const addHistory = (data, parent = null) => {
        const history = controlDB.getItem(KEY) || [...GLOBAL_HISTORY];
        if (!history) {
            return { id: null };
        }
        const dataModel = { data, id: generatedId(), parent: parent || null, date: new Date(Date.now()) };
        history.push(dataModel);
        console.log(history);
        controlDB.updateItem(KEY, history);
        return { id: dataModel.id };
    };
    const clearHistory = () => {
        controlDB.removeItem(KEY);
    };
    const getData = ({ id }) => {
        const history = controlDB.getItem(KEY);
        if (!history || !id) {
            return { data: null, index: null, id: null, parent: null, date: null };
        }
        for (let i = 0; i < history.length; i++) {
            if (history[i].id != id) {
                continue;
            }
            return { ...history[i], index: i };
        }
        return { data: null, index: null, id: null, parent: null, date: null };
    };
    const getHistory = () => {
        const history = controlDB.getItem(KEY, ["separatorLine"]) || GLOBAL_HISTORY;
        return { history };
    };
    const getPreviousVersion = (parent) => {
        const { history } = getHistory();
        if (!parent || !history) {
            return null;
        }
        for (let i = history.length - 1; i >= 0; i--) {
            const _ver = history[i];
            if (_ver.id != parent) {
                continue;
            }
            return _ver;
        }
        return null;
    };
    const getNewVersions = (id) => {
        const { history } = getHistory();
        const versions = [];
        if (!id || !history) {
            return [];
        }
        for (let i = 0; i < history.length; i++) {
            const _ver = history[i];
            if (_ver.parent != id) {
                continue;
            }
            versions.push(_ver);
        }
        return versions;
    };
    const getVersion = ({ id, indicator }) => {
        const { parent: parentRef, id: idVersionRef } = getData({ id });
        const { history } = getHistory();
        if (!history) {
            return [];
        }
        const actions = {
            previous: () => {
                if (!parentRef) {
                    return [];
                }
                const lastVersion = getPreviousVersion(parentRef);
                return [lastVersion];
            },
            _new: () => {
                if (!idVersionRef) {
                    return [];
                }
                return getNewVersions(idVersionRef);
            }
        };
        return actions[indicator] ? actions[indicator]() : [];
    };
    const updateHistory = (id, value) => {
        const { index } = getData({ id });
        if (!index) {
            return false;
        }
        addHistory(value, id);
        return true;
    };
    return {
        addHistory,
        getHistory,
        updateHistory,
        getVersion,
        getData,
        clearHistory,
        setup,
    };
}
function SettingControl(farmRepository) {
    const controlDB = ControlDataBase();
    const KEY = "setting";
    const updateSettings = (settings) => {
        controlDB.updateItem(KEY, settings);
    };
    const clearSettings = () => {
        controlDB.removeItem(KEY);
    };
    const getSettings = (where = { farm: false, storage: false, global: false }, onlyWhere = false) => {
        if (where.storage) {
            const settings = controlDB.getItem(KEY, ["separatorLine"]);
            if (onlyWhere) {
                return { settings };
            }
            return { settings: settings || _.cloneDeep(GLOBAL_SETTINGS) };
        }
        if (where.farm) {
            const set = _.cloneDeep(farmRepository.getSettings());
            if (onlyWhere) {
                return { settings: set.isActive ? set : null };
            }
            return { settings: set.isActive ? set : _.cloneDeep(GLOBAL_SETTINGS) };
        }
        if (where.global)
            return { settings: _.cloneDeep(GLOBAL_SETTINGS) };
        return { settings: controlDB.getItem(KEY, ["separatorLine"]) || _.cloneDeep(GLOBAL_SETTINGS) || _.cloneDeep(farmRepository.getSettings()) };
    };
    return {
        updateSettings,
        getSettings,
        clearSettings,
    };
}
function TableControl() {
    const converterStringForTable = ({ value, configSeparatorColumn, separatorColumn, separatorLine }) => {
        if (!value) {
            return [];
        }
        const table = [];
        const ABC = "abcdefghijklmnopqrstuvwxyv";
        const MAP_REPLACE_VALUE = "!@#$%&*()-=_+§|\\//{}[]^~`´ºª:;<>,.?" + ABC + ABC.toUpperCase();
        const replaceValue = configSeparatorColumn.replaceValue || (function () {
            for (let i = 0; i < MAP_REPLACE_VALUE.length; i++) {
                const character = MAP_REPLACE_VALUE[i];
                if (!value.includes(character)) {
                    return character;
                }
            }
            return null;
        }());
        if (!replaceValue) {
            return [];
        }
        value.split(separatorLine).forEach(line => {
            const columns = !configSeparatorColumn ? line.split(separatorColumn) : replaceText({ val: line, searchValue: separatorColumn, replaceValue, betweenText: configSeparatorColumn.betweenText }).split(separatorColumn);
            table.push(columns);
        });
        table.forEach((line, i) => {
            line.forEach((column, j) => {
                table[i][j] = replaceText({ val: column, searchValue: replaceValue, replaceValue: configSeparatorColumn.searchValue });
            });
        });
        return removeLinesEmpty({ table });
    };
    const removeLinesEmpty = ({ table }) => {
        return table.filter(row => row.some(cell => cell));
    };
    const getIndex = ({ valueSearch, where, options, method = "filled" }) => {
        if (!valueSearch || !where) {
            return -1;
        }
        if (where.table) {
            if (!options) {
                return -1;
            }
            if (typeof options.line != "undefined") {
                for (let j = 0; j < where.table[options.line].length; j++) {
                    const el = where.table[options.line][j];
                    const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? j : -1;
                    if (index >= 0) {
                        return index;
                    }
                }
            }
            for (let i = 0; i < where.table.length; i++) {
                if (typeof options.column != "undefined") {
                    const el = where.table[i][options.column];
                    const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? i : -1;
                    if (index >= 0) {
                        return index;
                    }
                }
                for (let j = 0; j < where.table[i].length; j++) {
                    const el = where.table[i][j];
                    const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? j : -1;
                    if (index >= 0) {
                        return index;
                    }
                }
            }
        }
        if (where.array) {
            for (let i = 0; i < where.array.length; i++) {
                const el = where.array[i];
                const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? i : -1;
                if (index >= 0) {
                    return index;
                }
            }
            return -1;
        }
        if (where.cell) {
            const index = method == "some" ? where.cell.indexOf(valueSearch) : where.cell == valueSearch ? 0 : -1;
            if (index >= 0) {
                return index;
            }
        }
        return -1;
    };
    const copyTable = ({ tablePlant }) => {
        const tableCopied = [];
        for (let i = 0; i < tablePlant.length; i++) {
            const row = [];
            for (let j = 0; j < tablePlant[i].length; j++) {
                const cell = tablePlant[i][j];
                row.push(cell);
            }
            tableCopied.push(row);
        }
        return tableCopied;
    };
    const getTableFiltering = ({ indexColumn, table: tableBase, value }) => {
        const table = [];
        for (let i = 0; i < tableBase.length; i++) {
            if (tableBase[i][indexColumn] == value) {
                table.push(tableBase[i]);
            }
        }
        return table;
    };
    const getDistinctColumnValues = ({ columnIndex, table, excludes = { line: -1 } }) => {
        const column = table.map(row => row[columnIndex]);
        return column.filter((value, index, self) => {
            if (excludes.line == index) {
                return false;
            }
            return self.indexOf(value) === index;
        });
    };
    const addColumn = ({ table, header = "", index, value = "" }) => {
        if (index)
            table[0].splice(index, 0, header);
        else
            table[0].push(header);
        for (let i = 1; i < table.length; i++) {
            if (index)
                table[i].splice(index, 0, value);
            else
                table[i].push(value);
        }
    };
    const removeCharacter = ({ characters, table, options }) => {
        if (options && options.specific) {
            if (typeof options.specific.line != "undefined") {
                for (let j = 0; j < table[options.specific.line].length; j++) {
                    if (options.excludes && options.excludes.column && options.excludes.column.indexOf(j) >= 0) {
                        continue;
                    }
                    for (let k = 0; k < characters.length; k++) {
                        const character = characters[k];
                        table[options.specific.line][j] = replaceText({ val: table[options.specific.line][j], searchValue: character, replaceValue: "" });
                    }
                }
                return true;
            }
            if (typeof options.specific.column != "undefined") {
                for (let i = 0; i < table.length; i++) {
                    if (options.excludes && options.excludes.line && options.excludes.line.indexOf(i) >= 0) {
                        continue;
                    }
                    for (let k = 0; k < characters.length; k++) {
                        const character = characters[k];
                        table[i][options.specific.column] = replaceText({ val: table[i][options.specific.column], searchValue: character, replaceValue: "" });
                    }
                }
            }
            return true;
        }
        for (let i = 0; i < table.length; i++) {
            if (options && options.excludes && options.excludes.line && options.excludes.line.indexOf(i) >= 0) {
                continue;
            }
            for (let j = 0; j < table[i].length; j++) {
                if (options && options.excludes && options.excludes.column && options.excludes.column.indexOf(j) >= 0) {
                    continue;
                }
                for (let k = 0; k < characters.length; k++) {
                    const character = characters[k];
                    table[i][j] = replaceText({ val: table[i][j], searchValue: character, replaceValue: "" });
                }
            }
        }
        return true;
    };
    const orderTable = ({ column, table }) => {
        const headers = table[0];
        const _table = table.splice(1, table.length);
        const _tableOrdered = _table.sort(function (a, b) {
            return Number(a[column]) - Number(b[column]);
        });
        _tableOrdered.unshift(headers);
        return _tableOrdered;
    };
    return {
        converterStringForTable,
        copyTable,
        getIndex,
        getTableFiltering,
        getDistinctColumnValues,
        addColumn,
        removeCharacter,
        orderTable,
        removeLinesEmpty,
    };
}
function TestControl() {
    const farmRepository = FarmRepository();
    const farmControl = FarmControl(farmRepository);
    const tableControl = TableControl();
    const getRange = ({ table, headers, indexRow, settings }) => {
        const tableHeaders = [...headers.filter(_header => { return _header.type != "selection-criteria"; }).map(_header => { return _header; })];
        const range = [tableHeaders.map(_header => { return _header.header; }), []];
        if (indexRow < 0) {
            return { table: [range[0], range[0].map(_a => { return ""; })], headers: tableHeaders };
        }
        const headersCS = [];
        for (let i = 0; i < headers.length; i++) {
            const _headers = headers[i];
            const indexColumn = tableControl.getIndex({ valueSearch: _headers.header, where: { array: table[0] } });
            if (indexColumn < 0) {
                continue;
            }
            if (_headers.type == "selection-criteria") {
                headersCS.push(_headers);
                headers.splice(i, 0);
                continue;
            }
            range[1].push(table[indexRow][indexColumn]);
        }
        const cs = farmControl.getSelectionCriteria({ i: indexRow, headers: headersCS, table, settings });
        range[0].push("CS");
        range[1].push(cs);
        tableHeaders.push({ header: range[0][range[0].length - 1], type: "selection-criteria" });
        return { table: range, headers: tableHeaders };
    };
    const getIndexByCep = ({ cep, headers, table }) => {
        if (!getIndexByCep || headers.length != 2) {
            return -1;
        }
        const indexColumnCepInitial = tableControl.getIndex({ valueSearch: headers[0].header, where: { array: table[0] } });
        const indexColumnCepFinal = tableControl.getIndex({ valueSearch: headers[1].header, where: { array: table[0] } });
        for (let i = 1; i < table.length; i++) {
            const cepInitial = table[i][indexColumnCepInitial];
            const cepFinal = table[i][indexColumnCepFinal];
            if (cep < cepInitial || cep > cepFinal) {
                continue;
            }
            return i;
        }
        return -1;
    };
    const getRandomCep = ({ table, headers }) => {
        const indexRange = Math.floor(Math.random() * (table.length - 1)) + 1;
        const indexColumnCepInitial = tableControl.getIndex({ valueSearch: headers[0].header, where: { array: table[0] } });
        const indexColumnCepFinal = tableControl.getIndex({ valueSearch: headers[1].header, where: { array: table[0] } });
        const initial = Number(table[indexRange][indexColumnCepInitial]);
        const final = Number(table[indexRange][indexColumnCepFinal]);
        const value = Math.round(Math.random() * (final - initial)) + initial;
        return `${value}`;
    };
    return {
        getRandomCep,
        getRange,
        getIndexByCep,
    };
}
function PanelControl() {
    const modelWindow = ModelWindowComponent();
    const routerControl = RouterControl();
    let panelList;
    let abaList;
    let panelActive = null;
    const initComponents = (listPanel, listAba) => {
        panelList = listPanel;
        abaList = listAba;
    };
    const createPanel = (id, name, parent, callback) => {
        if (!name) {
            return null;
        }
        const panelEl = document.createElement("div");
        panelEl.setAttribute("id", `${id}`);
        panelEl.setAttribute("panel", `${name}`);
        panelEl.setAttribute("model-window-parent", "");
        loadPanel(panelEl, id, name, parent, (res) => {
            if (!res) {
                return callback(null);
            }
            callback(panelEl);
        });
    };
    const newPanel = ({ name, title, __dev, active }, isCtrl) => {
        if (GLOBAL_DEPENDENCE != "development") {
            if (__dev) {
                return;
            }
            if (!active) {
                return;
            }
        }
        if (!isCtrl && getPanelByName(name)) {
            return;
        }
        const id = generatedId();
        const { bt: closePanel, el: aba } = createAba(title, id);
        createPanel(id, name, panelList, (panel) => {
            if (!isCtrl || !getPanelByName(name)) {
                togglePanel(id);
            }
            aba.addEventListener("mousedown", (ev) => ev.button == 1 && removePanelModel(id));
            aba.addEventListener("click", ({ altKey }) => {
                if (altKey) {
                    return removePanelModel(id);
                }
                togglePanel(id);
            });
            closePanel.addEventListener("click", () => removePanelModel(id));
            abaList.appendChild(aba);
        });
    };
    const loadPanel = (panel, id, name, parent, callback) => {
        const responseRouter = routerControl.getRouter({ name });
        if (!responseRouter) {
            panel.innerHTML = GLOBAL_ROUTER_NOT_FOUND;
        }
        else {
            const { router, script } = responseRouter;
            routerControl.query({ router }, ({ data, error }) => {
                if (!data || error) {
                    panel.innerHTML = error?.msg || GLOBAL_ROUTER_NOT_FOUND;
                    return callback(false);
                }
                if (!GLOBAL_MODULE_SCRIPTS[`${script}`]) {
                    panel.innerHTML = "Cannot load page";
                    return callback(false);
                }
                panel.innerHTML = data;
                parent.appendChild(panel);
                if (GLOBAL_MODULE_SCRIPTS[`${script}`](id).error) {
                    panel.innerHTML = GLOBAL_ROUTER_NOT_FOUND;
                    return callback(false);
                }
                callback(true);
            });
        }
        return true;
    };
    const removePanelModel = (id) => {
        removeAba(id);
        removePanel(id);
    };
    const showPanel = (id) => {
        const panel = getPanel(id);
        if (!panel) {
            return;
        }
        panel.classList.toggle("active", true);
        panelActive = id;
    };
    const hiddenPanel = (id) => {
        const panel = getPanel(id);
        if (!panel) {
            return;
        }
        panel.classList.toggle("active", false);
    };
    const removePanel = (id) => {
        const panel = getPanel(id);
        if (!panel) {
            return false;
        }
        const nextPanel = panel.previousElementSibling;
        if (panelActive == id) {
            const nextId = nextPanel ? nextPanel.getAttribute("id") || "" : "";
            if (nextId) {
                togglePanel(nextId);
            }
            else {
                panelActive = null;
            }
        }
        panel.remove();
        return true;
    };
    const getPanel = (id) => {
        const panel = panelList.querySelector(`[panel][id="${id}"]`);
        return panel;
    };
    const getPanelByName = (name, id) => {
        const panel = document.querySelector(`[panel="${name}"]${id ? `[id="${id}"]` : ``}`);
        return panel;
    };
    const togglePanel = (id) => {
        if (!getPanel(id)) {
            return;
        }
        const panels = panelList.querySelectorAll("[panel]");
        panels.forEach(_panel => {
            hiddenPanel(_panel.getAttribute("id") || "");
        });
        showPanel(id);
        activeAba(id);
    };
    const createAba = (title, idPanel) => {
        const abaEl = document.createElement("div");
        const spanTitle = document.createElement("span");
        const btClose = document.createElement("button");
        const iconEl = createIcon("x");
        spanTitle.textContent = title;
        spanTitle.classList.add("aba-title");
        abaEl.setAttribute("aba", `${idPanel}`);
        abaEl.classList.add("aba");
        btClose.title = "Fechar aba";
        btClose.appendChild(iconEl);
        abaEl.appendChild(spanTitle);
        abaEl.appendChild(btClose);
        return { el: abaEl, bt: btClose };
    };
    const getAba = (id) => {
        const aba = abaList.querySelector(`[aba="${id}"]`);
        return aba;
    };
    const removeAba = (id) => {
        const aba = getAba(id);
        if (!aba) {
            return;
        }
        aba.remove();
    };
    const activeAba = (id) => {
        const aba = getAba(id);
        if (!aba) {
            return;
        }
        const abas = abaList.querySelectorAll(`[aba]`);
        abas.forEach(_aba => _aba.classList.toggle("active", false));
        aba.classList.toggle("active", true);
    };
    return {
        initComponents,
        newPanel,
        togglePanel,
        getPanelByName,
    };
}
function RouterControl() {
    const GLOBAL_DEPENDENCE = "production";
    const apiRouter = {
        "production": (router, callback) => {
            const response = fetch(`${router}`).then(res => {
                return res.text();
            }).then(res => {
                return { data: res };
            }).catch(error => {
                return { error: { msg: "Rout not found" } };
            });
            response.then(callback);
            return response;
        },
        "development": (router, callback) => {
            const routerResponse = GLOBAL_ROUTERS_ROUTER[`${router}`];
            if (routerResponse)
                return callback({ data: routerResponse });
            callback({ error: { msg: "Rout not found" } });
        },
    };
    const fetchRouter = (router, callback) => {
        apiRouter[GLOBAL_DEPENDENCE](router, ({ data, error }) => {
            if (!data || error)
                return apiRouter[GLOBAL_DEPENDENCE]("routers/panel-404.html", callback);
            callback({ data });
        });
    };
    const getRouter = ({ router, name, script }) => {
        return GLOBAL_ROUTERS.find(_router => { return _router.router == router || _router.name == name || _router.script == script; }) || null;
    };
    const query = ({ router }, callback) => {
        fetchRouter(`${router}`, callback);
    };
    return {
        getRouter,
        query
    };
}
function MainControl() {
    const farmRepository = FarmRepository();
    const historyTableControl = HistoryTableControl();
    const settingControl = SettingControl(farmRepository);
    const fileControl = FileControl(farmRepository);
    const farmControl = FarmControl(farmRepository);
    const getData = (id) => {
        console.log(`Panel=${id}`);
        console.log({ farm: farmControl.getData() });
        console.log(historyTableControl.getHistory());
        console.log(settingControl.getSettings({ farm: true }, true).settings ? settingControl.getSettings({ farm: true }, true) : settingControl.getSettings({ global: true }));
        console.log("");
        return farmControl.getData();
    };
    const uploadFilesPlants = (props, callback) => {
        farmControl.uploadFilesPlants(props, callback);
    };
    const getContentFile = (file, onload, onerror) => {
        return fileControl.getContentFile(file, onload, onerror);
    };
    const exportFiles = ({ files, callback }) => {
        const filesZip = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileBlob = fileControl.createFile({ content: [file.file] });
            filesZip.push({ file: fileBlob, name: file.name || "?" });
        }
        const zip = fileControl.createFileZip({ files: filesZip });
        zip.generateAsync({ type: "blob" }).then((zipBlob) => {
            const url = fileControl.createObjectURL(zipBlob);
            callback(url);
        });
    };
    const createURLDownload = (callback, files) => {
        const now = new Date(Date.now());
        const date = replaceText({ replaceValue: ".", searchValue: "/", val: now.toLocaleDateString('pt-br') });
        const hour = `${now.getHours().toString().padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;
        const zipName = `${date} - ${hour}.zip`;
        exportFiles({ files, callback: (url) => callback(url, zipName) });
    };
    const createFile = (props) => {
        return fileControl.createFile(props);
    };
    const downloadCurrentFarm = (callback) => {
        const farm = farmControl.getData().tables;
        const files = [];
        for (let i = 0; i < farm.length; i++) {
            const _farm = farm[i];
            if (!_farm) {
                continue;
            }
            const file = fileControl.getContentInFormatCSV(_farm.table);
            files.push({ file: file, name: _farm.name });
        }
        createURLDownload(callback, files);
    };
    const prepareForDownload = (name = "") => {
        downloadCurrentFarm((url, zipName) => {
            const tagDownload = document.getElementById("download-files");
            if (!tagDownload) {
                return;
            }
            tagDownload.setAttribute("href", url);
            tagDownload.setAttribute("download", `Fazenda - ${name ? `${name} ` : ``}${zipName}`);
        });
    };
    const setupFarm = ({ settings, process: processSelection }, callback) => {
        const process = processSelection.map(_process => { return { type: _process, logs: [] }; });
        farmControl.updateSetting({ settings });
        farmControl.setupProcess({ process });
        uploadFilesPlants({ plants: settings.plants }, callback);
    };
    const processFarm = () => {
        const plantDeadline = _.cloneDeep(farmControl.getTable({ code: "plant.deadline" })[0]);
        const plantPrice = _.cloneDeep(farmControl.getTable({ code: "plant.price" })[0]);
        const plantFarm = _.cloneDeep(farmControl.getTable({ code: "farm" })[0]);
        const plants = [];
        plantDeadline && plants.push(plantDeadline);
        plantPrice && plants.push(plantPrice);
        plantFarm && plants.push(plantFarm);
        const farm = processRepoTable({
            modelTables: plants,
            settings: settingControl.getSettings({ farm: true }, true).settings || settingControl.getSettings({ storage: true }, true).settings || settingControl.getSettings().settings || _.cloneDeep(GLOBAL_SETTINGS),
            process: farmControl.getProcess()
        });
        console.log("$Finish");
        farm && farmControl.setup(farm);
        return farm || null;
    };
    const processRepoTable = (props) => {
        return farmControl.processFarm(props) || null;
    };
    const saveFarm = (name) => {
        const { id } = historyTableControl.addHistory({ tables: farmControl.getData().tables, name, settings: farmControl.getData().settings, process: farmControl.getData().process }, farmControl.getData().id);
        if (!id) {
            return;
        }
        farmControl.setup({ id, tables: farmControl.getData().tables, settings: farmControl.getData().settings, process: farmControl.getData().process });
    };
    const loadFarm = (id) => {
        const farm = historyTableControl.getData({ id });
        if (!farm.data) {
            return;
        }
        farmControl.reset();
        farmControl.setup({ id: farm.id, tables: farm.data.tables, settings: farm.data.settings, process: farm.data.process });
    };
    const clearFarm = () => {
        farmControl.reset();
    };
    const clearHistory = () => {
        historyTableControl.clearHistory();
        historyTableControl.setup(GLOBAL_HISTORY);
    };
    const clearSettings = () => {
        settingControl.clearSettings();
        settingControl.updateSettings(GLOBAL_SETTINGS);
    };
    const getSettings = (where, onlyWhere) => {
        return settingControl.getSettings(where, onlyWhere);
    };
    return {
        getData,
        uploadFilesPlants,
        processFarm,
        getContentFile,
        processRepoTable,
        exportFiles,
        saveFarm,
        loadFarm,
        clearHistory,
        createURLDownload,
        createFile,
        downloadCurrentFarm,
        clearFarm,
        clearSettings,
        prepareForDownload,
        setupFarm,
        getSettings,
    };
}
function RenderControl() {
    const historyTableControl = HistoryTableControl();
    const mainControl = MainControl();
    const panelControl = PanelControl();
    const modelWindow = ModelWindowComponent();
    const ELEMENTS = {
        sideBarList: document.querySelector(".side-bar [list]"),
        panelControl: document.querySelector(".panel-control"),
        abaContentList: document.querySelector(".abas"),
        listFarms: document.querySelector(".list.farms")
    };
    const initComponents = () => {
        panelControl.initComponents(ELEMENTS.panelControl, ELEMENTS.abaContentList);
        GLOBAL_ROUTERS.forEach(_item => {
            if (GLOBAL_DEPENDENCE != "development") {
                if (_item.__dev) {
                    return;
                }
                if (!_item.active) {
                    return;
                }
            }
            const itemEl = createItem(_item.title, _item.icon, _item.name, _item.active);
            itemEl.addEventListener("click", (ev) => {
                const panelAlreadyExist = panelControl.getPanelByName(_item.name);
                if (!ev.ctrlKey && panelAlreadyExist) {
                    const id = panelAlreadyExist.getAttribute("id");
                    return id && panelControl.togglePanel(id);
                }
                panelControl.newPanel(_item, ev.ctrlKey);
            });
            GLOBAL_ROUTERS_OPEN.includes(_item.name) && panelControl.newPanel(_item, false);
            ELEMENTS.sideBarList.appendChild(itemEl);
        });
    };
    const createItem = (title, icon, name, active) => {
        const itemEl = document.createElement("div");
        const span = document.createElement("span");
        const iconEl = createIcon(icon);
        itemEl.setAttribute("item", name);
        itemEl.setAttribute("icon-parent", "");
        itemEl.classList.add("item");
        span.classList.add("item-title");
        span.textContent = title;
        itemEl.appendChild(iconEl);
        itemEl.appendChild(span);
        if (!active) {
            const iconDisabledEl = createIcon("eye-slash");
            itemEl.appendChild(iconDisabledEl);
        }
        return itemEl;
    };
    return {
        initComponents,
    };
}
function FarmScript(idPanel) {
    const panel = document.querySelector(`[panel="farm"][id="${idPanel}"]`);
    if (!panel) {
        return { error: { msg: "Panel not found" } };
    }
    const notificationControl = NotificationControl(document.querySelector(".list-notification"));
    const mainControl = MainControl();
    const renderControl = RenderControl();
    const ELEMENTS_FORM = {
        plantDeadline: panel.querySelector("#input-file-plant-deadline"),
        plantPrice: panel.querySelector("#input-file-plant-price"),
        plantFarm: panel.querySelector("#input-file-farm"),
        fileSettings: panel.querySelector("#input-file-settings"),
        paramCepInitial: panel.querySelector("#param-cep-initial"),
        paramCepFinal: panel.querySelector("#param-cep-final"),
        paramCepOriginInitial: panel.querySelector("#param-cep-origin-initial"),
        paramCepOriginFinal: panel.querySelector("#param-cep-origin-final"),
        paramDeadline: panel.querySelector("#param-deadline"),
        paramRateDeadline: panel.querySelector("#param-rate-deadline"),
        paramRatePrice: panel.querySelector("#param-rate-price"),
        paramSelectionCriteriaDeadline: panel.querySelector("#param-selection-criteria-deadline"),
        paramSelectionCriteriaPrice: panel.querySelector("#param-selection-criteria-price"),
        paramExcess: panel.querySelector("#param-excess"),
        nameFarm: panel.querySelector("#param-name-farm"),
    };
    const PARAMS = GLOBAL_DEPENDENCE == "production" ? _.cloneDeep(GLOBAL_TEMPLATE) : {
        "settings": {
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
            },
            "plants": []
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
    };
    const initComponents = () => {
        PreloadPanel(panel);
        loadForm();
        panel.querySelector("#upload-files-plant")?.addEventListener("click", updateFilesPlant);
        panel.querySelector("#download-files")?.addEventListener("click", downloadFiles);
        panel.querySelector("#save-farm")?.addEventListener("click", saveFarm);
        panel.querySelector("#get-data")?.addEventListener("click", () => mainControl.getData(idPanel));
        panel.querySelector("#clear-ls")?.addEventListener("click", clearHistory);
        panel.querySelector("#clear-farm")?.addEventListener("click", clearFarm);
        panel.querySelector("#clear-settings")?.addEventListener("click", clearSettings);
        ELEMENTS_FORM.fileSettings.addEventListener("change", uploadSettings);
    };
    const loadForm = () => {
        ELEMENTS_FORM.paramCepOriginInitial.value = PARAMS.settings.template.cepOriginValue["cep.origin.initial"];
        ELEMENTS_FORM.paramCepOriginFinal.value = PARAMS.settings.template.cepOriginValue["cep.origin.final"];
    };
    const uploadSettings = () => {
        const fileSettingsInput = ELEMENTS_FORM.fileSettings?.files ? ELEMENTS_FORM.fileSettings?.files[0] : null;
        if (!fileSettingsInput) {
            return;
        }
        const fileSettings = mainControl.createFile({ content: [fileSettingsInput], type: fileSettingsInput.type });
        mainControl.getContentFile(fileSettings, (result) => {
            const contentSettings = converterStringToJSON(result, ["separatorLine"]);
            if (!contentSettings || !deepEqual(contentSettings, GLOBAL_TEMPLATE)) {
                console.log("Template incorrect");
            }
            Object.assign(PARAMS, contentSettings);
            loadForm();
        });
    };
    const getDataOfForm = () => {
        const plantFarm = ELEMENTS_FORM.plantFarm?.files ? ELEMENTS_FORM.plantFarm?.files[0] : null;
        const plantDeadline = ELEMENTS_FORM.plantDeadline?.files ? ELEMENTS_FORM.plantDeadline?.files[0] : null;
        const plantPrice = ELEMENTS_FORM.plantPrice?.files ? ELEMENTS_FORM.plantPrice?.files[0] : null;
        const paramCepInitial = `${ELEMENTS_FORM.paramCepInitial?.value}`;
        const paramCepFinal = `${ELEMENTS_FORM.paramCepFinal?.value}`;
        const paramCepOriginInitial = `${ELEMENTS_FORM.paramCepOriginInitial?.value}`;
        const paramCepOriginFinal = `${ELEMENTS_FORM.paramCepOriginFinal?.value}`;
        const paramDeadline = `${ELEMENTS_FORM.paramDeadline?.value}`;
        const paramRateDeadline = `${ELEMENTS_FORM.paramRateDeadline?.value}`;
        const paramRatePrice = `${ELEMENTS_FORM.paramRatePrice?.value}`;
        const paramSelectionCriteriaDeadline = `${ELEMENTS_FORM.paramSelectionCriteriaDeadline?.value}`;
        const paramSelectionCriteriaPrice = `${ELEMENTS_FORM.paramSelectionCriteriaPrice?.value}`;
        const paramExcess = `${ELEMENTS_FORM.paramExcess?.value}`;
        const dataPlants = {
            ...PARAMS
        };
        if ((GLOBAL_DEPENDENCE == "production" && plantFarm) || GLOBAL_DEPENDENCE == "development")
            dataPlants.plants.push({
                code: "farm", file: plantFarm || mainControl.createFile({ content: [plantFarmTest] }),
                headers: [
                    { header: paramCepFinal, type: "cep.final" },
                    { header: paramCepInitial, type: "cep.initial" },
                    { header: paramDeadline, type: "deadline" },
                    { header: paramRateDeadline, type: "rate" },
                    { header: paramExcess, type: "excess" },
                    { header: paramSelectionCriteriaDeadline, type: "selection-criteria" },
                ],
                name: "Fazenda"
            });
        if ((GLOBAL_DEPENDENCE == "production" && plantDeadline) || GLOBAL_DEPENDENCE == "development")
            dataPlants.plants.push({
                code: "plant.deadline", file: plantDeadline || mainControl.createFile({ content: [plantDeadlineTest] }),
                headers: [
                    { header: paramCepFinal, type: "cep.final" },
                    { header: paramCepInitial, type: "cep.initial" },
                    { header: paramDeadline, type: "deadline" },
                    { header: paramSelectionCriteriaDeadline, type: "selection-criteria" },
                    { header: paramRateDeadline, type: "rate" },
                ],
                name: "Planta Prazo"
            });
        if ((GLOBAL_DEPENDENCE == "production" && plantPrice) || GLOBAL_DEPENDENCE == "development")
            dataPlants.plants.push({
                code: "plant.price", file: plantPrice || mainControl.createFile({ content: [plantPriceTest] }),
                headers: [
                    { header: paramExcess, type: "excess" },
                    { header: paramSelectionCriteriaPrice, type: "selection-criteria" },
                    { header: paramRatePrice, type: "rate" },
                ],
                name: "Planta Preço"
            });
        return dataPlants;
    };
    const updateFilesPlant = () => {
        const bodyForm = getDataOfForm();
        if (!bodyForm) {
            return;
        }
        mainControl.setupFarm({
            plants: bodyForm.plants,
            settings: bodyForm.settings,
            process: bodyForm.process,
        }, () => {
            mainControl.processFarm();
            prepareForDownload();
        });
        notificationControl.newNotification({ type: "_success", title: "Tratador de Fazenda", body: "Tratamento concluído" });
    };
    const prepareForDownload = () => {
        mainControl.prepareForDownload();
    };
    const downloadFiles = () => { };
    const saveFarm = () => {
        if (mainControl.getData().tables.length == 0) {
            return;
        }
        const nameInput = `${ELEMENTS_FORM.nameFarm.value}`;
        mainControl.saveFarm(`Teste - Fazenda${nameInput ? ` ${nameInput}` : ``}`);
    };
    const clearHistory = () => {
        mainControl.clearHistory();
    };
    const clearFarm = () => {
        mainControl.clearFarm();
    };
    const clearSettings = () => {
        mainControl.clearSettings();
    };
    initComponents();
    return {};
}
function FeatureScript(idPanel) {
    const panel = document.querySelector(`[panel="feature"][id="${idPanel}"]`);
    if (!panel) {
        return { error: { msg: "Panel not found" } };
    }
    const notificationControl = NotificationControl(document.querySelector(".list-notification"));
    const mainControl = MainControl();
    const modelWindow = ModelWindowComponent();
    const ELEMENTS_FORM = {
        selectGroupPlants: panel.querySelector(".select-group.plants"),
        selectGroupProcess: panel.querySelector(".select-group.process"),
        btUpload: panel.querySelector("#upload-files-plant"),
    };
    const dataPlants = { process: [], settings: mainControl.getSettings({ storage: true }).settings || mainControl.getSettings().settings || _.cloneDeep(GLOBAL_SETTINGS) };
    const MAP_PARAMS = {
        process: { "create-farm": [], "insert-values": [], "deadline+D": [], "contained-cep": [], procv: [], template: [], rate: [] },
        plants: [
            { content: "CEP de Origem Inicial", type: "cep.origin.initial", action: "cep.origin.initial" },
            { content: "CEP de Origem Final", type: "cep.origin.final", action: "cep.origin.final" },
            { content: "CEP Inicial", type: "cep.initial", action: "cep.initial" },
            { content: "CEP Final", type: "cep.final", action: "cep.final" },
            { content: "Critério de Seleção", type: "selection-criteria", action: "selection-criteria" },
            { content: "Prazo", type: "deadline", action: "deadline" },
            { content: "Prazo+D", type: "deadline+d", action: "deadline+d" },
            { content: "Excedente", type: "excess", action: "excess" },
            { content: "Taxa", type: "rate", action: "rate" },
        ],
    };
    const MAP_SELECTION_PLANTS = [
        { action: "deadline", content: "Prazo", type: "deadline" },
        { action: "price", content: "Preço", type: "price" },
        { action: "farm", content: "Fazenda", type: "farm" },
    ];
    const MAP_SELECTION_PROCESS = [
        { content: "Criar Fazenda", type: "process", action: "create-farm", submenu: [...MAP_PARAMS["process"]["create-farm"]] },
        { content: "Inserir valores", type: "process", action: "insert-values", submenu: [...MAP_PARAMS["process"]["insert-values"]] },
        { content: "D+1", type: "process", action: "deadline+D", submenu: [...MAP_PARAMS["process"]["deadline+D"]] },
        { content: "Verificar CEP contido", type: "process", action: "contained-cep", submenu: [...MAP_PARAMS["process"]["contained-cep"]] },
        { content: "Procv", type: "process", action: "procv", submenu: [...MAP_PARAMS["process"]["procv"]] },
        { content: "Gerar templates de Preço e Prazo", type: "process", action: "template", submenu: [...MAP_PARAMS["process"]["template"]] },
        { content: "Gerar templates de taxas", type: "process", action: "rate", submenu: [...MAP_PARAMS["process"]["rate"]] },
    ];
    const initComponents = () => {
        PreloadPanel(panel);
        const { getData: getListPlants } = SelectionGroupComponent(ELEMENTS_FORM.selectGroupPlants, { templates: { _new: templateSelectionPlantsParent }, basePath: ".box.parent", pathsValue: [{ path: ".box-container.parent", inputs: [{ type: "plant-file", path: 'input[type="file"]' }, { type: "plant-name", path: 'input[type="text"]' }, { type: "plant-type", path: "select" },] }, { path: ".box-container.children", children: true, inputs: [{ type: "header-name", path: 'input[type="text"]' }, { type: "header-type", path: "select" },] },], actions: ["_newOne", "_newAll", "_clear"], options: MAP_SELECTION_PLANTS, classBox: "box", classMenu: ["select-group-list", "parent"] }, ["_newOne"]);
        const { getData: getListProcess } = SelectionGroupComponent(ELEMENTS_FORM.selectGroupProcess, { templates: { _new: templateSelectionProcess }, basePath: ".box.parent", pathsValue: [{ path: ".box-container.parent", inputs: [{ path: "select", type: "process" }] }], actions: ["_newOne", "_newAll", "_clear"], classBox: "box", classMenu: ["select-group-list"], options: MAP_SELECTION_PROCESS }, ["_newAll"]);
        panel.querySelector("#download-files")?.addEventListener("click", downloadFiles);
        panel.querySelector("#save-farm")?.addEventListener("click", saveFarm);
        panel.querySelector("#get-data")?.addEventListener("click", () => mainControl.getData(idPanel));
        panel.querySelector("#clear-ls")?.addEventListener("click", clearHistory);
        panel.querySelector("#clear-farm")?.addEventListener("click", clearFarm);
        panel.querySelector("#clear-settings")?.addEventListener("click", clearSettings);
        panel.querySelector("#process-files-plant")?.addEventListener("click", updateFilesPlant);
        panel.querySelector("#setting-advanced")?.addEventListener("click", openModelConfigAdvanced);
        panel.querySelector("#upload-files-plant")?.addEventListener("click", () => {
            uploadPlants(getListPlants(), getListProcess());
            const input = panel.querySelector('input[name="input-file-setting-advanced"]');
            const file = input.files ? input.files[0] : null;
            if (!file) {
                return;
            }
            uploadSettings(file);
        });
    };
    const uploadPlants = (plants, process) => {
        dataPlants.settings.plants.splice(0, dataPlants.settings.plants.length);
        dataPlants.process.splice(0, dataPlants.process.length);
        plants.map((_plants) => {
            const plant = { code: "", file: new Blob([], { type: "text/plain" }), headers: [], name: "" };
            _plants.forEach((_plant) => {
                _plant.values && _plant.values.forEach((_valuesInput) => {
                    _valuesInput.forEach((_value) => {
                        plant[_value.type == "plant-type" ? "code" : _value.type == "plant-name" ? "name" : "file"] = _value.value;
                    });
                });
                _plant.subMenu && _plant.subMenu.forEach((_valuesInput) => {
                    let header = { header: "", type: "" };
                    _valuesInput.forEach((_value) => {
                        header[_value.type == "header-type" ? "type" : "header"] = _value.value;
                    });
                    plant.headers.push(header);
                });
            });
            dataPlants.settings.plants.push(plant);
        });
        process.forEach(_process => {
            _process.forEach(_pro => {
                _pro.values && _pro.values.forEach(_values => {
                    _values.forEach(_value => {
                        dataPlants.process.push(_value.value);
                    });
                });
            });
        });
    };
    const openModelConfigAdvanced = () => {
        const form = getContentConfigAdvanced();
        const model = modelWindow.createModel(form, "Configurações Avançadas", false);
        const btCancelConfig = form.querySelector('button[name="cancel-setting-advanced"]');
        const btSaveConfig = form.querySelector('button[name="save-setting-advanced"]');
        const btResetConfig = form.querySelector('button[name="reset-setting-advanced"]');
        btResetConfig?.addEventListener("click", () => {
            resetConfigAdvanced();
            model.remove();
        });
        btCancelConfig?.addEventListener("click", () => model.remove());
        btSaveConfig?.addEventListener("click", () => {
            saveConfigAdvanced(form);
            model.remove();
        });
        panel.appendChild(model);
    };
    const getContentConfigAdvanced = () => {
        const FORM_CONTENT_HTML = `<div class="list-inputs-wrapper" list-content="">
        <h2># Processos</h2>

        <div class="inputs-wrapper" list-type="vertical">
            <div class="input-group">
                <input class="input" required="required" type="number" min="0" path-origin="process/deadline+D" name="input-d+1">
                <label>D+1</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="process/criteria.selection/join" name="input-.join">
                <label>Junção de Critério de Seleção</label>
                <i class="field-input"></i>
            </div>
        </div>

        <div line="horizontal" line-width="margin"></div>
        <h2># Nome dos Cabeçalhos</h2>

        <div class="inputs-wrapper" list-type="vertical">
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.origin.initial" name="input-headerName-cep.origin.initial">
                <label>Inicio Origem</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.origin.final" name="input-headerName-cep.origin.final">
                <label>Fim Origem</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.initial" name="input-cep.initial">
                <label>Inicio Destino</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.final" name="input-cep.final">
                <label>Fim Destino</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/deadline+D" name="input-deadline+D">
                <label>Dias</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/excess" name="input-excess">
                <label>Excedente</label>
                <i class="field-input"></i>
            </div>
        </div>

        <div line="horizontal" line-width="margin"></div>
        <h2># Valores do Template</h2>

        <div class="inputs-wrapper" list-type="vertical">
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/cepOriginValue/cep.origin.initial" name="input-cepOriginValue-cep.origin.final">
                <label>CEP de Inicio Origem (Preço/Prazo)</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/cepOriginValue/cep.origin.final" name="input-cepOriginValue-cep.origin.initial">
                <label>CEP de Fim Origem (Preço/Prazo)</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/rateValue/cep.origin.initial" name="input-rateValue-cep.origin.final">
                <label>CEP de Inicio Origem (Taxa)</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/rateValue/cep.origin.final" name="input-rateValue-cep.origin.initial">
                <label>CEP de Fim Origem (Taxa)</label>
                <i class="field-input"></i>
            </div>
        </div>
    </div>
    <div button-container="end" class="actions-setting-advanced">
        <button type="button" action="_confirm" id="cancel-setting-advanced" name="reset-setting-advanced"><i class="bi-arrow-clockwise" icon=""></i><span>Resetar</span></button>
        <button type="button" action="_cancel" id="cancel-setting-advanced" name="cancel-setting-advanced"><i class="bi-x-lg" icon=""></i><span>Cancelar</span></button>
        <button type="button" action="_confirm" id="save-setting-advanced" name="save-setting-advanced"><i class="bi-check-lg" icon=""></i><span>Salvar</span></button>
    </div>`;
        const form = document.createElement("form");
        form.innerHTML = FORM_CONTENT_HTML;
        form.classList.add("form-setting-advanced");
        loadValuesConfigAdvanced(form);
        return form;
    };
    const saveConfigAdvanced = (form) => {
        const inputs = form.querySelectorAll("input");
        inputs.forEach(_input => {
            const path = _input.getAttribute("path-origin") || "";
            const valueInput = _input.value || "";
            if (!path) {
                return;
            }
            const paths = path.split("/");
            let value = dataPlants.settings;
            for (let i = 0; i < paths.length - 1; i++) {
                if (!(paths[i] in value)) {
                    value[paths[i]] = {};
                }
                value = value[paths[i]] ? value[paths[i]] : value;
            }
            Object.defineProperty(value, paths[paths.length - 1], { value: valueInput });
        });
        notificationControl.newNotification({ title: "Configurações Avançadas", body: "Configurações salvas com sucesso", type: "_success" });
    };
    const loadValuesConfigAdvanced = (form) => {
        const inputs = form.querySelectorAll("input");
        inputs.forEach(_input => {
            const path = _input.getAttribute("path-origin") || "";
            if (!path) {
                return;
            }
            let value = dataPlants.settings;
            const paths = path.split("/");
            paths.forEach(_path => {
                value = value[_path];
            });
            _input.value = value;
        });
    };
    const resetConfigAdvanced = () => {
        dataPlants.settings = mainControl.getSettings({ storage: true }).settings || mainControl.getSettings().settings || _.cloneDeep(GLOBAL_SETTINGS);
        notificationControl.newNotification({ title: "Configurações Avançadas", body: "Configurações resetadas", type: "_success" });
    };
    const uploadSettings = (file) => {
        const fileSettings = mainControl.createFile({ content: [file], type: file.type });
        mainControl.getContentFile(fileSettings, (result) => {
            const contentSettings = converterStringToJSON(result, ["separatorLine"]);
            if (!contentSettings || !deepEqual(contentSettings, GLOBAL_TEMPLATE, ["process", "plants"])) {
                return notificationControl.newNotification({ title: "Upload de Configurações", body: "Template de configurações incorreto", type: "_error" });
            }
            Object.assign(dataPlants, contentSettings);
            notificationControl.newNotification({ title: "Upload de Configurações", body: "Configurações importadas com sucesso", type: "_success" });
        });
    };
    const updateFilesPlant = () => {
        mainControl.setupFarm(dataPlants, () => {
            mainControl.processFarm();
            prepareForDownload();
        });
        notificationControl.newNotification({ type: "_success", title: "Tratador de Fazenda", body: "Tratamento concluído" });
    };
    const prepareForDownload = () => {
        mainControl.prepareForDownload();
    };
    const downloadFiles = () => { };
    const saveFarm = () => {
        if (mainControl.getData().tables.length == 0) {
            return;
        }
        const nameInput = `Fazenda`;
        mainControl.saveFarm(`Teste - Fazenda${nameInput ? ` ${nameInput}` : ``}`);
    };
    const clearHistory = () => {
        mainControl.clearHistory();
    };
    const clearFarm = () => {
        mainControl.clearFarm();
    };
    const clearSettings = () => {
        mainControl.clearSettings();
    };
    const templateSelectionPlantsParent = (actionProcessActive = "") => {
        const box = document.createElement("div");
        const list = ELEMENTS_FORM.selectGroupPlants.querySelector(".select-group-list.parent");
        box.classList.add("box", "parent");
        const selectionContent = document.createElement("div");
        const btRemove = document.createElement("button");
        const selectionProcess = document.createElement("select");
        const subMenu = document.createElement("div");
        const input = document.createElement("input");
        const name = document.createElement("input");
        const iconRemove = createIcon("trash");
        MAP_SELECTION_PLANTS.forEach((_option) => {
            const option = document.createElement("option");
            option.innerHTML = _option.content;
            option.value = _option.action;
            if (actionProcessActive == _option.action) {
                option.selected = true;
            }
            selectionProcess.appendChild(option);
        });
        selectionContent.classList.add("box-container", "parent");
        subMenu.classList.add("sub-menu");
        input.setAttribute("type", "file");
        name.setAttribute("type", "text");
        btRemove.setAttribute("action", "_default");
        btRemove.onclick = () => box.remove();
        SelectionGroupComponent(subMenu, { templates: { _new: templateSelectionPlantsChildren }, basePath: "", pathsValue: [], actions: ["_newOne", "_newAll", "_clear"], options: [...MAP_PARAMS["plants"]], isParent: false, updateList: false, classBox: "box", classMenu: ["select-group-list", "children"] }, ["_newAll"]);
        btRemove.appendChild(iconRemove);
        selectionContent.appendChild(name);
        selectionContent.appendChild(selectionProcess);
        selectionContent.appendChild(input);
        selectionContent.appendChild(btRemove);
        box.appendChild(selectionContent);
        list.appendChild(box);
        box.appendChild(subMenu);
    };
    const templateSelectionPlantsChildren = (actionProcessActive = "", parentForm) => {
        if (!parentForm) {
            return;
        }
        const box = document.createElement("div");
        const list = parentForm.querySelector(".select-group-list.children");
        box.classList.add("box", "children");
        const selectionContent = document.createElement("div");
        const btRemove = document.createElement("button");
        const selectionProcess = document.createElement("select");
        const input = document.createElement("input");
        const iconRemove = createIcon("trash");
        MAP_PARAMS["plants"].forEach((_option) => {
            const option = document.createElement("option");
            option.innerHTML = _option.content;
            option.value = _option.action;
            if (actionProcessActive == _option.action) {
                option.selected = true;
            }
            selectionProcess.appendChild(option);
        });
        selectionContent.classList.add("box-container", "children");
        input.setAttribute("type", "text");
        btRemove.setAttribute("action", "_default");
        btRemove.onclick = () => box.remove();
        btRemove.appendChild(iconRemove);
        selectionContent.appendChild(selectionProcess);
        selectionContent.appendChild(input);
        selectionContent.appendChild(btRemove);
        box.appendChild(selectionContent);
        list.appendChild(box);
    };
    const templateSelectionProcess = (actionProcessActive = "") => {
        const box = document.createElement("div");
        const list = ELEMENTS_FORM.selectGroupProcess.querySelector(".select-group-list");
        box.classList.add("box", "parent");
        const selectionContent = document.createElement("div");
        const btRemove = document.createElement("button");
        const selectionProcess = document.createElement("select");
        const iconRemove = createIcon("trash");
        MAP_SELECTION_PROCESS.forEach((_option) => {
            const option = document.createElement("option");
            option.innerHTML = _option.content;
            option.value = _option.action;
            if (actionProcessActive == _option.action) {
                option.selected = true;
            }
            selectionProcess.appendChild(option);
        });
        selectionContent.classList.add("box-container", "parent");
        btRemove.setAttribute("action", "_default");
        btRemove.onclick = () => box.remove();
        btRemove.appendChild(iconRemove);
        selectionContent.appendChild(selectionProcess);
        selectionContent.appendChild(btRemove);
        box.appendChild(selectionContent);
        list.appendChild(box);
    };
    initComponents();
    return {};
}
function GuideScript(idPanel) {
    const panel = document.querySelector(`[panel="guide"][id="${idPanel}"]`);
    if (!panel) {
        return { error: { msg: "Panel not found" } };
    }
    const initComponents = () => {
        PreloadPanel(panel);
    };
    initComponents();
    return {};
}
function HistoryScript(idPanel) {
    const panel = document.querySelector(`[panel="history"][id="${idPanel}"]`);
    if (!panel) {
        return { error: { msg: "Panel not found" } };
    }
    const mainControl = MainControl();
    const historyControl = HistoryTableControl();
    const HEADERS_TABLE = [{ header: "id", content: "#", id: true }, { header: "parent", content: "Pai" }, { header: "name", content: "Nome" }, { header: "date", content: "Data" }];
    const ELEMENTS = {
        tableHistory: panel.querySelector('[table="history"]'),
        btLoadTable: panel.querySelector('.load-table'),
    };
    const initComponents = () => {
        PreloadPanel(panel);
        const { onLoad } = tableComponent({ table: ELEMENTS.tableHistory, headers: HEADERS_TABLE }, listSelected => { });
        ELEMENTS.btLoadTable.addEventListener("click", () => onLoad(getListHistory()));
        onLoad(getListHistory());
    };
    const getListHistory = () => {
        const { history } = historyControl.getHistory();
        const data = history.map(_farm => { return { name: _farm.data.name, date: _farm.date, id: _farm.id, parent: _farm.parent }; });
        return data;
    };
    initComponents();
    return {};
}
const GLOBAL_MODULE_SCRIPTS = {
    ["FarmScript"]: FarmScript,
    ["HistoryScript"]: HistoryScript,
    ["FeatureScript"]: FeatureScript,
    ["TestScript"]: (id) => { return { error: { msg: 'Router "Test" not found' } }; },
    ["SettingScript"]: (id) => { return { error: { msg: 'Router "Setting" not found' } }; },
    ["GuideScript"]: GuideScript
};
function Setup() {
    const historyTableControl = HistoryTableControl();
    const settingControl = SettingControl(FarmRepository());
    if (!historyTableControl.getHistory().history) {
        historyTableControl.setup([...GLOBAL_HISTORY]);
    }
    if (!settingControl.getSettings({ storage: true }, true).settings) {
        settingControl.updateSettings(GLOBAL_SETTINGS);
    }
}
const plantDeadlineTest = `CEP INICIAL;CEP FINAL;X;X;Prazo;D+1;UF;REGIAO;CS
15111000;15114999;1;3999;7;8;SP;I;SP I
15115000;15115999;1;999;5;6;SP;C;SP C
15116000;15119999;1;3999;7;8;SP;I;SP I
2925000;2930999;1;5999;1;2;SP;C;SP C
2931000;2958999;1;27999;1;2;SP;C;SP C
14400000;14414999;239001;14999;1;2;SP;C;SP C
1001000;1599999;x;598999;1;2;SP;C;SP C
15120000;15120999;1;999;5;6;SP;I;SP I
15121000;15124999;1;3999;7;8;SP;I;SP I
15125000;15125999;1;999;5;6;SP;I;SP I
2900000;2911999;58001;11999;1;2;SP;C;SP C
2912000;2924999;1;12999;1;2;SP;C;SP C
2000000;2811999;400001;811999;1;2;SP;C;SP C
2817000;2832999;5001;15999;1;2;SP;C;SP C
2840000;2841999;7001;1999;1;2;SP;C;SP C
15126000;15127999;1;1999;7;8;SP;I;SP I
15128000;15128999;1;999;5;6;SP;I;SP I
15129000;15129999;1;999;7;8;SP;I;SP I
19870000;19870999;4001;999;5;6;SP;I;SP I
19880000;19880999;9001;999;3;4;SP;I;SP I
14940000;14940999;525001;999;3;4;SP;I;SP I
15100000;15101999;1;1999;2;3;SP;I;SP I
15102000;15102999;1;999;5;6;SP;C;SP C
15110000;15110999;1;999;5;6;SP;I;SP I
15103000;15103999;1;999;2;3;SP;I;SP I
15000000;15099999;59001;99999;1;2;SP;C;SP C
15104000;15104999;1;999;5;6;SP;C;SP C
15105000;15105999;1;999;5;6;SP;I;SP I
15106000;15107999;1;1999;7;8;SP;I;SP I
15108000;15108999;1;999;5;6;SP;I;SP I
15109000;15109999;1;999;7;8;SP;I;SP I
19900000;19919999;19001;19999;3;4;SP;I;SP I`;
const plantPriceTest = `REGIAO;UF;CS;Exce;0,25;0,5;0,75;1;2;3;4;5;6;7;8;9;10
C;PR;PR C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
C;RS;RS C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
C;SC;SC C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
C;SP;SP C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
C;MG;MG C;4,69;15,56;17,78;20,01;22,23;23,19;27,72;29,6;31,67;36,02;39,75;43,31;45,44;46,97
C;RJ;RJ C;4,69;15,56;17,78;20,01;22,23;23,19;27,72;29,6;31,67;36,02;39,75;43,31;45,44;46,97
C;ES;ES C;5,37;16,49;18,85;21,21;23,56;25,89;30,93;33,04;35,34;41,09;45,37;49,42;51,87;53,6
C;DF;DF C;5,37;16,49;18,85;21,21;23,56;25,89;30,93;33,04;35,34;41,09;45,37;49,42;51,87;53,6
C;TO;TO C;5,37;16,49;18,85;21,21;23,56;25,89;30,93;33,04;35,34;41,09;45,37;49,42;51,87;53,6
C;GO;GO C;5,37;16,49;18,85;21,21;23,56;25,89;30,93;33,04;35,34;41,09;45,37;49,42;51,87;53,6
C;MS;MS C;5,37;16,49;18,85;21,21;23,56;25,89;30,93;33,04;35,34;41,09;45,37;49,42;51,87;53,6
C;SE;SE C;6,64;19,8;22,63;25,46;28,29;31,06;37,13;39,66;42,42;50,88;56,16;61,2;64,22;66,36
C;BA;BA C;6,64;19,8;22,63;25,46;28,29;31,06;37,13;39,66;42,42;50,88;56,16;61,2;64,22;66,36
C;MT;MT C;6,64;19,8;22,63;25,46;28,29;31,06;37,13;39,66;42,42;50,88;56,16;61,2;64,22;66,36
C;SE;SE C;6,64;19,8;22,63;25,46;28,29;31,06;37,13;39,66;42,42;50,88;56,16;61,2;64,22;66,36
C;AL;AL C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;CE;CE C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;MA;MA C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;PB;PB C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;PI;PI C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;PE;PE C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;RN;RN C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;AM;AM C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;AP;AP C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;PA;PA C;8,17;23,75;27,14;30,53;33,93;37,28;44,54;47,58;50,9;62,62;69,13;75,32;79,04;81,68
C;AC;AC C;8,98;26,12;29,85;33,59;37,32;40,99;49;52,33;56;68,88;76,04;82,85;86,94;89,85
C;RR;RR C;8,98;26,12;29,85;33,59;37,32;40,99;49;52,33;56;68,88;76,04;82,85;86,94;89,85
C;RO;RO C;8,98;26,12;29,85;33,59;37,32;40,99;49;52,33;56;68,88;76,04;82,85;86,94;89,85
I;DF;DF I;7,49;37,73;40,09;42,45;44,8;48,9;55,71;57,82;61,89;69,41;75,81;81,98;86,55;90,4
I;ES;ES I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;GO;GO I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;MG;MG I;6,81;45,06;47,28;49,51;51,73;54,81;61,47;63,35;67,54;74,02;79,87;85,55;89,8;93,45
I;RJ;RJ I;6,81;45,06;47,28;49,51;51,73;54,81;61,47;63,35;67,54;74,02;79,87;85,55;89,8;93,45
I;SP;SP I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
I;AC;AC I;11,1;55,62;59,35;63,09;66,82;72,61;82,75;86,08;91,87;106,88;116,16;125,09;131,3;136,33
I;AL;AL I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;AM;AM I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;AP;AP I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;BA;BA I;8,76;41,04;43,87;46,7;49,53;54,07;61,91;64,44;68,97;79,2;86,6;93,76;98,9;103,16
I;CE;CE I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;MA;MA I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;MS;MS I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;MT;MT I;8,76;49,3;52,13;54,96;57,79;62,68;70,88;73,41;78,29;88,88;96,28;103,44;108,58;112,84
I;PA;PA I;10,29;44,99;48,38;51,77;55,17;60,29;69,32;72,36;77,45;90,94;99,57;107,88;113,72;118,48
I;PB;PB I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;PE;PE I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;PI;PI I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;PR;PR I;6,2;33,58;33,58;33,58;33,58;35,7;37,83;37,83;39,95;42,08;44,2;46,32;48,44;50,56
I;RO;RO I;11,1;55,62;59,35;63,09;66,82;72,61;82,75;86,08;91,87;106,88;116,16;125,09;131,3;136,33
I;RN;RN I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;RR;RR I;11,1;47,36;51,09;54,83;58,56;64;73,78;77,11;82,55;97,2;106,48;115,41;121,62;126,65
I;RS;RS I;6,2;33,58;33,58;33,58;33,58;35,7;37,83;37,83;39,95;42,08;44,2;46,32;48,44;50,56
I;SC;SC I;6,2;33,58;33,58;33,58;33,58;35,7;37,83;37,83;39,95;42,08;44,2;46,32;48,44;50,56
I;SE;SE I;8,76;49,3;52,13;54,96;57,79;62,68;70,88;73,41;78,29;88,88;96,28;103,44;108,58;112,84
I;TO;TO I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;DF;DF I;7,49;37,73;40,09;42,45;44,8;48,9;55,71;57,82;61,89;69,41;75,81;81,98;86,55;90,4
I;ES;ES I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;GO;GO I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;MG;MG I;6,81;45,06;47,28;49,51;51,73;54,81;61,47;63,35;67,54;74,02;79,87;85,55;89,8;93,45
I;RJ;RJ I;6,81;45,06;47,28;49,51;51,73;54,81;61,47;63,35;67,54;74,02;79,87;85,55;89,8;93,45
I;SP;SP I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
I;AC;AC I;11,1;55,62;59,35;63,09;66,82;72,61;82,75;86,08;91,87;106,88;116,16;125,09;131,3;136,33
I;AL;AL I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;AM;AM I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;AP;AP I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;BA;BA I;8,76;41,04;43,87;46,7;49,53;54,07;61,91;64,44;68,97;79,2;86,6;93,76;98,9;103,16
I;CE;CE I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;MA;MA I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;MS;MS I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;MT;MT I;8,76;49,3;52,13;54,96;57,79;62,68;70,88;73,41;78,29;88,88;96,28;103,44;108,58;112,84
I;PA;PA I;10,29;44,99;48,38;51,77;55,17;60,29;69,32;72,36;77,45;90,94;99,57;107,88;113,72;118,48
I;PB;PB I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;PE;PE I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;PI;PI I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;PR;PR I;6,2;33,58;33,58;33,58;33,58;35,7;37,83;37,83;39,95;42,08;44,2;46,32;48,44;50,56
I;RO;RO I;11,1;55,62;59,35;63,09;66,82;72,61;82,75;86,08;91,87;106,88;116,16;125,09;131,3;136,33
I;RN;RN I;10,29;53,25;56,64;60,03;63,43;68,9;78,29;81,33;86,77;100,62;109,25;117,56;123,4;128,16
I;RR;RR I;11,1;47,36;51,09;54,83;58,56;64;73,78;77,11;82,55;97,2;106,48;115,41;121,62;126,65
I;RS;RS I;6,2;33,58;33,58;33,58;33,58;35,7;37,83;37,83;39,95;42,08;44,2;46,32;48,44;50,56
I;SC;SC I;6,2;33,58;33,58;33,58;33,58;35,7;37,83;37,83;39,95;42,08;44,2;46,32;48,44;50,56
I;SE;SE I;8,76;49,3;52,13;54,96;57,79;62,68;70,88;73,41;78,29;88,88;96,28;103,44;108,58;112,84
I;TO;TO I;7,49;45,99;48,35;50,71;53,06;57,51;64,68;66,79;71,21;79,09;85,49;91,66;96,23;100,08
I;PR;PR I;5,98;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08
I;RS;RS I;5,98;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08
I;SC;SC I;5,98;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08
I;SP;SP I;5,98;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08;84,08
I;MG;MG I;6,59;95,56;97,78;100,01;102,23;103,19;107,72;109,6;111,67;116,02;119,75;123,31;125,44;126,97
I;RJ;RJ I;6,59;95,56;97,78;100,01;102,23;103,19;107,72;109,6;111,67;116,02;119,75;123,31;125,44;126,97
I;ES;ES I;7,27;96,49;98,85;101,21;103,56;105,89;110,93;113,04;115,34;121,09;125,37;129,42;131,87;133,6
I;DF;DF I;7,27;96,49;98,85;101,21;103,56;105,89;110,93;113,04;115,34;121,09;125,37;129,42;131,87;133,6
I;TO;TO I;7,27;96,49;98,85;101,21;103,56;105,89;110,93;113,04;115,34;121,09;125,37;129,42;131,87;133,6
I;GO;GO I;7,27;96,49;98,85;101,21;103,56;105,89;110,93;113,04;115,34;121,09;125,37;129,42;131,87;133,6
I;MS;MS I;7,27;96,49;98,85;101,21;103,56;105,89;110,93;113,04;115,34;121,09;125,37;129,42;131,87;133,6
I;MT;MT I;8,54;99,8;102,63;105,46;108,29;111,06;117,13;119,66;122,42;130,88;136,16;141,2;144,22;146,36
I;BA;BA I;8,54;99,8;102,63;105,46;108,29;111,06;117,13;119,66;122,42;130,88;136,16;141,2;144,22;146,36
I;SE;SE I;8,54;99,8;102,63;105,46;108,29;111,06;117,13;119,66;122,42;130,88;136,16;141,2;144,22;146,36
I;AL;AL I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;CE;CE I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;MA;MA I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;PB;PB I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;PI;PI I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;PE;PE I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;RN;RN I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;AM;AM I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;AP;AP I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;PA;PA I;10,07;103,75;107,14;110,53;113,93;117,28;124,54;127,58;130,9;142,62;149,13;155,32;159,04;161,68
I;AC;AC I;10,88;106,12;109,85;113,59;117,32;120,99;129;132,33;136;148,88;156,04;162,85;166,94;169,85
I;RR;RR I;10,88;106,12;109,85;113,59;117,32;120,99;129;132,33;136;148,88;156,04;162,85;166,94;169,85
I;RO;RO I;10,88;106,12;109,85;113,59;117,32;120,99;129;132,33;136;148,88;156,04;162,85;166,94;169,85
I;PR;PR I;5,98;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08
I;RS;RS I;5,98;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08
I;SC;SC I;5,98;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08
I;SP;SP I;5,98;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08;154,08
I;MG;MG I;6,59;165,56;167,78;170,01;172,23;173,19;177,72;179,6;181,67;186,02;189,75;193,31;195,44;196,97
I;RJ;RJ I;6,59;165,56;167,78;170,01;172,23;173,19;177,72;179,6;181,67;186,02;189,75;193,31;195,44;196,97
I;ES;ES I;7,27;166,49;168,85;171,21;173,56;175,89;180,93;183,04;185,34;191,09;195,37;199,42;201,87;203,6
I;DF;DF I;7,27;166,49;168,85;171,21;173,56;175,89;180,93;183,04;185,34;191,09;195,37;199,42;201,87;203,6
I;TO;TO I;7,27;166,49;168,85;171,21;173,56;175,89;180,93;183,04;185,34;191,09;195,37;199,42;201,87;203,6
I;GO;GO I;7,27;166,49;168,85;171,21;173,56;175,89;180,93;183,04;185,34;191,09;195,37;199,42;201,87;203,6
I;MS;MS I;7,27;166,49;168,85;171,21;173,56;175,89;180,93;183,04;185,34;191,09;195,37;199,42;201,87;203,6
I;MT;MT I;8,54;169,8;172,63;175,46;178,29;181,06;187,13;189,66;192,42;200,88;206,16;211,2;214,22;216,36
I;BA;BA I;8,54;169,8;172,63;175,46;178,29;181,06;187,13;189,66;192,42;200,88;206,16;211,2;214,22;216,36
I;SE;SE I;8,54;169,8;172,63;175,46;178,29;181,06;187,13;189,66;192,42;200,88;206,16;211,2;214,22;216,36
I;AL;AL I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;CE;CE I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;MA;MA I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;PB;PB I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;PI;PI I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;PE;PE I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;RN;RN I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;AM;AM I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;AP;AP I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;PA;PA I;10,07;173,75;177,14;180,53;183,93;187,28;194,54;197,58;200,9;212,62;219,13;225,32;229,04;231,68
I;AC;AC I;10,88;176,12;179,85;183,59;187,32;190,99;199;202,33;206;218,88;226,04;232,85;236,94;239,85
I;RR;RR I;10,88;176,12;179,85;183,59;187,32;190,99;199;202,33;206;218,88;226,04;232,85;236,94;239,85
I;RO;RO I;10,88;176,12;179,85;183,59;187,32;190,99;199;202,33;206;218,88;226,04;232,85;236,94;239,85`;
const plantFarmTest = `CEP INICIAL;CEP FINAL;Prazo;UF;REGIAO;Exce;0,25;0,5;0,75;1;2;3;4;5;6;7;8;9;10
15109-000;15109-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
14940-000;14940-999;4;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
2912-000;2924-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15100-000;15101-999;3;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
1001-000;1599-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
14400-000;14414-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2000-000;2811-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15129-000;15129-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15120-000;15120-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15000-000;15099-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15128-000;15128-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15116-000;15119-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15121-000;15124-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15125-000;15125-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
2925-000;2930-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
19870-000;19870-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15126-000;15127-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15102-000;15102-999;6;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15106-000;15107-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
19900-000;19919-999;4;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
2817-000;2832-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15110-000;15110-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15115-000;15115-999;6;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15111-000;15114-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
2931-000;2958-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2840-000;2841-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2900-000;2911-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15108-000;15108-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15103-000;15103-999;3;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15104-000;15104-999;6;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15105-000;15105-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
19880-000;19880-999;4;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88`;
function App() {
    const controlDB = ControlDataBase();
    const now = Date.now();
    const isAuthenticated = controlDB.getItem("auth.authenticated") || false;
    const devIsConnected = controlDB.getItem("dev.edition") || false;
    const expireDate = controlDB.getItem("auth.expire") || now - 100000;
    const isExpired = expireDate < now;
    if (!devIsConnected && GLOBAL_DEPENDENCE == "production") {
        if (!isAuthenticated || isExpired) {
            const res = prompt("KEY");
            if (res !== "panoramasistemas") {
                if (res === "__devpanoramasistemas") {
                    controlDB.updateItem("dev.edition", true);
                    controlDB.updateItem("auth.authenticated", false);
                    return window.location.reload();
                }
                return;
            }
            const now = new Date(Date.now());
            now.setHours(now.getHours() + 1);
            controlDB.updateItem("auth.authenticated", true);
            controlDB.updateItem("auth.expire", now.getTime());
            controlDB.updateItem("dev.edition", false);
        }
    }
    const renderControl = RenderControl();
    const initComponents = () => {
        Setup();
        const notificationControl = NotificationControl(document.querySelector(".list-notification"));
        const btLogout = document.querySelector(".bt-logout");
        btLogout.addEventListener("click", () => {
            controlDB.updateItem("auth.authenticated", false);
            controlDB.updateItem("dev.edition", false);
            window.location.reload();
        });
        renderControl.initComponents();
    };
    return initComponents();
}
window.onload = App;
function PreloadPanel(panel) {
    const modelWindow = ModelWindowComponent();
    const forms = panel.querySelectorAll("form");
    const models = panel.querySelectorAll("[model-window]");
    forms.forEach(_form => _form.addEventListener("submit", ev => ev.preventDefault()));
    models.forEach(_model => {
        const header = _model.querySelector(".model-header");
        modelWindow.activeMoveModel(header, _model);
    });
}
