// @flow

import type {AbcMetadata, AbcCurrencyWallet, AbcSpendInfo, AbcTransaction, AbcParsedUri, AbcReceiveAddress} from 'airbitz-core-types'

const ENABLED_TOKENS_FILENAME = 'EnabledTokens.json'

export const renameWalletRequest = (wallet: AbcCurrencyWallet, name: string) =>
  wallet.renameWallet(name)
  .then(() => wallet)

export const getTransactions = (wallet: AbcCurrencyWallet, currencyCode: string): Promise<Array<AbcTransaction>> =>
  wallet.getTransactions ? wallet.getTransactions({currencyCode}) : Promise.resolve([])

const dummyAbcTransaction: AbcTransaction = {
  txid: '',
  date: 0,
  currencyCode: '',
  blockHeight: 0,
  nativeAmount: '0',
  networkFee: '0',
  ourReceiveAddresses: [],
  signedTx: '',
  metadata: {},
  otherParams: {}
}

const dummyAbcReceiveAddress: AbcReceiveAddress = {
  publicAddress: '',
  metadata: {},
  nativeAmount: ''
}

export const setTransactionDetailsRequest = (wallet: AbcCurrencyWallet, txid: string, currencyCode: string, abcMetadata: AbcMetadata): Promise<void> =>
   wallet.saveTxMetadata ? wallet.saveTxMetadata(txid, currencyCode, abcMetadata): Promise.resolve()

export const getReceiveAddress = (wallet: AbcCurrencyWallet, currencyCode: string): Promise<AbcReceiveAddress> =>
  wallet.getReceiveAddress ? wallet.getReceiveAddress(currencyCode) : Promise.resolve(dummyAbcReceiveAddress)

export const makeSpend = (wallet: AbcCurrencyWallet, spendInfo: AbcSpendInfo): Promise<AbcTransaction> =>
  wallet.makeSpend ? wallet.makeSpend(spendInfo) : Promise.resolve(dummyAbcTransaction)

export const getMaxSpendable = (wallet: AbcCurrencyWallet, spendInfo: AbcSpendInfo): Promise<string> =>
  wallet.getMaxSpendable ? wallet.getMaxSpendable(spendInfo) : Promise.resolve('0')

export const getBalance = (wallet: AbcCurrencyWallet, currencyCode: string): string =>
  wallet.getBalance ? wallet.getBalance({currencyCode}) : '0'

export const disableTokens = (wallet: AbcCurrencyWallet, tokens: Array<string>) =>
  wallet.disableTokens(tokens)

export const enableTokens = (wallet: AbcCurrencyWallet, tokens: Array<string>) =>
  wallet.enableTokens(tokens)

export const addCoreCustomToken = (wallet: AbcCurrencyWallet, tokenObj: any) =>
  wallet.addCustomToken(tokenObj)
  .then(() => wallet.enableTokens([tokenObj.currencyCode]))
  .catch((e) => console.log(e))

export const getEnabledTokensFromFile = (wallet: AbcCurrencyWallet): Promise<Array<any>> =>
  getEnabledTokensFile(wallet).getText()
  .then(JSON.parse)
  .catch((e) => {
    console.log(e)
    return setEnabledTokens(wallet, [])
  })

export const getEnabledTokensFile = (wallet: AbcCurrencyWallet) => {
  const folder = wallet.folder
  const file = folder.file(ENABLED_TOKENS_FILENAME)
  return file
}

export async function setEnabledTokens (wallet: AbcCurrencyWallet, tokens: Array<string>, tokensToDisable?: Array<string>) {  // initialize array for eventual setting of file
  let finalTextArray = tokens
  // now stringify the new tokens
  let stringifiedTokens = JSON.stringify(finalTextArray)
  // grab the enabledTokensFile
  const tokensFile = getEnabledTokensFile(wallet)
  try {
    await tokensFile.setText(stringifiedTokens)
    enableTokens(wallet, tokens)
    if (tokensToDisable && tokensToDisable.length > 0) {
      disableTokens(wallet, tokensToDisable)
    }
    return tokens
  } catch (e) {
    console.log(e)
    return
  }
}

export const parseURI = (wallet: AbcCurrencyWallet, uri: string): AbcParsedUri => wallet.parseUri(uri)

export const signTransaction = (wallet: AbcCurrencyWallet, unsignedTransaction: AbcTransaction): Promise<AbcTransaction> => wallet.signTx(unsignedTransaction)

export const broadcastTransaction = (wallet: AbcCurrencyWallet, signedTransaction: AbcTransaction): Promise<AbcTransaction> => wallet.broadcastTx(signedTransaction)

export const saveTransaction = (wallet: AbcCurrencyWallet, signedTransaction: AbcTransaction): Promise<void> => wallet.saveTx(signedTransaction)

// Documented but not implemented in the core
// Do not use for Glidera transactions
// export const signBroadcastAndSaveTransaction = (wallet:any, unsignedTransaction:any) => {
//   return wallet.signBroadcastAndSaveTransactionTx(unsignedTransaction)
// }
