/* eslint linebreak-style: ["error", "windows"] */
/* global db print */
/* eslint no-restricted-globals: "off" */

db.products.remove({});

const prodDB = [
  {
    id: 1, name: 'Pepe Jeans', price: 10, url: 'google.com', category: 'Jeans',
  },
  {
    id: 2, name: 'Denim', price: 20, url: 'youtube.com', category: 'Jeans',
  },
];

db.products.insertMany(prodDB);
const count = db.products.count();
print('Inserted', count, 'test');
db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });
db.products.createIndex({ id: 1 }, { unique: true });
