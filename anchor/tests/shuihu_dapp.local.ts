// import * as anchor from "@coral-xyz/anchor";
// import { Program, web3, BN } from "@coral-xyz/anchor";
// import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { ShuihuDapp } from "../target/types/shuihu_dapp";
// import chalk from "chalk";
// // import testSecretKey from "../test_keypair.json";
// import { OraoVrfTestHelper } from "./orao_vrf_utils.local";
// import { assert } from "chai";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { hero_list } from "./heroData";
// import {
//   getAssociatedTokenAddressSync,
//   TOKEN_2022_PROGRAM_ID,
// } from "@solana/spl-token";
// import {
//   fetchAssetsByOwner,
//   fetchAsset,
//   fetchCollection,
//   fetchAllAssets,
//   fetchAssetV1,
//   mplCore,
// } from "@metaplex-foundation/mpl-core";
// import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// // import { user } from "@nextui-org/theme";

// const log = console.log;
// const group = console.group;
// const groupEnd = console.groupEnd;

// // Seed
// const TOKEN_MINT = Buffer.from("TOKEN_MINT");
// const SHUIHU_SEED = Buffer.from("SHUIHU");
// const MINT_STATE_SEED = Buffer.from("SHUIHU_HERO_MINT_STATE");
// const USER_COLLECTION_SEED = Buffer.from("USER_COLLECTION");
// const ROUND_CLAIM_SEED = Buffer.from("ROUND_CLAIM");
// const START_MINT_PRICE = 10_000_000;
// const START_ROUND = 1;

// // const HERO_COL_NAME = "Shuihu Hero Collection"; // 英雄集合名称

// describe("shuihu_dapp", () => {
//   const provider = anchor.AnchorProvider.env();
//   let vrfTestHelper: OraoVrfTestHelper;
//   anchor.setProvider(provider);

//   const umi = createUmi(provider.connection.rpcEndpoint, "processed").use(
//     mplCore()
//   );
//   // const umi = createUmi(provider.connection.rpcEndpoint);
//   // const umi = createUmi(provider.connection.rpcEndpoint).use(dasApi());

//   const wallet = provider.wallet as anchor.Wallet;
//   const team = new PublicKey("tesSimU5mgfeXXDYUXCWcL3q6BGVxMEpArYRn5VbTdN");
//   const program = anchor.workspace.ShuihuDapp as Program<ShuihuDapp>;
//   const heroCollection = Keypair.generate();
//   const testUser = Keypair.generate();
//   const testUser2 = Keypair.generate();
//   const wrongMintUser = Keypair.generate();
//   const wrongCollectUser = Keypair.generate();
//   const wrongCombineUser = Keypair.generate();
//   const claimer1 = Keypair.generate();
//   const claimer2 = Keypair.generate();

//   const frontUser = Keypair.fromSecretKey(
//     bs58.decode(
//       "4VCdUyqXTViGFum76b5C4vwfhni6ZhFXiBSgyEnaiCgoZdj4hveMcQmGfRmQK1MrrsfWhetq2VFNcnHgJeSqgBK4"
//     )
//   );

//   console.log("- front user", frontUser.publicKey.toBase58());

//   const otherUserForClaim = Keypair.generate();

//   const [shuihuAddress, shuihuBump] = web3.PublicKey.findProgramAddressSync(
//     [Buffer.from(SHUIHU_SEED)],
//     program.programId
//   );

//   const [tokenMintAddress, tokenMintBump] =
//     web3.PublicKey.findProgramAddressSync(
//       [TOKEN_MINT, shuihuAddress.toBuffer()],
//       program.programId
//     );

//   const testUserTokenAccount = getAssociatedTokenAddressSync(
//     tokenMintAddress,
//     testUser.publicKey,
//     false,
//     TOKEN_2022_PROGRAM_ID
//   );

//   let claimEventCalled = false;
//   let claimEventData = null;
//   let claimEventListener: any = null;
//   let mintEventCalled = false;
//   let mintEventData = null;
//   let mintEventListener: any = null;

//   group(" ----- addresses list ");
//   log("shuihu", shuihuAddress.toBase58());
//   log("team", team.toBase58());
//   log("token_mint", tokenMintAddress.toBase58());
//   log("hero_collection", heroCollection.publicKey.toBase58());
//   log("testUser", testUser.publicKey.toBase58());
//   log("testUserTokenAccount", testUserTokenAccount.toBase58());
//   log("- wallet", wallet.publicKey.toBase58());
//   groupEnd();

//   beforeAll(async () => {
//     vrfTestHelper = await OraoVrfTestHelper.create(provider);
//     console.log(
//       "treasuryAccount",
//       vrfTestHelper.treasuryAccount.publicKey.toBase58()
//     );
//     await airdropToAcc(testUser.publicKey, 1000);
//     await airdropToAcc(wrongMintUser.publicKey, 20);
//     await airdropToAcc(wrongCollectUser.publicKey, 20);
//     await airdropToAcc(wrongCombineUser.publicKey, 20);
//     await airdropToAcc(claimer1.publicKey, 1000);
//     await airdropToAcc(claimer2.publicKey, 1000);
//     await airdropToAcc(frontUser.publicKey, 100);

//     claimEventListener = program.addEventListener(
//       "claimEvent",
//       (event, slot, signature) => {
//         claimEventCalled = true;
//         claimEventData = event;
//         log("- claim Event listener", event);
//         log("- claim Event slot", event);
//         log("- claim Event sig", signature);
//       }
//     );
//     mintEventListener = program.addEventListener(
//       "mintEvent",
//       (event, slot, signature) => {
//         mintEventCalled = true;
//         mintEventData = event;
//         // console.log("- event", event);
//       }
//     );
//   });

//   afterAll(() => {
//     program.removeEventListener(claimEventListener);
//   });

//   const airdropToAcc = async (acc: PublicKey, amount: number = 1) => {
//     await provider.connection.requestAirdrop(acc, amount * LAMPORTS_PER_SOL);
//   };

//   const vrfFullFilled = async (force: PublicKey) => {
//     await vrfTestHelper.mockFulfillment(force.toBuffer());
//     await vrfTestHelper.waitFulfilled(force.toBuffer());
//   };

//   const mintAndRevealHero = async (user: Keypair) => {
//     let hero = Keypair.generate();
//     // mint hero
//     await program.methods
//       .mint(hero.publicKey)
//       .accounts({
//         minter: user.publicKey,
//         treasury: vrfTestHelper.treasuryAccount.publicKey,
//       })
//       .signers([user])
//       .rpc();

//     // vrf full filled
//     await vrfFullFilled(hero.publicKey);

//     // reveal hero
//     await program.methods
//       .reveal()
//       .accounts({
//         minter: user.publicKey,
//         hero: hero.publicKey,
//         treasury: vrfTestHelper.treasuryAccount.publicKey,
//       })
//       .signers([user, hero])
//       .rpc();

//     return hero;
//   };

//   const mintHeroIndexed = async (user: Keypair, index: number) => {
//     let hero = Keypair.generate();

//     await program.methods
//       .revealIndex(index)
//       .accounts({
//         minter: user.publicKey,
//         hero: hero.publicKey,
//       })
//       .signers([user, hero])
//       .rpc();

