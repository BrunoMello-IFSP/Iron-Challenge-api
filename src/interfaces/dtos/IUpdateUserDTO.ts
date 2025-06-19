export interface IUpdateUserDTO {
  name?: string;
  cpf?: string;
  birthDate?: Date;
  sex?: string;
  phone?: number;
  email?: string;
  role?: string;
  address?: {
    street?: string;
    number?: number;
    neighborhood?: string;
    complement?: string;
    city?: string;
    uf?: string;
    zipCode?: string;
  };
}