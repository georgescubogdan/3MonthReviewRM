import { provideRouterInitializer } from '@angular/router/src/router_module';

export interface Sr {
    srModelId: number;
    description: string;
    isSpor: boolean;
    name: string;
    deletable: boolean;
    formula: string;
    priority: number;
}
