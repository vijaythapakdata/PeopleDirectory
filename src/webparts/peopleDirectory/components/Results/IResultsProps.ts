// import { IPerson } from '../../interfaces/IPerson';
import { IPerson } from "../../interfaces/IPerson";

export interface IResultsProps {
  results: IPerson[];
  loading?: boolean;
  onUserClick: (user: any) => void;
}