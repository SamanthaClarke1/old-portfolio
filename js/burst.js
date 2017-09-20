/* global $ mojs */

$(document).ready(function() {
  
   // ripple effect
   const circ = new mojs.Shape({
      radius: {0: 700},
      fill: 'none',
      stroke: 'yellow',
      opacity: {1: 0},
      duration: 3500
   }).play();
   
   // zigzag burst
   const burst = new mojs.Burst({
      radius: {0: 720},
      count : 10,
      children : {
         shape : 'zigzag',
         points: 7,
         stroke : 'blue',
         strokeWidth : { 0 : 3},
         angle : { '-360' : 0},
         radius : { 5: 30},
         duration : 2500
      }
   }).play();
   
   const circ_opt = new mojs.Shape({
      radius: {0: 700},
      fill: 'none',
      stroke: 'yellow',
      opacity: {1: 0},
      duration: 3500
   }).play();
   
   // circle burst
   const burst2 = new mojs.Burst({
      radius: {0: 360},
      count : 20,
      children : {
         shape : 'cross',
         stroke : {'magenta' : 'pink'},
         angle : {360: 0},
         strokeWidth : { 4 : 0},
         radius : { 30: 5},
         duration : 2500
      }
   }).play();

});