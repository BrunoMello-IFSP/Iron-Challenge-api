export interface ICreateEventDTO {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  eventDate: string;
  token: string;
  categories: { name: string; weightRequirement: number; started: string }[];
  sponsors?: string[];
}