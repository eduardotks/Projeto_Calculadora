class CalcController {

    //this. = referencia a atributos e métodos.
    //underline _ com o atributo significa que o atributo é privado
    //arrow function cria uma função

    //contrutor
    constructor() {
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
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
    //ctrl v
    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');//formato que não seja imagem ou binário, apenas text

            this.displayCalc = parseFloat(text);
            console.log(text);
        });
    }


    //ctrl c ctrl v
    copyToClipboard() {
        let input = document.createElement('input'); //cria elementos na tela dinamicamente

        input.value = this.displayCalc; //coloca dentro do value displaycalc

        document.body.appendChild(input);
        input.select();

        document.execCommand("Copy");

        input.remove(); //remove o input

    }

    //inicialização, quando inicializar a calculadora executa as seguintes info.
    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay(); //iniciar calculadora com zero.
        this.pasteFromClipboard();

        //para áudio da calc
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }

    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;

    }

    playAudio() {
        //se pode tocar
        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }
    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value) {

        //limite de quantidade de char na tela
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

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

    getLastItem(isOperator = true) //por padrão trás o último operador
    {
        let lastItem;


        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i]; //coloca num na variável
                break; //se encontrou para o for
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber; //if ternário então e se não
        }
        return lastItem;
    }

    //Guarda o último número
    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false); //false pois quero um número


        if (!lastNumber) lastNumber = 0; //array é vazio ? então coloca zero

        this.displayCalc = lastNumber;
    }

    //limpa
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    //limpa
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    //
    getResult() {
        return eval(this._operation.join(""));
    }
    //
    calc() {
        let last = '';

        this._lastOperator = this.getLastItem(); //como padrão o parâmetro é true vai guardar o operador.

        //se tiver menos de 3 itens
        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber]; //3 itens para realizar operação
        }

        if (this._operation.length > 3) {
            last = this._operation.pop(); //tira o último se for maior que 3 itens.
            this._lastNumber = this.getResult(); //resultado do botão igual.

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false); //guardar o último núm
        }
        /*
        console.log('this._lastOperator', this._lastOperator);

        console.log('this._lastNumber', this._lastNumber);
        */
        let result = this.getResult(); //resultado do botão 

        if (last == '%') //Se o elemento for % exec a operação.
        {
            result /= 100;  //ou result = result / 100
            this._operation = [result];
        }
        else {
            //resultado desse eval sera enviado para o novo array
            this._operation = [result];

            if (last) this._operation.push(last); //se last for diferente de vazio , executa o push, add só se existir.
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
        //o último número não é numérico ou é sinal ou ponto, se for número cai no else;
        if (isNaN(this.getLastOperation())) {
            //
            if (this.isOperator(value)) { //o valor atual é um operador?
                this.setLastOperation(value); //se for um operador troca para o outro operador.

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
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }
    }

    addDot() {
        let lastOperation = this.getLastOperation();

        //verificar se existe e se o ponto já existe
        //split só é realizado se for string
        //é uma string e tem um ponto? se sim faz um return e para a operação
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) {
            return;
        }

        if (this.isOperator(lastOperation) || !lastOperation) //se uma das duas cond forem verdade então
        {
            this.pushOperation('0.') //add um novo item na operação
        }
        else {
            this.setLastOperation(lastOperation.toString() + '.'); //para não perder a última operação uso o método set last operation e concateno com ponto
        }

        this.setLastNumberToDisplay(); //coloca na tela
    }

    execBtn(value) {

        this.playAudio(); //toca audio

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
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
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

    //captura teclado
    initKeyboard() {
        document.addEventListener('keyup', e => {
            this.playAudio();//toca áudio

            switch (e.key) { //'e' é o evento e key é a propriedade
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key)); //add valor
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
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