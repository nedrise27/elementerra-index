import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OpenPackAccounts {
  associatedTokenProgram: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  slots: PublicKey
  authority: PublicKey
  programSigner: PublicKey
  season: PublicKey
  player: PublicKey
  packMetaplexMetadataAccount: PublicKey
  packNftMint: PublicKey
  packNftToken: PublicKey
  crystalMetaplexMetadataAccount: PublicKey
  crystalNftMint: PublicKey
  crystalNftToken: PublicKey
  crystalNftEdition: PublicKey
  crystalCollectionMint: PublicKey
  crystalCollectionMetadata: PublicKey
  crystalCollectionMasterEdition: PublicKey
  metaplexTokenMetadataProgram: PublicKey
}

export function openPack(
  accounts: OpenPackAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.slots, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.programSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.season, isSigner: false, isWritable: true },
    { pubkey: accounts.player, isSigner: false, isWritable: true },
    {
      pubkey: accounts.packMetaplexMetadataAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.packNftMint, isSigner: false, isWritable: true },
    { pubkey: accounts.packNftToken, isSigner: false, isWritable: true },
    {
      pubkey: accounts.crystalMetaplexMetadataAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.crystalNftMint, isSigner: true, isWritable: true },
    { pubkey: accounts.crystalNftToken, isSigner: false, isWritable: true },
    { pubkey: accounts.crystalNftEdition, isSigner: false, isWritable: true },
    {
      pubkey: accounts.crystalCollectionMint,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: accounts.crystalCollectionMetadata,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.crystalCollectionMasterEdition,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.metaplexTokenMetadataProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([75, 203, 144, 65, 63, 253, 103, 85])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
