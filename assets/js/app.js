const Modal = {
    open() {
        // Abrir modal
        // Adicionar class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        // Fechar modal
        // Remover class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    },
    activeModal() {
        // Adicionar e Remover class active do modal utilizando toggle
        document
            .querySelector('.modal-overlay')
            .classList
            .toggle('active')
    } 
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50001,
        date: '23/01/2021',
    },
    {
        id: 2,
        description: 'Criação de Site',
        amount: 180000,
        date: '27/02/2021',
    },
    {
        id: 3,
        description: 'Internet',
        amount: -38639,
        date: '29/01/2021',
    },
    {
        id: 4,
        description: 'Ecommerce',
        amount: 2050000,
        date: '29/01/2021',
    }
]

const Transaction = {
    all: transactions,
    add(transaction) {
        Transaction.all.push(transaction)

        console.log(Transaction.all)
    },
    incomes() {
        let income = 0
        // Pegar tds as transações
        // para cada transação,
        Transaction.all.forEach(transaction => {
            //  se ela for maior que zero
            if(transaction.amount > 0) {
                // Somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }

        })
        
        return income;
    },
    expenses() {
        let expense = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense;
    },
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CSSClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <button type="button">
                    <svg class="svg-icon danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `

        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        
        return signal + value
    }
}

const App = {
    init() {},
    reload() {},
}

transactions.forEach(transaction => {
    DOM.addTransaction(transaction)
})

DOM.updateBalance()

Transaction.add({
    id: 5,
    description: "Almoço",
    amount: 2550,
    date: "31/01/2021"
})