import {Iban} from './iban';
export interface Profile {
    ibans: Iban[];
    profileModelId: number;
    code: string;
    name: string;
    subDomainId: number;
}
