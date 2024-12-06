import axios from 'axios';

function getaccesstoken2ledgged()
{
    var querystring = require('querystring');
    return axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v2/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
            client_id: 'VIAvLqRFS014ISwQFHu1dwox4x6OAAhT',
            client_secret: 'JWTOp9OmbVEuRPIq',
            grant_type: 'client_credentials',
            scope: 'bucket:create bucket:read bucket:update bucket:delete data:write data:read'
        })
    })
        .then(function (response) {
            // Success
           
            return response.data.access_token
         //   res.send(response.data)

        })
        .catch(function (error) {
            // Failed
           
            //return error
            //  res.send('Failed to authenticate');
        });

}

export default getaccesstoken2ledgged