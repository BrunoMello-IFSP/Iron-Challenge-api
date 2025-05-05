export interface ICreateEventDTO {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  categories: { name: string; weightRequirement: number }[];
}