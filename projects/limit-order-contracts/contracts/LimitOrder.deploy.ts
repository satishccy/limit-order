import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';
import { LimitOrderFactory } from './clients/LimitOrderClient';
import 'dotenv/config';

if (!process.env.MNEMONIC) {
  throw new Error('No MNEMONIC in .env');
}
const account = algosdk.mnemonicToSecretKey(process.env.MNEMONIC);

(async () => {
  const factory = new LimitOrderFactory({
    defaultSender: account.addr,
    algorand: algokit.AlgorandClient.testNet(),
    defaultSigner: algosdk.makeBasicAccountTransactionSigner(account),
  });
  const res = await factory.send.create.createApplication({ args: [] });
  console.log(res.result.appId);
})();
