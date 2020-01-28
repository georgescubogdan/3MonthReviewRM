import {Profile} from './profile';
export interface SD {
    subDomainId: number;
    name: string;
    code: string;
    profiles: Profile[];
    enable: boolean;
    angCode: string;
    angId: string;
}
