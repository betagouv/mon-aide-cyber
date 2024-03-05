const { OpenFgaClient } = require('@openfga/sdk'); // OR import { OpenFgaClient } from '@openfga/sdk';

const openFga = new OpenFgaClient({
  apiUrl: 'http://0.0.0.0:8080', // required, e.g. https://api.fga.example
});

const { id: storeId } = openFga
  .createStore({
    name: 'FGA Demo Store',
  })
  .then((value) => {
    console.log(value);
  });
