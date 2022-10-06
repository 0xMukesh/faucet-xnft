import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as React from "react";
import ReactXnft, { Button, Text, usePublicKey, View } from "react-xnft";
import { Image } from "react-xnft";

ReactXnft.events.on("connect", () => {});

export const App = () => {
  const publicKey = usePublicKey();
  const address = publicKey.toString();
  const [transactionLink, setTransactionLink] = React.useState<string | null>(
    "abc"
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
      <Image
        src="https://res.cloudinary.com/didkcszrq/image/upload/v1665046864/logo_wprsm9.svg"
        style={{
          width: "100px",
          height: "100px",
          marginBottom: "20px",
        }}
      />
      <Text
        style={{
          fontSize: "20px",
          color: "white",
        }}
      >
        SolFaucet
      </Text>
      <Text style={{ color: "#FFFFFF99", width: "80%", textAlign: "center" }}>
        Get Solana Devnet funds right from your backpack wallet 🎒
      </Text>
      <Button
        style={{
          margin: "20px 0",
          width: "200px",
          backgroundColor: "#2AC9C9",
          borderRadius: "32px",
          color: "#000",
        }}
        disabled={transactionLink}
        onClick={() => requestAirDrop()}
      >
        Request Funds
      </Button>
      {balance && <Text>Balance: {balance} SOL</Text>}
      {transactionLink && (
        <>
          <Text style={{ marginTop: "20px" }}>
            🎉 Funds sent successfully!{" "}
          </Text>
          <Text
            style={{ color: "#FFFFFF99", textDecoration: "underline" }}
            href={transactionLink}
            target="_blank"
          >
            View transaction on Solana Explorer
          </Text>
        </>
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
