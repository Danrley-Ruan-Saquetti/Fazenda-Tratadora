"use strict";
function App() {
    const renderControl = RenderControl();
    const initComponents = () => {
        renderControl.initComponents();
    };
    return initComponents();
}
window.onload = App;
const GLOBAL_SETTINGS = {
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
};
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
};
const GLOBAL_HISTORY = [];
const GLOBAL_ROUTES = [
    { icon: "house-door", title: "Fazenda", name: "farm", router: "routes/panel-farm.html", script: "FarmScript" },
    { icon: "ui-radios", title: "Histórico", name: "history", router: "routes/panel-history.html", script: "HistoryScript" },
    { icon: "calculator", title: "Testes", name: "test", router: "routes/panel-test.html", script: "TestScript" },
    { icon: "gear", title: "Configurações", name: "setting", router: "routes/panel-setting.html", script: "SettingScript" },
    { icon: "signpost-split", title: "Features", name: "feature", router: "routes/panel.feature.html", script: "FeatureScript" },
];
const GLOBAL_ROUTES_ROUTER = {
    "routes/panel-history.html": `<button class="load-table">Load</button>
    <div class="table" table-parent>
        <table table="history"></table>
    </div>`,
    "routes/panel-test.html": `<h1>Teste</h1>`,
    "routes/panel-farm.html": `<label for="input-file-plant-price">Selecione o arquivo de Preço</label>
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
    "routes/panel-404.html": `<h1>Router not found</h1>`,
};
const GLOBAL_ROUTER_NOT_FOUND = `<h1>Router not found</h1>`;
function Setup() {
    const historyTableControl = HistoryTableControl();
    const settingControl = SettingControl(FarmRepository());
    if (!historyTableControl.getHistory().history) {
        historyTableControl.setup([...GLOBAL_HISTORY]);
    }
    if (!settingControl.getSettings({ storage: true })) {
        settingControl.updateSettings(GLOBAL_SETTINGS);
    }
}
const plantDeadlineTest = `CEP INICIAL;CEP FINAL;X;X;Prazo;D+1;UF;REGIAO;CS
1001000;1599999;x;598999;1;2;SP;C;SP C
2000000;2811999;400001;811999;1;2;SP;C;SP C
2817000;2832999;5001;15999;1;2;SP;C;SP C
2840000;2841999;7001;1999;1;2;SP;C;SP C
2900000;2911999;58001;11999;1;2;SP;C;SP C
2912000;2924999;1;12999;1;2;SP;C;SP C
2925000;2930999;1;5999;1;2;SP;C;SP C
2931000;2958999;1;27999;1;2;SP;C;SP C
14400000;14414999;239001;14999;1;2;SP;C;SP C
14940000;14940999;525001;999;3;4;SP;I;SP I
15000000;15099999;59001;99999;1;2;SP;C;SP C
15100000;15101999;1;1999;2;3;SP;I;SP I
15102000;15102999;1;999;5;6;SP;C;SP C
15103000;15103999;1;999;2;3;SP;I;SP I
15104000;15104999;1;999;5;6;SP;C;SP C
15105000;15105999;1;999;5;6;SP;I;SP I
15106000;15107999;1;1999;7;8;SP;I;SP I
15108000;15108999;1;999;5;6;SP;I;SP I
15109000;15109999;1;999;7;8;SP;I;SP I
15110000;15110999;1;999;5;6;SP;I;SP I
15111000;15114999;1;3999;7;8;SP;I;SP I
15115000;15115999;1;999;5;6;SP;C;SP C
15116000;15119999;1;3999;7;8;SP;I;SP I
15120000;15120999;1;999;5;6;SP;I;SP I
15121000;15124999;1;3999;7;8;SP;I;SP I
15125000;15125999;1;999;5;6;SP;I;SP I
15126000;15127999;1;1999;7;8;SP;I;SP I
15128000;15128999;1;999;5;6;SP;I;SP I
15129000;15129999;1;999;7;8;SP;I;SP I
19870000;19870999;4001;999;5;6;SP;I;SP I
19880000;19880999;9001;999;3;4;SP;I;SP I
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
1001-000;1599-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2000-000;2811-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2817-000;2832-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2840-000;2841-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2900-000;2911-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2912-000;2924-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2925-000;2930-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
2931-000;2958-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
14400-000;14414-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
14940-000;14940-999;4;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15000-000;15099-999;2;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15100-000;15101-999;3;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15102-000;15102-999;6;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15103-000;15103-999;3;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15104-000;15104-999;6;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15105-000;15105-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15106-000;15107-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15108-000;15108-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15109-000;15109-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15110-000;15110-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15111-000;15114-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15115-000;15115-999;6;SP;C;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08;4,08
15116-000;15119-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15120-000;15120-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15121-000;15124-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15125-000;15125-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15126-000;15127-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15128-000;15128-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
15129-000;15129-999;8;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
19870-000;19870-999;6;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
19880-000;19880-999;4;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88
19900-000;19919-999;4;SP;I;6,2;25,32;25,32;25,32;25,32;27,09;28,86;28,86;30,63;32,4;34,52;36,64;38,76;40,88`;
function tableComponent({ table: tableEl, headers }, onSelection, colResizableProps = { dragCursor: "ew-resize", headerOnly: true, hoverCursor: "ew-resize", liveDrag: true, resizeMode: 'fit', minWidth: 64 }) {
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
            $('[table]').colResizable({ ...colResizableProps });
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
        const settings = settingControl.getSettings({ farm: true }).settings.process.converterStringTable;
        fileControl.getContentFile(file, result => {
            const table = tableControl.converterStringForTable({ value: result, separatorLine: settings.separatorLine, separatorColumn: settings.separatorColumn, configSeparatorColumn: settings.configSeparatorColumn });
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
                if (!modelTablePlantPrice || !modelTablePlantDeadline) {
                    return;
                }
                const headersPlantDeadline = [
                    ...repoControl.getHeaders({ tableModel: modelTablePlantDeadline, types: ["cep.initial", "cep.final", "deadline", "excess", "rate", "selection-criteria"] }),
                ];
                const headersPlantPrice = [
                    ...repoControl.getHeaders({ tableModel: modelTablePlantPrice }),
                    ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] }),
                ];
                repoControl.updateHeaders({ code: "plant.price", headers: headersPlantPrice });
                repoControl.updateHeaders({ code: "plant.deadline", headers: headersPlantDeadline });
            },
            "prepare-environment": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm) {
                    return;
                }
                const isProcessDeadline = process.find(_process => { return _process.type == "deadline+D"; });
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
                        return;
                    }
                    tableControl.addColumn({ table: modelTableFarm.table, header: `${headerDeadline.header}+${settings.process["deadline+D"]}`, index: indexHeaderDeadline + 1 });
                }
                repoControl.updateTable({ table: modelTableFarm.table, code: "farm", headers: headersFarm });
            },
            "create-farm": () => {
                const modelTablePlantPrice = repoControl.getTable({ code: "plant.price" })[0];
                const modelTablePlantDeadline = repoControl.getTable({ code: "plant.deadline" })[0];
                if (!modelTablePlantPrice || !modelTablePlantDeadline) {
                    return;
                }
                const isProcessDeadline = process.find(_process => { return _process.type == "deadline+D"; });
                const headerDeadline = repoControl.getHeaders({ code: "plant.deadline", types: ["deadline"] })[0];
                const headersFarm = isProcessDeadline ? [
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["cep.initial", "cep.final", "deadline"] }),
                    { header: `${headerDeadline ? headerDeadline.header : "D"}+${settings.process["deadline+D"]}`, type: "deadline+D" },
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["selection-criteria", "rate"] }),
                    ...repoControl.getHeaders({ code: "plant.price", types: ["excess", "rate"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
                ] : [
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["cep.initial", "cep.final", "deadline"] }),
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["selection-criteria", "rate"] }),
                    ...repoControl.getHeaders({ code: "plant.price", types: ["excess", "rate"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
                ];
                const { modelTable: modelTableFarm, logs: logsCreateFarm } = createFarm({ headers: headersFarm, plant: modelTablePlantDeadline.table, name: "Fazenda" });
                repoControl.addTable({ tableModel: modelTableFarm });
            },
            "insert-values": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                const modelTablePlantDeadline = repoControl.getTable({ code: "plant.deadline" })[0];
                const modelTablePlantPrice = repoControl.getTable({ code: "plant.price" })[0];
                if (!modelTableFarm || !modelTablePlantDeadline || !modelTablePlantPrice) {
                    return;
                }
                const headerDeadline = repoControl.getHeaders({ code: "plant.deadline", types: ["deadline"] })[0];
                const headerPlantValueDeadlineToFarm = [
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["cep.initial", "cep.final", "deadline"] }),
                    { header: `${headerDeadline ? headerDeadline.header : "D"}+${settings.process["deadline+D"]}`, type: "deadline+D" },
                    ...repoControl.getHeaders({ code: "plant.deadline", types: ["selection-criteria", "excess", "rate"] }),
                    ...repoControl.getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
                ];
                insertValues({ table: modelTableFarm.table, tablePlant: modelTablePlantDeadline.table, headers: headerPlantValueDeadlineToFarm });
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
            },
            "remove-character": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm) {
                    return;
                }
                const columns = ["cep.initial", "cep.final"];
                const characters = ["-"];
                columns.forEach(_column => {
                    const indexColumn = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: modelTableFarm.table, headers: modelTableFarm.headers }, types: [_column] })[0]?.header, where: { array: modelTableFarm.table[0] } });
                    tableControl.removeCharacter({ table: modelTableFarm.table, characters, options: { specific: { column: indexColumn }, excludes: { line: [0] } } });
                });
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
            },
            "deadline+D": () => {
                const modelTableFarm = repoControl.getTable({ code: "farm" })[0];
                if (!modelTableFarm) {
                    return;
                }
                const { logs: logsInsertValuesDMoreOne } = insertValuesDMoreOne({ tableModel: { table: modelTableFarm.table, headers: modelTableFarm.headers }, tableBase: { table: modelTableFarm.table, headers: modelTableFarm.headers }, settings });
                repoControl.updateTable({ code: "farm", table: modelTableFarm.table });
            },
            "contained-cep": () => { },
            "procv": () => { },
            "rate": () => { }
        };
        if (process.find(_process => { return _process.type == "create-farm"; })) {
            PROCESS["process-plant"]();
        }
        else {
            PROCESS["prepare-environment"]();
        }
        process.forEach(_process => {
            if (_process.type == "insert-values" || _process.type == "procv") {
                if (!process.find(_process => { return _process.type == "create-farm"; })) {
                    return;
                }
            }
            PROCESS[_process.type]();
        });
        return repoControl.getData();
    };
    const insertValues = ({ tablePlant, table, headers }) => {
        const logs = [];
        for (let k = 0; k < headers.length; k++) {
            const indexColumnHeader = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: table[0] } });
            const indexColumnHeaderPlant = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: tablePlant[0] } });
            if (indexColumnHeader < 0 || indexColumnHeaderPlant < 0) {
                if (indexColumnHeaderPlant < 0 && (headers[k].type == "cep.final" || headers[k].type == "cep.initial"))
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
    const insertCSValue = ({}) => {
    };
    const insertValuesDMoreOne = ({ tableModel, tableBase, settings }) => {
        const logs = [];
        const headerDeadlineMoreD = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: tableModel.table, headers: tableModel.headers }, types: ["deadline+D"] })[0]?.header || "", where: { array: tableModel.table[0] } });
        const headerDeadline = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: tableBase.table, headers: tableBase.headers }, types: ["deadline"] })[0]?.header || "", where: { array: tableBase.table[0] } });
        if (headerDeadline < 0 || headerDeadlineMoreD < 0) {
            !headerDeadline && logs.push({ type: "warning", message: `Column "${getHeaders({ tableModel: { table: tableModel.table, headers: tableModel.headers }, types: ["deadline+D"] })[0]?.header || "Deadline"}" not found in plant deadline` });
            return { logs };
        }
        const valueD = Number(settings.process["deadline+D"]);
        for (let i = 1; i < tableModel.table.length; i++) {
            tableModel.table[i][headerDeadlineMoreD] = `${Number(tableBase.table[i][headerDeadline]) + valueD}`;
        }
        return { logs };
    };
    const validateContainedCEP = ({ table }) => {
        const logs = [];
        const indexHeaderCepInitial = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: table, types: ["cep.initial"] })[0].header, where: { array: table.table[0] } });
        const indexHeaderCepFinal = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: table, types: ["cep.final"] })[0].header, where: { array: table.table[0] } });
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
    const updateProcess = (props) => {
        farmRepository.updateProcess(props.process);
    };
    const getProcess = () => {
        return farmRepository.getProcess();
    };
    return {
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
    const controlLocalStorage = ControlLocalStorage();
    const KEY = "history";
    const setup = (value) => {
        controlLocalStorage.updateItem(KEY, value);
    };
    const addHistory = (data, parent = null) => {
        const history = controlLocalStorage.getItem(KEY) || [...GLOBAL_HISTORY];
        if (!history) {
            return { id: null };
        }
        const dataModel = { data, id: generatedId(), parent: parent || null, date: new Date(Date.now()) };
        history.push(dataModel);
        controlLocalStorage.updateItem(KEY, history);
        return { id: dataModel.id };
    };
    const clearHistory = () => {
        controlLocalStorage.removeItem(KEY);
    };
    const getData = ({ id }) => {
        const history = controlLocalStorage.getItem(KEY);
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
        const history = controlLocalStorage.getItem(KEY, ["separatorLine"]) || GLOBAL_HISTORY;
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
const storageLocal = (function () {
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
    development: storageLocal
};
const ls = dependencies["production"];
function ControlLocalStorage() {
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
        console.log(settingControl.getSettings({ farm: true }).settings ? settingControl.getSettings({ farm: true }) : settingControl.getSettings({ global: true }));
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
    const setupFarm = ({ plants, settings, process }, callback) => {
        farmControl.updateSetting({ settings });
        farmControl.updateProcess({ process });
        uploadFilesPlants({ plants }, callback);
    };
    const processRepoTable = (props) => {
        return farmControl.processFarm(props) || null;
    };
    const processFarm = () => {
        const plantDeadline = _.cloneDeep(farmControl.getTable({ code: "plant.deadline" })[0]);
        const plantPrice = _.cloneDeep(farmControl.getTable({ code: "plant.price" })[0]);
        const plantFarm = _.cloneDeep(farmControl.getTable({ code: "farm" })[0]);
        const plants = plantDeadline && plantPrice ? [plantDeadline, plantPrice] : plantFarm ? [plantFarm] : [];
        const farm = processRepoTable({
            modelTables: plants,
            settings: settingControl.getSettings({ farm: true }).settings || settingControl.getSettings().settings || GLOBAL_SETTINGS,
            process: farmControl.getProcess()
        });
        farmControl.setup(farm);
        console.log("$Finish");
        return farm;
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
    };
}
function ModelWindowControl() {
    const createModel = (children) => {
        const model = document.createElement("div");
        model.setAttribute("model-window", "enabled");
        model.appendChild(children);
        setupModel(model);
        return model;
    };
    const setupModel = (model) => {
        const headerModel = document.createElement("div");
        const btClose = document.createElement("button");
        btClose.onclick = () => closeModel(model);
        btClose.appendChild(createIcon("x"));
        headerModel.appendChild(btClose);
        headerModel.classList.add("header");
        model.insertBefore(headerModel, model.firstChild);
        setupMoveModel(headerModel, model);
        openModel(model);
    };
    const setupMoveModel = (header, model) => {
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
    };
    const openModel = (model) => {
        model.setAttribute("model-window", "enabled");
        const headerModel = model.querySelector(".header");
        if (!headerModel) {
            return;
        }
    };
    const closeModel = (model) => {
        model.setAttribute("model-window", "disabled");
    };
    return {
        createModel
    };
}
function PanelControl() {
    const modelWindowControl = ModelWindowControl();
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
    const newPanel = ({ name, title }, isCtrl) => {
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
function RenderControl() {
    const historyTableControl = HistoryTableControl();
    const mainControl = MainControl();
    const panelControl = PanelControl();
    const modelWindowControl = ModelWindowControl();
    const ELEMENTS = {
        sideBarList: document.querySelector(".side-bar [list]"),
        panelControl: document.querySelector(".panel-control"),
        abaContentList: document.querySelector(".abas"),
        listFarms: document.querySelector(".list.farms")
    };
    const initComponents = () => {
        panelControl.initComponents(ELEMENTS.panelControl, ELEMENTS.abaContentList);
        GLOBAL_ROUTES.forEach(_item => {
            const itemEl = createItem(_item.title, _item.icon, _item.name);
            itemEl.addEventListener("click", (ev) => {
                const panelAlreadyExist = panelControl.getPanelByName(_item.name);
                if (!ev.ctrlKey && panelAlreadyExist) {
                    const id = panelAlreadyExist.getAttribute("id");
                    return id && panelControl.togglePanel(id);
                }
                panelControl.newPanel({ name: _item.name, title: _item.title }, ev.ctrlKey);
            });
            _item.name == "feature" && panelControl.newPanel({ name: _item.name, title: _item.title }, false);
            ELEMENTS.sideBarList.appendChild(itemEl);
        });
    };
    const loadListFarms = () => {
        const { history } = historyTableControl.getHistory();
        if (ELEMENTS.listFarms) {
            ELEMENTS.listFarms.textContent = "";
        }
        history && history.forEach(_farm => {
            const div = document.createElement("div");
            const span = document.createElement("span");
            const btDownload = document.createElement("a");
            const btLoad = document.createElement("button");
            btLoad.textContent = "Carregar";
            btLoad.onclick = () => {
                mainControl.loadFarm(_farm.id);
                mainControl.prepareForDownload();
            };
            mainControl.createURLDownload((url, zipName) => {
                btDownload.setAttribute("href", url);
                btDownload.setAttribute("download", `Teste Histórico - ${_farm.id} ${_farm.data.name} ${zipName}`);
            }, _farm.data.tables.map(_f => { return { file: _f.table, name: _f.name }; }));
            btDownload.textContent = "Download";
            span.textContent = _farm.id + ": " + _farm.date + (_farm.parent ? " Parent: " + _farm.parent : "");
            div.appendChild(span);
            div.appendChild(btDownload);
            div.appendChild(btLoad);
            ELEMENTS.listFarms?.appendChild(div);
        });
    };
    const createItem = (title, icon, name) => {
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
        return itemEl;
    };
    return {
        initComponents,
        loadListFarms,
    };
}
function RouterControl() {
    const dependence = "production";
    const apiRouter = {
        "production": (router, callback) => {
            const response = fetch(`${router}`).then(response => response.text()).then(response => {
                return { data: response };
            }).catch(error => {
                return { error: { msg: "Rout not found" } };
            });
            response.then(callback);
            return response;
        },
        "development": (router, callback) => {
            const routerResponse = GLOBAL_ROUTES_ROUTER[`${router}`];
            if (routerResponse)
                return callback({ data: routerResponse });
            callback({ error: { msg: "Rout not found" } });
        },
    };
    const fetchRouter = (router, callback) => {
        apiRouter[dependence](router, ({ data, error }) => {
            if (!data || error)
                return apiRouter[dependence]("routes/panel-404.html", callback);
            callback({ data });
        });
    };
    const getRouter = ({ router, name, script }) => {
        return GLOBAL_ROUTES.find(_router => { return _router.router == router || _router.name == name || _router.script == script; }) || null;
    };
    const query = ({ router }, callback) => {
        fetchRouter(`${router}`, callback);
    };
    return {
        getRouter,
        query
    };
}
function SettingControl(farmRepository) {
    const controlLocalStorage = ControlLocalStorage();
    const KEY = "setting";
    const updateSettings = (settings) => {
        controlLocalStorage.updateItem(KEY, settings);
    };
    const clearSettings = () => {
        controlLocalStorage.removeItem(KEY);
    };
    const getSettings = (where = { farm: false, storage: false, global: false }) => {
        if (where.storage)
            return { settings: controlLocalStorage.getItem(KEY, ["separatorLine"]) || GLOBAL_SETTINGS };
        if (where.farm) {
            const set = _.cloneDeep(farmRepository.getSettings());
            return { settings: set.isActive ? set : GLOBAL_SETTINGS };
        }
        if (where.global)
            return { settings: _.cloneDeep(GLOBAL_SETTINGS) };
        return { settings: controlLocalStorage.getItem(KEY, ["separatorLine"]) || _.cloneDeep(GLOBAL_SETTINGS) || _.cloneDeep(farmRepository.getSettings()) };
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
        return table;
    };
    function getIndex({ valueSearch, where, options, method = "filled" }) {
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
    }
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
        const _table = table.slice(1);
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
function FarmRepository() {
    const data = {
        tables: [], id: null, settings: _.cloneDeep({ ...GLOBAL_SETTINGS_RESET, isActive: false }),
        process: []
    };
    const setup = (props) => {
        data.tables = [...props.tables];
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
    const updateProcess = (process) => {
        data.process = _.cloneDeep(process);
    };
    const getProcess = () => {
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
    };
}
const GLOBAL_MODULE_SCRIPTS = {
    ["FarmScript"]: FarmScript,
    ["HistoryScript"]: HistoryScript,
    ["FeatureScript"]: FeatureScript,
    ["TestScript"]: (id) => { return { error: { msg: 'Router "Test" not found' } }; },
    ["SettingScript"]: (id) => { return { error: { msg: 'Router "Test" not found' } }; }
};
function FarmScript(idPanel) {
    const panel = document.querySelector(`[panel="farm"][id="${idPanel}"]`);
    if (!panel) {
        return { error: { msg: "Panel not found" } };
    }
    const mainControl = MainControl();
    const renderControl = RenderControl();
    const ELEMENTS_FORM = {
        plantDeadline: panel.querySelector("#input-file-plant-deadline"),
        plantPrice: panel.querySelector("#input-file-plant-price"),
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
    const PARAMS = {
        "table": {
            "cep.initial": "CEP INICIAL",
            "cep.final": "CEP FINAL",
            "deadline": "Prazo",
            "excess": "Exce",
            "rate": {
                "deadline": "",
                "price": ""
            },
            "selection.criteria": {
                "price": "UF,REGIAO",
                "deadline": "UF,REGIAO"
            }
        },
        process: _.cloneDeep(GLOBAL_SETTINGS.process),
        template: _.cloneDeep(GLOBAL_SETTINGS.template),
    };
    const initComponents = () => {
        Setup();
        renderControl.loadListFarms();
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
        ELEMENTS_FORM.paramCepInitial.value = PARAMS.table["cep.initial"];
        ELEMENTS_FORM.paramCepFinal.value = PARAMS.table["cep.final"];
        ELEMENTS_FORM.paramCepOriginInitial.value = PARAMS.template.cepOriginValue["cep.origin.initial"];
        ELEMENTS_FORM.paramCepOriginFinal.value = PARAMS.template.cepOriginValue["cep.origin.final"];
        ELEMENTS_FORM.paramDeadline.value = PARAMS.table.deadline;
        ELEMENTS_FORM.paramRateDeadline.value = PARAMS.table.rate.deadline;
        ELEMENTS_FORM.paramRatePrice.value = PARAMS.table.rate.price;
        ELEMENTS_FORM.paramSelectionCriteriaDeadline.value = PARAMS.table["selection.criteria"].deadline;
        ELEMENTS_FORM.paramSelectionCriteriaPrice.value = PARAMS.table["selection.criteria"].price;
        ELEMENTS_FORM.paramExcess.value = PARAMS.table.excess;
    };
    const uploadSettings = () => {
        const fileSettingsInput = ELEMENTS_FORM.fileSettings?.files ? ELEMENTS_FORM.fileSettings?.files[0] : null;
        if (!fileSettingsInput) {
            return;
        }
        const fileSettings = mainControl.createFile({ content: [fileSettingsInput], type: fileSettingsInput.type });
        mainControl.getContentFile(fileSettings, (result) => {
            const contentSettings = converterStringToJSON(result, ["separatorLine"]);
            if (!contentSettings || !deepEqual(contentSettings, GLOBAL_SETTINGS)) {
                return console.log("Template incorrect");
            }
            Object.assign(PARAMS, contentSettings);
            loadForm();
        });
    };
    const getDataOfForm = () => {
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
            plants: [
                {
                    code: "plant.deadline", file: plantDeadline || mainControl.createFile({ content: [plantDeadlineTest] }),
                    headers: [
                        { header: PARAMS.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: paramCepOriginInitial || PARAMS.template.cepOriginValue["cep.origin.initial"] },
                        { header: PARAMS.template.headerName["cep.origin.final"], type: "cep.origin.final", value: paramCepOriginFinal || PARAMS.template.cepOriginValue["cep.origin.final"] },
                        { header: paramCepFinal || PARAMS.table["cep.final"], type: "cep.final" },
                        { header: paramCepInitial || PARAMS.table["cep.initial"], type: "cep.initial" },
                        { header: paramDeadline || PARAMS.table.deadline, type: "deadline" },
                        { header: paramSelectionCriteriaDeadline || PARAMS.table["selection.criteria"].deadline, type: "selection-criteria" },
                        { header: paramRateDeadline || PARAMS.table.rate.deadline, type: "rate" },
                    ],
                    name: "Planta Prazo"
                },
                {
                    code: "plant.price", file: plantPrice || mainControl.createFile({ content: [plantPriceTest] }),
                    headers: [
                        { header: paramExcess || PARAMS.table.excess, type: "excess" },
                        { header: paramSelectionCriteriaPrice || PARAMS.table["selection.criteria"].price, type: "selection-criteria" },
                        { header: paramRatePrice || PARAMS.table.rate.price, type: "rate" },
                    ],
                    name: "Planta Preço"
                },
            ],
            settings: PARAMS
        };
        if (!plantDeadline || !plantPrice || !paramCepInitial || !paramCepFinal || !paramCepOriginInitial || !paramCepOriginFinal || !paramDeadline || !paramSelectionCriteriaDeadline || !paramSelectionCriteriaPrice || !paramExcess) {
            console.log("$Teste");
            return dataPlants;
        }
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
        }, () => {
            mainControl.processFarm();
            prepareForDownload();
        });
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
        renderControl.loadListFarms();
    };
    const clearHistory = () => {
        mainControl.clearHistory();
        renderControl.loadListFarms();
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
    const GLOBAL_SETTINGS = {
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
    };
    const panel = document.querySelector(`[panel="feature"][id="${idPanel}"]`);
    if (!panel) {
        return { error: { msg: "Panel not found" } };
    }
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
    };
    const PARAMS = {
        "table": {
            "cep.initial": "CEP INICIAL",
            "cep.final": "CEP FINAL",
            "deadline": "Prazo",
            "excess": "Exce",
            "rate": {
                "deadline": "",
                "price": ""
            },
            "selection.criteria": {
                "price": "UF,REGIAO",
                "deadline": "UF,REGIAO"
            }
        },
        process: _.cloneDeep(GLOBAL_SETTINGS.process),
        template: _.cloneDeep(GLOBAL_SETTINGS.template),
    };
    const initComponents = () => {
        Setup();
        renderControl.loadListFarms();
        loadForm();
        panel.querySelector("#upload-files-plant")?.addEventListener("click", updateFilesPlant);
        panel.querySelector("#get-data")?.addEventListener("click", () => mainControl.getData(idPanel));
        ELEMENTS_FORM.fileSettings.addEventListener("change", uploadSettings);
    };
    const loadForm = () => {
        ELEMENTS_FORM.paramCepInitial.value = PARAMS.table["cep.initial"];
        ELEMENTS_FORM.paramCepFinal.value = PARAMS.table["cep.final"];
        ELEMENTS_FORM.paramCepOriginInitial.value = PARAMS.template.cepOriginValue["cep.origin.initial"];
        ELEMENTS_FORM.paramCepOriginFinal.value = PARAMS.template.cepOriginValue["cep.origin.final"];
        ELEMENTS_FORM.paramDeadline.value = PARAMS.table.deadline;
        ELEMENTS_FORM.paramRateDeadline.value = PARAMS.table.rate.deadline;
        ELEMENTS_FORM.paramRatePrice.value = PARAMS.table.rate.price;
        ELEMENTS_FORM.paramSelectionCriteriaDeadline.value = PARAMS.table["selection.criteria"].deadline;
        ELEMENTS_FORM.paramSelectionCriteriaPrice.value = PARAMS.table["selection.criteria"].price;
        ELEMENTS_FORM.paramExcess.value = PARAMS.table.excess;
    };
    const uploadSettings = () => {
        const fileSettingsInput = ELEMENTS_FORM.fileSettings?.files ? ELEMENTS_FORM.fileSettings?.files[0] : null;
        if (!fileSettingsInput) {
            return;
        }
        const fileSettings = mainControl.createFile({ content: [fileSettingsInput], type: fileSettingsInput.type });
        mainControl.getContentFile(fileSettings, (result) => {
            const contentSettings = converterStringToJSON(result, ["separatorLine"]);
            if (!contentSettings || !deepEqual(contentSettings, GLOBAL_SETTINGS)) {
                return console.log("Template incorrect");
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
            plants: [
                {
                    code: "farm", file: plantFarm || mainControl.createFile({ content: [plantFarmTest] }),
                    headers: [
                        { header: paramCepFinal || PARAMS.table["cep.final"], type: "cep.final" },
                        { header: paramCepInitial || PARAMS.table["cep.initial"], type: "cep.initial" },
                        { header: paramDeadline || PARAMS.table.deadline, type: "deadline" },
                        { header: paramRateDeadline || PARAMS.table.rate.deadline, type: "rate" },
                        { header: paramExcess || PARAMS.table.excess, type: "excess" },
                        { header: paramSelectionCriteriaDeadline || PARAMS.table["selection.criteria"].deadline, type: "selection-criteria" },
                    ],
                    name: "Fazenda"
                },
            ],
            settings: PARAMS,
            process: [
                { type: "insert-values", logs: [] },
                { type: "remove-character", logs: [] },
                { type: "deadline+D", logs: [] },
                { type: "contained-cep", logs: [] },
                { type: "procv", logs: [] },
                { type: "rate", logs: [] },
            ]
        };
        if (!plantDeadline || !plantPrice || !paramCepInitial || !paramCepFinal || !paramCepOriginInitial || !paramCepOriginFinal || !paramDeadline || !paramSelectionCriteriaDeadline || !paramSelectionCriteriaPrice || !paramExcess) {
            console.log("$Teste");
            return dataPlants;
        }
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
        });
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
        const { onLoad } = tableComponent({ table: ELEMENTS.tableHistory, headers: HEADERS_TABLE }, (listSelected) => {
        });
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
function deepEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    keys1.sort();
    keys2.sort();
    for (let i = 0; i < keys1.length; i++) {
        if (keys1[i] != keys2[i]) {
            return false;
        }
    }
    return true;
}
function Log(log) {
    console.log(log);
}
