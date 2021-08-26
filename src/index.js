const { Client, Intents, MessageEmbed } = require('discord.js')
const { token, channelId } = require('./config.json')
const allCryptos = require('./cryptos.json')
// const allCurrencies = require('./currencies.json')

const { getDolar, getCrypto } = require('./services/currency')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// Inicializa o Bot
// Manda cotacao a cada 60s
client.once('ready', () => {

    getCurrency() 

    setTimeout(() => getCurrency(), 600000)

})


client.on('interactionCreate', async interaction => {

    let cryptosList = {}
    Object.keys(allCryptos).forEach(key => {
        cryptosList[allCryptos[key].title.split('-')[0].trim()] = key
    })

    if (!interaction.isCommand()) return;

    const cryptos = await getCrypto()

	const { commandName } = interaction;

    // List Cryptos
	if (commandName === 'cryptos') {
        
        const currencyMessage = await getCurrencyMessages()

		await interaction.reply({ embeds: currencyMessage})

    // Get Actual Crypto Value
    }
    else if (commandName === 'crypto') {

        const currentCrypto = interaction.options.getString('actualcrypto').toUpperCase();

        try {
            if (Object.keys(cryptosList).indexOf(currentCrypto.toUpperCase()) > -1 ) {
                const currencyMessage = await getCurrencyMessages([cryptosList[currentCrypto]])  

                interaction.reply({ embeds: currencyMessage})
            } else {

                await interaction.reply("Nao identificamos a crypto desejada, favor verificar")

            }

        } catch (error) {

            console.log(error)

            await interaction.reply("O comando enviado esta mal formatado, favor verificar")
        }

    // Convert some Crypto to USD/BRL
    }
    else if (commandName === 'currency') {

        const currentCrypto = interaction.options.getString('checkcrypto').toUpperCase();
        const quantity = interaction.options.getString('quantity');

        let cryptosToSearch = Object.keys(allCryptos).join(',')

        const crypto = await getCrypto(cryptosToSearch)
        
        try {

            if (Object.keys(cryptosList).indexOf(currentCrypto) > -1 ) {

                if (!quantity) {

                    await interaction.reply("Quantidade da crypto desejada nao enviada, favor reenviar")
                    
                }
                else {

                    const valueInUSD = parseFloat(quantity)*crypto[cryptosList[currentCrypto]].usd.toString();
                    const valueInBRL = parseFloat(quantity)*crypto[cryptosList[currentCrypto]].brl.toString();

                    const responseMessage = new MessageEmbed()
                        .setColor(allCryptos[cryptosList[currentCrypto]].color)
                        .setTitle('Cotação de ' + quantity + " " + currentCrypto.toUpperCase())
                        .setAuthor('TISP Coin', 'https://i.ibb.co/cNsHf4T/pp.png', '')
                        .setThumbnail(allCryptos[cryptosList[currentCrypto]].image)
                        .addField('Dolar', '$ ' + parseFloat(valueInUSD).toFixed(2), true)
                        .addField('Real', 'R$ ' + parseFloat(valueInBRL).toFixed(2), true)
                        .setTimestamp()

                    await interaction.reply({ embeds: [ responseMessage ]})
                }

            }
            else {

                await interaction.reply("Nao identificamos a crypto desejada, favor verificar")

            }

        }
        catch (error) {

            console.log(error)
            
            await interaction.reply("O comando enviado esta mal formatado, favor verificar")
            
        }

    }

})

client.login(token)

const getCurrency = async () => {

    const channel = await client.channels.fetch(channelId)
    const currencyMessage = await getCurrencyMessages()   

    channel.send({ embeds: currencyMessage})

}

const getCurrencyMessages = async (currenciesToGet = []) => {
    
    const message = []

    let cryptosToSearch = Object.keys(allCryptos).join(',')

    const crypto = await getCrypto(cryptosToSearch)

    Object.keys(crypto).forEach(key => {

        if (currenciesToGet.length == 0) {
            
            message.push(

                new MessageEmbed()
                    .setColor(allCryptos[key].color)
                    .setTitle(allCryptos[key].title)
                    .setURL(allCryptos[key].url)
                    .setAuthor('TISP Coin', 'https://i.ibb.co/cNsHf4T/pp.png', allCryptos[key].url)
                    .setThumbnail(allCryptos[key].image)
                    .addField('Dolar', '$ ' + crypto[key].usd.toString(), true)
                    .addField('Real', 'R$ ' + crypto[key].brl.toString(), true)
                    .addField('Variação 24h Dolar', (crypto[key].usd_24h_change < 0) ? '🟥 ' : '🟩 ' + crypto[key].usd_24h_change.toFixed(4).toString() + '%', false)
                    .addField('Variação 24h Real', (crypto[key].usd_24h_change < 0) ? '🟥 ' : '🟩 '+ crypto[key].brl_24h_change.toFixed(4).toString() + '%', false)
                    .setTimestamp()
    
            )

        }
        else {

            if (currenciesToGet.indexOf(key) > -1) {

                message.push(

                    new MessageEmbed()
                        .setColor(allCryptos[key].color)
                        .setTitle(allCryptos[key].title)
                        .setURL(allCryptos[key].url)
                        .setAuthor('TISP Coin', 'https://i.ibb.co/cNsHf4T/pp.png', allCryptos[key].url)
                        .setThumbnail(allCryptos[key].image)
                        .addField('Dolar', '$ ' + crypto[key].usd.toString(), true)
                        .addField('Real', 'R$ ' + crypto[key].brl.toString(), true)
                        .addField('Variação 24h Dolar', (crypto[key].usd_24h_change < 0) ? '🟥 ' : '🟩 ' + crypto[key].usd_24h_change.toFixed(4).toString() + '%', false)
                        .addField('Variação 24h Real', (crypto[key].usd_24h_change < 0) ? '🟥 ' : '🟩 '+ crypto[key].brl_24h_change.toFixed(4).toString() + '%', false)
                        .setTimestamp()
        
                )

            }

        }

    })

    return message

}