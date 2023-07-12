export interface Empresa {
    id: number
    name: string
    nit: number
}

export interface User {
    id?: number
    username: string
    email: string
    password: string
    companyId: number
    tipo?: string
    areas?: Area[]
}

export interface Step {
    id?: number
    number: number,
    title: string
    description: string
    video: string
    activityId: number
}

export interface CreateStep {
    number: number,
    title: string
    description: string
    video: string | ArrayBuffer | null
    activityId?: number
}

export interface Area {
    id?: number
    name: string
    companyId: number
    active?: boolean
}

export interface Activity {
    id?: number
    title: string
    areaId: number
    active?: boolean
    companyId: number
}