//     return hero;
//   };

//   const collectHero = async (user: Keypair, hero: PublicKey) => {
//     await program.methods
//       .collect()
//       .accounts({
//         hero: hero,
//         minter: user.publicKey,
//       })
//       .signers([user])
//       .rpc();
//   };

//   const collectAllHeroForAUser = async (
//     col_user: Keypair,
//     nickname: string
//   ) => {
//     log(
//       chalk.green(
//         `🔨 开始为用户 ${nickname} : ${col_user.publicKey.toBase58()} 收集英雄`
//       )
//     );

//     // 1.1 计算收藏册pda地址
//     const [userColAddr] = PublicKey.findProgramAddressSync(
//       [USER_COLLECTION_SEED, col_user.publicKey.toBuffer()],
//       program.programId
//     );

//     // 1.2 获取收藏册信息
//     let userColl = await program.account.userCollection
//       .fetch(userColAddr)
//       .catch(() => null);

//     // 1.3 计算需要收集的英雄索引
//     let neededHeroesToCollection = [];
//     if (!userColl) {
//       neededHeroesToCollection = Array.from(
//         { length: 108 },
//         (_, index) => index
//       );
//     } else {
//       neededHeroesToCollection = userColl.collection
//         .map((value, index) => ({ value, index }))
//         .filter((item) => item.value === 0)
//         .map((item) => item.index);
//     }

//     // 2. 铸造英雄
//     const mintPromises = neededHeroesToCollection.map(async (index) => {
//       const hero = await mintHeroIndexed(col_user, index);
//       return { index, hero };
//     });

//     const mintedHeroes = await Promise.all(mintPromises);
//     // 3. 收藏英雄
//     const collectPromises = mintedHeroes.map(async ({ index, hero }) => {
//       await collectHero(col_user, hero.publicKey);
//       return index;
//     });

//     await Promise.all(collectPromises);
//     // 3.1 验证英雄铸造状态

//     // 4. 验证英雄是否成功收藏
//     const updatedUserCol = await program.account.userCollection.fetch(
//       userColAddr
//     );

//     assert.equal(
//       updatedUserCol.collection.length,
//       108,
//       "✅ 用户未成功收集所有英雄"
//     );

//     log(chalk.bgGreen(`🌟 ${nickname} 已收集齐所有英雄`));
//   };

//   it("1. 初始化项目 - Initialize ShuihuDapp", async () => {
//     await program.methods
//       .initialize(new BN(1735660800), team) // 2025 1.1
//       // .initialize(new BN(1748764800), team)
//       .accounts({
//         heroCollection: heroCollection.publicKey,
//         payer: wallet.publicKey,
//       })
//       .signers([wallet.payer, heroCollection])
//       .rpc();

//     // 1. 获取水浒账户信息
//     const shuihu_account = await program.account.shuiHu.fetch(shuihuAddress);
//     console.log("- shuihu account ", shuihu_account);
//     assert.equal(shuihu_account.round, START_ROUND);
//     assert.equal(shuihu_account.mintPrice.toNumber(), START_MINT_PRICE);

//     // 2. 获取token mint 信息
//     const token_mint_account = await provider.connection.getTokenSupply(
//       tokenMintAddress
//     );
//     assert.ok(token_mint_account.value.uiAmount == 0);

//     // 3. 获取英雄合集信息
//     try {
//       const collection = await fetchCollection(
//         umi,
//         heroCollection.publicKey.toBase58(),
//         {
//           commitment: "confirmed",
//         }
//       );

//       assert.equal(
//         collection.name,
//         "SHUI HU HERO COLLECTION",
//         "合集名称不正确"
//       );
//       assert.equal(collection.numMinted, 0, "合集mint数量不正确");
//       assert.equal(
//         collection.publicKey,
//         heroCollection.publicKey.toBase58(),
//         "合集地址不正确"
//       );
//       assert.equal(collection.currentSize, 0, "合集当前数量数量不正确");
//       assert.equal(
//         collection.updateAuthority,
//         shuihuAddress.toBase58(),
//         "合集更新权限不是合约pda"
//       );
//     } catch (error) {
//       assert.fail("获取英雄合集信息时出错", error);
//     }
//   });

//   // it(
//   //   "2. 给前端用收集齐英雄",
//   //   async () => {
//   //     await collectAllHeroForAUser(frontUser, "front");
//   //   },
//   //   30 * 1000
//   // );

//   it("2. 铸造卡片 - Mint A Card Test Unit", async () => {
//     const hero = Keypair.generate();
//     log("英雄公钥:", hero.publicKey.toString());
//     // 1. 获取铸造前状态 Get shuihu account info before mint
//     const shuihuBefore = await program.account.shuiHu.fetch(shuihuAddress);
//     const userBalanceBefore = await provider.connection.getBalance(
//       testUser.publicKey
//     );
//     // 2. 铸造卡片 mint card
//     const mintTx = await program.methods
//       .mint(hero.publicKey)
//       .accounts({
//         minter: testUser.publicKey,
//         treasury: vrfTestHelper.treasuryAccount.publicKey,
//       })
//       .signers([testUser])
//       .rpc({
//         skipPreflight: true,
//       });

//     log("铸造交易:", mintTx);

//     // 3. 验证铸造后状态 get shuihu account info after mint
//     const shuihuAfter = await program.account.shuiHu.fetch(shuihuAddress);

//     // 3.1 验证奖池增加 verify the bonus increase correctly
//     assert.equal(
//       shuihuAfter.bonus.toNumber(),
//       shuihuBefore.bonus.toNumber() + START_MINT_PRICE,
//       "奖池金额未正确增加"
//     );

//     // 3.2 验证铸造状态 verify the mint state pda account
//     const [heroMintStateAddress] = PublicKey.findProgramAddressSync(
//       [MINT_STATE_SEED, hero.publicKey.toBuffer()],
//       program.programId
//     );
//     const heroMintState = await program.account.heroMintState.fetch(
//       heroMintStateAddress
//     );
//     assert.equal(
//       heroMintState.minter.toString(),
//       testUser.publicKey.toString(),
//       "铸造者不匹配"
//     );
//     assert.equal(
//       heroMintState.hero.toString(),
//       hero.publicKey.toString(),
//       "英雄公钥不匹配"
//     );
//     assert.equal(heroMintState.minted, false, "铸造状态错误");

//     log(`✅ 铸造状态验证通过`);

//     // 3.3 验证用户状态 - verify the user balance change
//     const userBalanceAfter = await provider.connection.getBalance(
//       testUser.publicKey
//     );
//     console.log("铸造后用户余额:", userBalanceAfter / LAMPORTS_PER_SOL, "SOL");
//     const userBalanceChange = userBalanceBefore - userBalanceAfter;
//     assert.equal(
//       userBalanceChange > START_MINT_PRICE,
//       true,
//       "用户余额未正确减少"
//     );

//     log(
//       `✅ 用户余额状态验证通过, 余额变化 ${
//         userBalanceChange / LAMPORTS_PER_SOL
//       } SOL`
//     );

