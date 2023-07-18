//Declare global variables
const slider = document.querySelector('.slider > input');
const gridSizeText = document.querySelector('.slider > .grid-size');
const gridContainer = document.querySelector('.container');

const modeButtons = document.querySelectorAll('button.mode');
let currentActiveButton = document.querySelector('button.active');
const colorPicker = document.querySelector('.color-picker > input');

let mouseDown = false;

//Initializes the grid size
newGridSize(24);

//Updates the grid size
slider.addEventListener('input', () => {
    const newSize = slider.value;
    gridSizeText.textContent = `Grid Size: ${newSize} x ${newSize}`;
    newGridSize(newSize);
});

//Updates selected mode
modeButtons.forEach((button) => button.addEventListener('click', changeActiveMode));

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
    square.addEventListener('mousedown', (e) => { mouseDown = true; e.preventDefault()});
    square.addEventListener('mouseup', () => { mouseDown = false });
    square.addEventListener('mouseover', (e) => {
        if(mouseDown) {
            if (currentActiveButton.classList.contains('normal')) {
                paintNormal(e.target);
            }
        }
    });
}

function paintNormal(target) {
    const currentColorValue = colorPicker.value;
    target.style.backgroundColor = currentColorValue;
}