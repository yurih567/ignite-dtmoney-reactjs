import { createRoot } from 'react-dom/client'
import { createServer, Model } from 'miragejs'

import { App } from './App'

createServer({
  models: {
    transaction: Model,
  },

  seeds(server) {
    server.db.loadData({
      transactions: [
        {
          id: 1,
          title: 'Desenvolvimento de website',
          type: 'deposit',
          category: 'Desenvolvimento',
          amount: 6000,
          createdAt: new Date('2022-06-25 12:00:00'),
        },
        {
          id: 2,
          title: 'Compra de lanche',
          type: 'withdraw',
          category: 'Comida',
          amount: -500,
          createdAt: new Date('2022-06-26 19:30:00'),
        },
      ],
    })
  },

  routes() {
    this.namespace = 'api'

    this.get('/transactions', () => {
      return this.schema.all('transaction')
    })

    this.post('/transactions', (schema, request) => {
      const data = JSON.parse(request.requestBody)

      return schema.create('transaction', { ...data, createdAt: new Date() })
    })
  },
})

createRoot(document.getElementById('root')!).render(<App />)
