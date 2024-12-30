import crypto from "crypto";

function generateHash(key: string, txnid: string, amount: number, productinfo: string, firstname: string, email: string): string {
    let salt = process.env.PAYU_SALT||'';
    const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(input).digest('hex');
}

function generateReverseHash(key: string,txnid: string, amount: number, productinfo: string, firstname: string, email: string, status: string){
    let salt = process.env.PAYU_SALT||'';
    const input =  `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    return crypto.createHash('sha512').update(input).digest('hex');
}

export {generateHash, generateReverseHash}