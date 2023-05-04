type TOptionSelectionForm = '_newOne' | '_newAll' | '_clear';
type TOptionSelectionFormAction = '_newOne' | '_newAll' | '_clear';
type TOptionSelection = {
  content: string;
  type: string;
  action: string;
  submenu?: any[];
};
type TFormResult = { value: any; type: string };
