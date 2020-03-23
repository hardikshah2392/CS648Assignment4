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
      headers: { 'Content-Type': 'application/json' },
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

class ProductRow extends React.Component {
  render() {
    const prod = this.props.prod;
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        null,
        prod.name
      ),
      React.createElement(
        'td',
        null,
        '$',
        prod.price
      ),
      React.createElement(
        'td',
        null,
        prod.category
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: prod.url, target: '__blank' },
          'View'
        )
      )
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const prodrows = this.props.prods.map(prod => React.createElement(ProductRow, { key: prod.id, prod: prod }));
    return React.createElement(
      'table',
      { style: { borderCollapse: "collapse" } },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Product Name'
          ),
          React.createElement(
            'th',
            null,
            'Price'
          ),
          React.createElement(
            'th',
            null,
            'Category'
          ),
          React.createElement(
            'th',
            null,
            'Image'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        prodrows
      )
    );
  }
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var form = document.forms.prodAdd;
    this.props.createProd({
      name: form.name.value,
      price: form.price.value.replace("$", ""),
      category: form.category.value,
      url: form.url.value
    });
    form.name.value = '', form.price.value = "$", form.category.value = "Shirts", form.url.value = "";
  }
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('br', null),
      React.createElement(
        'h2',
        null,
        'Add a Product'
      ),
      React.createElement(
        'form',
        { name: 'prodAdd', onSubmit: this.handleSubmit },
        React.createElement(
          'lable',
          null,
          'Category'
        ),
        React.createElement(
          'label',
          null,
          'Name'
        ),
        React.createElement(
          'select',
          { name: 'category' },
          React.createElement(
            'option',
            { selected: 'selected', value: 'Shirts' },
            'Shirts'
          ),
          React.createElement(
            'option',
            { value: 'Jeans' },
            'Jeans'
          ),
          React.createElement(
            'option',
            { value: 'Jackets' },
            'Jackets'
          ),
          React.createElement(
            'option',
            { value: 'Sweaters' },
            'Sweaters'
          ),
          React.createElement(
            'option',
            { value: 'Accessories' },
            'Accessories'
          )
        ),
        React.createElement('input', { type: 'text', name: 'name' }),
        React.createElement(
          'lable',
          null,
          'Price'
        ),
        React.createElement(
          'lable',
          null,
          'Image'
        ),
        React.createElement('input', { type: 'text', name: 'price' }),
        React.createElement('input', { type: 'text', name: 'url' }),
        React.createElement(
          'button',
          null,
          'Add'
        )
      )
    );
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { prods: [] };
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
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'My Company Inventory'
      ),
      React.createElement('br', null),
      React.createElement(
        'h2',
        null,
        'Showing all available products',
        React.createElement('hr', null)
      ),
      React.createElement(ProductTable, { prods: this.state.prods }),
      React.createElement(ProductAdd, { createProd: this.createProd })
    );
  }
}

ReactDOM.render(React.createElement(ProductList, null), contentNode);