//     // 3.4 验证用户获得水浒元宝 verify the user token balance
//     try {
//       const tokenBalance = await provider.connection.getTokenAccountBalance(
//         testUserTokenAccount
//       );
//       log("用户元宝余额:", tokenBalance.value.uiAmount);
//       assert.equal(
//         tokenBalance.value.uiAmount,
//         START_MINT_PRICE / LAMPORTS_PER_SOL,
//         "用户未获得正确数量的水浒元宝"
//       );

//       log(`✅ 用户元宝验证通过， 元宝余额: ${tokenBalance.value.uiAmount}`);
//     } catch (e) {
//       console.error("获取代币余额失败:", e);
//       assert.fail("获取代币余额失败");
//     }

//     // 4. 验证事件触发 - verify the mint event
//     assert.ok(mintEventCalled, "MintEvent 事件没有被触发");
//     assert.ok(mintEventData!.round === START_ROUND, "事件中的 round 不正确");
//     assert.ok(
//       mintEventData!.bonus.eq(new BN(START_MINT_PRICE)),
//       "事件中的 bonus 不正确"
//     );
//     assert.ok(
//       mintEventData!.minter.equals(testUser.publicKey),
//       "事件中的 minter 不正确"
//     );

//     log(`✅ Mint 事件接收验证通过`);

//     // 5. 测试边界情况：使用零地址铸造 - test the zero seed minting
//     try {
//       await program.methods
//         .mint(PublicKey.default)
//         .accounts({
//           minter: testUser.publicKey,
//           treasury: vrfTestHelper.treasuryAccount.publicKey,
//         })
//         .signers([testUser])
//         .rpc();
//       assert.fail("使用零地址铸造应该失败");
//     } catch (error: any) {
//       log(`✅ Mint seed零地址铸造,验证通过`);
//       assert.include(
//         error.message,
//         "VrfSeedIllegal",
//         "应该返回VrfSeedIllegal错误"
//       );
//     }

//     // 6. 测试边界情况， 0 Sol mint
//     try {
//       let newHero = Keypair.generate();
//       await program.methods
//         .mint(newHero.publicKey)
//         .accounts({
//           minter: testUser2.publicKey,
//           treasury: vrfTestHelper.treasuryAccount.publicKey,
//         })
//         .signers([testUser2])
//         .rpc();

//       assert.fail("零 SOL 用户铸造应该失败");
//     } catch (error: any) {
//       log(`✅ 0 SOL MINT,验证通过`);
//       assert.ok(
//         error.logs.some((log: string) => log.includes("insufficient lamports")),
//         "应该包含余额不足，insufficient lamports"
//       );
//     }

//     // 7. 测试已使用过的 vrf seed 铸造 - test use minted vrf seed minting
//     try {
//       await program.methods
//         .mint(hero.publicKey)
//         .accounts({
//           minter: testUser.publicKey,
//           treasury: vrfTestHelper.treasuryAccount.publicKey,
//         })
//         .signers([testUser])
//         .rpc();

//       assert.fail("已使用过的 vrf Seed 再次铸造应该失败");
//     } catch (error: any) {
//       log(`✅ 已使用过得 vrf seed 重复铸造,验证通过`);
//       assert.ok(
//         error.logs.some((log: string) => log.includes("already in use")),
//         "应该显示，already in use"
//       );
//     }
//   });

//   it(
//     "3. 揭示英雄 - Reveal A Hero Test Unit",
//     async () => {
//       // 1. 铸造 + 揭示一个英雄 mint and reveal a hero
//       // 1.1 创建卡片
//       const hero = Keypair.generate();

//       // 1.2 铸造卡片 mint a card first
//       await program.methods
//         .mint(hero.publicKey)
//         .accounts({
//           minter: testUser.publicKey,
//           treasury: vrfTestHelper.treasuryAccount.publicKey,
//         })
//         .signers([testUser])
//         .rpc();

//       // 2. 获取铸造状态账户地址 - get the mint state account address
//       const [heroMintStateAddress] = PublicKey.findProgramAddressSync(
//         [MINT_STATE_SEED, hero.publicKey.toBuffer()],
//         program.programId
//       );

//       // 2.1. 获取铸造状态 - get the mint state account pda info
//       let heroMintState = await program.account.heroMintState.fetch(
//         heroMintStateAddress
//       );

//       // 2.2 铸造状态验证 - verify the mint state pda account
//       assert.equal(
//         heroMintState.minter.toString(),
//         testUser.publicKey.toString(),
//         "铸造者不匹配"
//       );
//       assert.equal(
//         heroMintState.hero.toString(),
//         hero.publicKey.toString(),
//         "英雄公钥不匹配"
//       );
//       assert.equal(heroMintState.minted, false, "铸造状态错误");

//       // 3. 等待VRF随机数生成
//       await vrfFullFilled(hero.publicKey);

//       // 4. 揭示英雄 - reveal hero
//       try {
//         const revealTx = await program.methods
//           .reveal()
//           .accounts({
//             minter: testUser.publicKey,
//             hero: hero.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([testUser, hero])
//           .rpc();

//         log("揭示交易:", revealTx);
//         const latestBlockHash = await provider.connection.getLatestBlockhash();
//         await provider.connection.confirmTransaction(
//           {
//             signature: revealTx,
//             ...latestBlockHash,
//           },
//           "confirmed"
//         );

//         assert.ok(true, "✅ 揭示交易完成");
//       } catch (error: any) {
//         console.error("❌ 揭示失败:", error);
//         assert.fail("英雄揭示应该成功");
//       }

//       // 5. 验证揭示后的铸造状态 - verify the mint state pda account
//       heroMintState = await program.account.heroMintState.fetch(
//         heroMintStateAddress
//       );
//       assert.equal(heroMintState.minted, true, "揭示后铸造状态应为true");
//       assert.equal(
//         heroMintState.minter.toString(),
//         testUser.publicKey.toString(),
//         "铸造者与揭晓者一不一致"
//       );
//       assert.notDeepEqual(
//         heroMintState.randomness,
//         new Array(64).fill(0),
//         "随机数应该已设置"
//       );
//       assert.isAtLeast(heroMintState.result, 0, "英雄索引应该大于等于0");
//       assert.isBelow(heroMintState.result, 108, "英雄索引应该小于108");

//       // 5.1 随机数计算索引验证 - cal the hero index from the randomness has
//       let cal_hero_index = calHeroIndex(heroMintState.randomness);
//       assert.equal(
//         heroMintState.result,
//         cal_hero_index,
//         "计算的英雄索引与铸造状态中英雄索引不符"
//       );

//       // 6. 英雄NFT账户验证 - verify the hero nft account
//       const heroAccountInfo = await provider.connection.getAccountInfo(
//         hero.publicKey
//       );
//       assert.isNotNull(heroAccountInfo, "英雄NFT账户应该存在");

//       // 6.1 NFT 信息验证 - verify the hero nft info
//       try {
//         const hero_assets = await fetchAsset(umi, hero.publicKey.toBase58(), {
//           skipDerivePlugins: false,
//         });
//         assert.equal(hero_assets.publicKey, hero.publicKey.toBase58());
//         assert.equal(
//           hero_assets.updateAuthority.address,
//           heroCollection.publicKey.toBase58(),
//           "英雄 update 权限 应该属于合集"
//         );
//         assert.equal(
//           hero_assets.name,
//           `SHUI HU HERO #${heroMintState.result + 1}`,
//           `英雄名称 应该是: SHUI HU HERO #${heroMintState.result}`
//         );

