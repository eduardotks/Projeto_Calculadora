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

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (!this.isOperator(this._operation[i])) {
                lastNumber = this._operation[i]; //coloca num na variável
                break; //se encontrou para o for
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

    //
    calc() {
        let last = this._operation.pop(); //tira o último 

        if (this._operation.length > 3) 
        {
            last = this._operation.pop(); //
        }

        let result = eval(this._operation.join("")); //resultado desse eval sera enviado para o novo array
        if (last == '%') {
            result = result / 100; //divide por 100 se for porcentagem ou pode ser result /= 100
            this._operation = [result];
        }
        else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }
        this.setLastNumberToDisplay();
    }

    //para mensagem de erro
    setError() {
        this.displayCalc = "Error";
    }

    //insere
    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }

    }
    //é operador?
    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1); //indexOf é maior que -1? compara se o valor está no array de sinais, se sim conta qtd.
    }

    //Pega ultima operação realizada
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }
    //guarda informação enviada
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }
    //para operações
    addOperation(value) {
        //OBS: se for um número é necessário concatenar

        console.log('a', isNaN(this.getLastOperation()));
        //o último número não é numérico ou é sinal ou ponto, se for número cai no else;
        if (isNaN(this.getLastOperation())) {
            //
            if (this.isOperator(value)) { //o valor atual é um operador?
                this.setLastOperation(value); //se for um operador troca para o outro operador.

            }
            else if (isNaN(value)) {   //isso não é um numero?
                console.log('Outra coisa', value);

            }
            else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }
        else {
            //Se for operador só add ao array
            if (this.isOperator(value)) {
                this.pushOperation(value);
            }
            //
            else {
                let newValue = this.getLastOperation().toString() + value.toString(); //concatena string dos números.
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();
            }

            console.log(this._operation);
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
            //FALSE é passado para função pois temos tanto o botão quanto o texto do botão se acontecer de clicar nos 2 pode gerar 2 informações,
            // com false acontece 1 só vez
            element.addEventListener(event, fn, false);
        });
    }
    //
    initButtonsEvents() {
        //querySelectorAll seleciona todos aqueles que casam com essa consulta que estou fazendo.
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");


        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.className.baseVal.replace("btn-", ""); //substitui o btn- por vazio

                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }




}