const validServerAddrRegex = /^https?:\/\/[a-z0-9.-]+(:[0-9]+)?(\/[a-z0-9]+)*\/?$/i;
const validEmailRegex = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;

export function isValidServerAddr(serverAddr: string):boolean {
    return validServerAddrRegex.test(serverAddr);
}

export function isValidEmail(email: string): boolean {
    return validEmailRegex.test(email);
}