//         let asset_star = hero_assets.attributes?.attributeList.find(
//           (attr) => attr.key === "Star"
//         )?.value;
//         assert.isNotNull(asset_star, "英雄 star 属性不为空");

//         let asset_index = hero_assets.attributes?.attributeList.find(
//           (attr) => attr.key === "Index"
//         )?.value;
//         assert.isNotNull(asset_index, "英雄 index 属性不为空");
//         assert.equal(
//           Number(asset_index),
//           heroMintState.result,
//           "英雄Index属性，应该等于铸造状态中的结果"
//         );

//         let find_star = hero_list.find((hero, index) => {
//           return index === heroMintState.result;
//         })?.star;

//         assert.equal(
//           find_star,
//           Number(asset_star),
//           "查找的星数 应该等于属性星数"
//         );

//         log(`✅ 英雄NFT信息验证通过`);
//       } catch (e) {
//         assert.fail("获取英雄NFT信息时出错", e);
//       }

//       // 7. 测试重复揭示应该失败 - test the repeat reveal should fail
//       try {
//         await program.methods
//           .reveal()
//           .accounts({
//             minter: testUser.publicKey,
//             hero: hero.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([testUser, hero])
//           .rpc();
//         assert.fail("重复揭示应该失败");
//       } catch (error: any) {
//         assert.include(
//           error.message,
//           "AlreadyMinted",
//           "应该返回AlreadyMinted错误"
//         );
//       }

//       // 8. 测试错误的铸造者揭示应该失败 - test the wrong minter reveal should fail
//       try {
//         const wrongMintUserTestHero = Keypair.generate();

//         // 8.1 testUser 先铸造一个卡片
//         await program.methods
//           .mint(wrongMintUserTestHero.publicKey)
//           .accounts({
//             minter: testUser.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([testUser])
//           .rpc();

//         await program.methods
//           .reveal()
//           .accounts({
//             minter: wrongMintUser.publicKey,
//             hero: wrongMintUserTestHero.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([wrongMintUser, wrongMintUserTestHero])
//           .rpc();

//         assert.fail("错误的铸造者揭示应该失败");
//       } catch (error: any) {
//         // log("✅ 8.1 错误的揭示者，预期的错误:", error.message);
//         assert.include(
//           error.message,
//           "Invalid Minter",
//           "应该返回 Invalid Minter 错误"
//         );
//       }
//     },
//     1000 * 20
//   );

//   it(
//     "4. 英雄收集 - Collect Hero Test Unit ",
//     async () => {
//       // 1. 先铸造并揭示一个英雄 mint and reveal a hero
//       const hero = await mintHeroIndexed(testUser, 0);

//       // 1.1. 计算用户英雄集合地址 - cal the user collection address
//       const [userCollectionAddress] = PublicKey.findProgramAddressSync(
//         [USER_COLLECTION_SEED, testUser.publicKey.toBuffer()],
//         program.programId
//       );
//       log("📚 test user 英雄集合地址:", userCollectionAddress.toString());

//       // 2. 收集英雄 - collect hero
//       try {
//         const collectTx = await program.methods
//           .collect()
//           .accounts({
//             minter: testUser.publicKey,
//             hero: hero.publicKey,
//           })
//           .signers([testUser])
//           .rpc();
//         console.log("✅ 收集交易完成:", collectTx);
//       } catch (error: any) {
//         console.error("❌ 收集英雄失败:", error);
//         assert.fail("英雄收集应该成功");
//       }

//       // 3. 收集验证 - verify the collect
//       // 3.1 获取testUser英雄集合信息 - get the user collection info
//       const userCollection = await program.account.userCollection.fetch(
//         userCollectionAddress
//       );

//       // 3.2 地址验证 - verify the user collection address
//       assert.equal(
//         userCollection.minter.toString(),
//         testUser.publicKey.toString(),
//         "用户地址不匹配"
//       );

//       // 3.3 验证是否收集成功 - verify the collect
//       assert.equal(userCollection.collection[0], 1, "英雄未被成功收集");

//       // 3.4 验证集合数组 - verify the collection array
//       let collectedCount = 0;
//       for (let i = 0; i < userCollection.collection.length; i++) {
//         if (userCollection.collection[i] === 1) {
//           collectedCount++;
//           console.log(`🌟 已收集英雄索引: ${i}`);
//         }
//       }
//       assert.equal(collectedCount, 1, "应该只收集了一个英雄");

//       // // 4. 验证英雄NFT是否已销毁 - verify the hero nft is destroyed
//       // // 4.1 验证 NFT 是否已销毁 （MPL - 合集）
//       // try {
//       //   const collection = await fetchCollection(
//       //     umi,
//       //     heroCollection.publicKey.toBase58(),
//       //     {
//       //       commitment: "confirmed",
//       //     }
//       //   );
//       //   assert.equal(
//       //     collection.numMinted - collection.currentSize,
//       //     1,
//       //     "合集数据中，显示的NFT已销毁数量应该为1"
//       //   );
//       // } catch (e) {
//       //   assert.fail("获取MPL合集信息信息时出错", e);
//       // }

//       // 4.2 验证 NFT 是否已销毁 （MPL - 单NFT） - verify the hero nft is destroyed
//       try {
//         const hero_assets = await fetchAsset(umi, hero.publicKey.toBase58(), {
//           skipDerivePlugins: false,
//         });
//         assert.fail("英雄应该已被销毁");
//       } catch (e: any) {
//         assert.include(
//           e.message,
//           "is not of the expected type",
//           "不是期望的账户类型了"
//         );
//       }

//       // 5. 测试重复收集同一个英雄应该失败 - test the repeat collect the same hero should fail
//       // 5.1 在铸造一个0号英雄 - mint a new hero
//       const repeat_col_hero = await mintHeroIndexed(testUser, 0);
//       try {
//         // 5.2 重复收集
//         await program.methods
//           .collect()
//           .accounts({
//             minter: testUser.publicKey,
//             hero: repeat_col_hero.publicKey,
//           })
//           .signers([testUser])
//           .rpc();
//         assert.fail("重复收集同一个英雄应该失败");
//       } catch (error: any) {
//         console.log("✅ 5. 重复收集英雄 预期的错误:", error.message);
//         assert.include(
//           error.message,
//           "HeroAlreadyCollected",
//           "该英雄应该已被收集"
//         );
//       }

//       // 6. 测试错误的用户收集英雄 - test the wrong user collect hero
//       try {
//         // 6.1 铸造一个新英雄 - mint a new hero
//         const wrong_col_user_test_hero = await mintAndRevealHero(testUser);

//         // 6.2 测试收集 - test collect
//         await program.methods
//           .collect()
//           .accounts({
//             minter: wrongCollectUser.publicKey,
//             hero: wrong_col_user_test_hero.publicKey,
//           })
//           .signers([wrongCollectUser])
//           .rpc();
//         assert.fail("错误的用户收集英雄应该失败");
//       } catch (error: any) {
//         assert.include(
//           error.message,
//           "InvalidHeroOwner",
//           "应该返回InvalidHeroOwner错误"
//         );
//       }
//     },
//     1000 * 60
//   );

