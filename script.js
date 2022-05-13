window.addEventListener('DOMContentLoaded', () => {
    let arrayCurrency = ['USD', 'EUR', 'CNY'],
        baseCurrency = 'RUB';
    class convertCurrency {

        constructor(allCurrency, baseCurrency) {
            this.listAllCurrency = allCurrency;
            this.baseCurrency = baseCurrency;
            this.currencyExchangeRate = {
                RUB : {Value: 1}
            };
            this.initialCourses = {};
        }

        setOtherCurrancyName() {
            const baseCurrencyItem = document.querySelectorAll('.currency__current__name'),
                  baseCurrencyValue = document.querySelectorAll('.currency__current__value');
    
            baseCurrencyItem.forEach( (element, i) => {
                element.textContent = this.listAllCurrency[i];
                baseCurrencyValue[i].dataset.currency = `${this.listAllCurrency[i]}`;
            });
        }
    
        async getExchangeRate() {
            let exchangeRate = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    
        if (exchangeRate.ok) {
            let json = await exchangeRate.json();
            this.listAllCurrency.forEach(element => {
                this.currencyExchangeRate[`${element}`] = json.Valute[`${element}`];
            });
            this.initialCourses = JSON.parse(JSON.stringify(this.currencyExchangeRate));
            this.convertCurrency();
            this.setExchangeRate();
          } else {
            alert("Ошибка HTTP: " + exchangeRate.status);
          }
        }
    
        setExchangeRate() {
            const currentCourseItem = document.querySelectorAll('.currency__current__value');
            currentCourseItem.forEach(element => {
                element.textContent = this.currencyExchangeRate[`${element.dataset.currency}`].Value.toFixed(2);
            });
        }
    
        setConverterName() {
            const currencyName = document.querySelectorAll('.currency__current-name');
    
            currencyName.forEach( element => {
                element.textContent = element.dataset.currency;
            });
        }
    
        convertCurrency() {
            const outputField = document.querySelector('#output'),
                  inputField = document.querySelector('#input'),
                  toConvert = document.querySelector('#outputName');

            outputField.textContent = (+(inputField.value) * 
                                      (1 / +this.currencyExchangeRate[toConvert.textContent].Value)).toFixed(2); 
        }
    
        changeBaseCurrency() {
            const currentCurrency = document.querySelector('.currency__base-wrapper'),
                  baseCurrencyItem = document.querySelectorAll('.currency__base__choice');
    
            currentCurrency.addEventListener('click', e => {
                if (e.target.tagName == 'path') {
                    this.chooseElement(e.target.parentNode.parentNode, baseCurrencyItem);
                }
                if (e.target.tagName == 'svg') {
                    this.chooseElement(e.target.parentNode, baseCurrencyItem);

                }
                if (e.target.classList.contains('currency__base__choice')) {
                    this.chooseElement(e.target, baseCurrencyItem);
                }
            }); 
        }
    
        chooseElement(targetElement, baseCurrencyItem) {
            baseCurrencyItem.forEach(element => {
                element.classList.remove('currency__base__choice_active');
                if (element == targetElement) {
                    element.classList.add('currency__base__choice_active');
                }
            });
            this.listAllCurrency.push(this.baseCurrency);
            this.baseCurrency = targetElement.dataset.base;
            document.querySelector('#inputName').dataset.currency = this.baseCurrency;
            this.listAllCurrency = this.listAllCurrency.filter(element => element != this.baseCurrency);
            this.changeExchangeRate();
            this.setConverterName();
            this.convertCurrency();
            this.setOtherCurrancyName();
            this.setExchangeRate();
        }

        changeExchangeRate() {
            this.currencyExchangeRate = JSON.parse(JSON.stringify(this.initialCourses));
            for (let key in this.currencyExchangeRate) {
                if (key != this.baseCurrency) {
                    this.currencyExchangeRate[key] = {
                        Value: this.initialCourses[key].Value / this.initialCourses[`${this.baseCurrency}`].Value
                    };   
                }
            }
            this.currencyExchangeRate[`${this.baseCurrency}`] = {
                Value: 1};
        }

        changeOutputValue() {
            const arrowRight = document.querySelector('.currency__current-item__right'),
                  arrowLeft = document.querySelector('.currency__current-item__left'),
                  outputName = document.querySelector('#outputName');
            let index = 0;

                arrowRight.addEventListener('click', () => {
                    if (index < this.listAllCurrency.length - 1) {
                        index++; 
                    } else {
                        index = 0;
                    }
                    outputName.textContent = this.listAllCurrency[index];
                    this.convertCurrency();
                });

                arrowLeft.addEventListener('click', () => {
                    if (index > 0) {
                        index--; 
                    } else {
                        index = this.listAllCurrency.length - 1;
                    }
                    outputName.textContent = this.listAllCurrency[index];
                    this.convertCurrency();
                });
        }

        changeInput() {
            const input = document.querySelector('#input');

            input.addEventListener('input', () => {
                this.convertCurrency();
            });
        }
    }
    
    let converter = new convertCurrency(arrayCurrency, baseCurrency);
    converter.setOtherCurrancyName();
    converter.getExchangeRate();
    converter.setConverterName();
    converter.changeBaseCurrency();
    converter.changeOutputValue();
    converter.changeInput();
});

    