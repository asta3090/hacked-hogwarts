"use strict";

document.addEventListener("DOMContentLoaded", start);

const HTML = {};
let studentJSON = [];
let allOfStudent = [];
let currentList = [];
let countsOfStudents;

const Student = {
  firstName: "",
  lastName: "",
  middleName: null,
  nickName: null,
  image: null,
  house: ""
};

//START OG HENT JSON

function start() {
  HTML.template = document.querySelector(".student-temp");
  HTML.dest = document.querySelector(".listofstudents");
  HTML.popup = document.querySelector(".popup");
  HTML.wrapper = document.querySelector(".section-wrapper");
  HTML.studentName = document.querySelector(".contentpopup>h2");

  countsOfStudents = 0;

  //ADD EVENTLISTENER TIL FILTRERING
  document.querySelector("[data-filter='Gryffindor']").addEventListener("click", filterGryffindor);
  document.querySelector("[data-filter='Hufflepuff']").addEventListener("click", filterHufflepuff);
  document.querySelector("[data-filter='Ravenclaw']").addEventListener("click", filterRavenclaw);
  document.querySelector("[data-filter='Slytherin']").addEventListener("click", filterSlytherin);
  document.querySelector("[data-filter='all']").addEventListener("click", showAll);

  //EVENTLISTENER TIL SORTING

  getJson();
  document.querySelector("select#theme").addEventListener("change", selectTheme);
}

async function getJson() {
  const jsonData = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");

  studentJSON = await jsonData.json();
  prepareObjects();
}

function selectTheme() {
  document.querySelector("body").setAttribute("data-house", this.value);
}

//POPUP
function showPopup(student) {
  console.log("showPopup");

  HTML.popup.classList.add("popup-appear");

  document.querySelector(".contentpopup").setAttribute("data-house", student.house);

  document.querySelector(".contentpopup>h3").textContent = "House: " + student.house;

  document.querySelector(".contentpopup>img").src = `images/${student.image}.png`;

  if (student.lastName == undefined) {
    HTML.studentName.textContent = student.firstName;
  } else if (student.middleName == undefined) {
    HTML.studentName.textContent = student.firstName + " " + student.lastName;
  } else {
    HTML.studentName.textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  }

  if (student.nickName != null) {
    HTML.studentName.textContent = `${student.firstName} "${student.nickName}" ${student.lastName}`;
  }

  document.querySelector(".contentpopup>h3").textContent = "House: " + student.house;
  if (student.fullName == "") {
    HTML.studentName.textContent = student.fullName + "";
  }
  document.querySelector(".close").addEventListener("click", () => {
    HTML.popup.classList.remove("popup-appear");
  });
}

//data

function prepareObjects() {
  studentJSON.forEach(cleanData);

  //KALD DIG SELV HERINDE IFT HACKING
}

function cleanData(studentData) {
  let student = Object.create(Student);

  // navn //TRIM REMOVES WHITESPACE
  let fullName = studentData.fullname.trim();
  fullName = fullName.toLowerCase();

  // første navn
  let firstletter = fullName.substring(0, 1);
  firstletter = firstletter.toUpperCase();

  student.firstName = fullName.substring(1, fullName.indexOf(" "));
  student.firstName = firstletter + student.firstName;

  // efternavn
  student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.length + 1);

  let firstletterLastName = student.lastName.substring(0, 1);
  firstletterLastName = firstletterLastName.toUpperCase();
  student.lastName = firstletterLastName + fullName.substring(fullName.lastIndexOf(" ") + 2, fullName.length + 1);

  // mellemnavn
  student.middleName = fullName.substring(student.firstName.length + 1, fullName.lastIndexOf(" "));
  let firstletterMiddle = student.middleName.substring(0, 1);
  firstletterMiddle = firstletterMiddle.toUpperCase();
  if (student.middleName == " ") {
    student.middleName = null;
  } else if (student.middleName.includes('"')) {
    firstletterMiddle = student.middleName.substring(1, 2);
    firstletterMiddle = firstletterMiddle.toUpperCase();
    student.nickName = firstletterMiddle + fullName.substring(student.firstName.length + 3, fullName.lastIndexOf(" ") - 1);
  } else {
    student.middleName = firstletterMiddle + fullName.substring(student.firstName.length + 2, fullName.lastIndexOf(" "));
  }

  if (fullName.includes(" ") == false) {
    student.firstName = fullName.substring(1);
    student.firstName = firstletter + student.firstName;

    student.middleName = null;
    student.lastName = null;
  }
  // billeder

  student.image = student.lastName + "_" + firstletter;
  student.image = student.image.toLowerCase();

  if (student.lastName == "Patil") {
    student.image = student.lastName + "_" + student.firstName;
    student.image = student.image.toLowerCase();
  } else if (student.lastName == "Finch-fletchley") {
    student.image = "fletchley_j";
  } else if (student.lastName == null) {
    student.image = null;
  }

  // hus
  student.house = studentData.house.toLowerCase();
  student.house = student.house.trim();
  let houses = student.house.substring(0, 1);
  houses = houses.toUpperCase();
  student.house = houses + student.house.substring(1);

  allOfStudent.push(student);
  showStudent(student);
}

function showStudent(student) {
  let klon = HTML.template.cloneNode(true).content;

  if (student.lastName == undefined) {
    klon.querySelector("li").textContent = student.firstName;
  } else {
    klon.querySelector("li").textContent = student.firstName + " " + student.lastName;
  }

  if (student.lastName == "") {
    klon.querySelector("li").textContent = student.firstName + " " + student.lastName;
    +"";
  }

  HTML.dest.appendChild(klon);

  HTML.dest.lastElementChild.addEventListener("click", () => {
    showPopup(student);
  });
}

//FUNCTION SOM HJÆLPER MED AT FÅ FILTRERINGEN TIL AT VIRKE

function displayList(student) {
  //Tøm listen

  document.querySelector(".listofstudents").innerHTML = "";

  //Byg nu liste

  currentList.forEach(showStudent);
}

//FILTRER

function filterGryffindor() {
  currentList = allOfStudent.filter(isGryffindor);
  displayList(currentList);
}

function filterHufflepuff() {
  currentList = allOfStudent.filter(isHufflepuff);
  displayList(currentList);
}
function filterRavenclaw() {
  currentList = allOfStudent.filter(isRavenclaw);
  displayList(currentList);
}
function filterSlytherin() {
  currentList = allOfStudent.filter(isSlytherin);
  displayList(currentList);
}
function showAll() {
  currentList = allOfStudent.filter(isAll);
  displayList(currentList);
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isAll(student) {
  return student;
}

// //SORTER

// function sortingName() {
//   const sortName = currentList.sort(compareName);
//   displayList(currentList);
// }

// function compareName(a, b) {
//   if (a.name < b.name) {
//     return -1;
//   } else if (a.name > b.name) {
//     return -1;
//   } else {
//     return 1;
//   }
// }
