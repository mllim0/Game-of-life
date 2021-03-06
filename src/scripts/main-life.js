/**
 * @author Antonio Raúl Guijarro Contreras <alu0101100494@ull.edu.es>
 * @file Script principal que simulará el juego de la vida
 * @copyright Antonio Raúl Guijarro Contreras 2020
 * @since 07.05.2020
 * @module life-main
 */

import Board from './Board.js';
import Box from './Box.js';
import Layers from './Layers.js';
import * as Utility from './CanvasUtility.js';
import Cell from './Cell.js';

 // Atributos HTML
let canvas;
let ctx;
let buttonStartGame;
let buttonEndGame;
let buttonPauseGame;
let buttonNextStepGame;
let sliderSpeed;

//  Atributos lógicos
const BOXES = 33;
let originalTimeSpeed = 600;
let timeSpeed = originalTimeSpeed;
let timeSpeedScale = 1;
let isRun = true;
let board;
let interval;
let timeOut;
let nCells;

if (document != null) {
  // Asignación
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  buttonStartGame = document.getElementById('start-game');
  buttonEndGame = document.getElementById('end-game');
  buttonPauseGame = document.getElementById('pause-game');
  buttonNextStepGame = document.getElementById('nextSep-game');
  sliderSpeed = document.getElementById('speed');
  nCells = parseInt(document.getElementById('cellsNumber').value);

  // Eventos
  window.addEventListener('load', start);
  buttonStartGame.addEventListener('click', main);
  buttonNextStepGame.addEventListener('click', gameOfLife);
  buttonEndGame.addEventListener('click', ()  => { isRun = false; Utility.clearScreen(ctx, canvas); resetAll()});
}

/**
 * Función que se ejecutará nada más cargar la página
 */
function start() {
  //  Escalamos el ratio de pixeles en función del tamaño dado por el CSS
  Utility.fixDpi(canvas);

  //  Para no detener el doom dejamos que cada X tiempo revise algunos elementos
  interval = setInterval(function() {
    buttonPauseGame.addEventListener('click', () => isRun = false);
    timeSpeedScale = sliderSpeed.value;
    timeSpeed = originalTimeSpeed / timeSpeedScale;
  }, 100);
}

/**
 * Ejecutará la función principal del script: Generar una solucíon de 8 reinas
 */
async function main() {
  if (isRun) resetAll();
  isRun = true;
  while(isRun) {
    await gameOfLife();
    await new Promise(r => timeOut = setTimeout(r, timeSpeed));
  }
}

/**
 * Algoritmo del juego de la vida
 */
async function gameOfLife() {
  // Mostramos por pantalla
  await board.draw(ctx);
  // Recorremos y asignamos los vecinos
  await setNeightbourds(board);
  // Comprobamos el estado
  await checkRules(board);
}

/**
 * Resetea todo el entorno del script
 */
function resetAll() {
  let aux = canvas.width / canvas.height;
  board = new Board(BOXES * Math.round(aux), BOXES);
  board.build(canvas.width, canvas.height, ['black']);
  clearTimeout(timeOut);
  //  Insertamos las células
  nCells = parseInt(document.getElementById('cellsNumber').value);
  resetBoard(board);
  insertCellsRandomdly(board, nCells);
}

/**
 * Resetea el tablero a solo células muertas
 * @param {Board} _board Tablero de la simulación
 */
function resetBoard(_board) {
  for (let i = 0; i < _board.verticalBoxes; i++) {
    for (let j = 0; j < _board.horizontalBoxes; j++) {
      _board.elements[_board.translate(i, j)].element = new Cell(false);
    }
  }
}

/**
 * Asingna a cada célula sus vecinos muertos y vivos
 * @param {Board} _board Ingresa los vecinos correspondientes a cada neurona 
 */
function setNeightbourds(_board) {
  for (let i = 0; i < _board.verticalBoxes; i++) {
    for (let j = 0; j < _board.horizontalBoxes; j++) {
      _board.elements[_board.translate(i, j)].element.neighbors = {alive: [], dead: []};
      // Submatriz 3x3
      if (_board.elements[_board.translate(i, j)].element != null) {
        for (let y = -1; y < 2; y++) {
          for (let x = -1; x < 2; x++) {
            // Controlamos que no sobresalga el rango de la matriz y no es el punto inicial
            if ((i + y >= 0 && i + y < _board.verticalBoxes && j + x >= 0 &&
                j + x < _board.horizontalBoxes) && (y != 0 || x != 0)) {
              _board.elements[_board.translate(i, j)].element.neighbor =
                  _board.elements[_board.translate(i + y, j + x)].element;
            }
          }
        }
      }

    }
  }
}

/**
 * Introduce aleatoriamente un número determinado de células dentro del tablero
 * @param {Board} _board Tablero de la simulación
 * @param {Nmber} _nCells Número de células a introducir
 */
function insertCellsRandomdly(_board, _nCells) {
  let size = _board.horizontalBoxes * _board.verticalBoxes;
  let index = 0;
  for (let i = 0; i < _nCells; i++) {
    index = Math.floor(Math.random() * size); 
    _board.elements[index].element = new Cell();
    _board.elements[index].fillStyle = 'yellow';
  }
}

/**
 * Comprueba las reglas de juego
 * @param {Board} _board Tablero de la simulación
 */
function checkRules(_board) {
  for (let i = 0; i < _board.horizontalBoxes * _board.verticalBoxes; i++) {
    _board.elements[i].element.check();
    if (_board.elements[i].element.isAlive) {
      // Células vivas
      _board.elements[i].fillStyle = 'yellow';
    } else {
      // Células muertas
      _board.elements[i].fillStyle = 'black';
    }
  }
}
