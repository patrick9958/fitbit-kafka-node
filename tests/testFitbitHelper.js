import FitbitHelper from '../lib/FitbitHelper.js';

const authCode = '35ab1f1f4aa7858fdc1ece98e30fd2597f27a444';

let data = await FitbitHelper.getAuthorizationInformation(authCode);
console.log(data);
