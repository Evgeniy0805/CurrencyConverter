window.addEventListener('DOMContentLoaded', () => {
    
    let arrayCurrency = ['USD', 'EUR', 'CNY'];

    async function getDataCurrency(arr) {
        let promise = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');

    if (promise.ok) {
        let json = await promise.json();
        let currentCourse = {};
        arr.forEach(element => {
            currentCourse[`${element}`] = json.Valute[`${element}`];
        });
        setCourse(currentCourse);
      } else {
        alert("Ошибка HTTP: " + promise.status);
      }
    }

    function setCourse(course) {
        let currentCourseItem = document.querySelectorAll('.currency__current__value');
        currentCourseItem.forEach(element => {
            element.textContent = course[`${element.dataset.currency}`].Value.toFixed(2);
        });
    }

    getDataCurrency(arrayCurrency);
    

    

    

    
});