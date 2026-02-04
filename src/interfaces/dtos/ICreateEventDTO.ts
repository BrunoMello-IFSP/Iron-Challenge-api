export interface ICreateEventDTO {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  token: string;
  categories: { name: string; weightRequirement: number; started: string }[];
}