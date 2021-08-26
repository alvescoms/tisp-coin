const axios = require('axios');

exports.getCrypto = async (cryptosToSearch) => {

    const data = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + cryptosToSearch + '&vs_currencies=usd,brl&include_24hr_change=true')

    return data.data

}

exports.getDolar = async () => {

    const data = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL')

    return data.data['USDBRL'].bid

}