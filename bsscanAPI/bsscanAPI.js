import bscscan, { account } from 'bsc-scan'

bscscan.setUrl('https://bsc-dataseed.binance.org/')
bscscan.setApiKey('APWFP16UP19G7CCDQ39788NNI5UAJJIW3W')

const start = async () => {
    try {
        const balance = await account.getBnbBalance('0x765090aB712984081aeE059eA7025C48a4198183')

        console.log(`Your balance is: ${balance}`)
    } catch (err) {
        console.log(err)
    }
}

start()