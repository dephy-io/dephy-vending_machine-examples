/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/balance_payment.json`.
 */
export type BalancePayment = {
  "address": "8Pna6CZRquk83XT6ecisT9TYVfN3hY299GH2yEJk73dL",
  "metadata": {
    "name": "balancePayment",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createNamespace",
      "discriminator": [
        205,
        189,
        35,
        255,
        214,
        116,
        25,
        107
      ],
      "accounts": [
        {
          "name": "globalAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  71,
                  76,
                  79,
                  66,
                  65,
                  76
                ]
              }
            ]
          }
        },
        {
          "name": "namespaceAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  78,
                  65,
                  77,
                  69,
                  83,
                  80,
                  65,
                  67,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "global_account.namespace_nonce",
                "account": "globalAccount"
              }
            ]
          }
        },
        {
          "name": "authority"
        },
        {
          "name": "treasury"
        },
        {
          "name": "bot"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "deposit",
      "discriminator": [
        242,
        35,
        198,
        137,
        82,
        225,
        242,
        182
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
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
          "name": "globalAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  71,
                  76,
                  79,
                  66,
                  65,
                  76
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "lock",
      "discriminator": [
        21,
        19,
        208,
        43,
        237,
        62,
        255,
        87
      ],
      "accounts": [
        {
          "name": "namespaceAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  78,
                  65,
                  77,
                  69,
                  83,
                  80,
                  65,
                  67,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "namespaceId"
              }
            ]
          }
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true
        },
        {
          "name": "lockAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  79,
                  67,
                  75
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "user_account.nonce",
                "account": "userAccount"
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "bot",
          "signer": true,
          "relations": [
            "namespaceAccount"
          ]
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "namespaceId",
          "type": "u64"
        },
        {
          "name": "recoverInfo",
          "type": {
            "defined": {
              "name": "ed25519RecoverInfo"
            }
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pay",
      "discriminator": [
        119,
        18,
        216,
        65,
        192,
        117,
        122,
        220
      ],
      "accounts": [
        {
          "name": "namespaceAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  78,
                  65,
                  77,
                  69,
                  83,
                  80,
                  65,
                  67,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "namespaceId"
              }
            ]
          }
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "bot",
          "signer": true,
          "relations": [
            "namespaceAccount"
          ]
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "namespaceId",
          "type": "u64"
        },
        {
          "name": "recoverInfo",
          "type": {
            "defined": {
              "name": "ed25519RecoverInfo"
            }
          }
        },
        {
          "name": "amountToTransfer",
          "type": "u64"
        }
      ]
    },
    {
      "name": "register",
      "discriminator": [
        211,
        124,
        67,
        15,
        211,
        194,
        178,
        240
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "signer": true
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "settle",
      "discriminator": [
        175,
        42,
        185,
        87,
        144,
        131,
        102,
        212
      ],
      "accounts": [
        {
          "name": "namespaceAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  78,
                  65,
                  77,
                  69,
                  83,
                  80,
                  65,
                  67,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "lock_account.namespace_id",
                "account": "lockAccount"
              }
            ]
          }
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "lockAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  79,
                  67,
                  75
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "nonce"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "bot",
          "signer": true,
          "relations": [
            "namespaceAccount"
          ]
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u64"
        },
        {
          "name": "amountToTransfer",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateNamespace",
      "discriminator": [
        61,
        107,
        207,
        79,
        239,
        88,
        36,
        255
      ],
      "accounts": [
        {
          "name": "namespaceAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  78,
                  65,
                  77,
                  69,
                  83,
                  80,
                  65,
                  67,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "namespaceId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "namespaceAccount"
          ]
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "namespaceId",
          "type": "u64"
        },
        {
          "name": "newName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newBot",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newTreasury",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalAccount",
      "discriminator": [
        129,
        105,
        124,
        171,
        189,
        42,
        108,
        69
      ]
    },
    {
      "name": "lockAccount",
      "discriminator": [
        223,
        64,
        71,
        124,
        255,
        86,
        118,
        192
      ]
    },
    {
      "name": "namespaceAccount",
      "discriminator": [
        131,
        90,
        249,
        50,
        43,
        36,
        38,
        137
      ]
    },
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooShort",
      "msg": "Name must be at least 3 characters long"
    },
    {
      "code": 6001,
      "name": "noUpdateFields",
      "msg": "No fields to update"
    },
    {
      "code": 6002,
      "name": "invalidPubkey",
      "msg": "Invalid public key"
    },
    {
      "code": 6003,
      "name": "unauthorized",
      "msg": "Unauthorized access."
    },
    {
      "code": 6004,
      "name": "insufficientFunds",
      "msg": "Insufficient funds."
    },
    {
      "code": 6005,
      "name": "signatureFormatInvalid",
      "msg": "The signature format or recovery ID is incorrect."
    },
    {
      "code": 6006,
      "name": "signatureRecoveryFailed",
      "msg": "Failed to recover public key from signature."
    },
    {
      "code": 6007,
      "name": "signatureMismatch",
      "msg": "The recovered public key does not match the user's public key."
    },
    {
      "code": 6008,
      "name": "signatureExpired",
      "msg": "The signature is expired."
    }
  ],
  "types": [
    {
      "name": "ed25519RecoverInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signature",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "extraData",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "deadline",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "globalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "namespaceNonce",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lockAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "namespaceId",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "namespaceAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bot",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u64"
          },
          {
            "name": "lockedAmount",
            "type": "u64"
          },
          {
            "name": "vault",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
