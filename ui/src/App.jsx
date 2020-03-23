var contentNode = document.getElementById('contents');

// const intialProds = [
//   {
//       id:1, name:"hardik SHah", price:10, url:"google.com", category:"Shirts"
//   },
//   {
//       id:2, name:"harsh SHah", price:10, url:"youtube.com", category:"Jeans"
//   },
// ];

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body);
    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
  }
}

class ProductRow extends React.Component{
  render() {
    const prod = this.props.prod;
    return(
      <tr>
        <td>{prod.name}</td>
        <td>${prod.price}</td>
        <td>{prod.category}</td>
        <td><a href = {prod.url} target = "__blank">View</a></td>        
      </tr>
    )
  }
}

class ProductTable extends React.Component {
  render () {
    const prodrows = this.props.prods.map(prod => <ProductRow key={prod.id} prod={prod}/>);
    return (
      <table style={{borderCollapse: "collapse"}}>
        <thead>
          <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {prodrows}
        </tbody>
      </table>
    )
  }
}


class ProductAdd extends React.Component {
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var form = document.forms.prodAdd;
    this.props.createProd({
      name: form.name.value,
      price: form.price.value.replace("$",""),
      category:form.category.value,
      url:form.url.value
    });
    form.name.value = '',form.price.value = "$", form.category.value = "Shirts", form.url.value= ""
  }
  render() {
    return (
      <div>
        <br/>
        <h2>Add a Product</h2>
        <form name="prodAdd" onSubmit={this.handleSubmit}>
        <lable>Category</lable>
        <label>Name</label>
          <select name="category">
               <option selected="selected" value="Shirts">Shirts</option>
               <option value="Jeans">Jeans</option>
               <option value="Jackets">Jackets</option>
               <option value="Sweaters">Sweaters</option>
               <option value="Accessories">Accessories</option>
          </select>
          <input type="text" name="name"/>
          <lable>Price</lable>
          <lable>Image</lable>
          <input type="text" name="price"/>
          <input type="text" name="url"/>
          <button>Add</button>
        </form>
      </div>
    )
  }
}


class ProductList extends React.Component {
  constructor (){
    super();
    this.state = {prods:[]};
    // this.createTestProd = this.createProd.bind(this);
    this.createProd = this.createProd.bind(this);
    // setTimeout(this.createTestProd.bind(this),2000);
  }
  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      prodList {
        id name price category url
      }
    }`;

    // const response = await fetch('/graphql', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json'},
    //   body: JSON.stringify({query})
    // });

    // const results = await response.json();
    // this.setState({ prods: results.data.prodList });
    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ prods: data.prodList });
    }
  }

  async createProd(prods) {
    // const newProds = this.state.prods.slice();
    // newProd.id = this.state.prods.length + 1;
    // newProds.push(newProd);
    // console.log({newProds})
    // this.setState({prods:newProds})
    const query = `mutation {
      addProd(prods:{
        name:"${prods.name}"
        category:${prods.category}
        price:${prods.price}
        url:"${prods.url}"
      }) {
        id
      }
    }`;
    // const response = await fetch('/graphql', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json'},
    //   body: JSON.stringify({ query })
    // });
    // this.loadData();
    const data = await graphQLFetch(query, { prods });
    if (data) {
      this.loadData();
    }
  }

  // createTestProd(){
  //   this.createProd({
  //     name:"Deepesh", price:20,category:"Accesories",url:"wikipedia.com"
  //   });
  // }
  render(){
  return (
    <div>
      <h1>My Company Inventory</h1><br/>
      <h2>Showing all available products<hr/></h2>
      <ProductTable prods = { this.state.prods }/>
      <ProductAdd createProd = {this.createProd}/>
    </div>
  )
  }
}


ReactDOM.render(<ProductList />, contentNode);