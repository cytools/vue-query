interface Cache<TData, TReturnData> {
    put: (key: string, data: TData) => this;
    get: (key: string) => TReturnData;
    remove: (key: string) => this;
    count: () => number;
    clear: () => this;
}

export type CacheData<TData> = {
    [key: string]: TData
}

export default Cache;
