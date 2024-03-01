(() => {
  const studentsArr = [];
  let filteredStudents = [];

  class Student {
    constructor(surname, name, secondName, birthDate, startStudy, faculty) {
      this.surname = surname;
      this.name = name;
      this.secondName = secondName;
      this.birthDate = birthDate;
      this.startStudy = startStudy;
      this.faculty = faculty;
    }

    add(arr) {
      arr.push(this)
    }
  }

  function changeLettersCase(string) {
    firstLetter = string[0].toUpperCase();
    string = firstLetter + string.slice(1).toLowerCase();
    return string;
  }

  const tableBody = document.getElementById('tbody');

  const today = new Date();

  function addStudent(student) {
    const tableStr = document.createElement('tr');

    const fullName = document.createElement('td');
    student.fullName = `${changeLettersCase(student.surname)} ${changeLettersCase(student.name)} ${changeLettersCase(student.secondName)}`;
    fullName.textContent = student.fullName;

    const faculty = document.createElement('td');
    faculty.textContent = `${changeLettersCase(student.faculty)}`;

    const birthDate = document.createElement('td');
    let birthDay = student.birthDate.getDate();

    if (birthDay < 10) {
      birthDay = `0${birthDay}`;
    }

    let birthMonth = student.birthDate.getMonth() + 1;

    if (birthMonth < 10) {
      birthMonth = `0${birthMonth}`;
    }

    const birthYear = student.birthDate.getFullYear();

    let age = today.getFullYear() - student.birthDate.getFullYear();

    if (today.getMonth() < student.birthDate.getMonth() ||
      today.getMonth() == student.birthDate.getMonth() &&
      today.getDate() < student.birthDate.getDate()) {
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
    student.finishYear = +student.startStudy + 4;
    const studyEnd = student.finishYear;

    const course = today.getFullYear() - +student.startStudy;
    let courseText;

    if (course < 4 || course === 4 && today.getMonth() < 8) {
      courseText = `${course} курс`
    }

    if (course === 0) {
      courseText = `1 курс`
    }

    if (course > 4 || course === 4 && today.getMonth() > 8) {
      courseText = 'Закончил';
    }

    studyYears.textContent = `${student.startStudy} - ${studyEnd} (${courseText})`;

    tableStr.append(fullName);
    tableStr.append(faculty);
    tableStr.append(birthDate);
    tableStr.append(studyYears);
    tableBody.append(tableStr);
  }

  function createStudentsList(arr) {
    tableBody.innerHTML = '';

    arr.forEach(student => {
      addStudent(student);
    });
  }

  const addForm = document.getElementById('add-form');
  const warning = document.getElementById('warning');

  addForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const surName = document.getElementById('surName');
    const name = document.getElementById('name');
    const secondName = document.getElementById('secondName');
    const birthDate = document.getElementById('birthDate');
    const beginDate = document.getElementById('beginDate');
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

    if (birthDate.valueAsDate < new Date(1900, 0, 1)) {
      valueName = 'Дата рождения (не ранее 01.01.1900)';
      wrongValues.push(valueName);
    }

    if (+beginDate.value < 2000 && beginDate.value !== '') {
      valueName = 'Год начала обучения (не ранее 2000-го)';
      wrongValues.push(valueName);
    }

    if (+beginDate.value > today.getFullYear()) {
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
        surName.value,
        name.value,
        secondName.value,
        birthDate.valueAsDate,
        beginDate.value,
        faculty.value
      );
      student.add(studentsArr);

      createStudentsList(studentsArr);

      inputs.forEach((input,) => {
        input.value = '';
        warning.textContent = '';
      });
    }
  });

  let dir = false;

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

  function render(arr) {
    const name = document.getElementById('name-filter');
    const fac = document.getElementById('faculty-filter');
    const startStudy = document.getElementById('start-filter');
    const finishStudy = document.getElementById('finish-filter');

    let copyArr = [...arr];

    if (name.value.trim() !== '') {
      copyArr = filter(copyArr, 'fullName', name.value);
    }

    if (fac.value.trim() !== '') {
      copyArr = filter(copyArr, 'faculty', fac.value);
    }

    if (startStudy.value.trim() !== '' && startStudy.value.length === 4) {
      copyArr = filter(copyArr, 'startStudy', startStudy.value);
    }

    if (finishStudy.value.trim() !== '' && finishStudy.value.length === 4) {
      copyArr = filter(copyArr, 'finishYear', finishStudy.value);
    }

    filteredStudents = copyArr;

    return copyArr;
  }

  function sortDirection(sortVal, arr, prop) {
    document.getElementById(sortVal).addEventListener('click', function () {

      if (filteredStudents.length > 0) {
        if (dir === false) {
          createStudentsList(sortStudents(filteredStudents, prop, false));
          dir = true;
        } else {
          createStudentsList(sortStudents(filteredStudents, prop, true));
          dir = false;
        }
      }
      else {
        if (dir === false) {
          createStudentsList(sortStudents(arr, prop, false));
          dir = true;
        } else {
          createStudentsList(sortStudents(arr, prop, true));
          dir = false;
        }
      }
    });
  }

  document.getElementById('filter').addEventListener('input', function () {
    setTimeout(createStudentsList, 400, render(studentsArr));
  });

  sortDirection('fio-sort', studentsArr, 'fullName');

  sortDirection('fac-sort', studentsArr, 'faculty');

  sortDirection('birthDate-sort', studentsArr, 'birthDate');

  sortDirection('studyYears-sort', studentsArr, 'finishYear');
})();
