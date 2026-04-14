import { IDropdownOption } from "@fluentui/react/lib/components/Dropdown";


export interface IGroupSelectProps {
  label: string;
  loadOptions: () => Promise<IDropdownOption[]>;
  selected: number | string;
  onChange?: (option: IDropdownOption, index?: number) => void;
  disabled: boolean;
}