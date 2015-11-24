/**
 * app-start.js
 *
 * Author: Brayan Cruces, Diego Jara
 * 
 * Project: Magical Hasse Flow v1
 *
 * JS de inicialización de Framework7
 *
 */

// Iniciamos el app
var myApp = new Framework7({
    animateNavBackIcon:true,
    swipePanel: 'left',

    // Habilitar Material Design
    material: true,
});

// Expose Internal DOM library
var $$ = Dom7;


// Add main view
var mainView = myApp.addView('.view-main', {
});



// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});



/* PANELES */ 



$$('.open-left-panel').on('click', function (e) {
        // 'left' position to open Left panel
        myApp.openPanel('left');
    });


$$('.panel-close').on('click', function (e) {
	myApp.closePanel();
});




// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
});



/* ===== Pickers ===== */


var myPickerElements = myApp.picker({
    input: '#picker-elementos',
    cols: [
       {
         values: ['5', '6', '7','8','9','10','11','12','13','14','15']
       }
     ],
    toolbarCloseText:'Listo'
});   

var myPickerRelacion = myApp.picker({
    input: '#picker-relacion',
    cols: [
       {
         values: ['a > b', 'a < b', 'a ≥ b', 'a ≤ b', 'a / b', 'a | b']
       }
     ],
    toolbarCloseText:'Listo'
});   



