import { FormEvent, useCallback, useContext, useState } from 'react'
import Modal from 'react-modal'

import closeImg from '../../assets/close.svg'
import incomeImg from '../../assets/income.svg'
import outcomeImg from '../../assets/outcome.svg'
import { useTransactions } from '../../hooks/useTransactions'

import { Container, RadioBox, TransactionTypeContainer } from './styles'

interface NewTransactionModalProps {
  isOpen: boolean
  onRequestClose: () => void
}

export const NewTransactionModal = ({
  isOpen,
  onRequestClose,
}: NewTransactionModalProps) => {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0)
  const [type, setType] = useState<'deposit' | 'withdraw'>('deposit')
  const [category, setCategory] = useState('')

  const { createTransaction } = useTransactions()

  const handleCreateNewTransaction = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    const multiplier = type === 'deposit' ? 1 : -1
    await createTransaction({
      title,
      amount: amount * multiplier,
      type,
      category,
    })

    setTitle('')
    setCategory('')
    setType('deposit')
    setAmount(0)
    onRequestClose()
  }, [title, amount, type, category])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button
        type="button"
        className="react-modal-close"
        onClick={onRequestClose}
      >
        <img src={closeImg} alt="Fechar modal" />
      </button>

      <Container onSubmit={handleCreateNewTransaction}>
        <h2>Cadastrar transação</h2>

        <input
          value={title}
          placeholder="Título"
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          value={amount}
          type="number"
          onChange={e => setAmount(Number(e.target.value))}
          placeholder="Valor"
          required
        />

        <TransactionTypeContainer>
          <RadioBox
            type="button"
            activeColor="green"
            isActive={type === 'deposit'}
            onClick={() => setType('deposit')}
          >
            <img src={incomeImg} alt="Entrada" />
            <span>Entrada</span>
          </RadioBox>

          <RadioBox
            type="button"
            activeColor="red"
            isActive={type === 'withdraw'}
            onClick={() => setType('withdraw')}
          >
            <img src={outcomeImg} alt="Saída" />
            <span>Saída</span>
          </RadioBox>
        </TransactionTypeContainer>

        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Categoria"
        />

        <button type="submit">Cadastrar</button>
      </Container>
    </Modal>
  )
}
