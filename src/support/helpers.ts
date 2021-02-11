export const startTimeout = (time: number) => {
    let timeoutId: any = null;
    const promise = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, time);
    });
    // @ts-ignore
    promise.cancel = () => timeoutId && clearTimeout(timeoutId);

    return promise;
};