//   it(
//     "5. 合成英雄 - Combine Heroes Test Unit",
//     async () => {
//       // 1. 先铸造并揭示两个英雄 - mint and reveal two heroes
//       const hero1 = await mintAndRevealHero(testUser);
//       const hero2 = await mintAndRevealHero(testUser);

//       // 1.1. 创建新英雄的种子 - create the seed for the new hero
//       const newHero = Keypair.generate();

//       // 2. 合成英雄 - combine heroes
//       try {
//         const combineTx = await program.methods
//           .combine(newHero.publicKey)
//           .accounts({
//             minter: testUser.publicKey,
//             hero1: hero1.publicKey,
//             hero2: hero2.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([testUser])
//           .rpc();

//         console.log("✅ 合成交易完成:", combineTx);
//       } catch (error: any) {
//         assert.fail("英雄合成应该成功", error.message);
//       }

//       // 3. 验证 - verify
//       // 3.1 获取铸造状态地址，及信息 - get the mint state address and info
//       const [heroMintStateAddress] = PublicKey.findProgramAddressSync(
//         [MINT_STATE_SEED, newHero.publicKey.toBuffer()],
//         program.programId
//       );
//       let heroMintState = await program.account.heroMintState.fetch(
//         heroMintStateAddress
//       );

//       // 3.2 铸造状态判断 - verify the mint state
//       assert.equal(
//         heroMintState.minter.toString(),
//         testUser.publicKey.toString(),
//         "铸造者不匹配"
//       );
//       assert.equal(
//         heroMintState.hero.toString(),
//         newHero.publicKey.toString(),
//         "英雄公钥不匹配"
//       );
//       assert.equal(heroMintState.minted, false, "铸造状态错误");

//       // 3.3. 验证 原英雄是否已销毁 - verify the hero is destroyed
//       try {
//         await fetchAsset(umi, hero1.publicKey.toBase58(), {
//           skipDerivePlugins: false,
//         });
//         assert.fail("英雄应该已被销毁");
//       } catch (e: any) {
//         // console.log("✅ 英雄1已成功销毁", e.message);
//         assert.include(
//           e.message,
//           "is not of the expected type",
//           "不是期望的账户类型了"
//         );
//       }

//       try {
//         await fetchAsset(umi, hero1.publicKey.toBase58(), {
//           skipDerivePlugins: false,
//         });
//         // assert.isNull(hero1AccountInfo, "英雄1应该已被销毁");
//         assert.fail("英雄应该已被销毁");
//       } catch (e: any) {
//         // console.log("✅ 英雄2已成功销毁", e.message);
//         assert.include(
//           e.message,
//           "is not of the expected type",
//           "不是期望的账户类型了"
//         );
//       }

//       // 4. 等待VRF随机数生成 - wait for the VRF random number to be generated
//       await vrfFullFilled(newHero.publicKey);

//       // 5. 揭示新英雄 - reveal the new hero
//       await program.methods
//         .reveal()
//         .accounts({
//           minter: testUser.publicKey,
//           hero: newHero.publicKey,
//           treasury: vrfTestHelper.treasuryAccount.publicKey,
//         })
//         .signers([testUser, newHero])
//         .rpc();

//       // 6. 验证揭示后的铸造状态 - verify the mint state after reveal
//       heroMintState = await program.account.heroMintState.fetch(
//         heroMintStateAddress
//       );
//       assert.equal(heroMintState.minted, true, "揭示后铸造状态应为true");
//       assert.isAtLeast(heroMintState.result, 0, "英雄索引应该大于等于0");
//       assert.isBelow(heroMintState.result, 108, "英雄索引应该小于108");

//       assert.equal(
//         heroMintState.minter.toString(),
//         testUser.publicKey.toString(),
//         "铸造者不匹配"
//       );

//       // 6.1 验证揭示结果 - verify the reveal result
//       assert.notDeepEqual(
//         heroMintState.randomness,
//         new Array(64).fill(0),
//         "随机数应该已设置"
//       );

//       // 6.2 验证揭示随机数是否符合英雄索引 - verify the reveal result
//       let cal_hero_index = calHeroIndex(heroMintState.randomness);
//       assert.equal(
//         heroMintState.result,
//         cal_hero_index,
//         "计算的英雄索引与铸造状态中英雄索引不符"
//       );

//       // 7. 测试边界情况：尝试合成相同的英雄
//       const sameHero = await mintAndRevealHero(testUser);
//       const sameNewHero = Keypair.generate();
//       try {
//         await program.methods
//           .combine(sameNewHero.publicKey)
//           .accounts({
//             minter: testUser.publicKey,
//             hero1: sameHero.publicKey,
//             hero2: sameHero.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([testUser])
//           .rpc();
//         assert.fail("合成相同的英雄应该失败");
//       } catch (error: any) {
//         console.log("✅ 预期的错误:", error.message);
//         assert.include(
//           error.message,
//           "SameHeroNotAllowed",
//           "应该返回SameHeroNotAllowed错误"
//         );
//       }

//       // 7.1 测试使用已销毁的英雄合成 - test using a burned hero to combine
//       const anotherHero = await mintHeroIndexed(testUser, 4);

//       try {
//         await program.methods
//           .combine(newHero.publicKey)
//           .accounts({
//             minter: testUser.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//             hero1: hero1.publicKey, // 已销毁的英雄 - burned hero
//             hero2: anotherHero.publicKey,
//           })
//           .signers([testUser])
//           .rpc();
//         assert.fail("使用已销毁的英雄合成应该失败");
//       } catch (error: any) {
//         assert.include(
//           error.message,
//           "Failed to serialize or deserialize account data: Unknown",
//           "应该返回Failed to serialize or deserialize account data: Unknown错误"
//         );
//       }

//       // 8. 测试边界情况：使用零地址作为种子 - test using zero address as seed
//       const zeroHero1 = await mintAndRevealHero(testUser);
//       const zeroHero2 = await mintAndRevealHero(testUser);
//       try {
//         await program.methods
//           .combine(PublicKey.default)
//           .accounts({
//             minter: testUser.publicKey,
//             hero1: zeroHero1.publicKey,
//             hero2: zeroHero2.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([testUser])
//           .rpc();
//         assert.fail("使用零地址作为种子应该失败");
//       } catch (error: any) {
//         console.log("✅ 预期的错误:", error.message);
//         assert.include(
//           error.message,
//           "VrfSeedIllegal",
//           "应该返回VrfSeedIllegal错误"
//         );
//       }

//       // 9. 测试边界情况：错误的用户尝试合成 - test the wrong user try to combine
//       const wrongHero1 = await mintAndRevealHero(testUser);
//       const wrongHero2 = await mintAndRevealHero(wrongCombineUser);
//       const wrongNewHero = Keypair.generate();

//       try {
//         await program.methods
//           .combine(wrongNewHero.publicKey)
//           .accounts({
//             minter: wrongCombineUser.publicKey,
//             hero1: wrongHero1.publicKey,
//             hero2: wrongHero2.publicKey,
//             treasury: vrfTestHelper.treasuryAccount.publicKey,
//           })
//           .signers([wrongCombineUser])
//           .rpc();
//         assert.fail("错误的用户尝试合成应该失败");
//       } catch (error: any) {
//         console.log("✅ 预期的错误:", error.message);
//         assert.include(
//           error.message,
//           "InvalidHeroOwner",
//           "应该返回InvalidHeroOwner错误"
//         );
//       }
//     },
//     1000 * 60 * 2 // 2分钟超时
//   );

