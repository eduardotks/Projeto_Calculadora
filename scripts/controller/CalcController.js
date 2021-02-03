class CalcController {

    //this. = referencia a atributos e métodos.
    //underline _ com o atributo significa que o atributo é privado
    //arrow function cria uma função

    //contrutor
    constructor() {
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    //set hora tempo
    setDisplayDateTime() {
        //mostrando data e personalizando o dia com 2 digitos e o mês para escrito com LONG
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //inicialização, quando inicializar a calculadora executa as seguintes info.
    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }
    get displayTime() {
        return this._timeEl.innerHTML;
    }
    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }
    get displayDate() {
        return this._dateEl.innerHTML;
    }
    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }
    get currentDate() {
        return new Date();
    }
    set currentDate(value) {
        this._currentDate = value;
    }



    //Guarda o último número
    setLastNumberToDisplay() {
        let lastNumber;

        for (let i = this._operation.lenght - 1; i >= 0; i--) {
            if (!this.isOperator(this._operation[i])) {
                lastNumber = this._operation[i];
                break;
            }
        }
        this.displayCalc = lastNumber;
    }

    //limpa
    clearAll() {
        this._operation = [];
    }

    //limpa
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }


    //é operador?
    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    //insere
    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.lenght > 3) {
            this.calc();
        }

    }

    //
    calc() {
        let last = this._operation.pop();
        let result = eval(this._operation.join(""));
        if (last == '%') {
            result = result / 100; //divide por 100 se for porcentagem ou pode ser result /= 100
            this._operation = [result];
        }
        else {

            this._operation = [result, last];

        }
        this.setLastNumberToDisplay();
    }

    //para mensagem de erro
    setError() {
        this.displayCalc = "Error";
    }



    getLastOperation() {
        return this._operation[this._operation.lenght - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.lenght - 1] = value;
    }






    //para operações
    addOperation(value) {


        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            }
            else if (isNaN(value)) {
                console.log('Outra coisa', value);
            }
            else {
                this.pushOperation(value);
                console.log(this.pushOperation);
                this.setLastNumberToDisplay();
            }
        }
        else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
                console.log(this.pushOperation);
            }
            else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();
            }
        }
    }




    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                break;

            case 'ponto':
                this.addOperation('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value)); //add valor
                break;

            default:
                this.setError();
                break;
        }
    }


    //evento de escuta
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }
    //
    initButtonsEvents() {
        //querySelectorAll seleciona todos aqueles que casam com essa consulta que estou fazendo.
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");


        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                console.log(btn.className.baseVal.replace("btn-", "")); //substitui o btn- por vazio

                this.execBtn();
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }




}