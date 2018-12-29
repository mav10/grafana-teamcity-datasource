export interface Range {
    from: Date;
    to: Date;
    raw: RangeRaw;
}

export interface RangeRaw {
    from: string;
    to: string;
}

/**
 *
 */
export interface ITarget {
    /**
     * intern unique key
     */
    $$hashKey: string;
    /**
     * target build id in TeamCity (DeployService)
     */
    target: string;
    /**
     * for current example it's a build (first combobox in query)
     */
    type: string;
    /**
     * The field is returned from TeamCity. e.g. status, state, projectName etc.
     */
    field: string;
    /**
     * intern unique key
     */
    refId: string;
}

export interface Interval {
    text: string;
    value: string;
}

export interface IntervalMs {
    text: number;
    value: number;
}