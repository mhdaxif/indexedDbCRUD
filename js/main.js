const button = document.querySelector('button#save');
const results = document.querySelector('#results');

const name = document.querySelector('input#name');
const city = document.querySelector('input#city');
const add = document.querySelector('input#add');

var { from, fromEvent, of } = rxjs;
var { switchMap, map, filter, switchAll} = rxjs.operators;


var { openDb, deleteDb } = idb;
var { config, createToast, toasts } = toastmaker;

// -------------------   --------------------


const onSaveObs = fromEvent(button, 'click');
onSaveObs.subscribe(
  _ => saveRecord(),
  _ => handleError(_)
)

async function saveRecord() {
  let customer = {
    guid: (new Date().valueOf()),
    data: {
      name: name.value,
      city: city.value,
      add: add.value
    }
  }

  if (customer.guid && customer.data.name) {
    const table = 'Customers';
    let res = await addOrUpdate(table, customer);
    res.subscribe(
      val => {
        createToast(toasts.toast({
          type: 'success',
          title: `Created`,
          text: `Record with id ${val.guid} is created successfully`,
        }));

        showAllRecords();
        name.value = null;
        city.value = null;
        add.value = null;
      },
      err => handleError(err))
  }
};

  async function showAllRecords() {
    const dbStore = 'Customers';
    let data = await getAll(dbStore);

    data.subscribe(
      data => display(data),
      err => handleError(err)
    );

  function display(data) {
    clean();
    let resultHtml = ``;

    data.forEach(cust => {
        let { name, city, add } = cust.data;
        resultHtml += ` <tr>
            <td>  ${cust.guid} </td>
            <td>  ${name}  </td>
            <td> ${city} </td>
            <td> ${add} </td>
            <td><button class="btn btn-danger" onclick="deleteRecordById(${cust.guid})">   Delelte  </button></td>
        </tr>`;
      })
      results.innerHTML = resultHtml;
  }
}

async function deleteRecordById(id) {
  const table = 'Customers';
  let res = await deleteRecord(table, id);

  res.subscribe(
    () =>  {
      createToast({
        title: "Deleted",
        text: "Record deleted successfully."
      });

      showAllRecords();
    },
    err => handleError(err)
  )
}


let loadInitiaData = async _ => {
  const table = 'Customers';
  let users = [
    {
      guid: (new Date().valueOf()+1),
      data: {
        name: "Ali",
        city: "Mardan",
        add: "Abc #1234"
      }
    },
    {
      guid: (new Date().valueOf()+2),
      data: {
        name: "Faisal",
        city: "Peshawar",
        add: "Sbt, Gt"
      }
    }
  ];

  showAllRecords();
  let initialRes = await addRange(table, users);

  let resp = await getAll(table);
  await resp.subscribe(x => {
    if(x.length > 0) return;

      initialRes.subscribe(
        data => {
          console.log(data);
          createToast({
            type: "success",
            title: "Initial data",
            text: "Loaded Initial data successfully"
          });

          showAllRecords();
        },
        err => handleError(err)
      )
  });
}


window.addEventListener('load', loadInitiaData);
