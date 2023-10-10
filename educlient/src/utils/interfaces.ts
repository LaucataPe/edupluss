export interface Empresa {
  id: number;
  name: string;
  nit: number;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  companyId: number;
  tipo?: string;
  areas?: Area[];
  active?: boolean;
}

export interface Step {
  id?: number;
  number: number;
  title: string;
  description: string;
  video: string;
  file?: string;
  activityId: number;
}

export interface CreateStep {
  id?: number;
  number: number;
  title: string;
  description: string;
  video: File | string | ArrayBuffer | null;
  file?: File | string | ArrayBuffer | null;
  activityId?: number;
}

export interface Area {
  id?: number;
  name: string;
  companyId: number;
  active?: boolean;
}

export interface Role {
  id?: number;
  name: string;
  hardSkills: Array<String>;
  softSkills?: Array<String>;
  schedule?: string;
  salary?: string;
  experience?: Array<Number>;
  remote?: boolean;
  areaId?: number;
}

export interface Activity {
  id?: number;
  title: string;
  hasTest: boolean;
  numberSteps: number;
  formURL: string;
  excelURL: string;
  roleId: number;
  active?: boolean;
}

export interface UserStep {
  id?: number;
  finished?: boolean;
  activityId?: number;
  userId?: number;
  stepId?: number;
}

export interface ProgressData {
  userId?: number;
  progress?: string;
}

export interface excelRow {
  A: number;
  B: string | number;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
  __EMPTY: number;
  __rowNum__: number;
}
