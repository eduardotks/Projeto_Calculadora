class CalcController
{
//contrutor
constructor()
{
    this._locale = 'pt-BR';
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
}

//inicialização
initialize()
{
    this.setDisplayDateTime();

    setInterval(() => {
        this.setDisplayDateTime();
    }, 1000);
}

//
initButtonsEvents()
{
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {
        this.addEventListenerAll(btn, "click drag", e =>{
            console.log(btn.className.baseVal.replace("btn-", ""));
        });
        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
            btn.style.cursor = "pointer";
        });
    });
}

//set hora tempo
setDisplayDateTime()
{
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
}

//evento de escuta
addEventListenerAll(element, events, fn)
{
    events.split(' ').forEach(event => {
        element.addEventListener(event, fn, false);
    });
}

//limpa
clearAll()
{
    this._operation = [];
}

//limpa
clearEntry()
{
    this._operation.pop();
    this.setLastNumberToDisplay();
}

getLastOperation()
{
    return this._operation[this._operation.lenght - 1];
}

setLastOperation(value)
{
    this._operation[this._operation.lenght - 1] = value;
}

//é operador?
isOperator(value)
{
    return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
}

//insere
pushOperation(value)
{
    this._operation.push(value);
    if (this._operation.lenght > 3) {
        this.calc();
    }

}

//
calc()
{
    let last = this._operation.pop();
    let result = eval(this._operation.join(""));
    this._operation = [result, last];
    this.setLastNumberToDisplay();
}

//Guarda o último número
setLastNumberToDisplay()
{
    let lastNumber;

    for (let i = this._operation.lenght - 1; i >= 0; i--) {
        if (!this.isOperator(this._operation[i])) {
            lastNumber = this._operation[i];
            break;
        }
    }
    this.displayCalc = lastNumber;
}

//para operações
addOperation(value)
{
    if (isNaN(this.getLastOperation())) {
        if (this.isOperator(value)) {
            this.setLastOperation(value);
        }
        else if (isNaN(value)) {
            console.log('Outra coisa', value);
        }
        else {
            this.pushOperation(value);
            this.setLastNumberToDisplay();
        }
    }
    else {
        if (this.isOperator(value)) {
            this.pushOperation(value);
        }
        else {
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(parseInt(newvalue));
            this.setLastNumberToDisplay();
        }
    }
}

//para mensagem de erro
setError()
{
    this.displayCalc = "Error";
}

execBtn(value)
{
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

get displayTime()
{
    return this._timeEl.innerHTML;
}
set displayTime(value)
{
    this._timeEl.innerHTML = value;
}
get displayDate()
{
    return this._dateEl.innerHTML;
}
set displayDate(value)
{
    this._dateEl.innerHTML = value;
}
get currentDate()
{
    return new Date();
}
set currentDate(value)
{
    this._currentDate = valor;
}

}