//   it("6. 没收集齐全领奖测试 - not completed collect then claim test", async () => {
//     // 1. 没有收集齐全领取奖励 - claim without collect all
//     log(chalk.green(`测试没有收集齐，领取奖励`));

//     // 2. 获取 testUser 收藏集地址 - get the user collection address
//     const [testUserColAddres] = PublicKey.findProgramAddressSync(
//       [USER_COLLECTION_SEED, testUser.publicKey.toBuffer()],
//       program.programId
//     );

//     // 2.1 获取收藏集信息 - get the user collection info
//     let userCollection = await program.account.userCollection
//       .fetch(testUserColAddres)
//       .catch(() => null);

//     // 2.2 如果没有收藏集，则收藏一点儿 - if no collection, collect some
//     if (!userCollection) {
//       const hero0 = await mintHeroIndexed(testUser, 0);
//       await collectHero(testUser, hero0.publicKey);
//     }

//     const currentShuihu = await program.account.shuiHu.fetch(shuihuAddress);
//     const currentRound = currentShuihu.round;

//     // 2. 计算领取地址 - calculate the claim address
//     const [roundClaimAddress] = PublicKey.findProgramAddressSync(
//       [ROUND_CLAIM_SEED, Buffer.from([currentRound])],
//       program.programId
//     );

//     // 2.1 领取奖励 - claim reward
//     try {
//       const claimTx = await program.methods
//         .claim()
//         .accounts({
//           minter: testUser.publicKey,
//           roundClaim: roundClaimAddress,
//         })
//         .signers([testUser])
//         .rpc();
//       assert.fail("未收集全部英雄的用户应该无法领取奖励");
//     } catch (error: any) {
//       console.log(`✅ 预期的错误: ${error.message}`);
//       assert.include(
//         error.message,
//         "CollectNotCompleted",
//         "应该返回CollectNotCompleted错误"
//       );
//     }
//   });

//   it(
//     "7.翻轮领奖测试 - claim bonus several round-",
//     async () => {
//       // 1.1. 计算 testUser 收藏册地址
//       const [testUserCollectionAddress] = PublicKey.findProgramAddressSync(
//         [USER_COLLECTION_SEED, testUser.publicKey.toBuffer()],
//         program.programId
//       );

//       // 1.2 计算 testUser 的代币账户地址
//       const testUserTokenAcc = getAssociatedTokenAddressSync(
//         tokenMintAddress,
//         testUser.publicKey,
//         false,
//         TOKEN_2022_PROGRAM_ID
//       );

//       // 测试 三轮领取奖励
//       for (let round = 1; round <= 4; round++) {
//         log(chalk.bgBlue(`🔢 开始第 ${round} 轮测试`));
//         log(`🔨 test User 开始铸造并收集所有英雄...`);

//         // 1. 获取当前用户收集状态 - get the user collect state
//         let userCollection = await program.account.userCollection
//           .fetch(testUserCollectionAddress)
//           .catch(() => null);

//         // 1.2 获取当前用户的token余额 - get the user token balance
//         const tokenAccountBefore =
//           await provider.connection.getTokenAccountBalance(testUserTokenAcc);
//         let tokenBalanceBefore = tokenAccountBefore.value.amount || 0;
//         console.log(`💰 铸造前用户元宝余额: ${tokenBalanceBefore}`);
//         log("- tokenAccountBefore", tokenAccountBefore);
//         // 1.3 铸造并揭示一个英雄 - mint and reveal a hero
//         console.log(`🔨 在第 ${round} 轮铸造英雄...`);
//         const hero = await mintAndRevealHero(testUser);
//         console.log(`✅ 英雄铸造并揭示完成: ${hero.publicKey.toString()}`);

//         // 1.4 铸造后
//         let tokenAccountAfter =
//           await provider.connection.getTokenAccountBalance(testUserTokenAcc);
//         let tokenBalanceAfter = tokenAccountAfter.value.amount || 0;
//         console.log(`💰 铸造后用户元宝余额: ${tokenBalanceAfter}`);

//         // 1.5 铸造后验证 - verify after mint
//         let tokenChange =
//           Number(tokenBalanceAfter) - Number(tokenBalanceBefore);

//         // 2. 收藏齐 - collect all
//         await collectAllHeroForAUser(testUser, "测试 test User");
//         // 1.1. 获取当前轮次和铸造价格 - get the current round and mint price
//         const currentShuihu = await program.account.shuiHu.fetch(shuihuAddress);
//         const currentRound = currentShuihu.round;
//         const currentMintPrice = currentShuihu.mintPrice.toNumber();
//         const currentBonus = currentShuihu.bonus.toNumber();
//         assert.equal(
//           currentMintPrice,
//           tokenChange,
//           "元宝变动不符合轮数，铸造价格"
//         );
//         // 2.1 testUser 账户sol余额
//         const testUserBalanceBeforeClaim = await provider.connection.getBalance(
//           testUser.publicKey
//         );
//         const teamBalanceBeforeClaim = await provider.connection.getBalance(
//           team
//         );

//         // 2.2. 计算轮次领取账户地址 - calculate the claim address
//         const [roundClaimAddress] = PublicKey.findProgramAddressSync(
//           [ROUND_CLAIM_SEED, Buffer.from([currentRound])],
//           program.programId
//         );

//         const expectedClaimBonus = currentBonus / 2;
//         const expectedTeamBonus = expectedClaimBonus * 0.01;
//         const expectedMinterBonus = expectedClaimBonus - expectedTeamBonus;

//         group(chalk.bgGreen(`💎 开始领取第 ${currentRound} 轮奖励...`));
//         log(
//           `🏆 当前奖池金额: ${
//             currentBonus / LAMPORTS_PER_SOL
//           } SOL -- ${currentBonus} lamports`
//         );
//         log(
//           `当前铸造价格: ${
//             currentMintPrice / LAMPORTS_PER_SOL
//           } SOL -- ${currentMintPrice} lamports`
//         );
//         log(
//           `预期发出的总奖励: ${
//             expectedClaimBonus / LAMPORTS_PER_SOL
//           } SOL -- ${expectedClaimBonus} lamports`
//         );
//         log(
//           `预期用户奖励 ${
//             expectedMinterBonus / LAMPORTS_PER_SOL
//           } SOL -- ${expectedMinterBonus} lamports`
//         );
//         log(
//           `预期团队奖励 ${
//             expectedTeamBonus / LAMPORTS_PER_SOL
//           } SOL -- ${expectedTeamBonus} lamports`
//         );
//         log(
//           `test User sol 余额：${
//             testUserBalanceBeforeClaim / LAMPORTS_PER_SOL
//           } SOL -- ${testUserBalanceBeforeClaim} lamports`
//         );

//         log(
//           `team账户余额: ${
//             teamBalanceBeforeClaim / LAMPORTS_PER_SOL
//           } SOL -- ${teamBalanceBeforeClaim} lamports`
//         );
//         groupEnd();

