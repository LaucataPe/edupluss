export interface Empresa {
    id: number
    name: string
    nit: number
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



export const steps: Step[] = [
    {
        id:1,
        number: 1,
        title: "Abrir el navegador",
        description: "Este es el primer paso",
        video: "Acá va el video",
        activityId: 1
    },
    {
        id:2,
        number: 2,
        title: "Abrir el fdgdfg",
        description: "Este es el segundo paso",
        video: "Acá va el video",
        activityId: 1
    },
    {
        id:3,
        number: 3,
        title: "Cerrar",
        description: "Este es el tercer paso",
        video: "Acá va el video",
        activityId: 1
    },
    {
        id:4,
        number: 4,
        title: "Lo lograste",
        description: "Este es el cuarto paso",
        video: "Acá va el video",
        activityId: 1
    }

]