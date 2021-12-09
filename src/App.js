import { Component } from 'react';
import { Table, Button } from 'reactstrap';
import {Modal,ModalHeader,ModalBody,FormGroup,Label,Input,ModalFooter} from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';

class App extends Component {
  //the state of the app
  state= {
    books: [
      {id: uuidv4(),name: 'The Kingkiller Chronicle', isbm:'5435-54',quantity: '4', price:'14.99', isBorrowed: false, remainingDays: 14},
      {id: uuidv4(),name: 'Jane Eyre', isbm:'643543-21',quantity: '2', price:'19.99', isBorrowed: false, remainingDays: -3}
    ],
    newBookModal: false,
    editBookModal: false,
    newBookData: {
      id: '',
      name: '',
      isbm: '',
      quantity:'',
      price: '',
      isBorrowed: false,
      remainingDays: 14
    },
    editBookData: {
      id: '',
      name: '',
      isbm: '',
      quantity:'',
      price: ''
    }
  }

  //function for opening a new book modal
  openNewBookModal() {
    this.setState({
      newBookModal: !this.state.newBookModal//the opposite of the state
    });
  }

  //function for opening a edit book modal
  openEditBookModal() {
    this.setState({
      editBookModal: !this.state.editBookModal//the opposite of the state
    });
  }

  //function for adding a new book
  addBook () {
    let { books } = this.state;
    
    books.push(this.state.newBookData);

    this.setState({ books, newBookModal: false, newBookData: {
      id: uuidv4(),
      name: '',
      isbm: '',
      quantity:'',
      price: '',
      isBorrowed: false
    }});
  }

  //function for getting the data for the editing
  editBook(id,name,isbm, quantity,price) {
    this.setState({
      editBookData: {id, name, isbm,quantity, price }, editBookModal: !this.state.editBookModal
    });
  }

  //function that updates the book
  updateBook(bookId) {
    let { id, name, isbm, quantity, price } = this.state.editBookData;
    let { books } = this.state;

    this.state.books.map(book => {
      if (bookId === book.id) {
        book.id = id;
        book.name = name;
        book.isbm = isbm;
        book.quantity = quantity;
        book.price = price;
      }
    });
    this.setState({ books, editBookModal: false, editBookData: {
      id: '',
      name: '',
      isbm: '',
      quantity:'',
      price: ''
    }});
  }

  //function that deletes a book
  deleteBook(id) {
    let books = this.state.books.filter(book => {
      return book.id !== id
    })
    this.setState({
      books: books
    })
  }

  //function for borrowing a books
  borrowBook = (id) => {
    let { books } = this.state;

    this.state.books.map(book => {
        if(book.isBorrowed === false && id === book.id) {
          book.isBorrowed = true
          book.quantity--;
          this.computePenalty(book.remainingDays, book.price)
          this.setState({books})
        } else if (book.isBorrowed === true && id === book.id) 
        {
          console.log(book)
          book.isBorrowed = false
          book.quantity++;
          this.setState({books})
        }
    });
  }
  
