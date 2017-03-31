export default <T>(url: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open("GET", url);

        req.onload = () => {
            if (req.status === 200) {
                try {
                    resolve(JSON.parse(req.response));
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = () => {
            reject(Error("Network Error"));
        };

        req.send();
    });
};
