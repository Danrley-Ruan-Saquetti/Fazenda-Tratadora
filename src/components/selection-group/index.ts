function SelectionGroupComponent(
  form: HTMLElement,
  props: {
    actions: TOptionSelectionForm[];
    options: TOptionSelection[];
    isParent?: boolean;
    updateList?: boolean;
    classBox: string;
    classMenu: string[];
    basePath: string;
    pathsValue: {
      path: string;
      inputs: { path: string; type: string }[];
      children?: boolean;
    }[];
    templates: {
      _new: (optionActive: string, parentForm?: HTMLElement) => void;
    };
  },
  pre?: TOptionSelectionForm[]
) {
  const MAP_OPTIONS: {
    type: TOptionSelectionForm;
    icon: string;
    _action: string;
    content: string;
  }[] = [
    { type: '_newOne', icon: 'plus-lg', _action: '_new', content: 'Novo' },
    {
      type: '_newAll',
      icon: 'list-ul',
      _action: '_new',
      content: 'Adicionar Tudo',
    },
    { type: '_clear', icon: 'x-lg', _action: '_cancel', content: 'Limpar' },
  ];

  const GET_INPUT_VALUE = {
    text: (el: HTMLInputElement) => {
      return el.value || '';
    },
    'select-one': (el: HTMLInputElement) => {
      return el.value || '';
    },
    file: (el: HTMLInputElement) => {
      return el.files[0] || null;
    },
  };

  if (typeof props.isParent == 'undefined') {
    props.isParent = true;
  }
  if (typeof props.updateList == 'undefined') {
    props.updateList = true;
  }

  const getDataList = () => {
    const listSelected: {
      values?: TFormResult[][];
      subMenu?: TFormResult[][];
    }[][] = [];

    const baseEl = form.querySelectorAll(
      `${props.basePath}`
    ) as NodeListOf<HTMLElement>;

    baseEl.forEach((_base) => {
      const listBases: {
        values?: TFormResult[][];
        subMenu?: TFormResult[][];
      }[] = [];

      props.pathsValue.forEach((_path) => {
        const inputsEl = _base.querySelectorAll(
          `${_path.path}`
        ) as NodeListOf<HTMLInputElement>;
        const values: TFormResult[][] = [];

        inputsEl.forEach((_inputsEl) => {
          const inputGroups: TFormResult[] = [];
          _path.inputs.forEach((_input) => {
            const inputEl = _inputsEl.querySelector(
              `${_input.path}`
            ) as HTMLInputElement;

            if (GET_INPUT_VALUE[`${inputEl.type}`]) {
              const value = GET_INPUT_VALUE[`${inputEl.type}`](inputEl);

              console.log(value, inputEl.type);

              inputGroups.push({ value, type: _input.type });
            }
          });

          values.push(inputGroups);
        });

        if (!_path.children) {
          listBases.push({ values });
        } else {
          listBases.push({ subMenu: values });
        }
      });

      listSelected.push(listBases);
    });

    return listSelected;
  };

  const MAP_OPTIONS_FUNCTION = {
    _newOne: (actionProcessActive: string = '') => {
      props.templates._new(actionProcessActive, form);
    },
    _newAll: () => {
      props.options.forEach((_option) => {
        MAP_OPTIONS_FUNCTION['_newOne'](_option.action);
      });
    },
    _clear: () => {
      const listEl = form.querySelectorAll(
        '.' + props.classBox
      ) as NodeListOf<HTMLElement>;

      listEl.forEach((_el) => _el.remove());
    },
  };

  const createContainerActions = () => {
    const container = document.createElement('div');

    container.setAttribute('button-container', '');
    container.classList.add('select-group-actions');

    MAP_OPTIONS.forEach((_option) => {
      if (!props.actions.includes(_option.type)) {
        return;
      }

      const bt = document.createElement('button');
      const span = document.createElement('span');

      bt.onclick = () => MAP_OPTIONS_FUNCTION[_option.type]();

      bt.setAttribute('action', _option._action);
      span.textContent = _option.content;

      bt.appendChild(span);
      container.appendChild(bt);
    });

    form.appendChild(container);
  };

  const createListOptions = () => {
    const list = document.createElement('div');

    list.setAttribute('list-type', 'vertical');
    list.classList.add(...props.classMenu);

    form.appendChild(list);
  };

  const setup = () => {
    createContainerActions();
    createListOptions();

    pre && pre.forEach((_preFunc) => MAP_OPTIONS_FUNCTION[_preFunc]());
  };

  const getData = () => {
    return getDataList();
  };

  setup();

  return {
    getData,
  };
}
