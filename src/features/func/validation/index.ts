export const validation = (inputElem: HTMLInputElement) => {
    const length = inputElem.value.length
    
    let regex = /[\d.]/
    let position: any = inputElem.selectionStart

    if(length > 10) {
        inputElem.classList.add('error')
        alert('Куда разогнался? Не больше 10 символов!!!');
        inputElem.value = ''
    } else if(length > 0) {
        inputElem.classList.remove('error')
    }

    if(!regex.test(inputElem.value)) {
        inputElem.value = inputElem.value.substring(0, position - 1) + inputElem.value.substring(position + 1)
    }
}