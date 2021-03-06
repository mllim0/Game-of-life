/**
 * @author Antonio Raúl Guijarro Contreras <alu0101100494@ull.edu.es>
 * @file Declaración de la clase linea. Hereda de Shape y representa una linea
 * con todas las caracteristicas de Shape + las coordenadas principio=Point() y
 * fin=Point()
 * @copyright Antonio Raúl Guijarro Contreras 2020
 * @since 05.03.2020
 */

'use strinc'

import Point from './Point.js';
import Shape from './Shape.js';

/** 
 * Hereda de Shape y representa una linea con todas las caracteristicas de Shape 
 * las coordenadas principio=Point() y fin=Point().
 * @extends Shape
*/
class Line extends Shape{
  
  /**
   * @param {Point} start punto inicial
   * @param {Point} end punto final
   * @param {boolean} discontinuous Si es discontinua true : false
   */
  constructor(start = new Point(0, 0), end = new Point(0, 0)) {
    super()
    this.start = start;
    this.end = end;
    this.slope = 0;
    this.ordinate = 0;
    this.build();
  }

  /**
   * Calcula los valores de: pendiende y origen par poder tener 
   * las bases de la ecuación de la recta
   */
  build() {
    if (this.end.x - this.start.x !== 0) {
      this.slope = (this.end.y - this.start.y) / (this.end.x - this.start.x);
      this.ordinate = this.start.y - (this.slope * this.start.x);
    }
  }

  /**
   * Devuelve el valor de la posición de Y dentro de la recta
   * @param {number} coorinateX Posición X
   * @return {number} El valor de Y en la linea con coordenada X
   */
  calculateY(xCoordinate) {
    return this.slope * xCoordinate + this.ordinate;
  }

  /**
   * Comprueba si un punto está dentro de la linea
   * @param {Point} point Punto a comprobar si está dentro de la linea
   * @return {Boolean} true si pertenece : false
   */
  isPointInLine(point) {
    return (this.calculateY(point.x) === point.y);
  }

  /**
   * Devulve la longitud de la recta
   * @return {Number} Longitud de la recta
   */
  length() {
    return Math.sqrt(Math.pow(this.end.x - this.start.x, 2) + Math.pow(this.end.y - this.start.y, 2));
  }



  /* istanbul ignore next   */
  /**
   * Se encarga de dibujar la figura que representa la clase
   * @param {Context} ctx Contexto del canvas, preferiblemente '2d'
   */
  draw(ctx) {
    if (ctx != null) {
      this.baseDraw(ctx);
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.end.x, this.end.y);
      ctx.stroke();
    }
  }
};

export default Line;