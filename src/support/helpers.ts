export const startTimeout = (time: number) => {
    let timeoutId: any = null;
    const promise = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, time);
    });
    // @ts-ignore
    promise.cancel = () => timeoutId && clearTimeout(timeoutId);

    return promise;
};

export const containsAny = (haystack: any[], needles: any[]): boolean => {
    for (const needle of needles) {
        if (haystack.includes(needle)) {
            return true;
        }
    }

    return false;
};
