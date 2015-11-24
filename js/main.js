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
var TipoParOrdenado = 
{
  Null : 0,
  Reflexiva : 1,
  Transitiva : 2,
  Antisimetrica : 3,  
  
};

function ParOrdenado(pA, pB, pTipo)
{
  this.a = pA;
  this.b = pB;
    this.tipo = pTipo;
    this.boolean;
    
    if(pTipo === TipoParOrdenado.Null)
        boolean = 0;
    else
        boolean = 1;
}


// Generar un numero aleatorio entero
function EnteroRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function GenerarElementos (pNumero, pRelacion) 
{
  var lista = "#text_Elementos";

    $(lista).html("");

    pRelacion.dominio = [];
    
    
    // Si es divisibilidad
    if($( "#id-tipo-relacion" ).val() === '5' ){
          for (var i = 1; i <= (pNumero + 1) / 2; i++)
            {
                if (pNumero % i === 0)
                {   
                  if(i!=pNumero + 1) $(lista).append(i + ", ");
                    else $(lista).append(i);
        
                    pRelacion.dominio.push(new Nodo(i));
                }
            }
            $(lista).append( pNumero );
            pRelacion.dominio.push(new Nodo(pNumero));
    }
    else{
        
        for (var i = 1; i <= $( "#id-elementos" ).val() ; i++)
            {
                   var randomito = EnteroRandom(1,999);
                   $(lista).append(randomito + ", ");
                 
        
                    pRelacion.dominio.push(new Nodo(randomito));
                
            }
            
           
    }
    
    
     
}




