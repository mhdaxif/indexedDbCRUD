var { from } = rxjs;
var { switchMap, map, filter, switchAll } = rxjs.operators;
var { openDb, deleteDb } = idb;


function database() {
  return openDb('StoreKit', 1, function (upgradeDb) {
    const CustomerStore = upgradeDb.createObjectStore('Customers', {
      keyPath: 'guid'
    });
  });

};

function addRange(table, data) {
  let databaseObs = from(database());

  let transactionObs = databaseObs.pipe(
    switchMap(db => {
      const transaction = db.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);

      if(data)
        {
          data.forEach(x => {
            store.add(x)
          })
        }

      return from(transaction.complete);
    })
  );

  return transactionObs;
}

function addOrUpdate(table, payLoad) {
  let databaseObs = from(database());

  let transactionObs = databaseObs.pipe(
    map(db => {
      const transaction = db.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);

      return from(store.put(payLoad));
    }),
    switchAll(),
    switchMap(key => {
      return getById(table, key);
    }),
  );

  return transactionObs;
}

function deleteRecord(table, id) {
  let databaseObs = from(database());

  let transactionObs = databaseObs.pipe(
    switchMap(db => {
      const transaction = db.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);

      return from(store.delete(id));
    })
  );

  return transactionObs;
}

function getById(table, id) {
  let databaseObs = from(database());

  let transactionObs = databaseObs.pipe(
    switchMap(db => {
      const transaction = db.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);

      return from(store.get(id));
    })
  );

  return transactionObs;
}

function getAll(table) {
  let databaseObs = from(database());

  let transactionObs = databaseObs.pipe(
    switchMap(db => {
      const transaction = db.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);

      return from(store.getAll());
    })
  );

  return transactionObs;
}

function search(table, searchObj) {
  let n = searchObj.name || '';
  let a = searchObj.add || '';
  let c = searchObj.city || '';
  // let others = ...

  let databaseObs = from(database());

  let transactionObs = databaseObs.pipe(
    switchMap(db => {
      const transaction = db.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);

      return from(store.getAll());
    }),
    switchAll(),
    filter(x => {
      let {name, city, add} = x.data;
      return (name.includes(n) && add.includes(a) && city.includes(c));
    })
  );

  return transactionObs;
}

