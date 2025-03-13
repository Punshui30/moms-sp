import { create } from 'zustand';
import Web3 from 'web3';
import { ethers } from 'ethers';

interface Web3Store {
  web3: Web3 | null;
  provider: any;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  connected: boolean;
  error: string | null;
  transactions: Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
  }>;
  initializeWeb3: () => Promise<void>;
  disconnect: () => void;
  monitorPayment: (address: string, amount: string) => Promise<boolean>;
  addTransaction: (tx: any) => void;
}

export const useWeb3Store = create<Web3Store>((set, get) => ({
  web3: null,
  provider: null,
  account: null,
  chainId: null,
  balance: null,
  connected: false,
  error: null,
  transactions: [],

  initializeWeb3: async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        const provider = window.ethereum;
        const web3 = new Web3(provider);

        // Request account access
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const chainId = await provider.request({ method: 'eth_chainId' });
        const balance = await web3.eth.getBalance(accounts[0]);

        set({
          web3,
          provider,
          account: accounts[0],
          chainId: parseInt(chainId, 16),
          balance: web3.utils.fromWei(balance, 'ether'),
          connected: true,
          error: null
        });

        // Setup event listeners
        provider.on('accountsChanged', (newAccounts: string[]) => {
          set({ account: newAccounts[0] });
        });

        provider.on('chainChanged', (newChainId: string) => {
          set({ chainId: parseInt(newChainId, 16) });
        });

        provider.on('disconnect', () => {
          get().disconnect();
        });
      } else {
        throw new Error('Please install MetaMask');
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  disconnect: () => {
    const { provider } = get();
    if (provider) {
      provider.removeAllListeners();
    }
    set({
      web3: null,
      provider: null,
      account: null,
      chainId: null,
      balance: null,
      connected: false
    });
  },

  monitorPayment: async (address: string, expectedAmount: string) => {
    const { web3 } = get();
    if (!web3) return false;

    return new Promise((resolve) => {
      const subscription = web3.eth.subscribe('pendingTransactions')
        .on('data', async (txHash) => {
          try {
            const tx = await web3.eth.getTransaction(txHash);
            if (
              tx &&
              tx.to?.toLowerCase() === address.toLowerCase() &&
              web3.utils.fromWei(tx.value, 'ether') === expectedAmount
            ) {
              subscription.unsubscribe();
              get().addTransaction({
                hash: txHash,
                from: tx.from,
                to: tx.to,
                value: web3.utils.fromWei(tx.value, 'ether'),
                timestamp: Date.now()
              });
              resolve(true);
            }
          } catch (error) {
            console.error('Error monitoring transaction:', error);
          }
        });

      // Timeout after 30 minutes
      setTimeout(() => {
        subscription.unsubscribe();
        resolve(false);
      }, 30 * 60 * 1000);
    });
  },

  addTransaction: (tx) => {
    set((state) => ({
      transactions: [...state.transactions, tx]
    }));
  }
}));