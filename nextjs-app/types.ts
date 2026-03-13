export enum AppState {
  LOADING = 'LOADING',
  WELCOME = 'WELCOME',
  MAIN = 'MAIN'
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}
