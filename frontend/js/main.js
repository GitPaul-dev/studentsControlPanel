(async () => {
  let studentsArr = await getStudentsList();
  const firstStudyMonth = 8;
  const lastCourse = 4;

  class Student {
    constructor(surname, name, lastname, birthday, studyStart, faculty) {
      this.surname = surname;
      this.name = name;
      this.lastname = lastname;
      this.birthday = birthday;
      this.studyStart = studyStart;
      this.faculty = faculty;
    }
  }

  async function addStudentToServer(student) {
    const response = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      body: JSON.stringify(student),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const savedStudent = await response.json();
    return savedStudent;
  }

  async function getStudentsList() {
    const response = await fetch('http://localhost:3000/api/students');
    const studentsList = await response.json();
    return studentsList;
  }

  async function deleteStudentFromServ(student) {
    await fetch(`http://localhost:3000/api/students/${student.id}`, {
      method: 'DELETE',
    });
  }

  function createStudentsList(arr) {
    tableBody.innerHTML = '';

    arr.forEach(student => {
      renderStudent(student);
    });
  }

  function changeLettersCase(string) {
    firstLetter = string[0].toUpperCase();
    string = firstLetter + string.slice(1).toLowerCase();
    return string;
  }

  const tableBody = document.getElementById('tbody');

  const today = new Date();

  function renderStudent(student) {
    const tableStr = document.createElement('tr');

    const fullName = document.createElement('td');
    student.fullName = `${changeLettersCase(student.surname)} ${changeLettersCase(student.name)} ${changeLettersCase(student.lastname)}`;
    fullName.textContent = student.fullName;

    const faculty = document.createElement('td');
    faculty.textContent = `${changeLettersCase(student.faculty)}`;

    const birthDate = document.createElement('td');
    const birth = new Date(student.birthday);

    let birthDay = birth.getDate();

    if (birthDay < 10) {
      birthDay = `0${birthDay}`;
    }

    let birthMonth = birth.getMonth() + 1;

    if (birthMonth < 10) {
      birthMonth = `0${birthMonth}`;
    }

    const birthYear = birth.getFullYear();

    let age = today.getFullYear() - birth.getFullYear();

    if (today.getMonth() < birth.getMonth() ||
      today.getMonth() == birth.getMonth() &&
      today.getDate() < birth.getDate()) {
      age--;
    }

    let years = `${age} лет`;

    if (String(age).endsWith('1')) {
      years = `${age} год`;
    }

    if (String(age).endsWith('2') || String(age).endsWith('3') || String(age).endsWith('4')) {
      years = `${age} года`;
    }

    birthDate.textContent = `${birthDay}.${birthMonth}.${birthYear} года (${years})`;

    const studyYears = document.createElement('td');
    student.finishYear = +student.studyStart + 4;
    const studyEnd = student.finishYear;

    const course = today.getFullYear() - +student.studyStart;
    let courseText;

    if (course < lastCourse || course === lastCourse && today.getMonth() < firstStudyMonth) {
      courseText = `${course} курс`
    }

    if (course === 0) {
      courseText = `1 курс`
    }

    if (course > lastCourse || course === lastCourse && today.getMonth() > firstStudyMonth) {
      courseText = 'Закончил';
    }

    studyYears.textContent = `${student.studyStart} - ${studyEnd} (${courseText})`;

    const deleteStudentCell = document.createElement('td');
    deleteStudentCell.classList.add('del-cell');
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-secondary');
    deleteBtn.setAttribute('id', 'deleteBtn');
    deleteBtn.textContent = 'Удалить';

    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Вы действительно хотите удалить студента из списка?')) {
        return
      }

      await deleteStudentFromServ(student);
      studentsArr = await getStudentsList();

      createStudentsList(studentsArr);
      showStudentsList('fio-sort', studentsArr, false);
      showStudentsList('fac-sort', studentsArr, false);
      showStudentsList('birthday-sort', studentsArr, false);
      showStudentsList('studyYears-sort', studentsArr, false);
    });

    deleteStudentCell.append(deleteBtn);
    tableStr.append(fullName);
    tableStr.append(faculty);
    tableStr.append(birthDate);
    tableStr.append(studyYears);
    tableStr.append(deleteStudentCell);
    tableBody.append(tableStr);
  }

  createStudentsList(studentsArr);
  showStudentsList('fio-sort', studentsArr, false);
  showStudentsList('fac-sort', studentsArr, false);
  showStudentsList('birthday-sort', studentsArr, false);
  showStudentsList('studyYears-sort', studentsArr, false);

  const addForm = document.getElementById('add-form');
  const warning = document.getElementById('warning');

  addForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const surname = document.getElementById('surname');
    const name = document.getElementById('name');
    const lastname = document.getElementById('lastname');
    const birthday = document.getElementById('birthday');
    const studyStart = document.getElementById('studyStart');
    const faculty = document.getElementById('faculty');
    const inputs = document.querySelectorAll('.add__input');

    const wrongValues = [];
    let valueName;

    warning.innerHTML = '';

    inputs.forEach((input, ind) => {

      if (input.value.trim() === '') {

        switch (ind) {
          case 0:
            valueName = 'Фамилия';
            break;
          case 1:
            valueName = 'Имя (полное)';
            break;
          case 2:
            valueName = 'Отчество (полное)';
            break;
          case 3:
            valueName = 'Дата рождения (не ранее 01.01.1900)';
            break;
          case 4:
            valueName = 'Год начала обучения (не позже 2000-го)';
            break;
          case 5:
            valueName = 'Факультет (полное наименование)';
            break;
        }

        wrongValues.push(valueName);
      }
    });

    if (birthday.valueAsDate < new Date(1900, 0, 1)) {
      valueName = 'Дата рождения (не ранее 01.01.1900)';
      wrongValues.push(valueName);
    }

    if (+studyStart.value < 2000 && studyStart.value !== '') {
      valueName = 'Год начала обучения (не ранее 2000-го)';
      wrongValues.push(valueName);
    }

    if (+studyStart.value > today.getFullYear()) {
      valueName = 'Год начала обучения (не позже текущего)';
      wrongValues.push(valueName);
    }

    if (wrongValues.length !== 0) {
      const warningText = document.createElement('p');
      warningText.classList.add('warning__text');
      warningText.textContent = 'Корректно заполните поля:'

      const warningList = document.createElement('ul');
      warningList.classList.add('warning__list');

      warning.append(warningText);
      warning.append(warningList);

      wrongValues.forEach(item => {
        const warningItem = document.createElement('li');
        warningItem.classList.add('warning__item');
        warningItem.textContent = `${item}`;
        warningList.append(warningItem);
      });
    }
    else {
      const student = new Student(
        surname.value,
        name.value,
        lastname.value,
        birthday.valueAsDate,
        studyStart.value,
        faculty.value
      );
      await addStudentToServer(student);

      studentsArr = await getStudentsList();

      createStudentsList(studentsArr);
      showStudentsList('fio-sort', studentsArr, false);
      showStudentsList('fac-sort', studentsArr, false);
      showStudentsList('birthday-sort', studentsArr, false);
      showStudentsList('studyYears-sort', studentsArr, false);

      inputs.forEach((input) => {
        input.value = '';
        warning.textContent = '';
      });
    }
  });

  function sortStudents(arr, prop, dir) {
    let result = arr.sort((a, b) => {
      let display = dir === false ? a[prop] < b[prop] : a[prop] > b[prop];

      if (display === true) return -1;
    });

    return result;
  }

  function filter(arr, prop, value) {
    let result = [];

    arr.forEach((item) => {
      if (String(item[prop]).toLowerCase().includes(value.toLowerCase().trim()) === true) {
        result.push(item);
      }
    });
    return result;
  }

  function createFilteredStudentsArr(arr) {
    const name = document.getElementById('name-filter');
    const fac = document.getElementById('faculty-filter');
    const studyStart = document.getElementById('start-filter');
    const finishStudy = document.getElementById('finish-filter');

    let filteredStudents = [...arr];

    if (name.value.trim() !== '') {
      filteredStudents = filter(filteredStudents, 'fullName', name.value);
    }

    if (fac.value.trim() !== '') {
      filteredStudents = filter(filteredStudents, 'faculty', fac.value);
    }

    if (studyStart.value.trim() !== '' && studyStart.value.length === 4) {
      filteredStudents = filter(filteredStudents, 'studyStart', studyStart.value);
    }

    if (finishStudy.value.trim() !== '' && finishStudy.value.length === 4) {
      filteredStudents = filter(filteredStudents, 'finishYear', finishStudy.value);
    }

    return filteredStudents;
  }

  function sortDirection(sortVal, arr, prop, dir) {
    document.getElementById(sortVal).addEventListener('click', function () {
      let sortedStudentsList;

      if (dir === false) {
        sortedStudentsList = sortStudents(createFilteredStudentsArr(arr), prop, false);
        dir = true;
      } else {
        sortedStudentsList = sortStudents(createFilteredStudentsArr(arr), prop, true);
        dir = false;
      }

      createStudentsList(sortedStudentsList);
    });
  }

  function showStudentsList(sortVal, arr) {

    document.getElementById('filter').addEventListener('input', function () {
      setTimeout(createStudentsList, 400, createFilteredStudentsArr(arr));
    });

    switch (sortVal) {
      case ('fio-sort'):
        sortDirection('fio-sort', arr, 'fullName');
        break;
      case ('fac-sort'):
        sortDirection('fac-sort', arr, 'faculty');
        break;
      case ('birthday-sort'):
        sortDirection('birthday-sort', arr, 'birthday');
        break;
      case ('studyYears-sort'):
        sortDirection('studyYears-sort', arr, 'finishYear');
        break;
    }
  }

})();
