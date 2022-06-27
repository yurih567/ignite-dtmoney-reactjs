import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { api } from '../services/api'

interface TransactionsProviderProps {
  children: ReactNode | ReactNode[]
}

interface Transaction {
  id: number
  title: string
  type: 'deposit' | 'withdraw'
  category: string
  amount: number
  createdAt: string
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsContextData {
  transactions: Transaction[]
  createTransaction: (transaction: TransactionInput) => Promise<void>
}

const initialState: TransactionsContextData = {
  transactions: [],
  createTransaction: async (transaction: TransactionInput) => {},
}

const TransactionsContext = createContext<TransactionsContextData>(initialState)

export const TransactionsProvider = ({
  children,
}: TransactionsProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api
      .get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, [])

  const createTransaction = useCallback(
    async (transactionInput: TransactionInput) => {
      const response = await api.post('/transactions', transactionInput)
      setTransactions(state => [...state, response.data.transaction])
    },
    [],
  )

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export const useTransactions = () => {
  const context = useContext(TransactionsContext)

  return context
}
