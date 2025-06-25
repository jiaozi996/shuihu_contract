// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import ShuihuDappIDL from "../target/idl/shuihu_dapp.json";
import type { ShuihuDapp } from "../target/types/shuihu_dapp";

// Re-export the generated IDL and type
export { ShuihuDapp, ShuihuDappIDL };

// The programId is imported from the program IDL.
export const SHUIHU_DAPP_PROGRAM_ID = new PublicKey(ShuihuDappIDL.address);

// This is a helper function to get the ShuihuDapp Anchor program.
export function getShuihuDappProgram(
  provider: AnchorProvider,
  address?: PublicKey
) {
  return new Program(
    {
      ...ShuihuDappIDL,
      address: address ? address.toBase58() : ShuihuDappIDL.address,
    } as ShuihuDapp,
    provider
  );
}

// This is a helper function to get the program ID for the ShuihuDapp program depending on the cluster.
export function getShuihuDappProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
      // This is the program ID for the ShuihuDapp program on devnet and testnet.
      return new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
    case "mainnet-beta":
    default:
      return SHUIHU_DAPP_PROGRAM_ID;
  }
}
