pub const SHUIHU_SEED: &[u8] = b"SHUIHU"; // 配置账户种子
pub const TOKEN_MINT_SEED: &[u8] = b"TOKEN_MINT"; // 代币账户种子
pub const ROUND_CLAIM_SEED: &[u8] = b"ROUND_CLAIM"; // 轮领取种子
pub const MINT_STATE_SEED: &[u8] = b"SHUIHU_HERO_MINT_STATE"; // 英雄铸造状态种子
pub const USER_COLLECTION_SEED: &[u8] = b"USER_COLLECTION";

pub const START_ROUND: u8 = 1;  // 开始轮次
pub const START_MINT_PRICE: u64 = 10_000_000; // 开始铸币价格 0.01 SOL

// 英雄合集
pub const HERO_COL_NAME: &str = "SHUI HU HERO COLLECTION"; // 英雄集合名称
pub const HERO_COL_URI: &str = "wo_C8KmbuuZzqBwil_5_kTVyhX75I7NUau_FD-xaKNE";

// 英雄名称
pub const HERO_NAME: &str = "SHUI HU HERO";

// 元宝
pub const TOKEN_NAME: &str = "SHUI HU YUAN BAO";
pub const TOKEN_SYMBOL: &str = "SHYB";
pub const TOKEN_URI: &str = "HXeR9TbqLSKKVoMdWsdPJrJJ5e6IxL2OIU04LHxtCuU";
pub const MINT_DECIMALS: u8 = 9;  // 代币精度

pub const BASE_ASSETS_URI: &str = "https://arweave.net/";

#[derive(Clone, Copy)]
pub struct HeroInfo {
    #[allow(dead_code)]
    pub uri: &'static str,
    #[allow(dead_code)]
    pub probability: u16,
    #[allow(dead_code)]
    pub star: u8,
}