  computePenalty(days, price) {
    return Math.abs((0.01 * price)*days);
  }

render() {
 const renderBorrowButton = (status,bookId) => {
   if(status === false) {
     return <Button color="secondary" size="sm" onClick={this.borrowBook.bind(this,bookId)}>Borrow</Button>
   } else {
     return <Button color="secondary" size="sm" onClick={this.borrowBook.bind(this,bookId)}>Return Book</Button>
   }
 };

 const renderPenalty = (days,price) => {
   if(days < 0) {
     return <td>You should have returned the book {Math.abs(days)} ago.Penalty Applied: {this.computePenalty(days,price)} dollars</td>
   } else {
     return <td>You have {days} left to return the book.</td>
   }
 }
  //iterate over all the books from the state
  let books = this.state.books.map((book) => {
    return (
      <tr key={book.id}>
              <td>{book.name}</td>
              <td>{book.isbm}</td>
              <td>{book.quantity}</td>
              <td>{book.price}$</td>
              <td>
              <Button color="primary" size="sm" className="mr-2" 
              onClick={this.editBook.bind(this,book.id,book.name,book.isbm,book.quantity,book.price)}>
              Edit
              </Button>
              <Button color="danger" size="sm" className="mr-2"
              onClick={this.deleteBook.bind(this,book.id)}>
                Delete
              </Button>
              {renderBorrowButton(book.isBorrowed,book.id)}
              </td>
              {book.isBorrowed
              ? <td>{renderPenalty(book.remainingDays,book.price)}</td>
              : <td>Available</td>
               }
            </tr>
    )
  });

  return (
    <div className="App container">
      <Button className="my-3" color="primary" onClick={this.openNewBookModal.bind(this)}>Add New Book</Button>
<Modal isOpen={this.state.newBookModal} toggle={this.openNewBookModal.bind(this)}>
  <ModalHeader toggle={this.openNewBookModal.bind(this)}>Add a new book</ModalHeader>
  <ModalBody>
    <FormGroup>
      <Label for="title">Title</Label>
      <Input id="title" value={this.state.newBookData.name}  onChange={(e) => {
        let { newBookData } = this.state;

        newBookData.name = e.target.value;

        this.setState({ newBookData });
      }} />
    </FormGroup>

    <FormGroup>
      <Label for="isbm">ISBM</Label>
      <Input id="isbm" value={this.state.newBookData.isbm}  onChange={(e) => {
        let { newBookData } = this.state;

        if (e.target.value === '' || e.target.value.match(/^\d{1,}(\-\d{0,2})?$/)) {
          newBookData.isbm = e.target.value;
        }

        this.setState({ newBookData });
      }} />
    </FormGroup>

    <FormGroup>
      <Label for="quantity">Quantity</Label>
      <Input id="quantity" value={this.state.newBookData.quantity}  onChange={(e) => {
        let { newBookData } = this.state;

        if (e.target.value === '' || e.target.value.match(/^\d{1,9}?$/)) {
          newBookData.quantity = e.target.value;
        }

        this.setState({ newBookData });
      }} />
    </FormGroup>

    <FormGroup>
      <Label for="price">Price</Label>
      <Input id="price" value={this.state.newBookData.price}  onChange={(e) => {
        let { newBookData } = this.state;
        if (e.target.value === '' || e.target.value.match(/^\d{1,}(\.\d{0,2})?$/)) {
          newBookData.price = e.target.value;
        }

        this.setState({ newBookData });
      }} />
    </FormGroup>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
    <Button color="secondary" onClick={this.openNewBookModal.bind(this)}>Cancel</Button>
  </ModalFooter>
</Modal>

<Modal isOpen={this.state.editBookModal} toggle={this.openEditBookModal.bind(this)}>
  <ModalHeader toggle={this.openEditBookModal.bind(this)}>Edit a new book</ModalHeader>
  <ModalBody>
    <FormGroup>
      <Label for="title">Title</Label>
      <Input id="title" value={this.state.editBookData.name}  onChange={(e) => {
        let { editBookData } = this.state;

        editBookData.name = e.target.value;

        this.setState({ editBookData });
      }} />
    </FormGroup>

    <FormGroup>
      <Label for="isbm">ISBM</Label>
      <Input id="isbm" value={this.state.editBookData.isbm}  onChange={(e) => {
        let { editBookData } = this.state;

        if (e.target.value === '' || e.target.value.match(/^\d{1,}(\-\d{0,2})?$/)) {
          editBookData.isbm = e.target.value;
        }

        this.setState({ editBookData });
      }} />
    </FormGroup>

    <FormGroup>
      <Label for="quantity">Quantity</Label>
      <Input id="quantity" value={this.state.editBookData.quantity}  onChange={(e) => {
        let { editBookData } = this.state;

        if (e.target.value === '' || e.target.value.match(/^\d{1,9}?$/)) {
          editBookData.quantity = e.target.value;
        }

        this.setState({ editBookData });
      }} />
    </FormGroup>

    <FormGroup>
      <Label for="price">Price</Label>
      <Input id="price" value={this.state.editBookData.price}  onChange={(e) => {
        let { editBookData } = this.state;
        if (e.target.value === '' || e.target.value.match(/^\d{1,}(\.\d{0,2})?$/)) {
          editBookData.price = e.target.value;
        }

        this.setState({ editBookData });
      }} />
    </FormGroup>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={this.updateBook.bind(this,this.state.editBookData.id)}>Update Book</Button>{' '}
    <Button color="secondary" onClick={this.openEditBookModal.bind(this)}>Cancel</Button>
  </ModalFooter>
</Modal>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books}
          </tbody>
        </Table>
    </div>
    );
    }
}

export default App;
