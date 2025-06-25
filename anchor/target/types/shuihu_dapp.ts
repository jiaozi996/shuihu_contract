/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/shuihu_dapp.json`.
 */
export type ShuihuDapp = {
  "address": "GeMsK5Ru78XGVCQoyLkc4ECbpFZEgKkK1ukAiMWadHpc",
  "metadata": {
    "name": "shuihuDapp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claim",
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "minter",
          "writable": true,
          "signer": true
        },
        {
          "name": "shuihu",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85
                ]
              }
            ]
          }
        },
        {
          "name": "roundClaim",
          "writable": true
        },
        {
          "name": "userCollection",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82,
                  95,
                  67,
                  79,
                  76,
                  76,
                  69,
                  67,
                  84,
                  73,
                  79,
                  78
                ]
              },
              {
                "kind": "account",
                "path": "minter"
              }
            ]
          }
        },
        {
          "name": "team",
          "writable": true,
          "relations": [
            "shuihu"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "collect",
      "discriminator": [
        208,
        47,
        194,
        155,
        17,
        98,
        82,
        236
      ],
      "accounts": [
        {
          "name": "minter",
          "writable": true,
          "signer": true
        },
        {
          "name": "userHeroCollection",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82,
                  95,
                  67,
                  79,
                  76,
                  76,
                  69,
                  67,
                  84,
                  73,
                  79,
                  78
                ]
              },
              {
                "kind": "account",
                "path": "minter"
              }
            ]
          }
        },
        {
          "name": "shuihu",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85
                ]
              }
            ]
          }
        },
        {
          "name": "hero",
          "writable": true
        },
        {
          "name": "heroCollection",
          "writable": true,
          "relations": [
            "shuihu"
          ]
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "combine",
      "discriminator": [
        168,
        128,
        202,
        211,
        25,
        51,
        52,
        164
      ],
      "accounts": [
        {
          "name": "minter",
          "writable": true,
          "signer": true
        },
        {
          "name": "shuihu",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85
                ]
              }
            ]
          }
        },
        {
          "name": "heroMintState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85,
                  95,
                  72,
                  69,
                  82,
                  79,
                  95,
                  77,
                  73,
                  78,
                  84,
                  95,
                  83,
                  84,
                  65,
                  84,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "force"
              }
            ]
          }
        },
        {
          "name": "hero1",
          "writable": true
        },
        {
          "name": "hero2",
          "writable": true
        },
        {
          "name": "heroCollection",
          "writable": true,
          "relations": [
            "shuihu"
          ]
        },
        {
          "name": "random",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  114,
                  97,
                  110,
                  100,
                  111,
                  109,
                  110,
                  101,
                  115,
                  115,
                  45,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "force"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  110,
                  101,
                  116,
                  119,
                  111,
                  114,
                  107,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  117,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "vrf",
          "address": "VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y"
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "force",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "shuihu",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85
                ]
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "shuihu"
              }
            ]
          }
        },
        {
          "name": "heroCollection",
          "writable": true,
          "signer": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "u64"
        },
        {
          "name": "team",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "mint",
      "discriminator": [
        51,
        57,
        225,
        47,
        182,
        146,
        137,
        166
      ],
      "accounts": [
        {
          "name": "minter",
          "writable": true,
          "signer": true
        },
        {
          "name": "shuihu",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85
                ]
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true,
          "relations": [
            "shuihu"
          ]
        },
        {
          "name": "minerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "minter"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "heroMintState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85,
                  95,
                  72,
                  69,
                  82,
                  79,
                  95,
                  77,
                  73,
                  78,
                  84,
                  95,
                  83,
                  84,
                  65,
                  84,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "force"
              }
            ]
          }
        },
        {
          "name": "random",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  114,
                  97,
                  110,
                  100,
                  111,
                  109,
                  110,
                  101,
                  115,
                  115,
                  45,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "force"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  110,
                  101,
                  116,
                  119,
                  111,
                  114,
                  107,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  117,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "vrf",
          "address": "VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "force",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "reveal",
      "discriminator": [
        9,
        35,
        59,
        190,
        167,
        249,
        76,
        115
      ],
      "accounts": [
        {
          "name": "minter",
          "writable": true,
          "signer": true
        },
        {
          "name": "hero",
          "writable": true,
          "signer": true
        },
        {
          "name": "shuihu",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85
                ]
              }
            ]
          }
        },
        {
          "name": "heroMintState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  72,
                  85,
                  73,
                  72,
                  85,
                  95,
                  72,
                  69,
                  82,
                  79,
                  95,
                  77,
                  73,
                  78,
                  84,
                  95,
                  83,
                  84,
                  65,
                  84,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "hero"
              }
            ]
          }
        },
        {
          "name": "heroCollection",
          "writable": true,
          "relations": [
            "shuihu"
          ]
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "random",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  114,
                  97,
                  110,
                  100,
                  111,
                  109,
                  110,
                  101,
                  115,
                  115,
                  45,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "hero"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  110,
                  101,
                  116,
                  119,
                  111,
                  114,
                  107,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  117,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "vrf",
          "address": "VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y"
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "baseAssetV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "baseCollectionV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "heroMintState",
      "discriminator": [
        69,
        180,
        23,
        191,
        74,
        185,
        246,
        155
      ]
    },
    {
      "name": "networkState",
      "discriminator": [
        212,
        237,
        148,
        56,
        97,
        245,
        51,
        169
      ]
    },
    {
      "name": "roundClaim",
      "discriminator": [
        98,
        185,
        145,
        125,
        174,
        4,
        140,
        207
      ]
    },
    {
      "name": "shuiHu",
      "discriminator": [
        7,
        81,
        153,
        135,
        149,
        75,
        186,
        131
      ]
    },
    {
      "name": "userCollection",
      "discriminator": [
        114,
        1,
        122,
        55,
        53,
        17,
        121,
        62
      ]
    }
  ],
  "events": [
    {
      "name": "claimEvent",
      "discriminator": [
        93,
        15,
        70,
        170,
        48,
        140,
        212,
        219
      ]
    },
    {
      "name": "collectEvent",
      "discriminator": [
        138,
        16,
        76,
        55,
        167,
        75,
        242,
        47
      ]
    },
    {
      "name": "combineEvent",
      "discriminator": [
        15,
        195,
        86,
        228,
        191,
        189,
        181,
        228
      ]
    },
    {
      "name": "mintEvent",
      "discriminator": [
        197,
        144,
        146,
        149,
        66,
        164,
        95,
        16
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidCollectionAuthority",
      "msg": "Invalid collection authority"
    },
    {
      "code": 6001,
      "name": "invalidHeroIndex",
      "msg": "Invalid hero index"
    },
    {
      "code": 6002,
      "name": "invalidHeroOwner",
      "msg": "Invalid hero owner"
    },
    {
      "code": 6003,
      "name": "heroAlreadyCollected",
      "msg": "Hero already collected"
    },
    {
      "code": 6004,
      "name": "collectNotCompleted",
      "msg": "Collect not completed"
    },
    {
      "code": 6005,
      "name": "invalidCollectionLen",
      "msg": "Invalid collection length"
    },
    {
      "code": 6006,
      "name": "roundAlreadyClaimed",
      "msg": "Round Already Claimed"
    },
    {
      "code": 6007,
      "name": "emptyBonus",
      "msg": "Empty Bonus"
    },
    {
      "code": 6008,
      "name": "mintNotAvailable",
      "msg": "Mint not available"
    },
    {
      "code": 6009,
      "name": "vrfSeedIllegal",
      "msg": "VRF seed is illegal, can not be zero"
    },
    {
      "code": 6010,
      "name": "sameHeroNotAllowed",
      "msg": "Same Hero Not Allow to Combine"
    },
    {
      "code": 6011,
      "name": "minterInsufficientFunds",
      "msg": "Minter Insufficient Funds"
    },
    {
      "code": 6012,
      "name": "resultNotReady",
      "msg": "Result not ready"
    },
    {
      "code": 6013,
      "name": "alreadyMinted",
      "msg": "Already minted"
    },
    {
      "code": 6014,
      "name": "invalidMinter",
      "msg": "Invalid Minter"
    },
    {
      "code": 6015,
      "name": "invalidRandomness",
      "msg": "Invalid Randomness"
    },
    {
      "code": 6016,
      "name": "mathOverflow",
      "msg": "Math Overflow"
    },
    {
      "code": 6017,
      "name": "invalidRound",
      "msg": "Invalid round"
    },
    {
      "code": 6018,
      "name": "maxRoundExceeded",
      "msg": "Max round exceeded"
    },
    {
      "code": 6019,
      "name": "invalidTeamAccount",
      "msg": "Invalid team account"
    }
  ],
  "types": [
    {
      "name": "baseAssetV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "key"
              }
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "updateAuthority",
            "type": {
              "defined": {
                "name": "updateAuthority"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "seq",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "baseCollectionV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "key"
              }
            }
          },
          {
            "name": "updateAuthority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "numMinted",
            "type": "u32"
          },
          {
            "name": "currentSize",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "claimEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "claimer",
            "type": "pubkey"
          },
          {
            "name": "claimAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "collectEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "heroIndex",
            "type": "u8"
          },
          {
            "name": "collector",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "combineEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "heroIndex1",
            "type": "u8"
          },
          {
            "name": "heroIndex2",
            "type": "u8"
          },
          {
            "name": "combiner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "heroMintState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "minter",
            "type": "pubkey"
          },
          {
            "name": "hero",
            "type": "pubkey"
          },
          {
            "name": "randomness",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "result",
            "type": "u8"
          },
          {
            "name": "minted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "key",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "uninitialized"
          },
          {
            "name": "assetV1"
          },
          {
            "name": "hashedAssetV1"
          },
          {
            "name": "pluginHeaderV1"
          },
          {
            "name": "pluginRegistryV1"
          },
          {
            "name": "collectionV1"
          }
        ]
      }
    },
    {
      "name": "mintEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "bonus",
            "type": "u64"
          },
          {
            "name": "minter",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "networkConfiguration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "requestFee",
            "type": "u64"
          },
          {
            "name": "fulfillmentAuthorities",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "tokenFeeConfig",
            "type": {
              "option": {
                "defined": {
                  "name": "oraoTokenFeeConfig"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "networkState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": {
              "defined": {
                "name": "networkConfiguration"
              }
            }
          },
          {
            "name": "numReceived",
            "docs": [
              "Total number of received requests."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "oraoTokenFeeConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "ORAO token mint address."
            ],
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "docs": [
              "ORAO token treasury account."
            ],
            "type": "pubkey"
          },
          {
            "name": "fee",
            "docs": [
              "Fee in ORAO SPL token smallest units."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "roundClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "minter",
            "type": "pubkey"
          },
          {
            "name": "claimedAmount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "shuiHu",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "mintPrice",
            "type": "u64"
          },
          {
            "name": "bonus",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "bumpTokenMint",
            "type": "u8"
          },
          {
            "name": "heroCollection",
            "type": "pubkey"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "team",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateAuthority",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "address",
            "fields": [
              "pubkey"
            ]
          },
          {
            "name": "collection",
            "fields": [
              "pubkey"
            ]
          }
        ]
      }
    },
    {
      "name": "userCollection",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minter",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "collection",
            "type": {
              "array": [
                "u8",
                108
              ]
            }
          }
        ]
      }
    }
  ]
};
