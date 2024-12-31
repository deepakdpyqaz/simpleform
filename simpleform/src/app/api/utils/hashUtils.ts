import crypto from "crypto";

function generateHash(key: string, txnid: string, amount: number, productinfo: string, firstname: string, email: string): string {
    let salt = process.env.PAYU_SALT||'';
    const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(input).digest('hex');
}

function generateReverseHash(key: string,txnid: string, amount: string, productinfo: string, firstname: string, email: string, status: string, udf1: string, udf2: string, udf3: string, udf4: string, udf5: string, additionalCharges: string){
    let salt = process.env.PAYU_SALT||'';
    const keyString = key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|'+udf1+'|'+udf2+'|'+udf3+'|'+udf4+'|'+udf5+'|||||';
    const keyArray = keyString.split('|');
    const reverseKeyArray = keyArray.reverse();
    let reverseKeyString = salt+'|'+status+'|'+reverseKeyArray.join('|');
    if (additionalCharges) {
        reverseKeyString = additionalCharges + '|' + reverseKeyString
      }
    const cryp = crypto.createHash('sha512'); 
    cryp.update(reverseKeyString);
    const calchash = cryp.digest('hex');
    return calchash;
}


export {generateHash, generateReverseHash}