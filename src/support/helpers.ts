export const startTimeout = (time: number) => {
    let timeoutId: any = null;
    const promise = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, time);
    });
    const cancel = () => timeoutId && clearTimeout(timeoutId);
    // @ts-ignore
    promise.cancel = cancel;

    return promise;
};
