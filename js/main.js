/**
 * main.js
 *
 * Author: Brayan Cruces, Diego Jara
 * 
 * Project: Magical Hasse Flow v1
 *
 * Funciones principales para generar relacion
 * y Diagrama de Hasse.
 *
 */



/***** VARIABLES GLOBALES *****/ 

var DATA_medida = 300; 

var intMin = 1; 
var intMax = 9999;

//Arrays manuales (for development)
var conjunto1 = ["36", "53", "13","12", "15", "8", "9", "99"]; // 8 elementos

var conjunto2 = ["23", "11", "34","87", "675", "86"]; // 6 elementos

var conjunto3 = ["2", "3", "6", "9", "12"]; // 5 elementos 




/***** FUNCIONES *****/ 

// Validaciones 
 
 function Dissapear(){

 	$('#ShowResultados').fadeOut('slow');
 	$('#block_divisores').fadeOut('slow');
 }
 function liveEvents()
   {      

          $('#intMin,#intMax').unbind('focus blur change keyup').bind("focus blur change keyup", function(){
                   if($('input').val().length > 0 )
                   {
                        $('#btnRandom').removeAttr("disabled");
                   } 
                   else
                   {
                        	
                        $('#btnRandom').attr('disabled', 'disabled');
                        Dissapear();


                   }
            });


   }

function maxLengthCheck(object) {
    if (object.value.length > object.maxLength){
      object.value = object.value.slice(0, object.maxLength)

       myApp.closeNotification('.notification-item')
       // Notificacion
				myApp.addNotification({
					message: 'Max de 5 digitos',
					button: {
						text: 'Cerrar'
					}
				});
  }
       
      


  }

function isNumeric (evt) {
  	var theEvent = evt || window.event;
  	var key = theEvent.keyCode || theEvent.which;
  	key = String.fromCharCode (key);
  	var regex = /[0-9]|\./;
  	if ( !regex.test(key) ) {
  		theEvent.returnValue = false;
  		if(theEvent.preventDefault) theEvent.preventDefault();
  	}
}




// Nodos
function Nodo(pValor)
{
	this.valor = pValor;
	this.nivel = -1;
	this.posicion;
	this.x;
	this.y;
	this.xScreen;
	this.yScreen;
	this.xDiff = 0;
	this.yDiff = 0;
}

// Relaciones
var TipoRelacion = 
{
	Null : 0,
	Reflexiva : 1,
	Transitiva : 2,
	Antisimetrica : 3,	
};

function Relacion2D(pA, pB, pTipo)
{
	this.a = pA;
	this.b = pB;
    this.tipo = pTipo;   
}


// Generar un numero aleatorio entero
function EnteroRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function GenerarDivisores (pNumero, pHasse) 
{
	var lista = "#text_Divisores";

  	$(lista).html("");

  	pHasse.dominio = [];

	for (var i = 1; i <= (pNumero + 1) / 2; i++)
    {
        if (pNumero % i === 0)
        {   
        	if(i!=pNumero + 1) $(lista).append(i + ", ");
            else $(lista).append(i);

            pHasse.dominio.push(new Nodo(i));
        }
    }
    $(lista).append( pNumero );
    pHasse.dominio.push(new Nodo(pNumero));
}


// Generación Notación

function getNotacionConjuntos()
  {
    var notacion;
    var a;
    var b;

    notacion = "<b>R</b> = { ";

    for (var i = 0; i < this.dominio.length; i++)
            {
                for (var j = 0; j < this.dominio.length; j++)
                {
                    if (this.matriz[i][j].tipo !== TipoRelacion.Null)
                    {
                        a = this.matriz[i][j].a.valor;
                        b = this.matriz[i][j].b.valor;

                        notacion += "(" + a + "," + b + ")";

                        //if(i  < this.dominio.length-1)
                        notacion += " ; ";            
                    }       
          }
            }
            
            notacion.slice(0,-3);
            notacion += " }";

            return notacion;
  };

