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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("items:transactions")) || []
    }, 
    set(transactions) {
        localStorage.setItem("items:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get() ,
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <button onclick="Transaction.remove(${index})" type="button">
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
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatDate(date) {
        const splittedDate = date.split("-")
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatAmount(value) {
        value = value * 100
        
        return Math.round(value)
    },
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
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()        

        Storage.set(Transaction.all)        
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    validateFields() {
        const {description, amount, date} = Form.getValues()
        
        if(description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
            }
    },
    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
    },
    saveTransaction(transaction) {
        Transaction.add(transaction)
    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()        

        try {
            // Verificar se campos estão preenchidas - Valida dados
            Form.validateFields()
            // Formatar os dados para salvar
            const transaction = Form.formatValues()
            // Salvar
            Form.saveTransaction(transaction)
            // Ao invés de um novo metodo, tambem poderia ser Transaction.add(transaction)

            // Limpar os dados do formulario
            Form.clearFields()
            // Fechar o modal
            setTimeout(() => {
                Modal.activeModal()
            }, 100)
            // Atualizar aplicação
            //App.reload() não necessário pois esta sendo invocado dentro da Transaction.add()
        } catch (error) {            
            alert(error.message)
        }        
    }
}

App.init()