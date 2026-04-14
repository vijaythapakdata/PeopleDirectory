import { IDropdownOption } from "@fluentui/react/lib/components/Dropdown";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPeopleDirectoryProps {
    title: string;
  group: string;
  departments: IDropdownOption[];
  showDepartmentFilter: boolean;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  pageSize: number;
  context: WebPartContext;
}