//         // 3. 领取奖励 - claim bonus
//         try {
//           const normal_claimTx = await program.methods
//             .claim()
//             .accounts({
//               minter: testUser.publicKey,
//               roundClaim: roundClaimAddress,
//             })
//             .signers([testUser])
//             .rpc({ skipPreflight: true });

//           log(`✅ 领取奖励交易完成: ${normal_claimTx}`);
//         } catch (error: any) {
//           console.error(`❌ 领取奖励失败: ${error}`);
//           assert.fail(`领取奖励应该成功: ${error.message}`);
//         }

//         // 4. 领取后验 - verify after claim
//         // 4.1 shuihu 账户
//         const shuihuAfter = await program.account.shuiHu.fetch(shuihuAddress);
//         const bonusAfter = shuihuAfter.bonus.toNumber();
//         const mintPriceAfter = shuihuAfter.mintPrice.toNumber();
//         console.log(
//           `🏆 奖池剩余金额: ${
//             bonusAfter / LAMPORTS_PER_SOL
//           } SOL, ${bonusAfter} Lamports`
//         );
//         assert.strictEqual(
//           expectedClaimBonus,
//           currentBonus - bonusAfter,
//           "奖池减少金额等于预期发出的总奖金"
//         );

//         // 4.2. 验证轮次增加 - verify round increase
//         assert.equal(shuihuAfter.round, currentRound + 1, "轮次应该增加");
//         // 4.3. 验证铸造费用翻倍 - verify mint price double
//         const expectedMintPrice = currentMintPrice * 2;
//         const expectedCalMintPrice =
//           START_MINT_PRICE * 2 ** (shuihuAfter.round - 1);
//         assert.equal(mintPriceAfter, expectedMintPrice, "铸造价格应该翻倍");
//         assert.equal(
//           mintPriceAfter,
//           expectedCalMintPrice,
//           "铸造价格应该为预期计算值"
//         );
//         log(chalk.bgGreen("✅ shuihu验证通过"));

//         // 4.4 验证轮次领取账户 - verify round claim account pda
//         const roundClaim = await program.account.roundClaim.fetch(
//           roundClaimAddress
//         );

//         assert.equal(
//           testUser.publicKey.toString(),
//           roundClaim.minter.toString(),
//           "领取者匹配"
//         );
//         assert.equal(currentRound, roundClaim.round, "轮次匹配");

//         assert.equal(
//           expectedMinterBonus,
//           roundClaim.claimedAmount.toNumber(),
//           "奖励金额匹配"
//         );
//         log(chalk.bgGreen("✅ 轮次领取账户验证通过"));

//         // 4.5. 验证testUser 余额 - verify testUser balance
//         const testUserBalanceAfterClaim = await provider.connection.getBalance(
//           testUser.publicKey
//         );

//         let calTestUserBalanceChange =
//           testUserBalanceAfterClaim - testUserBalanceBeforeClaim;

//         log(
//           `test user 账户变化金额 ${
//             calTestUserBalanceChange / LAMPORTS_PER_SOL
//           } SOL -- ${calTestUserBalanceChange} lamports`
//         );
//         log(
//           `预期账户变化金额 ${
//             expectedMinterBonus / LAMPORTS_PER_SOL
//           } SOL -- ${expectedMinterBonus} lamports`
//         );
//         assert.approximately(
//           calTestUserBalanceChange / LAMPORTS_PER_SOL,
//           expectedMinterBonus / LAMPORTS_PER_SOL,
//           0.01,
//           "用户余额变化应在预期奖励的0.01 SOL误差范围内"
//         );

//         // 4.6 验证team账户余额 - verify team account balance
//         const teamBalanceAfterClaim = await provider.connection.getBalance(
//           team
//         );
//         log(
//           `team账户变化金额 ${
//             teamBalanceAfterClaim - teamBalanceBeforeClaim / LAMPORTS_PER_SOL
//           } SOL -- ${teamBalanceAfterClaim - teamBalanceBeforeClaim} lamports`
//         );
//         log(
//           `预期账户变化金额 ${
//             expectedTeamBonus / LAMPORTS_PER_SOL
//           } SOL -- ${expectedTeamBonus} lamports`
//         );

//         assert.approximately(
//           (teamBalanceAfterClaim - teamBalanceBeforeClaim) / LAMPORTS_PER_SOL,
//           expectedTeamBonus / LAMPORTS_PER_SOL,
//           0.01,
//           "团队余额变化应在预期奖励的0.01 SOL误差范围内"
//         );

//         // 4.7. 验证用户英雄集合已重置 - verify user collection is reset
//         userCollection = await program.account.userCollection.fetch(
//           testUserCollectionAddress
//         );
//         const allReset = userCollection.collection.every((item) => item === 0);
//         assert.isTrue(allReset, "用户英雄集合应该已重置");
//         log(chalk.bgGreen("🔄 用户英雄集合已重置，可以开始新一轮收集"));

//         // 5. 测试重复领取应该失败 - test duplicate claim should fail
//         try {
//           log(`🔄 测试重复领取同一轮奖励...`);
//           await program.methods
//             .claim()
//             .accounts({
//               minter: testUser.publicKey,
//               roundClaim: roundClaimAddress,
//             })
//             .signers([testUser])
//             .rpc();
//           assert.fail("重复领取同一轮奖励应该失败");
//         } catch (error: any) {
//           console.log(`✅ 预期的错误: ${error.message}`);
//           assert.include(
//             error.message,
//             "ConstraintSeeds",
//             "应该返回ConstraintSeeds错误"
//           );
//         }
//       }
//     },
//     1000 * 60 * 10 // 10分钟超时
//   );

//   it(
//     "8.领取测试2[两个用户同时领取情况]- claim test 2 - two users claim at the same time",
//     async () => {
//       // 2. 为两个用户铸造并收集英雄 - mint and collect all heroes for two users
//       await collectAllHeroForAUser(claimer1, "测试 claimer1");
//       await collectAllHeroForAUser(claimer2, "测试 claimer2");

//       // 3. 获取当前轮次 - get the current round
//       const shuihuCurent = await program.account.shuiHu.fetch(shuihuAddress);
//       const currentRound = shuihuCurent.round;
//       const currentBonus = shuihuCurent.bonus.toNumber();
//       const currentMintPrice = shuihuCurent.mintPrice.toNumber();
//       log(
//         `📊 当前轮次: ${currentRound}, 奖池: ${
//           currentBonus / LAMPORTS_PER_SOL
//         } SOL - ${currentBonus} lamports`
//       );

//       // 3.1 记录两个账户初始值 - record the initial balances for both users
//       const claimer1_balance_before = await provider.connection.getBalance(
//         claimer1.publicKey
//       );
//       const claimer2_balance_before = await provider.connection.getBalance(
//         claimer2.publicKey
//       );
//       const teamBalanceBeforeClaim = await provider.connection.getBalance(team);
//       log(`claimer1 余额 ${claimer1_balance_before / LAMPORTS_PER_SOL} SOL`);
//       log(`claimer2 余额 ${claimer2_balance_before / LAMPORTS_PER_SOL} SOL`);

