function FeatureScript(idPanel: string) {
  const panel = document.querySelector(`[panel="feature"][id="${idPanel}"]`);

  if (!panel) {
    return { error: { msg: 'Panel not found' } };
  }

  const ELEMENTS = {
    selectGroupPlants: panel.querySelector(
      '.select-group.plants'
    ) as HTMLElement,
    selectGroupProcess: panel.querySelector(
      '.select-group.process'
    ) as HTMLElement,
    btUpload: panel.querySelector('#upload-files-plant') as HTMLElement,
  };

  const dataPlants: {
    plants: { code: string; file: Blob; headers: any[]; name: string }[];
  } = {
    plants: [],
  };

  const MAP_PARAMS = {
    process: {
      'create-farm': [],
      'insert-values': [],
      'deadline+D': [],
      'contained-cep': [],
      procv: [],
      template: [],
      rate: [],
    },
    plants: [
      {
        content: 'CEP de Origem Inicial',
        type: 'cep.origin.initial',
        action: 'cep.origin.initial',
      },
      {
        content: 'CEP de Origem Final',
        type: 'cep.origin.final',
        action: 'cep.origin.final',
      },
      { content: 'CEP Inicial', type: 'cep.initial', action: 'cep.initial' },
      { content: 'CEP Final', type: 'cep.final', action: 'cep.final' },
      {
        content: 'Critério de Seleção',
        type: 'selection-criteria',
        action: 'selection-criteria',
      },
      { content: 'Prazo', type: 'deadline', action: 'deadline' },
      { content: 'Prazo+D', type: 'deadline+d', action: 'deadline+d' },
      { content: 'Excedente', type: 'excess', action: 'excess' },
      { content: 'Taxa', type: 'rate', action: 'rate' },
    ],
  };

  const MAP_SELECTION_PLANTS: TOptionSelection[] = [
    { action: 'deadline', content: 'Prazo', type: 'deadline' },
    { action: 'price', content: 'Preço', type: 'price' },
    { action: 'farm', content: 'Fazenda', type: 'farm' },
  ];

  const MAP_SELECTION_PROCESS: TOptionSelection[] = [
    {
      content: 'Criar Fazenda',
      type: 'process',
      action: 'create-farm',
      submenu: [...MAP_PARAMS['process']['create-farm']],
    },
    {
      content: 'Inserir valores',
      type: 'process',
      action: 'insert-values',
      submenu: [...MAP_PARAMS['process']['insert-values']],
    },
    {
      content: 'D+1',
      type: 'process',
      action: 'deadline+D',
      submenu: [...MAP_PARAMS['process']['deadline+D']],
    },
    {
      content: 'Verificar CEP contido',
      type: 'process',
      action: 'contained-cep',
      submenu: [...MAP_PARAMS['process']['contained-cep']],
    },
    {
      content: 'Procv',
      type: 'process',
      action: 'procv',
      submenu: [...MAP_PARAMS['process']['procv']],
    },
    {
      content: 'Gerar templates de Preço e Prazo',
      type: 'process',
      action: 'template',
      submenu: [...MAP_PARAMS['process']['template']],
    },
    {
      content: 'Gerar templates de taxas',
      type: 'process',
      action: 'rate',
      submenu: [...MAP_PARAMS['process']['rate']],
    },
  ];

  const initComponents = () => {
    const forms = panel.querySelectorAll('form') as NodeListOf<HTMLElement>;

    forms.forEach((_form) =>
      _form.addEventListener('submit', (ev) => ev.preventDefault())
    );

    const { getData: getListPlants } = SelectionGroupComponent(
      ELEMENTS.selectGroupPlants,
      {
        templates: { _new: templateSelectionPlantsParent },
        basePath: '.box.parent',
        pathsValue: [
          {
            path: '.box-container.parent',
            inputs: [
              { type: 'plant-file', path: 'input[type="file"]' },
              { type: 'plant-name', path: 'input[type="text"]' },
              { type: 'plant-type', path: 'select' },
            ],
          },
          {
            path: '.box-container.children',
            children: true,
            inputs: [
              { type: 'header-name', path: 'input[type="text"]' },
              { type: 'header-type', path: 'select' },
            ],
          },
        ],
        actions: ['_newOne', '_newAll', '_clear'],
        options: MAP_SELECTION_PLANTS,
        classBox: 'box',
        classMenu: ['select-group-list', 'parent'],
      },
      ['_newOne']
    );
    const { getData: getListProcess } = SelectionGroupComponent(
      ELEMENTS.selectGroupProcess,
      {
        templates: { _new: templateSelectionProcess },
        basePath: '.box.parent',
        pathsValue: [
          {
            path: '.box-container.parent',
            inputs: [{ path: 'select', type: 'process' }],
          },
        ],
        actions: ['_newOne', '_newAll', '_clear'],
        classBox: 'box',
        classMenu: ['select-group-list'],
        options: MAP_SELECTION_PROCESS,
      },
      []
    );

    ELEMENTS.btUpload.addEventListener('click', () => {
      dataPlants.plants.splice(0, dataPlants.plants.length);

      getListPlants().map((_plants) => {
        const plant: {
          code: string;
          file: Blob;
          headers: any[];
          name: string;
        } = {
          code: '',
          file: null,
          headers: [],
          name: '',
        };
        _plants.forEach((_plant) => {
          _plant.values &&
            _plant.values.forEach((_valuesInput) => {
              _valuesInput.forEach((_value) => {
                plant[
                  _value.type == 'plant-type'
                    ? 'code'
                    : _value.type == 'plant-name'
                    ? 'name'
                    : 'file'
                ] = _value.value;
              });
            });

          _plant.subMenu &&
            _plant.subMenu.forEach((_valuesInput) => {
              const header = {
                header: '',
                type: '',
              };
              _valuesInput.forEach((_value) => {
                header[_value.type == 'header-type' ? 'type' : 'header'] =
                  _value.value;
              });

              plant.headers.push(header);
            });
        });

        dataPlants.plants.push(plant);
      });

      console.log(dataPlants);
    });
  };

  const templateSelectionPlantsParent = (actionProcessActive: string = '') => {
    const box = document.createElement('div');
    const list = ELEMENTS.selectGroupPlants.querySelector(
      '.select-group-list.parent'
    ) as HTMLElement;

    box.classList.add('box', 'parent');

    const selectionContent = document.createElement('div');
    const btRemove = document.createElement('button');
    const selectionProcess = document.createElement('select');
    const subMenu = document.createElement('div');
    const input = document.createElement('input');
    const name = document.createElement('input');

    MAP_SELECTION_PLANTS.forEach((_option) => {
      const option = document.createElement('option');

      option.innerHTML = _option.content;
      option.value = _option.action;

      if (actionProcessActive == _option.action) {
        option.selected = true;
      }

      selectionProcess.appendChild(option);
    });

    selectionContent.classList.add('box-container', 'parent');
    subMenu.classList.add('sub-menu');

    btRemove.innerHTML = 'DEL';

    input.setAttribute('type', 'file');
    name.setAttribute('type', 'text');
    btRemove.setAttribute('action', '_default');
    btRemove.onclick = () => {
      box.remove();
    };
    SelectionGroupComponent(
      subMenu,
      {
        templates: {
          _new: templateSelectionPlantsChildren,
        },
        basePath: '',
        pathsValue: [],
        actions: ['_newOne', '_newAll', '_clear'],
        options: [...MAP_PARAMS['plants']],
        isParent: false,
        updateList: false,
        classBox: 'box',
        classMenu: ['select-group-list', 'children'],
      },
      ['_newAll']
    );

    selectionContent.appendChild(name);
    selectionContent.appendChild(selectionProcess);
    selectionContent.appendChild(input);
    selectionContent.appendChild(btRemove);
    box.appendChild(selectionContent);
    list.appendChild(box);
    box.appendChild(subMenu);
  };

  const templateSelectionPlantsChildren = (
    actionProcessActive: string = '',
    parentForm?: HTMLElement
  ) => {
    if (!parentForm) {
      return;
    }

    const box = document.createElement('div');
    const list = parentForm.querySelector(
      '.select-group-list.children'
    ) as HTMLElement;

    box.classList.add('box', 'children');

    const selectionContent = document.createElement('div');
    const btRemove = document.createElement('button');
    const selectionProcess = document.createElement('select');
    const input = document.createElement('input');

    MAP_PARAMS['plants'].forEach((_option) => {
      const option = document.createElement('option');

      option.innerHTML = _option.content;
      option.value = _option.action;

      if (actionProcessActive == _option.action) {
        option.selected = true;
      }

      selectionProcess.appendChild(option);
    });

    selectionContent.classList.add('box-container', 'children');

    btRemove.innerHTML = 'DEL';

    input.setAttribute('type', 'text');
    btRemove.setAttribute('action', '_default');
    btRemove.onclick = () => {
      box.remove();
    };

    selectionContent.appendChild(selectionProcess);
    selectionContent.appendChild(input);
    selectionContent.appendChild(btRemove);
    box.appendChild(selectionContent);
    list.appendChild(box);
  };

  const templateSelectionProcess = (actionProcessActive: string = '') => {
    const box = document.createElement('div');
    const list = ELEMENTS.selectGroupProcess.querySelector(
      '.select-group-list'
    ) as HTMLElement;

    box.classList.add('box', 'parent');

    const selectionContent = document.createElement('div');
    const btRemove = document.createElement('button');
    const selectionProcess = document.createElement('select');

    MAP_SELECTION_PROCESS.forEach((_option) => {
      const option = document.createElement('option');

      option.innerHTML = _option.content;
      option.value = _option.action;

      if (actionProcessActive == _option.action) {
        option.selected = true;
      }

      selectionProcess.appendChild(option);
    });

    selectionContent.classList.add('box-container', 'parent');

    btRemove.innerHTML = 'DEL';

    btRemove.setAttribute('action', '_default');
    btRemove.onclick = () => {
      box.remove();
    };

    selectionContent.appendChild(selectionProcess);
    selectionContent.appendChild(btRemove);
    box.appendChild(selectionContent);
    list.appendChild(box);
  };

  initComponents();

  return {};
}
