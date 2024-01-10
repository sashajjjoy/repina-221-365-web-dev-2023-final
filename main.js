'use strict'
// Максимальное количество записей,расположенных на одной странице равно 10 – для маршрутов и 5 – для заявок
//Репина Александра Денисовна, ваш ключ для доступа к API: 85edf5b1-45a5-4799-8a73-a694b53e3228

const API_KEY = '85edf5b1-45a5-4799-8a73-a694b53e3228';
const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';

let routesData;
let filteredRoutes;
  
const itemsPerPage = 5;
let currentPage = 1;

window.onload = function() {
  document.getElementById('submit_btn').onclick = SubmitOrder;
  document.getElementById('guide-input-expfrom').oninput = guideOptions;
  document.getElementById('guide-input-expto').oninput = guideOptions;
  document.getElementById('select_language').onchange = guideOptions;
  document.getElementById('excursion_start_time').onchange = change_price_of_excursion
  document.getElementById('excursionDuration').onchange = change_price_of_excursion
  document.getElementById('excursionDate').onchange = change_price_of_excursion
  document.getElementById('groupSize').onchange = change_price_of_excursion
  document.getElementById('additionalOption1').onchange = change_price_of_excursion
  document.getElementById('additionalOption2').onchange = change_price_of_excursion

  const table = document.querySelector('.table');
  table.addEventListener('click', clickHandler);
  fetchRoutesFromApi();
}

function displaySuccessNotification(message) {
  // Отображение уведомления об успешном действии
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', 'alert-success');
  alertDiv.role = 'alert';
  alertDiv.textContent = message;
}

function displayErrorNotification(message) {
  // Отображение уведомления об ошибке
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', 'alert-danger');
  alertDiv.role = 'alert';
  alertDiv.textContent = message;
}