//       // 3.2 计算预期奖励 - calculate the expected rewards
//       const expectedClaimBonus = currentBonus / 2;
//       const expectedTeamBonus = expectedClaimBonus * 0.01;
//       const expectedMinterBonus = expectedClaimBonus - expectedTeamBonus;
//       log(
//         `预期用户奖励 ${
//           expectedMinterBonus / LAMPORTS_PER_SOL
//         } SOL - ${expectedMinterBonus} lamports`
//       );
//       log(
//         `预期团队奖励 ${
//           expectedTeamBonus / LAMPORTS_PER_SOL
//         } SOL - ${expectedTeamBonus} lamports`
//       );

//       // 4. 两个用户同时领取 - claim both users at the same time
//       // 4.1 计算领取奖励PDA地址 - calculate the claim address
//       const [roundClaimAddress] = PublicKey.findProgramAddressSync(
//         [ROUND_CLAIM_SEED, Buffer.from([currentRound])],
//         program.programId
//       );

//       // 4.2 两个用户同时领取 - claim both users at the same time
//       const [claimTx1, claimTx2] = await Promise.all([
//         program.methods
//           .claim()
//           .accounts({
//             minter: claimer1.publicKey,
//             roundClaim: roundClaimAddress,
//           })
//           .signers([claimer1])
//           .rpc({ skipPreflight: true })
//           .catch((e) => {
//             log(`❌  claimer 1 领取失败`, e.message);
//             return null;
//           }),
//         program.methods
//           .claim()
//           .accounts({
//             minter: claimer2.publicKey,
//             roundClaim: roundClaimAddress,
//           })
//           .signers([claimer2])
//           .rpc({ skipPreflight: true })
//           .catch((e) => {
//             log(`❌  claimer 2 领取失败`, e.message);
//             return null;
//           }),
//       ]);

//       console.log("- claim Tx 1", claimTx1);
//       console.log("- claim Tx 2", claimTx2);

//       // 4.3 验证两个用户领取成功 - verify both users claim successfully
//       const successCount = [claimTx1, claimTx2].filter(
//         (tx) => tx !== null
//       ).length;
//       console.log(`✅ 成功领取次数: ${successCount}`);
//       assert.equal(successCount, 1, "应该只有一个用户成功领取奖励");

//       const claimer1_balance_after = await provider.connection.getBalance(
//         claimer1.publicKey
//       );
//       const claimer2_balance_after = await provider.connection.getBalance(
//         claimer2.publicKey
//       );

//       // 4.4 计算余额变化 - calculate the balance change
//       const claimer1_balance_change =
//         claimer1_balance_after - claimer1_balance_before;
//       const claimer2_balance_change =
//         claimer2_balance_after - claimer2_balance_before;
//       log(
//         `claimer1 余额变化 ${
//           claimer1_balance_change / LAMPORTS_PER_SOL
//         } SOL - ${claimer1_balance_change} lamports`
//       );
//       log(
//         `claimer2 余额变化 ${
//           claimer2_balance_change / LAMPORTS_PER_SOL
//         } SOL - ${claimer2_balance_change} lamports`
//       );

//       // 4.5 验证只有一个用户获得了奖励 - verify only one user gets the reward
//       const totalChange = claimer1_balance_change + claimer2_balance_change;
//       // 考虑到gas费用和创建PDA的租金，使用approximately断言
//       assert.approximately(
//         Math.abs(totalChange) / LAMPORTS_PER_SOL,
//         expectedMinterBonus / LAMPORTS_PER_SOL,
//         0.1,
//         "总奖励金额应该接近预期值"
//       );

//       log(chalk.bgGreen("✅ claimer 验证通过"));

//       const shuihuAfter = await program.account.shuiHu.fetch(shuihuAddress);
//       const bonusAfter = shuihuAfter.bonus.toNumber();
//       const mintPriceAfter = shuihuAfter.mintPrice.toNumber();

//       console.log(
//         `🏆 奖池剩余金额: ${
//           bonusAfter / LAMPORTS_PER_SOL
//         } SOL, ${bonusAfter} Lamports`
//       );
//       assert.strictEqual(
//         currentBonus - bonusAfter,
//         expectedClaimBonus,
//         "奖池减少金额等于预期发出的总奖金"
//       );

//       assert.equal(shuihuAfter.round, currentRound + 1, "轮次应该增加");
//       const expectedMintPrice = currentMintPrice * 2;
//       const expectedCalMintPrice =
//         START_MINT_PRICE * 2 ** (shuihuAfter.round - 1);
//       assert.equal(mintPriceAfter, expectedMintPrice, "铸造价格应该翻倍");
//       assert.equal(
//         mintPriceAfter,
//         expectedCalMintPrice,
//         "铸造价格应该为预期计算值"
//       );
//       log(chalk.bgGreen("✅ shuihu验证通过"));

//       // 4.7 验证roundClaim账户 - verify round claim account
//       const roundClaim = await program.account.roundClaim.fetch(
//         roundClaimAddress
//       );

//       if (claimTx1) {
//         assert.equal(
//           claimer1.publicKey.toString(),
//           roundClaim.minter.toString(),
//           "领取者匹配"
//         );
//       }

//       if (claimTx2) {
//         assert.equal(
//           claimer2.publicKey.toString(),
//           roundClaim.minter.toString(),
//           "领取者匹配"
//         );
//       }

//       assert.equal(currentRound, roundClaim.round, "轮次匹配");

//       assert.equal(
//         expectedMinterBonus,
//         roundClaim.claimedAmount.toNumber(),
//         "奖励金额匹配"
//       );
//       log(chalk.bgGreen("✅ 轮次领取账户验证通过"));

//       // 4.6 验证team账户余额 - verify team account balance
//       const teamBalanceAfterClaim = await provider.connection.getBalance(team);
//       log(
//         `team账户变化金额 ${
//           teamBalanceAfterClaim - teamBalanceBeforeClaim / LAMPORTS_PER_SOL
//         } SOL -- ${teamBalanceAfterClaim - teamBalanceBeforeClaim} lamports`
//       );
//       log(
//         `预期账户变化金额 ${
//           expectedTeamBonus / LAMPORTS_PER_SOL
//         } SOL -- ${expectedTeamBonus} lamports`
//       );

//       assert.approximately(
//         (teamBalanceAfterClaim - teamBalanceBeforeClaim) / LAMPORTS_PER_SOL,
//         expectedTeamBonus / LAMPORTS_PER_SOL,
//         0.01,
//         "团队余额变化应在预期奖励的0.01 SOL误差范围内"
//       );
//     },
//     60 * 1000 * 10
//   );
// });

// function calHeroIndex(randomness: number[]): number {
//   // 1. 将前8个字节转换为64位整数
//   const buffer = Buffer.from(randomness.slice(0, 8));
//   const revealed_random_value_u64 = buffer.readBigUInt64LE();
//   // 2. 计算概率总和
//   let total_probability = 0;
//   hero_list.forEach((hero:any) => {
//     total_probability += hero.probability;
//   });
//   // 3. 计算余数
//   const remainder = revealed_random_value_u64 % BigInt(total_probability);
//   // 4. 查找对应的英雄索引
//   let cumulative_probability = BigInt(0);
//   const hero_index = hero_list.findIndex((info: any) => {
//     cumulative_probability += BigInt(info.probability);
//     return cumulative_probability > remainder;
//   });
//   return hero_index;
// }