// Hasse
function Hasse2D()
{
	this.dominio = [];
	this.matriz = [];
	this.antisimetricas = [];
	this.nodosPorFila = [];
	this.alto;
	this.ancho;

	this.RelacionDivisibilidad = function(pA, pB)
	{
       if((pB % pA) === 0)
       { 
          return true; 
       }
       else
       {
       	return false;
       }
	};

	this.getCoordenadas = function()
	{
		var xInicio;

		for (var i = 0; i < this.dominio.length; i++) 
		{
			if(this.dominio[i].nivel !== -1)
			{
				xInicio = this.ancho - this.nodosPorFila[this.dominio[i].nivel];
				this.dominio[i].x = xInicio + this.dominio[i].posicion * 2 + 1;
				this.dominio[i].y = this.dominio[i].nivel + 1;
			}
		}
	};

	this.goHasse = function()
	{
		for (var i = 0; i < this.dominio.length; i++) 
		{
			this.matriz[i] = [];
		}

		var a;
		var b;
		var A;
		var B;

		for (var i = 0; i < this.dominio.length; i++) 
		{
			this.nodosPorFila.push(0);
			b = this.dominio[i];

			for (var j = 0; j < this.dominio.length; j++)
            {
                a = this.dominio[j];

                if(this.matriz[i][j] != null)
                	continue;
                
                if(this.RelacionDivisibilidad(a.valor, b.valor))
               	{ 
               		if(a.valor === b.valor)
               		{
               			this.matriz[i][j] = new Relacion2D(a, b, TipoRelacion.Reflexiva);
               		}
               		else
               		{
               			this.matriz[i][j] = new Relacion2D(a, b, TipoRelacion.Antisimetrica);
               			this.antisimetricas.push(this.matriz[i][j]);
           				
           				if(a.nivel === -1)
           				{
           					a.nivel = 0;
           				}

           				b.nivel = a.nivel + 1;

   						A = b;

   						for (var k = i + 1; k < this.dominio.length; k++) 
   						{
   							B = this.dominio[k];

   							if(this.RelacionDivisibilidad(A.valor, B.valor))
   							{
   								this.matriz[k][j] = new Relacion2D(A, B, TipoRelacion.Transitiva);
   							}
   						}
               		}
               }
               else
               {
               		this.matriz[i][j] = new Relacion2D(a, b, TipoRelacion.Null);
               }
            }
		}
		
		for (var i = 0; i < this.dominio.length; i++)
            {
                if (this.dominio[i].nivel !== -1)
                {
                    this.dominio[i].posicion = this.nodosPorFila[this.dominio[i].nivel];
                    this.nodosPorFila[this.dominio[i].nivel]++;
                }
            }

        for (var i = 0; i <= this.nodosPorFila.length; i++)
        {
            this.alto = i;
            if (i === this.nodosPorFila.length || this.nodosPorFila[i] === 0)
                break;
        }
        
        this.ancho = 0;

        for (var i = 0; i < this.alto; i++)
        {
            if (this.nodosPorFila[i] > this.ancho)
                this.ancho = this.nodosPorFila[i];
        }

        this.getCoordenadas();
		
	};

	this.getNotacionConjuntos = function()
	{
		var notacion;
		var a;
		var b;

		notacion = "<b>R</b> = { ";

		for (var i = 0; i < this.dominio.length; i++)
            {
                for (var j = 0; j < this.dominio.length; j++)
                {
                    if (this.matriz[i][j].tipo !== TipoRelacion.Null)
                    {
                        a = this.matriz[i][j].a.valor;
                        b = this.matriz[i][j].b.valor;

                        notacion += "(" + a + "," + b + ")";

                        //if(i  < this.dominio.length-1)
                        notacion += " ; ";            
                    }       
    		 	}
            }
            
            notacion.slice(0,-3);
            notacion += " }";

            return notacion;
	};
}




function DibujarHasse(pHasse)
{
	var canvas = document.getElementById("idHasse");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height)
	
	context.beginPath();

	context.strokeStyle = '#fff';
    context.stroke();

    context.font="14px Segoe UI";
  
	
	var r;
	
    var factorX;
    var factorY;

    factorX = DATA_medida / (pHasse.ancho);
    factorY = DATA_medida / (pHasse.alto + 1);
    

    //Crear Gradiente 
		var gradient=context.createLinearGradient(0,0,canvas.width,0);
		gradient.addColorStop("0","#e91e63");
		gradient.addColorStop("0.5","#ffffff");
		gradient.addColorStop("1.0","#f44336");

    for (var i = 0; i < pHasse.antisimetricas.length; i++)
    {
        r = pHasse.antisimetricas[i];

        r.a.xScreen = r.a.x * factorX / 2;
        r.a.yScreen = DATA_medida - r.a.y * factorY - r.a.yDiff;

        r.b.xScreen = r.b.x * factorX / 2;
        r.b.yScreen = DATA_medida - r.b.y * factorY - r.b.yDiff;
        
        //Dibujar linea nodo a nodo
		context.moveTo(r.a.xScreen, r.a.yScreen);
		context.lineTo(r.b.xScreen, r.b.yScreen);     


    }

     // Dibujar Numeros (nodos)
    context.fillStyle=gradient;
    for (var i = 0; i < pHasse.dominio.length; i++) 
    {
    context.fillText(pHasse.dominio[i].valor, pHasse.dominio[i].xScreen-10,  pHasse.dominio[i].yScreen-5);
    }

    
    context.stroke();
}




// Manipulacion DOM con jQuery

$(document).ready(function(){
		
		
		liveEvents();

        //Click para el boton generar Random
		$("#btnRandom").click	
		( 
			function()
			{   

				

				var hasse = new Hasse2D(); 
				var min = intMin;
				var max = intMax;		
				var random = EnteroRandom(min, max);

				
				$("#block_divisores").show();
                $("#text_Random").hide();
				$("#text_Random").html("Los divisores de : <b>" + random+"</b>");
				$("#text_Random").fadeIn('slow');

				GenerarDivisores(random,hasse);
				$("#text_Divisores").fadeIn('slow');
				
				hasse.goHasse();

				//Notacion
				$("#idNotacion").html("");				
				$("#idNotacion").html(hasse.getNotacionConjuntos());
				
				//Antisimetricas
				$("#idAntisimetricas").html("");				
				for (var i = 0; i < hasse.antisimetricas.length; i++) 
				{
					$("#idAntisimetricas").html($("#idAntisimetricas").text() + hasse.antisimetricas[i].a.valor + "->" + hasse.antisimetricas[i].b.valor + ", "); 
				}
				
			    //Hasse
				DibujarHasse(hasse);
                
                // Mostrar Resultados             
                $('#ShowResultados').fadeIn('slow');

                // Notificaciones
                myApp.closeNotification('.notification-item')
				myApp.addNotification({
					message: 'Listo! Divisibilidad generada de ' + random,
					button: {
						text: 'Cerrar'
					}

				});

			}
		);
	}
);