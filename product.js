'use strict'

const openModalProduct = () => document.getElementById('modal')
  .classList.add('active')

const closeModalProduct = () => {
  clearProductFields()
  document.getElementById('modal').classList.remove('active')
}

const getProductLocalStorage = () => JSON.parse(localStorage.getItem('db_product')) ?? []
const setProductLocalStorage = (dbProduct) => localStorage.setItem("db_product", JSON.stringify(dbProduct))

// CRUD - create read update delete
const deleteProduct = (index) => {
  const dbProduct = readProduct()
  dbProduct.splice(index, 1)
  setProductLocalStorage(dbProduct)
}

const updateProduct = (index, product) => {
  const dbProduct = readProduct()
  dbProduct[index] = product
  setProductLocalStorage(dbProduct)
}

const readProduct = () => getProductLocalStorage()

const createProduct = (product) => {
  const dbProduct = getProductLocalStorage()
  dbProduct.push(product)
  setProductLocalStorage(dbProduct)
}

const isValidProductFields = () => {
  return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearProductFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => field.value = "")
  document.getElementById('nome').dataset.index = 'new'
  document.querySelector(".modal-header>h2").textContent = 'Novo Produto'
}

const saveProduct = () => {
  if (isValidProductFields()) {
    const product = {
      nome: document.getElementById('nome').value,
      quantidade: document.getElementById('quantidade').value,
      valor: document.getElementById('valor').value
    }
    const index = document.getElementById('nome').dataset.index
    if (index == 'new') {
      createProduct(product)
      updateProductTable()
      closeModalProduct()
    } else {
      updateProduct(index, Product)
      updateProductTable()
      closePoductModal()
    }
  }
}

const createProductRow = (product, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
        <td>${product.nome}</td>
        <td>${product.quantidade}</td>
        <td>${product.valor}</td>
        <td>
        <button type="button" alt="Editar" class="button green" id="edit-${index}">Editar</button>
        <button type="button" alt="Excluir" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
  document.querySelector('#tableProduct>tbody').appendChild(newRow)
}

const clearProductTable = () => {
  const rows = document.querySelectorAll('#tableProduct>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateProductTable = () => {
  const dbProduct = readProduct()
  clearProductTable()
  dbProduct.forEach(createProductRow)
}

const fillProductFields = (product) => {
  document.getElementById('nome').value = product.nome
  document.getElementById('quantidade').value = product.quantidade
  document.getElementById('valor').value = product.valor
  document.getElementById('nome').dataset.index = product.index
}

const editProduct = (index) => {
  const product = readProduct()[index]
  product.index = index
  fillProductFields(product)
  document.querySelector(".modal-header>h2").textContent = `Editando ${product.nome}`
  openModalProduct()
}

const editDeleteProduct = (event) => {
  if (event.target.type == 'button') {

    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editProduct(index)
    } else {
      const product = readProduct()[index]
      const response = confirm(`Deseja realmente excluir o produto ${product.nome}`)
      if (response) {
        deleteProduct(index)
        updateProductTable()
      }
    }
  }
}

updateProductTable()

// Eventos
document.getElementById('cadastrarProduto')
  .addEventListener('click', openModalProduct)

document.getElementById('modalClose')
  .addEventListener('click', closeModalProduct)

document.getElementById('salvar')
  .addEventListener('click', saveProduct)

document.querySelector('#tableProduct>tbody')
  .addEventListener('click', editDeleteProduct)

document.getElementById('cancelar')
  .addEventListener('click', closeModalProduct)
