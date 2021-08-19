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
    }  
}