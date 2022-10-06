import { useState } from 'react';
import ReactXnft, { Button, Text, View, usePublicKey } from 'react-xnft';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

ReactXnft.events.on('connect', () => {
  // no-op
});

export const App = () => {
  const publicKey = usePublicKey();
  const address = publicKey.toString();
  const [fundsSent, setFundsSent] = useState(false);

  const requestAirDrop = async () => {
    // @ts-ignore
    const rpcUrl = window.xnft.solana.connection._rpcEndpoint;
    console.log('rpcUrl', rpcUrl);
    const connection = new Connection(rpcUrl);
    const wallet = new PublicKey(address);
    const signature = await connection.requestAirdrop(
      wallet,
      Number(LAMPORTS_PER_SOL)
    );

    console.log('signature: ', signature);
  };

  return (
    <View>
      <Button onClick={() => requestAirDrop()}>request airdrop</Button>
    </View>
  );
};
