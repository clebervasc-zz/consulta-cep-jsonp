function validateZip(inputZip) {
    let minLength = 8;

    if(inputZip.length < minLength) return false;

    let sum = 0;
    for(let i=0; i < inputZip.length; i++) { sum += parseInt(inputZip[i]); }
    let avg = sum / inputZip.length;
    if(avg.toString() == inputZip.substring(0,1)) return false;

    return true;
}

export {validateZip}