// Hasse
function Relacion2D()
{
  this.dominio = [];
  this.matriz = [];
  this.antisimetricas = [];
  this.nodosPorFila = [];
  
  this.esReflexiva;
  this.esIrreflexiva;
  this.esSimetrica;
  this.esAsimetrica;
    this.esAntisimetrica;
    this.esTransitiva;
    
  this.tipo;
  this.alto;
  this.ancho;

  this.r = function(pA, pB)
  {
      if(this.tipo === 'Divisibilidad')
      {
             if((pB % pA) === 0)
                return true; 
             else
                return false;
      }
      else if(this.tipo === 'MayorA') 
      {
             if(pB < pA)
                return true; 
             else
                return false;
      }
      else if(this.tipo === 'MayorIgualA')  
      {
             if(pB <= pA)
                return true; 
             else
                return false;
      }
      
       else if(this.tipo === 'MenorA')
      {
             if(pB > pA)
                return true; 
             else
                return false;
      }
      else if(this.tipo === 'MenorIgualA')
      {
             if(pB >= pA)
                return true; 
             else
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

    this.getReflexividad = function()
    {
        var reflexiva = true;
        var contador = 0;
        
        var Respuesta;
        var Justifificacion = '';
        
        for (var i = 0; i < this.dominio.length; i++) {
            if(this.matriz[i][i].boolean === 0)
            {
                reflexiva = false;
                Justifificacion += '(' + this.matriz[i][i].a.valor + ',' + this.matriz[i][i].b.valor + '), ';
                contador++;
            }
        }
        
        this.esReflexiva = reflexiva;

        if(reflexiva === true)
            Respuesta = "Si.";
        else
        {
            Justifificacion.slice(0,-3);
            Respuesta = "No, porque ";
            if(contador > 1)
                Justifificacion += " no son reflexivas.";
            else
                Justifificacion += " no es reflexiva..";
        
        }
            
            return Respuesta + Justifificacion;
    }
    
    this.getIrreflexividad = function()
    {
        var irreflexiva = true;
        var contador = 0;
        
        var Respuesta;
        var Justifificacion = '';
        
        for (var i = 0; i < this.dominio.length; i++) {
            if(this.matriz[i][i].boolean === 1)
            {
                irreflexiva = false;
                Justifificacion += '(' + this.matriz[i][i].a.valor + ',' + this.matriz[i][i].b.valor + '), ';
                contador++;
            }
        }
        
        this.esIrreflexiva = irreflexiva;

        if(irreflexiva === true)
            Respuesta = "Si.";
        else
        {
            Justifificacion.slice(0,-3);
            Respuesta = "No, porque ";
            if(contador > 1)
                Justifificacion += " no son reflexivas.";
            else
                Justifificacion += " no es reflexiva.";
        
        }
            
            return Respuesta + Justifificacion;
    }
    
    this.getSimetria = function()
    {
        var simetrica = true;
        var contador = 0;
        
        var Respuesta;
        var Justifificacion = '';
        
        for (var i = 0; i < this.dominio.length; i++) 
        {
            for (var j = 0; j < this.dominio.length; j++) 
            {
                if(this.matriz[i][j].boolean !== this.matriz[j][i].boolean && (i !== j))
                {
                    simetrica = false;
                    Justifificacion += '(' + this.matriz[i][j].a.valor + ',' + this.matriz[i][j].b.valor + '), ';
                    contador++;
                }
            }
        }
        
        this.esSimetrica = simetrica;

        if(simetrica === true)
            Respuesta = "Si.";
        else
        {
            Justifificacion.slice(0,-3);
            Respuesta = "No, porque ";
            if(contador > 1)
                Justifificacion += " no son simetricas..";
            else
                Justifificacion += " no es simetrica.";
        
        }
            
            return Respuesta + Justifificacion;
    }
    
    this.getAsimetria = function()
    {
        this.esAsimetrica = !(this.esSimetrica);
        
        if(this.esAsimetrica)
        return "Si.";
        else
        return "No.";
    }
    
    this.getAntimetria = function()
    {
        var antisimetrica = true;
        var contador = 0;
        
        var Respuesta;
        var Justifificacion = '';
        
        for (var i = 0; i < this.dominio.length; i++) 
        {
            for (var j = 0; j < this.dominio.length; j++) 
            {
                if(this.matriz[i][j].boolean === 1 && this.matriz[j][i].boolean === 1)
                {
                    antisimetrica = false;
                    Justifificacion += '(' + this.matriz[i][j].a.valor + ',' + this.matriz[i][j].b.valor + '), ';
                    contador++;
                }
            }
        }
        
        this.esAntisimetrica = antisimetrica;
        
        if(antisimetrica === true)
            Respuesta = "Si.";
        else
        {
            Justifificacion.slice(0,-3);
            Respuesta = "No, porque ";
            if(contador > 1)
                Justifificacion += " no son antisimetricas..";
            else
                Justifificacion += " no es antisimetrica.";
        
        }
            
            return Respuesta + Justifificacion;
    }
    
    this.getTransitiva = function()
    {
        this.esTransitiva = true;
        
        if(this.esTransitiva)
        return "Si.";
        else
        return "No.";
    }

    this.getMatriz = function()
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
      b = this.dominio[i];

      for (var j = 0; j < this.dominio.length; j++)
            {
                a = this.dominio[j];
                
                if(this.r(a.valor, b.valor))
                    this.matriz[i][j] = 1;
                else
                    this.matriz[i][j] = 0;
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
                
                if(this.r(a.valor, b.valor))
                { 
                  if(a.valor === b.valor)
                  {
                    this.matriz[i][j] = new ParOrdenado(a, b, TipoParOrdenado.Reflexiva);
                  }
                  else
                  {
                    this.matriz[i][j] = new ParOrdenado(a, b, TipoParOrdenado.Antisimetrica);
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

                if(this.r(A.valor, B.valor))
                {
                  this.matriz[k][j] = new ParOrdenado(A, B, TipoParOrdenado.Transitiva);
                }
              }
                  }
               }
               else
               {
                  this.matriz[i][j] = new ParOrdenado(a, b, TipoParOrdenado.Null);
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
                    if (this.matriz[i][j].tipo !== TipoParOrdenado.Null)
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




function DibujarHasse(pRelacion)
{
  var canvas = document.getElementById("idHasse");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height)
  
  context.beginPath();

  context.strokeStyle = '#e91e63';
    context.stroke();

    context.font="14px Segoe UI";
  
  
  var r;
  
    var factorX;
    var factorY;

    factorX = DATA_medida / (pRelacion.ancho);
    factorY = DATA_medida / (pRelacion.alto + 1);
    

   

    for (var i = 0; i < pRelacion.antisimetricas.length; i++)
    {
        r = pRelacion.antisimetricas[i];

        r.a.xScreen = r.a.x * factorX / 2;
        r.a.yScreen = DATA_medida - r.a.y * factorY - r.a.yDiff;

        r.b.xScreen = r.b.x * factorX / 2;
        r.b.yScreen = DATA_medida - r.b.y * factorY - r.b.yDiff;
        
        //Dibujar linea nodo a nodo
    context.moveTo(r.a.xScreen, r.a.yScreen);
    context.lineTo(r.b.xScreen, r.b.yScreen);     


    }

     // Dibujar Numeros (nodos)
    context.fillStyle='#ffffff';
    for (var i = 0; i < pRelacion.dominio.length; i++) 
    {
    context.fillText(pRelacion.dominio[i].valor, pRelacion.dominio[i].xScreen,  pRelacion.dominio[i].yScreen-5);
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

        var relacion = new Relacion2D(); 
        var min = intMin;
        var max = intMax;   
        var random = EnteroRandom(min, max);

        
        $("#block_conjunto").show();
        
        
        
        GenerarElementos(random,relacion);
        $("#text_Elementos").fadeIn('slow');
        
        
        
        //GET 
        
        // Check Elementos
        var cant_elementos = $( "#id-elementos" ).val();
      
        
        // Check tipo
        if  ($( "#id-tipo-relacion" ).val() === '1'){  relacion.tipo = 'MayorA';}
        else if($( "#id-tipo-relacion" ).val() === '2'){  relacion.tipo = 'MenorA';}
        else if($( "#id-tipo-relacion" ).val() === '3'){  relacion.tipo = 'MayorIgualA';}
        else if($( "#id-tipo-relacion" ).val() === '4'){  relacion.tipo = 'MenorIgualA';}
        else if($( "#id-tipo-relacion" ).val() === '5' ){  relacion.tipo = 'Divisibilidad'; }
        
        
        relacion.goHasse();
        
        var boolReflexiva = relacion.getReflexividad();
        var boolIrreflexiva = relacion.getIrreflexividad();
        var boolSimetrica = relacion.getSimetria();
        var boolAsimetrica = relacion.getAsimetria();
        var boolAntisimetrica = relacion.getAntimetria();
        var boolTransitiva = relacion.getTransitiva();
        
        // Imprimir Identificadores (Reflexividad, Simetria, etc)
        var target_identifi = 'ul#bloque_identificadores';
        $(target_identifi).html("");
        $(target_identifi).append("<li> <b>Es Reflexiva:</b> "+ boolReflexiva+"</li>");
        $(target_identifi).append("<li> <b>Es Irreflexiva:</b> "+ boolIrreflexiva+"</li>");
        $(target_identifi).append("<li> <b>Es Simétrica:</b> "+ boolSimetrica +"</li>");
        $(target_identifi).append("<li> <b>Es Asimetrica:</b> "+ boolAsimetrica+"</li>");
        $(target_identifi).append("<li> <b>Es Antisimetrica:</b> "+ boolAntisimetrica+"</li>");
        $(target_identifi).append("<li> <b>Es Transitiva:</b> "+ boolTransitiva+"</li>");
        
        //  if(relacion.esReflexiva && relacion.esSimetrica && relacion.esTransitiva)
        // {
       //       $(target_identifi).append("<li> <b>Es Relación de Equivalencia: Si.</b></li>");
        // }
        // else{
       //     $(target_identifi).append("<li> <b>Es Relación de Equivalencia: No.</b></li>");}
  

      
        
        

        //Notacion
        $("#idNotacion").html("");      
        
        $("#idNotacion").html(relacion.getNotacionConjuntos());
        
        //Antisimetricas
        $("#idAntisimetricas").html("");        
        for (var i = 0; i < relacion.antisimetricas.length; i++) 
        {
          $("#idAntisimetricas").html($("#idAntisimetricas").text() + relacion.antisimetricas[i].a.valor + "->" + relacion.antisimetricas[i].b.valor + ", "); 
        }
        
          //Hasse
        DibujarHasse(relacion);
                
                // Mostrar Resultados             
                $('#ShowResultados').fadeIn('slow');

                // Notificaciones
                myApp.closeNotification('.notification-item')
        myApp.addNotification({
          message: 'Éxito, conjunto generado aleatoriamente. ',
          button: {
            text: 'Cerrar'
          }

        });

      }
    );
  }
);