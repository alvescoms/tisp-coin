const { Client, Intents, MessageEmbed } = require('discord.js')
const { token, channelId } = require('./config.json')
const allCryptos = require('./cryptos.json')
const groupsPvu = require('./groups-pvu.json')
// const allCurrencies = require('./currencies.json')

const { getDolar, getCrypto } = require('./services/currency')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// Inicializa o Bot
// Manda cotacao a cada 600s
client.once('ready', () => {

    getCurrency() 

    setTimeout(() => getCurrency(), 600000)

})

// Interacoes de Comandos com o Bot
client.on('interactionCreate', async interaction => {

    let cryptosListTag = {}
    Object.keys(allCryptos).forEach(key => {
        cryptosListTag[allCryptos[key].title.split('-')[0].trim()] = key
    })

    // if (!interaction.isCommand()) {
    //     console.log('seu burro')
    //     return 0
    // };

	const { commandName } = interaction;

    // List all TISP Cryptos
    if (commandName === 'help') {
        const helpMessage = await getHelpMessage()

		await interaction.reply({ embeds: helpMessage})
    }
    // List All TISP Cryptos Tag
    else if (commandName === 'cryptostag') {
        const tagsMessage = await getTagsMessage(cryptosListTag)

		await interaction.reply({ embeds: tagsMessage})
    }
    // List all TISP Cryptos Currency
	else if (commandName === 'getcryptos') {
        
        const currencyMessage = await getCurrencyMessages()

		await interaction.reply({ embeds: currencyMessage})

    }
    // Get PVU Group List
    else if (commandName === 'getpvugroups') {
        const groupsMessage = await getGroupsMessage()

		await interaction.reply({ embeds: groupsMessage})
    }
    // Get specific Crypto Currency
    else if (commandName === 'crypto') {

        // Get actual crypto Param
        const currentCrypto = interaction.options.getString('crytptoname').toUpperCase();

        // Try to Verify bad formatted command
        try {
            if (Object.keys(cryptosListTag).indexOf(currentCrypto.toUpperCase()) > -1 ) {
                const currencyMessage = await getCurrencyMessages([cryptosListTag[currentCrypto]])  

                interaction.reply({ embeds: currencyMessage})
            } else {

                await interaction.reply("Nao identificamos a crypto desejada, favor verificar")

            }

        } catch (error) {

            console.log(error)

            await interaction.reply("O comando enviado esta mal formatado, favor verificar")
        }

    }
    // Convert specifc Crypto to USD/BRL
    else if (commandName === 'exchange') {

        // Get actual crypto Param
        const currentCrypto = interaction.options.getString('cryptotoexchange').toUpperCase();
        // Get acrypto quantity Param
        const quantity = interaction.options.getString('quantity');

        // List all cryptos tag:token
        let cryptosToSearch = Object.keys(allCryptos).join(',')

        const crypto = await getCrypto(cryptosToSearch)
        
        // Try to Verify bad formatted command
        try {

            if (Object.keys(cryptosListTag).indexOf(currentCrypto) > -1 ) {

                if (!quantity) {

                    await interaction.reply("Quantidade da crypto desejada nao enviada, favor reenviar")
                    
                }
                else {

                    const valueInUSD = parseFloat(quantity)*crypto[cryptosListTag[currentCrypto]].usd.toString();
                    const valueInBRL = parseFloat(quantity)*crypto[cryptosListTag[currentCrypto]].brl.toString();

                    const responseMessage = new MessageEmbed()
                        .setColor(allCryptos[cryptosListTag[currentCrypto]].color)
                        .setTitle('Cotação de ' + quantity + " " + currentCrypto.toUpperCase())
                        .setAuthor('TISP Coin', 'https://i.ibb.co/cNsHf4T/pp.png', '')
                        .setThumbnail(allCryptos[cryptosListTag[currentCrypto]].image)
                        .addField('Dolar', '$ ' + parseFloat(valueInUSD).toFixed(2), true)
                        .addField('Real', 'R$ ' + parseFloat(valueInBRL).toFixed(2), true)
                        .setTimestamp()

                    await interaction.reply({ embeds: [ responseMessage ]})
                }

            }
            else {
                // If Crypto dont exist on TISP
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


// Messages for interactions
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
                    .addField('Dolar', '$ ' + crypto[key].usd.toFixed(2).toString(), true)
                    .addField('Real', 'R$ ' + crypto[key].brl.toFixed(2).toString(), true)
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

const getHelpMessage = async () => {
    
    const message = []
            
    message.push(new MessageEmbed()
        .setColor('#68237f')
        .setTitle('TISP - Lista de Comandos do bot')
        .setAuthor('TISP Coin', 'https://i.ibb.co/cNsHf4T/pp.png', '')
        .setImage('https://i.pinimg.com/originals/ed/32/31/ed32319213bb232b3e9fb85cf06739d9.gif')
        .addField('/getcryptos', 'Replies with all TISP Cryptos Currencies!', false)
        .addField('/crypto [cryptoTAG]', 'Replies with specific TISP Cryptos Currencies!', false)
        .addField('/exchange [cryptoTAG] [quantity]', 'Replies crypto currency conversion', false)
        .addField('/cryptostag', 'Replies all TISP cryptos TAGs', false)
        .addField('/getpvugroups', 'Replies with PVU groups list', false)
        .addField('/help', 'Replies with all commands', false)
        .setTimestamp())

    return message

}

const getTagsMessage = async (cryptosTagList) => {
    
    const message = []

    const messageEmbed = new MessageEmbed()
        .setColor('#68237f')
        .setTitle('TISP - Lista de tags das cryptos')
        .setAuthor('TISP Coin', 'https://i.ibb.co/cNsHf4T/pp.png', '')
    
    Object.keys(cryptosTagList).forEach(key => {
        messageEmbed.addField(key, allCryptos[cryptosTagList[key]].title.split('-')[1], true)
    })
    
    message.push(messageEmbed)

    return message

}

const getGroupsMessage = async () => {
    
    const messageEmbed = new MessageEmbed()
        .setColor('#68237f')
        .setTitle('TISP - Grupos de acesso PVU')
        .setAuthor('TISP Coin', 'https://i.ibb.co/cNsHf4T/pp.png', '')

    for (let index = 0; index < groupsPvu.groups.length; index++) {
            
        var item = '```'
        item += groupsPvu.groups[index].join(', ').toString()
        item += '```'

        messageEmbed.addField('Grupo ' + (index + 1).toString(),item, false)

    }

    return [messageEmbed]

}