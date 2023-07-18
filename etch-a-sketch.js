//Declare global variables
const slider = document.querySelector('.slider > input');
const gridSizeText = document.querySelector('.slider > .grid-size');
const gridContainer = document.querySelector('.container');

const modeButtons = document.querySelectorAll('button.mode');
let currentActiveButton = document.querySelector('button.active');
const colorPicker = document.querySelector('.color-picker > input');
const clearButton = document.querySelector('button.clear');

let mouseDown = false;
let gridSize = 24;

//Initializes the grid size
newGridSize(gridSize);

//Updates the grid size
slider.addEventListener('input', () => {
    gridSize = slider.value;
    gridSizeText.textContent = `Grid Size: ${gridSize} x ${gridSize}`;
    newGridSize(gridSize);
});

//Updates selected mode
modeButtons.forEach((button) => button.addEventListener('click', changeActiveMode));

//Clears the grid
clearButton.addEventListener('click', () => { newGridSize(gridSize); })

function changeActiveMode() {
    currentActiveButton.classList.remove('active');
    currentActiveButton = this;
    this.classList.add('active');
}

function newGridSize(size) {
    //Remove previous grid
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    const containerSide = 560;
    const divSide = containerSide / size;

    const div = document.createElement('div');
    div.classList.add('square');
    div.setAttribute('style',`width:${divSide}px; height:${divSide}px`);
    //Useful when shading
    div.setAttribute('data-original-color','rgb(255, 255, 255)');
    div.setAttribute('data-times-shaded','0');

    for (let i = 0; i < size * size; i++) {
        gridContainer.appendChild(div.cloneNode(true));
    }

    const squares = document.querySelectorAll('div.square');
    squares.forEach(attachEventListeners);
    /* squares.forEach(square => square.addEventListener('mouseover', (e) => {
        const colorValue = colorPicker.value;
        square.style.backgroundColor = `${colorValue}`;
    })) */
     
}

function attachEventListeners(square) {
    square.addEventListener('mousedown', (e) => { 
        mouseDown = true; 
        paintSquare(e.target); 
        e.preventDefault();
    });
    square.addEventListener('mouseup', () => { mouseDown = false });
    square.addEventListener('mouseover', (e) => {
        if(mouseDown) paintSquare(e.target);
    });
}

function paintSquare(target) {
    if (currentActiveButton.classList.contains('normal')) {
        const colorValue = colorPicker.value;
        target.style.backgroundColor = colorValue;

        const rgb = [parseInt(colorValue.substring(1,3), 16),
                     parseInt(colorValue.substring(3,5), 16),
                     parseInt(colorValue.substring(5), 16)];
        target.dataset.originalColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        target.dataset.timesShaded = 0;
    }

    else if (currentActiveButton.classList.contains('rainbow')) {
        const rgb = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            rgb[i] = Math.random() * 255;
        }
        const rgbString = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        target.style.backgroundColor = rgbString;
        target.dataset.originalColor = rgbString;
        target.dataset.timesShaded = 0;
    }

    else if (currentActiveButton.classList.contains('shade')) {
        let originalColor = target.dataset.originalColor;
        originalColor = originalColor.substring(4, originalColor.length-1).replace(/ /g, '').split(',');
        //Array with 3 numeric values
        let newRgb = originalColor;
        const timesShaded = target.dataset.timesShaded;
        //We deminish each rgb value prportionally
        for (let i = 0; i < 3; i++) {
            const deminish = originalColor[i] / 10;
            //If timeShaded is 10 it's completly black
            if (timesShaded < 10) {
                for (let j = 0; j <= timesShaded; j++) {
                    if (newRgb[i] - deminish > 0) { 
                        newRgb[i] = newRgb[i] - deminish;
                    } else {
                        //Prevent round errors
                        newRgb[i] = 0;
                    }
                }
            } else {
                newRgb = [0, 0, 0];
            }
        }
        target.style.backgroundColor = `rgb(${newRgb[0]}, ${newRgb[1]}, ${newRgb[2]})`;
        target.dataset.timesShaded++;
    }

    else if (currentActiveButton.classList.contains('eraser')) {
        target.style.backgroundColor = '#ffffff';
        target.dataset.originalColor = 'rgb(255, 255, 255)';
        target.dataset.timesShaded = 0;
    }
}
