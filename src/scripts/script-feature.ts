function FeatureScript(idPanel: string) {
  const panel = querySelector(`[panel="feature"][id="${idPanel}"]`);

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

    const { listSelected: listPlants } = SelectionGroupComponent(
      ELEMENTS.selectGroupPlants,
      {
        templates: {
          _new: templateSelectionPlantsParent,
        },
        pathsValue: [
          {
            values: [
              {
                path: '.box.parent .box-container.parent input[type="file"]',
                type: 'plant-file',
              },
              {
                path: '.box.parent .box-container.parent select',
                type: 'plant-type',
              },
            ],
            childrens: [
              {
                path: '.box.parent .box-container.children input',
                type: 'header',
              },
            ],
          },
        ],
        actions: ['_newOne', '_newAll', '_clear'],
        options: MAP_SELECTION_PLANTS,
        classBox: 'box',
        classMenu: ['select-group-list', 'parent'],
      },
      []
    );
    const { listSelected: listProcess } = SelectionGroupComponent(
      ELEMENTS.selectGroupProcess,
      {
        templates: {
          _new: templateSelectionProcess,
        },
        pathsValue: [
          {
            values: [
              {
                path: '.box.parent .box-container.parent  select',
                type: 'process',
              },
            ],
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
      console.log(listPlants, listProcess);
    });
  };

  const templateSelectionPlantsParent = (
    actionProcessActive: string = '',
    onChange?: () => void
  ) => {
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
    btRemove.setAttribute('action', '_default');
    selectionProcess.onchange = () => onChange && onChange();
    btRemove.onclick = () => {
      box.remove();
      onChange && onChange();
    };
    SelectionGroupComponent(
      subMenu,
      {
        templates: {
          _new: templateSelectionPlantsChildren,
        },
        pathsValue: [],
        actions: ['_newOne', '_newAll', '_clear'],
        options: [...MAP_PARAMS['plants']],
        isParent: false,
        updateList: false,
        classBox: 'box',
        classMenu: ['select-group-list', 'children'],
        listeners: { onUpdate: onChange },
      },
      []
    );

    selectionContent.appendChild(selectionProcess);
    selectionContent.appendChild(input);
    selectionContent.appendChild(btRemove);
    box.appendChild(selectionContent);
    list.appendChild(box);
    box.appendChild(subMenu);
  };

  const templateSelectionPlantsChildren = (
    actionProcessActive: string = '',
    onChange?: () => void,
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
    const subMenu = document.createElement('div');
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
    subMenu.classList.add('sub-menu');

    btRemove.innerHTML = 'DEL';

    input.setAttribute('type', 'text');
    btRemove.setAttribute('action', '_default');
    selectionProcess.onchange = () => onChange && onChange();
    btRemove.onclick = () => {
      box.remove();
      onChange && onChange();
    };

    selectionContent.appendChild(selectionProcess);
    selectionContent.appendChild(input);
    selectionContent.appendChild(btRemove);
    box.appendChild(selectionContent);
    list.appendChild(box);
    box.appendChild(subMenu);
  };

  const templateSelectionProcess = (
    actionProcessActive: string = '',
    onChange?: () => void
  ) => {
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
    selectionProcess.onchange = () => onChange && onChange();
    btRemove.onclick = () => {
      box.remove();
      onChange && onChange();
    };

    selectionContent.appendChild(selectionProcess);
    selectionContent.appendChild(btRemove);
    box.appendChild(selectionContent);
    list.appendChild(box);
  };

  initComponents();

  return {};
}
