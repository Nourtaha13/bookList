class Book{
    constructor(title, author, isbn){
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

class UI{
    static displayBooks(){
        
        const Books = Store.getBooks()

        Books.forEach((book)=> UI.addBookToList(book))

    }

    static addBookToList(book){
        const list = document.querySelector("#book-list")
        const row = document.createElement("tr")
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="button is-danger px-0 py-4 icon delete-row">X</a></td>
        `
        list.appendChild(row)
    }
    static deleteBook(el){
        if(el.classList.contains("delete-row")){
            el.parentElement.parentElement.remove()
        }
    }
    static showAlert(message, className){
        const div = document.createElement("div")
        div.classList = `notification py-2 px-5 my-5 is-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector(".container")
        const form = document.querySelector("#book-form")
        container.insertBefore(div,form)
        setTimeout(()=> document.querySelector(".notification").remove(),2000 )
    }
    static clearFields(){
        document.querySelector("#title").value = ""
        document.querySelector("#auth").value = ""
        document.querySelector("#isbn").value = ""
    }

}

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem("books") === null){
            books = []
        }else{
            books = JSON.parse(localStorage.getItem("books"))
        }
        return books
    }

    static addBook(book){
        const books = this.getBooks()
        books.push(book)
        localStorage.setItem("books", JSON.stringify(books))
    }
    static removeBook(isbn){
        const books = this.getBooks()
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        })
        localStorage.setItem("books", JSON.stringify(books))
    }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks)



document.querySelector("#book-form").addEventListener("submit",(e)=>{
    e.preventDefault()
    const title = document.querySelector("#title")
    const author = document.querySelector("#auth")
    const isbn = document.querySelector("#isbn")
    var eleAll = [title,author,isbn]
    if(title.value === '' || author.value === '' || isbn.value === ''){
        var filter = eleAll.filter(el => {
            if(el.value === ""){
                el.parentElement.parentElement.querySelector(".help").innerText = "Please fill in all fields"
                el.parentElement.querySelector("input").classList.add("is-danger")
            }else{
                el.parentElement.parentElement.querySelector(".help").innerText = ""
                el.parentElement.querySelector("input").classList.remove("is-danger")
            }
        
        })
    }else{
        document.querySelectorAll(".help").forEach(el => el.innerText = "")
        eleAll.forEach(el => el.classList.remove("is-danger"))
        const book = new Book(title.value,author.value,isbn.value)
        UI.addBookToList(book)
        Store.addBook(book)
        UI.clearFields()
        UI.showAlert("Book Added", "success")
    }

})


document.querySelector("#book-list").addEventListener("click", e =>{
    UI.deleteBook(e.target)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    UI.showAlert("Book Removed", "success")
})