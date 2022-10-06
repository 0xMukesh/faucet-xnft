import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as React from "react";
import ReactXnft, { Button, Text, usePublicKey, View } from "react-xnft";

ReactXnft.events.on("connect", () => {
  // no-op
});

export const App = () => {
  const publicKey = usePublicKey();
  const address = publicKey.toString();
  const [transactionLink, setTransactionLink] = React.useState<string | null>(
    null
  );
  const [balance, setBalance] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  // @ts-ignore
  const rpcUrl = window.xnft.solana.connection._rpcEndpoint;
  const connection = new Connection(rpcUrl);
  const wallet = new PublicKey(address);
  console.log(connection);

  React.useEffect(() => {
    if (publicKey) {
      const getBalance = async () => {
        const balance = await connection.getBalance(wallet);
        setBalance(balance / LAMPORTS_PER_SOL);
      };
      getBalance();
    }
  }, [publicKey]);

  const requestAirDrop = async () => {
    try {
      const signature = await connection.requestAirdrop(
        wallet,
        Number(LAMPORTS_PER_SOL)
      );

      setTransactionLink(
        `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <View
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        style={{
          marginBottom: 20,
        }}
        disabled={transactionLink}
        onClick={() => requestAirDrop()}
      >
        Request airdrop
      </Button>
      {balance && <Text>Balance: {balance} SOL</Text>}
      {transactionLink && (
        <Text>
          🎉 Funds sent successfully!{" "}
          <Text as="a" href={transactionLink} target="_blank">
            View transaction on Solana Explorer
          </Text>
        </Text>
      )}
      {error && (
        <Text
          style={{
            color: "red",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
