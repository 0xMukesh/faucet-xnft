import * as React from 'react';
import ReactXnft, { Button, Text, View, usePublicKey } from 'react-xnft';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

ReactXnft.events.on('connect', () => {
  // no-op
});

export const App = () => {
  const publicKey = usePublicKey();
  const address = publicKey.toString();
  const [transactionLink, setTransactionLink] = React.useState<string | null>(
    ''
  );
  const [balance, setBalance] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  // @ts-ignore
  const rpcUrl = window.xnft.solana.connection._rpcEndpoint;
  const connection = new Connection(rpcUrl);
  const wallet = new PublicKey(address);

  React.useEffect(() => {
    if (publicKey) {
      (async () => {
        const balance = await connection.getBalance(wallet);
        setBalance(balance / LAMPORTS_PER_SOL);
      })();
    }
  }, [publicKey]);

  const requestAirDrop = async () => {
    try {
      const signature = await connection.requestAirdrop(
        wallet,
        Number(LAMPORTS_PER_SOL)
      );

      console.log('signature: ', signature);
      setTransactionLink(
        `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    } catch (e) {
      setError(e.message);
      console.log(e);
    }
  };

  return (
    <View>
      <Button onClick={() => requestAirDrop()}>request airdrop</Button>
    </View>
  );
};
