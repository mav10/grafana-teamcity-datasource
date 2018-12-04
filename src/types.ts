
export interface IFields {
   [name: string]: string[]
}

export interface IHeaders {
    [name: string]: string
}

export const TargetTypes: any = {
    Build: "builds",
    Project: "projects"
}

export interface buildRequests {
    from: Date,
    to: Date,
    count: number,
    buildId: string
}