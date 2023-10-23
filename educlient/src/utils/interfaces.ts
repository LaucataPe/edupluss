export interface Empresa {
  id: number;
  name: string;
  nit: number;
  active: boolean;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  companyId: number;
  avatarImage?: string;
  tipo?: string;
  areas?: Area[];
  active?: boolean;
}

export interface UserEdit {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  avatarImage?: string;
  companyId?: number;
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
  durationTest?: string;
  numberSteps: number;
  formURL: string;
  excelURL: string;
  roleId: number;
  active?: boolean;
  orderId:number;
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

export interface ListEvaluation {
  active: boolean,
  hasTest: boolean,
  id: number,
  title: string
}

export interface TestGrade {
  id? : number,
  gradeValue? : string,
  maximunGradeValue? : string,
  testWatched? : boolean
}

export interface EmployeeGrades {
  id: number,
  gradeValue: number,
  maximunGradeValue: number,
  Activity: {
    id: number,
  }
}

export interface GradePercentage {
  gradePercentage: number;
  activityName: string;
}

export interface EmployeeQualification {
  idUser?: number;
  username?: string;
  email?: string;
  idTestGrade: number;
  gradeValue: string | undefined;
  maximunGradeValue: string | undefined;
  testWatched?: boolean;
  errorTest?: boolean;
  activityId?: number;
}

export interface excelRow {
  A: string | number;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
  I: string;
  J: string;
  K: string;
  L: string;
  M: string;
  N: string;
  __EMPTY: number;
  __rowNum__: number;
  [key: string]: string | number;
}
