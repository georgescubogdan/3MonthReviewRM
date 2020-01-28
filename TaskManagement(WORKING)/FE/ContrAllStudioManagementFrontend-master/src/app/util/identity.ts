export enum AccountStatusType {
    NONE,
    ACTIVATED,
    ACTIVATION_REQUIRED,
}

export enum AccountType {
    NONE,
    USER,
    ADMIN
}

export class RegisterResult {
    email: string;
    accountStatus: AccountStatusType;
}

export class RegisterData {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
    cif: string;
    companyName: string;
    regNo: string;
    county: string;
    city: string;
    address: string;
    capital: string;
    paysVAT: true;
    cashingVAT: true;
}

export class FirmDataApiResult {
    cui: string;
    denumire: string;
    adresa: string;
}

export class LoginResult {
    email: string;
    accountStatus: AccountStatusType;
    accountType: AccountType
}

export class LoginData {
    email: string;
    password: string;
}