pub const HERO_INFO: [HeroInfo; 108] = [
    HeroInfo {
        uri: "0zN0waHPt9XBcj45dellb9-F-AEuRYND7lrl4pYUsRc",
        probability: 1, // 1
        star: 6,
    },
    HeroInfo {
        uri: "An-rsgjwSz1Blr1p_Fl8dIQOKWhRuBmjs6Om3jVKdfQ",
        probability: 10, // 2
        star: 5,
    },
    HeroInfo {
        uri: "hw5GM0AdcB99rNKpcN2AsgNL7Hp_YbvYFPRaeBVeLNU",
        probability: 10, // 3
        star: 5,
    },
    HeroInfo {
        uri: "aNxSugXdSLvsht5HK0CHcvO4cbh-qW5nhbNh5B7K0u4",
        probability: 10, // 4
        star: 5,
    },
    HeroInfo {
        uri: "UZctucEyVwSTrmNK0yn_yiWpJ_nqcqZfks9qrriteYs",
        probability: 100, // 5
        star: 4,
    },
    HeroInfo {
        uri: "VHBUdtWwHusUnfeXulVdZ8pwyajQYKXnKkc1OZEye_k",
        probability: 100, // 6
        star: 4,
    },
    HeroInfo {
        uri: "A3CMkA2DkZcjlehDbqGSYuxHvkwmop_Rk_UIVTMxOmA",
        probability: 100, // 7
        star: 4,
    },
    HeroInfo {
        uri: "AICqzrjqjI4G7zK8rfDnYCiOWh0q-ESCnK87WdSqL_I",
        probability: 100, // 8
        star: 4,
    },
    HeroInfo {
        uri: "u_r2ihi6-fc--1BMxyCGxD4IB8DSbNlDpC0dx30zZeI",
        probability: 100, // 9
        star: 4,
    },
    HeroInfo {
        uri: "manq-EMANTlWicjleZ3U9RsJBSsjR4ows0k831VodOg",
        probability: 100, // 10
        star: 4,
    },
    HeroInfo {
        uri: "sgasES9fLYFs0eL9Thz7q5BT-ex9pp6bkJ2PFuoSVX4",
        probability: 100, // 11
        star: 4,
    },
    HeroInfo {
        uri: "ZREx2G5ziL3Byw6A-Oe87pb_bf77DUu1xyet7GkhYdE",
        probability: 100, // 12
        star: 4,
    },
    HeroInfo {
        uri: "fj-E8dLqEXWZ1uy9kbCN1QYA1wVwvRPrhRZrQ7gfTGw",
        probability: 800, // 13
        star: 3,
    },
    HeroInfo {
        uri: "8kwhzb-mIQo0MRVncfbf50PM17n8EPt4a9ZSdxxwypk",
        probability: 800, // 14
        star: 3,
    },
    HeroInfo {
        uri: "-k1xMf8owxAKraHBynCG9pChET5IJK_IpL9GOO4Si9c",
        probability: 800, // 15
        star: 3,
    },
    HeroInfo {
        uri: "8TqmFu82RPxxCzy4JJm3FKyOnzfg6yN719JBA1OkukA",
        probability: 800, // 16
        star: 3,
    },
    HeroInfo {
        uri: "XSdJ9zPHvGgQudHUFNbZX06_1JsgRcF1ehIGucdTY1k",
        probability: 800, // 17
        star: 3,
    },
    HeroInfo {
        uri: "iggE7KiMMqVMCf0VTKoeAAJp_blTIUTzVoIMqCe_fno",
        probability: 800, // 18
        star: 3,
    },
    HeroInfo {
        uri: "dvpi977F8wmbLR-plmox6l6ofjcVCIroYHDRrGH2YMY",
        probability: 800, // 19
        star: 3,
    },
    HeroInfo {
        uri: "OoGu8nfWhOyWMTERZEBMUt1ge786jbdXzi9deA_I1sg",
        probability: 800, // 20
        star: 3,
    },
    HeroInfo {
        uri: "O0tgwxShIQxMxAoeEIopAPiUYKaOlGCT9mZ3JRyH2JI",
        probability: 800, // 21
        star: 3,
    },
    HeroInfo {
        uri: "mnd27vrYJX1Ohevj72Dp8S-lFQhSCv_liYgbyqx-ASs",
        probability: 800, // 22
        star: 3,
    },
    HeroInfo {
        uri: "eX-l_ddI2yPWDZHA1pZfdfEosFavG3dC8DDa4eAGaCs",
        probability: 800, // 23
        star: 3,
    },
    HeroInfo {
        uri: "Aw8-DKMP-q4fiRLQJwNpkf42_qlEBbDQuH9U1z1GFzA",
        probability: 800, // 24
        star: 3,
    },
    HeroInfo {
        uri: "exAoSGSydNS6HRcc7Gp0ek1UsFDlW_D_4dMH9NdWse8",
        probability: 800, // 25
        star: 3,
    },
    HeroInfo {
        uri: "P2nKZybQLB62OXAHX1XLck7dc2_InZPWj7lsxDOeqS0",
        probability: 800, // 26
        star: 3,
    },
    HeroInfo {
        uri: "N62fKxO90IKfEVhgEwIPAztb9GbA3Hw6W1D3LaBsYyw",
        probability: 800, // 27
        star: 3,
    },
    HeroInfo {
        uri: "408aDwL2VBvooVAMm5LA5zSCaL6dI5cUHWbTgRlwE4c",
        probability: 800, // 28
        star: 3,
    },
    HeroInfo {
        uri: "hoEzR_BJhuTwdxJBQP75g-CXZvxDhJfg-_96Dbyw9Os",
        probability: 800, // 29
        star: 3,
    },
    HeroInfo {
        uri: "T6PhG0nZBVesMyRrsAKk26SNVanACxxzcngIilQ5vL8",
        probability: 800, // 30
        star: 3,
    },
    HeroInfo {
        uri: "1Hmf4y1ZpYllDrnZTsXVOTLLv88WgUu2fpC3GhTZJ7Q",
        probability: 800, // 31
        star: 3,
    },
    HeroInfo {
        uri: "dRUQX5QHZ4oBDmhFpSRfs1H299vFgt7QU1L3vFn9Cs8",
        probability: 800, // 32
        star: 3,
    },
    HeroInfo {
        uri: "eHe-y0HndZCGv_7v0tlAMJLeVelSgpT57eMU18_i0iM",
        probability: 800, // 33
        star: 3,
    },
    HeroInfo {
        uri:"qBrWYh360hwwMQaiVwBDgPwnCWbV26jAf5MfsSSWblQ",
        probability: 800, // 34
        star: 3,
    },
    HeroInfo {
        uri: "rfG1ceKFmD0UbX_8IPo-prL6GejaKu77pIISKAdHmTg",
        probability: 800, // 35
        star: 3,
    },
    HeroInfo {
        uri: "G0EQ9QON1PC0bLru9HP08vxk32StfHNjFgZn1azynFg",
        probability: 800, // 36
        star: 3,
    },
    HeroInfo {
        uri: "kjw1exRnXfElIU2yWTV_tt2drs2SJ59wWn7iuClKbJM",
        probability: 1110, // 37
        star: 2,
    },
    HeroInfo {
        uri: "GQQlFgJG8nbVi36SLl2tkXKfgbxB-QXKGXcyUoM_Q_g",
        probability: 1110, // 38
        star: 2,
    },
    HeroInfo {
        uri: "F40ZeNBSI8ixdJ1eYjuwsxJAy9nWrv6HBj8XVBtsuRM",
        probability: 1110, // 39
        star: 2,
    },
    HeroInfo {
        uri: "UK97FxVazM8jDWaMX7SUX5Liub3i3WCcKFD724i4EtM",
        probability: 1110, // 40
        star: 2,
    },
    HeroInfo {
        uri: "FYv9uhGTEKU_HJbbigykQXTFlhRly38UqfqktMxwASo",
        probability: 1110, // 41
        star: 2,
    },
    HeroInfo {
        uri: "z7i_5eRxmlCKE64NUJStJTmzt8LATBaE7Q0ek_nDQTE",
        probability: 1110, // 42
        star: 2,
    },
    HeroInfo {
        uri: "rCM5e3Ql16YoF__XAKlccyd68-iQmLYBywL1ynk84lA",
        probability: 1110, // 43
        star: 2,
    },
    HeroInfo {
        uri: "FjjAWOW5NH8Jw7u6ehGW3BpgdUienYNyRRi4OkgYk4I",
        probability: 1110, // 44
        star: 2,
    },
    HeroInfo {
        uri: "msWcaDu9YA9tOUyVR3wgI6j_xJDpR8YFaDoRkjIm5KA",
        probability: 1110, // 45
        star: 2,
    },
    HeroInfo {
        uri: "xyz5xUc6QUnTNiCdSI9wtbqibD6N49KgJqqtB6sv5ZU",
        probability: 1110, // 46
        star: 2,
    },
    HeroInfo {
        uri: "ZzG8FG5N6jMt-JqoYCySzH-VkfVhJUo77ZKuj1FTdDc",
        probability: 1110, // 47
        star: 2,
    },
    HeroInfo {
        uri: "_O33M8dLR5upluW5ujtHOKYSXAzbw9VZUpgTk2bS-xI",
        probability: 1110, // 48
        star: 2,
    },
    HeroInfo {
        uri: "JwWxrw4iMd4keSycd7fkqxds3XcRTub2UocyItYvxVM",
        probability: 1110, // 49
        star: 2,
    },
    HeroInfo {
        uri: "gYpkoDC_TTfORpE5lMq3VuyeD_iZhGzKkrpweFcVcks",
        probability: 1110, // 50
        star: 2,
    },
    HeroInfo {
        uri: "a0XEqhw6SQWiS5tUj0xOjtkCskY4GFLYMrBkyix7iTw",
        probability: 1110, // 51
        star: 2,
    },
    HeroInfo {
        uri: "EMTlZ6VCOP0QziKgJEuMUvJhRfHkyi4BX41zK3TnoCw",
        probability: 1110, // 52
        star: 2,
    },
    HeroInfo {
        uri: "97A9XXZ6zv9OfQku_byG6VVqdziNPstPvZ6HUFg8-wE",
        probability: 1110, // 53
        star: 2,
    },
    HeroInfo {
        uri: "Fe8hA-VXkaZBhqgMkZex5KxOQ5gU9rHwk85StK-gytw",
        probability: 1110, // 54
        star: 2,
    },
    HeroInfo {
        uri: "pfa0FTjellce6vxzxqO01fYHzBUuqqHVlmTPN4MrPhM",
        probability: 1110, // 55
        star: 2,
    },
    HeroInfo {
        uri: "-q09XN_X46VoSRHQkln1JXmeyOxeZ-DSDZA7p2BA1L0",
        probability: 1110, // 56
        star: 2,
    },
    HeroInfo {
        uri: "I5LGG0eCku0xXfE9Y9dBAA5JSfueT7Fo89ernQSGxBc",
        probability: 1110, // 57
        star: 2,
    },
    HeroInfo {
        uri: "0z2TYLfDgs8wkEj0CG3KqcxPU8tMgC6Qy7S9HY5ZXRs",
        probability: 1110, // 58
        star: 2,
    },
    HeroInfo {
        uri: "NaPaa2tB7THSLkMoRkvZISOlRnjxJ0V7sFWeJag9G3g",
        probability: 1110, // 59
        star: 2,
    },
    HeroInfo {
        uri: "tGC-PC_-BnpoCApKTQYC-z4sELDO2UXyJ-yL_16Ivgg",
        probability: 1110, // 60
        star: 2,
    },
    HeroInfo {
        uri: "EFzdDU_rGs1hkzMYGmvvMBCMJA6UhqLKJbP2srBrHSE",
        probability: 1110, // 61
        star: 2,
    },
    HeroInfo {
        uri: "Ie0qxMe7j5DgOFgmki02vJtBxj9giIVt_E56_VGg80A",
        probability: 1110, // 62
        star: 2,
    },
    HeroInfo {
        uri: "basExQNWUvOFMIPiLd4kTGavXASnpzzPLbnCZe4Wnss",
        probability: 1110, // 63
        star: 2,
    },
    HeroInfo {
        uri: "bz53XAnfFhjMtIEwhxD11XqODIG_7wMCaN9nTmBDRWA",
        probability: 1110, // 64
        star: 2,
    },
    HeroInfo {
        uri: "sn9uP3LrniIYGy84LlYGQSFSlwHUPzDtl10MqRc3dG8",
        probability: 1110, // 65
        star: 2,
    },
    HeroInfo {
        uri: "bJLofGKRdcPam1yREIplw63Q436jCpM32hPejJ3MGg4",
        probability: 1110, // 66
        star: 2,
    },
    HeroInfo {
        uri: "uvhdfXnn7nPcHFlBfJ6RQggec0nafaVqTjNhvgxSJrw",
        probability: 1110, // 67
        star: 2,
    },
    HeroInfo {
        uri: "25UN0WvngQ1tt6n8IEGoKORIS8d4OtLRmpFY0RZ79rA",
        probability: 1110, // 68
        star: 2
    },
    HeroInfo {
        uri: "gmt-zqYnbf5Kc1Z74gvXgfusOXnuET1LNcxvtPpTVzY",
        probability: 1110, // 69
        star: 2
    },
    HeroInfo {
        uri: "nICrMgLGkWYwDndzZOAMZWtI1EvWxdk3u9LLv-ZQCf0",
        probability: 1110, // 70
        star: 2
    },
    HeroInfo {
        uri: "ls5GJbnhlExtW2k5l3sjy8CU7CPE_OiGn1sobjdk1RM",
        probability: 1110, // 71
        star: 2
    },
    HeroInfo {
        uri: "AmQhsdn7fY3KAGUrASM5aQ8Rb7NEDoIQygLXVrQwnqk",
        probability: 1110, // 72
        star: 2
    },
    HeroInfo {
        uri: "W2WGJWLuo8Z451F2KvTTXnrsLsjSPLXTeIfaYZZvqJY",
        probability: 1110, // 73
        star: 2
    },
    HeroInfo {
        uri: "V2Rp0i04lz0WflAwAlRLFJLHCMxlF1m0Kp9RIUXtmmQ",
        probability: 1110, // 74
        star: 2
    },
    HeroInfo {
        uri: "7mw-dCETsnGJfUQ_2ecuvcTAY7e-L-u6bFs2qtHrF28",
        probability: 1110, // 75
        star: 2
    },
    HeroInfo {
        uri: "VnCTCy9YM6aijrU5IYAZWsDDBU8S1KOlXw7sBXPdJS8",
        probability: 1110, // 76
        star: 2
    },
    HeroInfo {
        uri: "P6GgKWCsHGl5R2XrmpVYgFBAHkFmo9T5eWRpfEfPw8Q",
        probability: 1110, // 77
        star: 2
    },
    HeroInfo {
        uri: "B5VaaQP6CnLWXqtXFoRXrYNS8Bgsi5FfAvRu9N0cj5Y",
        probability: 1110, // 78
        star: 2
    },
    HeroInfo {
        uri: "fAikOnL5OaIRWEx2jF2YgXOK5WamAdiK_TmWddL6x3Y",
        probability: 1110, // 79
        star: 2
    },
    HeroInfo {
        uri: "-dF5Ncn7GWV-PYSS7O-F1by6AeDP5ORb_e0xi_9Nmk8",
        probability: 1110, // 80
        star: 2
    },
    HeroInfo {
        uri: "T-An9IYWCLSo7cP6p1dJ9xjaTWTQ-SRAQjEQyWhbVsA",
        probability: 1110, // 81
        star: 2
    },
    HeroInfo {
        uri: "EpEkG-efTOyxXrzuJbt0u6uLN90cj9peNgL3q5DQoG8",
        probability: 1110, // 82
        star: 2
    },
    HeroInfo {
        uri: "egbViw0NVTcuEBtogQMm95Dai-v3lHuIzgQc7pEepUM",
        probability: 1110, // 83
        star: 2
    },
    HeroInfo {
        uri: "kU9NkcauycBno_K9rx2fCttL6JjBienVvAVSNHFurNo",
        probability: 1110, // 84
        star: 2
    },
    HeroInfo {
        uri: "XqDGTYgorKkRVwtt30bNBk29kWl4PI_bc67trEA8FNQ",
        probability: 1110, // 85
        star: 2
    },
    HeroInfo {
        uri: "uROSsnGbgVeIeg1Iwwmi23pxoYCXwu6-5dqMN0wE3Ak",
        probability: 1110, // 86
        star: 2
    },
    HeroInfo {
        uri: "G6HX_3wGreXRwHNT94lqnFmEJ-_Gq4-506ezhZW5euo",
        probability: 1110, // 87
        star: 2
    },
    HeroInfo {
        uri: "lA1lvVLMZMPIDTtOHU-nYaoH6G3eSeKg-0nu4inv8BM",
        probability: 1110, // 88
        star: 2
    },
    HeroInfo {
        uri: "f8YXlxUudhIFb5TFEZIPWH41Hh0agFBc-JHninapnUU",
        probability: 1110, // 89
        star: 2
    },
    HeroInfo {
        uri: "pysDRGy52jMCQuig70ClPPUhWwl67KmvA5cxgkckMJ4",
        probability: 1110, // 90
        star: 2
    },
    HeroInfo {
        uri: "7iwUCbJ3nLD-9k-dxCS3sQrVme_IG1GWWtDJvq1i_zg",
        probability: 1110, // 91
        star: 2
    },
    HeroInfo {
        uri: "7t5VfF0_CQjTlmw0i2SgZclxC2yPLvHKZZtB3UBWHl0",
        probability: 1110, // 92
        star: 2
    },
    HeroInfo {
        uri: "opV58RhEek9sGW3rZwCmS-XAnC5enzqrkkUBF9zsBic",
        probability: 1110, // 93
        star: 2
    },
    HeroInfo {
        uri: "7Rm8d9vkqAFOH1I_-RrCZ1KwYBD34nIURCS4R63rZTk",
        probability: 1110, // 94
        star: 2
    },
    HeroInfo {
        uri: "XGSvOmCBjckamoMhmg8fkdBiqhhFUoeXTi2463yfDn0",
        probability: 1110, // 95
        star: 2
    },
    HeroInfo {
        uri: "GVHPLYC7lxeN0sAzU8Hs-FzLCJnSHaMrWSEwcnTCez0",
        probability: 1110, // 96
        star: 2
    },
    HeroInfo {
        uri: "xOO5EMLlR82PvuDbKU_gFgAYsTqjPkHhcGz70nLwVPA",
        probability: 1110, // 97
        star: 2
    },
    HeroInfo {
        uri: "N-2bO59xab_3USwe7IvCtMC4aSl3mZiS_SCQMPiDYds",
        probability: 1110, // 98
        star: 2
    },
    HeroInfo {
        uri: "y0tjCDivpcXr5CcS56tiOgLkANm6r-r4jHhRZs4Tr2Q",
        probability: 1110, // 99
        star: 2
    },
    HeroInfo {
        uri: "1Dg0BOog-lVnppyVzPSImRYxCq1qFkTr8JPpFEyHyN8",
        probability: 1110, // 100
        star: 2
    },
    HeroInfo {
        uri: "GP6bFfntZbwOiGQ5XBpxOzYJWHP6lqTeAvyI3Whg3KA",
        probability: 1110, // 101
        star: 2
    },
    HeroInfo {
        uri: "v7O9NLfAPPVH4lHyAqmQZ4-lkJvRqwC9c1O9s7Sav0U",
        probability: 1110, // 102
        star: 2
    },
    HeroInfo {
        uri: "n6BruuXhTIkjf4VS3nCfDN6qd9-lfP8mRwmztFUURoQ",
        probability: 1110, // 103
        star: 2
    },
    HeroInfo {
        uri: "SsWVLv7gVzrriAhdw2Z2m8vzgN8A4Y_KvXBn0rbajZQ",
        probability: 1110, // 104
        star: 2
    },
    HeroInfo {
        uri: "TsFYmnlmZ8DSF4hQuXtiYvFNtr42nvHHViCtLGEWJ2I",
        probability: 1110, // 105
        star: 2
    },
    HeroInfo {
        uri: "xQYJjZMQ8xMjWbzRwA7SgTECQpaIQfdjdA2Xa7vegns",
        probability: 1110, // 106
        star: 2
    },
    HeroInfo {
        uri: "BNRwwtalbZZ-2IXaxj-x3oGmcsy5k83sXQLBfjk8DlA",
        probability: 1110, // 107
        star: 2
    },
    HeroInfo {
        uri: "4iSt4PrdheUzvy2Z19E0eFpjCNsCb1fxQ5O2HqpZzek",
        probability: 1110, // 108
        star: 2
    },
];