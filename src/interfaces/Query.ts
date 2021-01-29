export interface Query<T> {
    data: T | null,
    error: any,
    status: string,
}
