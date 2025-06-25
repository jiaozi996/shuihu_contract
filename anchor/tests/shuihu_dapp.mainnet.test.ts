import * as anchor from "@coral-xyz/anchor";
import { Program, web3, BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ShuihuDapp } from "../target/types/shuihu_dapp";
import bs58 from "bs58";
const log = console.log;
const group = console.group;
const groupEnd = console.groupEnd;

// Seed
const TOKEN_MINT = Buffer.from("TOKEN_MINT");
const SHUIHU_SEED = Buffer.from("SHUIHU");

describe("shuihu_dapp", () => {
  const provider = anchor.AnchorProvider.env();
  console.log("- provider", provider.connection.rpcEndpoint);

  anchor.setProvider(provider);

  const wallet = provider.wallet as anchor.Wallet;
  const team = new PublicKey("BFwuSfqD7Lgnr8D83MPe48oJ7jnHJbNvsM5SqQdpN457"); // 团队账户确定了的
  const program = anchor.workspace.ShuihuDapp as Program<ShuihuDapp>;
  console.log("- program id", program.programId.toBase58());
  const heroCollection = Keypair.generate();

  const [shuihuAddress, shuihuBump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(SHUIHU_SEED)],
    program.programId
  );

  const [tokenMintAddress, tokenMintBump] =
    web3.PublicKey.findProgramAddressSync(
      [TOKEN_MINT, shuihuAddress.toBuffer()],
      program.programId
    );

  group(" ----- addresses list ");
  log("shuihu", shuihuAddress.toBase58());
  log("team", team.toBase58());
  log("token_mint", tokenMintAddress.toBase58());
  log("hero_collection", heroCollection.publicKey.toBase58());
  // log("- wallet", wallet.publicKey.toBase58());
  // groupEnd();

  it("1. 初始化项目 - Initialize ShuihuDapp", async () => {
    console.log("- initelize shuihu dapp");
    console.log("- program", program.programId.toBase58());
    console.log("- program", program.methods.initialize);

    await program.methods
      .initialize(new BN(1750349640), team) // 2025 6 20 14:00
      .accounts({
        heroCollection: heroCollection.publicKey,
        payer: wallet.publicKey,
      })
      .signers([wallet.payer, heroCollection])
      .rpc();
  }, 30000);
});
