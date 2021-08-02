import bscscan, { account } from 'bsc-scan'

bscscan.setUrl('https://bsc-dataseed.binance.org/')
bscscan.setApiKey('APWFP16UP19G7CCDQ39788NNI5UAJJIW3W')

const start = async () => {
    try {
        const balance = await account.getBnbBalance('0x2c238ad3411BdcDC0E4175f9320924ebC335E9E0')

        console.log(`Your balance is: ${balance}`)
    } catch (err) {
        console.log(err)
    }
}

start()