async function SubmitOrder()
{
  const data = {
  guide_id: 1,
  route_id: 1,
  totalCost: document.getElementById('totalCost').value,
  excursion_start_time :document.getElementById('excursion_start_time').value,
  excursionDate : document.getElementById('excursionDate').value,
  excursionDuration : document.getElementById('excursionDuration').value,
  groupSize: document.getElementById('groupSize').value,
  guidecost : document.getElementById('guidecost').value,
  IsdiscountForPensioners :document.getElementById('additionalOption1').checked ? 1 : 0,
  IsthematicSouvenirs : document.getElementById('additionalOption2').checked ? 1 : 0,
    };

  const formData = new FormData();
  for (const key in data) {
      formData.append(key, data[key]);
  }
  
  try {
    const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${API_KEY}`, {
        method: "POST",
        body: formData
    });
    const data = await response.json();
    if (data && typeof data === 'object') {
      displaySuccessNotification(`Вы успешно оформили заявку! ID вашей заявки: ${data.id}`);
      alert(отправлено)
    }
    

} catch (error) {
    console.error('Ошибка:', error);
}
}

//Счет цены- это понятно, но со временем и датой непонятно
function calculatePrice(guideServiceCost, hoursNumber, StartTime, DateOfExcurison, numberOfVisitors, IsdiscountForPensioners, IsthematicSouvenirs) {
  // Рассчет основной стоимости
   let DayOffs =["01-01", "01-02", "01-03", "01-04", "01-05", "01-06", "01-07", "01-08", "02-23", "03-08", "05-01", "05-09", "06-12", "11-04"]
   console.log(DateOfExcurison)
   const  Coef_DayOff = 1.5;
   const Coef_discountForPensioners = 500;
   const Coef_thematicSouvenirs= 0.75;
   console.log("StartTime "+StartTime);
   console.log("StartTime slice "+StartTime.slice(0,-3));
   let start_hour = StartTime.slice(0,-3);

  //let price = guideServiceCost * hoursNumber * isThisDayOff + isItMorning + isItEvening + (numberOfVisitors * 1000);

    let price = guideServiceCost
     price = price * hoursNumber;
     console.log("start h"+start_hour);
      if (start_hour >= 9 && start_hour <= 12) {
    
        price += 400;
      }

      else if (start_hour >= 20 && start_hour <= 23) {
        price += 1000;
      }
      let DateOfExcurisonDateFormat = new Date(DateOfExcurison) 
      console.log(DateOfExcurisonDateFormat.getDay())
      console.log(DateOfExcurison.slice(5))
      if (DateOfExcurisonDateFormat.getDay()==0 || DateOfExcurisonDateFormat.getDay()==6 || DayOffs.includes(DateOfExcurison.slice(5))) {
        price *= 1.5;
      } 
      console.log("numberOfVisitors"+numberOfVisitors);
      if (numberOfVisitors >= 1 && numberOfVisitors <= 5) {
        price += 0;
      } 
      else if (numberOfVisitors >= 5 && numberOfVisitors <= 10) {
        price += 1000;
      }
      else if (numberOfVisitors > 10 && numberOfVisitors <= 20) {
        price += 1500;
      }

      if (IsdiscountForPensioners) {
        price *= Coef_thematicSouvenirs;
      }

      if (IsthematicSouvenirs) {
        price += (numberOfVisitors * Coef_discountForPensioners);
      }

  return Math.round(price);
}

function clearFormFields() {
  // Очистка полей формы после успешного создания заявки
  document.getElementById('excursionDate').value = '';
  document.getElementById('excursionTime').value = '';
  document.getElementById('excursionDuration').value = '1';
  document.getElementById('groupSize').value = '1';
  document.getElementById('additionalOption1').checked = false;
  document.getElementById('additionalOption2').checked = false;
  document.getElementById('totalCost').value = '';
}




  // Отображение модального окна
 // Найти кнопку, по которой будет открываться модальное окно

// Назначить обработчик события по клику на кнопку

function show_model_window(guide_name, guide_cost)
{
  // Найти модальное окно
  var modal = document.querySelector('#requestModal');
  // Отобразить модальное окно
  let routeNameInput = document.getElementById('guideName');
  let guidecost = document.getElementById('guidecost');
  routeNameInput.value = guide_name
  guidecost.value = guide_cost
 $(modal).modal('show');
}



function fill_routeName_in_model_window(route_name)
{

  let routeNameInput = document.getElementById('routeName');
  routeNameInput.value = route_name;

}

function change_price_of_excursion()
{
  let totalCost = document.getElementById('totalCost')
  let excursion_start_time = document.getElementById('excursion_start_time').value
  let excursionDate = document.getElementById('excursionDate').value 
  let excursionDuration =  document.getElementById('excursionDuration').value
  let groupSize = document.getElementById('groupSize').value
  let guidecost = document.getElementById('guidecost').value
  let IsdiscountForPensioners = document.getElementById('additionalOption1').checked
  let IsthematicSouvenirs = document.getElementById('additionalOption2').checked

  console.log(excursion_start_time)
  console.log(excursionDate)
  console.log(excursionDuration)
  console.log(groupSize)
  console.log(additionalOption1)
  console.log(additionalOption2)
  console.log(guidecost)

  if(excursion_start_time!= 0 && excursionDuration!= 0 && 20 >= groupSize>= 1)
  {
    totalCost.value = calculatePrice(guidecost,excursionDuration,excursion_start_time,excursionDate,groupSize,IsdiscountForPensioners,IsthematicSouvenirs)
  }
}
//заполнение таблицы гидов

  
function fetchRoutesFromApi() {
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        routesData = data;
        updateTable();
      })
      .catch(error => console.error('Error fetching route data:', error));
      
  }
  
function updateTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRoutes = filteredRoutes ? filteredRoutes.slice(startIndex, endIndex) : routesData.slice(startIndex, endIndex); 
    clearTable();
    addRoutesToTable(currentRoutes);
    updatePagination();
    
    const searchKeyword = document.getElementById('routeNameInput').value.toLowerCase();
    if (searchKeyword) {
      highlightSearchResult(searchKeyword);
    }
}
  
function searchRoutes() {
    const searchKeyword = document.getElementById('routeNameInput').value.toLowerCase();
    const selectedObject = document.getElementById('mainObjectSelect').value.toLowerCase();
  
    filteredRoutes = routesData.filter(route => 
        route.name.toLowerCase().includes(searchKeyword) &&
        route.mainObject.toLowerCase().includes(selectedObject)
    );
  
    const limitedRoutes = filteredRoutes.slice(0, itemsPerPage);
  
    clearTable();
    addRoutesToTable(limitedRoutes);
    updatePaginationAfterSearch(filteredRoutes);
    highlightSearchResult(searchKeyword);
}
  
function resetSearch() {
    document.getElementById('routeNameInput').value = '';
    document.getElementById('mainObjectSelect').value = '';
    filteredRoutes = null;
    updateTable();
}
  
function clearTable() {
    const tableBody = document.getElementById('routesTableBody');
    tableBody.innerHTML = '';
}
function addRoutesToTable(routes) {
    const tableBody = document.getElementById('routesTableBody');
    routes.forEach(route => {
      const row = tableBody.insertRow();
      row.insertCell(0).innerHTML = route.name;
      row.insertCell(1).innerHTML = route.description;
      row.insertCell(2).innerHTML = route.mainObject;
  
      const selectButton = document.createElement('button');
      selectButton.innerText = 'Выбрать';
      selectButton.classList.add('btn'); // добавляем классы для стилизации кнопки
      selectButton.type = 'button';
      selectButton.setAttribute('data-toggle', 'collapse');
      selectButton.setAttribute('data-target', '#selectedRouteGuides');
      selectButton.setAttribute('aria-expanded', 'false');
      selectButton.setAttribute('aria-controls', 'selectedRouteGuides');
      selectButton.addEventListener('click', () => guideDownload(route.id));
      selectButton.addEventListener('click', () => fill_routeName_in_model_window(route.name));
      row.insertCell(3).appendChild(selectButton);

      
    });
}
  
function updatePagination() {
    const paginationElement = document.getElementById('pagination');
    const totalPages = Math.ceil((filteredRoutes ? filteredRoutes.length : routesData.length) / itemsPerPage);
  
    paginationElement.innerHTML = '';
  
    const prevItem = createPaginationItem('Previous', currentPage - 1);
    paginationElement.appendChild(prevItem);
  
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = createPaginationItem(i, i);
      paginationElement.appendChild(pageItem);
    }
  
    const nextItem = createPaginationItem('Next', currentPage + 1);
    paginationElement.appendChild(nextItem);
}
  
function createPaginationItem(text, pageNumber) {
    const pageItem = document.createElement('li');
    pageItem.className = 'page-item';
  
    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = 'javascript:void(0)';
    pageLink.innerText = text;
  
    if ((text === 'Previous' && currentPage === 1) || (text === 'Next' && currentPage === Math.ceil((filteredRoutes ? filteredRoutes.length : routesData.length) / itemsPerPage))) {
        pageItem.classList.add('disabled');
        pageLink.addEventListener('click', (e) => {
        e.preventDefault();
        handlePageClick(pageNumber);
      });
    } else {
      pageLink.addEventListener('click', () => handlePageClick(pageNumber));
    }
  
    if (pageNumber === currentPage) {
      pageItem.classList.add('active');
    }
  
    pageItem.appendChild(pageLink);
  
    return pageItem;
}
  
function updatePaginationAfterSearch(filteredRoutes) {
    const paginationElement = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  
    paginationElement.innerHTML = '';
  
    const prevItem = createPaginationItem('Previous', currentPage - 1);
    paginationElement.appendChild(prevItem);
  
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = createPaginationItem(i, i);
      paginationElement.appendChild(pageItem);
    }
  
    const nextItem = createPaginationItem('Next', currentPage + 1);
    paginationElement.appendChild(nextItem);
}
  
function handlePageClick(pageNumber) {
    currentPage = pageNumber;
    updateTable();
  }
  
function highlightSearchResult(searchKeyword) {
    const tableBody = document.getElementById('routesTableBody');
    const rows = tableBody.getElementsByTagName('tr');
  
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const nameCell = cells[0];

        const cellValue = nameCell.innerText;

        const lowerCaseCellValue = cellValue.toLowerCase();
        const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
  
        if (lowerCaseCellValue.includes(lowerCaseSearchKeyword)) {
            const startIndex = lowerCaseCellValue.indexOf(lowerCaseSearchKeyword);
            const endIndex = startIndex + searchKeyword.length;
  
            const highlightedText = cellValue.substring(0, startIndex) +
          `<span class="search-highlight">${cellValue.substring(startIndex, endIndex)}</span>` +
            cellValue.substring(endIndex);
  
            nameCell.innerHTML = highlightedText;
        }
    }
}

function guideDownload(id) {
    let guideTable = document.querySelector('.guide-table');
    let arroption = [];
    fetch (`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(response => {
        arroption = [];
        console.log(response);
        removeOptions(document.getElementById('select_language'));
        guideTable.innerHTML = '';
        for (let i in response) {
            console.log(i, 'id guid')
            let row = document.createElement("tr");
            console.log(response[i].name)
            row.innerHTML = `
            <th scope="col" id = "${response[i].name}" name = "${i}"><img src="pic.jpg"></th>
            <th scope="col" id = "${response[i].name}" name = "${i}">${response[i].name}</th>
            <th scope="col" id = "${response[i].name}" name = "${i}">${response[i].language}</th>
            <th scope="col" id = "${response[i].name}" name = "${i}">${response[i].workExperience}</th>
            <th scope="col" id = "${response[i].name}" name = "${i}">${response[i].pricePerHour}</th>
            <th scope="col" id = "${response[i].name}" name = "${i}">
            <button type="button" id = "guide_btn" name ="${response[i].name}" value = "${response[i].pricePerHour}"  class="btn " data-toggle="modal" data-target="#requestModal">Выбрать</button></th> 
            `; //  в последнее значение класса, где кнопка, надо будет сунуть свое значение стиля))
            if ((document.getElementById('guide-input-expfrom').value != '' &&
            document.getElementById('guide-input-expfrom').value > response[i].workExperience) ||
            (document.getElementById('guide-input-expto').value != '' &&
            document.getElementById('guide-input-expto').value < response[i].workExperience) &&
            document.getElementById('select_language').value == response[i].language) {
                row.classList.add("d-none");
            }
            guideTable.append(row);
            arroption.push(response[i].language);
        }
        let guide_buttons = document.querySelectorAll('#guide_btn');

        for(let i = 0; i< guide_buttons.length; i++){
          guide_buttons[i].addEventListener('click', () => show_model_window(guide_buttons[i].name, guide_buttons[i].value))
        }
        
        console.log(arroption);
        createselect(getoptionforselect(arroption));
        });
        
}

function guideOptions() {
    let list = document.querySelectorAll('.guide-table tr');
    let from = Number(document.getElementById('guide-input-expfrom').value);
    let to = Number(document.getElementById('guide-input-expto').value);
    for (let i in list) {
      if ((from == 0 || from <= list[i].cells[3].innerHTML) &&
        (to == 0 || to >= list[i].cells[3].innerHTML) &&
        (document.getElementById('select_language').options[document.getElementById('select_language').selectedIndex].innerHTML == 'Язык экскурсии' ||
        document.getElementById('select_language').options[document.getElementById('select_language').selectedIndex].innerHTML == list[i].cells[2].innerHTML))
        {
            list[i].classList.remove("d-none");
        }else{
            list[i].classList.add("d-none");
        }
        console.log(list[i].cells[2].innerHTML);
    }
}

function getoptionforselect(q){
    return [... new Set(q)];    
}

function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
    const selects = document.getElementById('select_language');
    let option = document.createElement('option');
    option.value = "";
    option.innerHTML = "Язык экскурсии";
    selects.appendChild(option);
}  

function createselect(arr){
    const select = document.getElementById('select_language');
    for(let i in arr){
        console.log(arr[i]);
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = arr[i];
        select.appendChild(opt);
    }  
}

function clickHandler(event) {
    const screen = document.querySelector('.screen');
    const target = event.target;
    const row = document.querySelectorAll('th');
    let idd = 0;
    if (target.classList.contains('choose')) {
        for(let i = 6; i< row.length; i++){
            if(target.id == row[i].id){
                row[i].classList.add('table-success');
                idd = row[i].getAttribute('name')
            }
            else{
                row[i].classList.remove('table-success');
            }
        }   
        getIDguide(idd);
    } 
}
function getIDguide(id){
    console.log(id)
    return id
}
