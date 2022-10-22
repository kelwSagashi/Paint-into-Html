var matrix = [];
var color = document.createElement('input');
var grid = document.getElementById("grid");
var largura = document.getElementById("largura");
var altura = document.getElementById("altura");
var brush = document.getElementById("brushsize");
var button = document.getElementsByClassName('button');
var PXaround_x = [];
var PXaround_y = [];
var atualselection = [];
var range_paint = brush.value;
var brushRotate = 0;

document.addEventListener('keypress', (event) => {
  var name = event.key;
  if(name === 'r') {
    brushRotate +=1
  }
  console.log(brushRotate);
  if(brushRotate === 4){
    brushRotate = 0;
  }
}, false);

var contador_x = 0;
var contador_y = 0;

color.type = 'color';
color.classList.add("color-picker");
document.getElementById("menu").appendChild(color);

grid.classList.add("grid-container");

document.body.appendChild(grid);

function setWidthHeight(){
  var pixel_width = grid.offsetWidth/largura.value;
  var pixel_height = grid.offsetHeight/altura.value;
  console.log(pixel_height, pixel_width, largura.value, altura.value);
  
  while (grid.firstChild){//apaga e recria o layaut do desenho com os parametros colocados
    grid.removeChild(grid.firstChild);
  }
  

  if (largura.value <= 100 || altura.value <= 100) {//defini o valor max de altura e largura
    for (var i = 0; i < largura.value; i++) {
      matrix[i] = [];
      for (var j = 0; j < altura.value; j++) {
        matrix[i][j] = document.createElement('ul');
        matrix[i][j].classList.add("pixel");
        matrix[i][j].id = i + ' ' + j;
        if(largura.value == altura.value){//caso largura e altura forem iguais exemplo 16 x 16
          matrix[i][j].style.width = pixel_width + 'px';
          matrix[i][j].style.height = pixel_height + 'px';
        }
        if(largura.value > altura.value){
          matrix[i][j].style.width = pixel_width + 'px';
          matrix[i][j].style.height = pixel_width + 'px';        
        }
        if(largura.value < altura.value){
          matrix[i][j].style.width = pixel_height + 'px';
          matrix[i][j].style.height = pixel_height + 'px';        
        }
        
        matrix[i][j].addEventListener('mouseover', function(e) {//aqui é onde a "caneta" pinta
          myFunction_set();

          if (e.which === 1) {//botao esquerdo do mouse pressionado    
            if(brush.value > 1) {//pinta de acordo com o tamanho do brush, *fins de teste* ja testado
              PXaround_x = new Array();
              PXaround_y = new Array();
              atualselection = new Array();
              atualselection = e.target.id.split(' ');
              atualselection[0] = parseInt(atualselection[0]);
              atualselection[1] = parseInt(atualselection[1]);

              contador_x = (brush.value) * (-1);
              contador_y = (brush.value) * (-1);

              for (var bs = 0; bs < (brush.value * 1); bs++) {
                PXaround_x.push(0);
                PXaround_y.push(0);
              }

              for (var index_range = 0; index_range < PXaround_x.length; index_range++) {
                contador_x +=1;
                contador_y +=1;

                //para x
                if(atualselection[0] != 0) {
                  PXaround_x[index_range] = (PXaround_x[index_range] + contador_x) + atualselection[0];
                }
                if(atualselection[0] == 0 && index_range < PXaround_x.length/2) {
                  PXaround_x[index_range] = 0 + atualselection[0];
                }
                if(atualselection[0] == 0 && index_range > PXaround_x.length/2) {
                  PXaround_x[index_range] = (PXaround_x[index_range] + contador_x) + atualselection[0];
                }
                //para y
                if(atualselection[1] != 0) {
                  PXaround_y[index_range] = (PXaround_y[index_range] + contador_y) + atualselection[1];
                }
                if(atualselection[1] == 0 && index_range < PXaround_x.length/2) {
                  PXaround_y[index_range] = 0 + atualselection[1];
                }
                if(atualselection[1] == 0 && index_range > PXaround_x.length/2) {
                  PXaround_y[index_range] = (PXaround_y[index_range] + contador_y) + atualselection[1];
                }
              }
              
            }

            var teste = '';
            
            if (brush.value > 1) {
              for (var rangeOfbrushx = 0; rangeOfbrushx < PXaround_x.length; rangeOfbrushx++) {
                for (var rangeOfbrushy = 0; rangeOfbrushy < PXaround_y.length; rangeOfbrushy++) {
                  var alphacolor = 0;
                  teste = document.getElementById(PXaround_x[rangeOfbrushx] + ' ' + PXaround_y[rangeOfbrushy]);
                  if (teste == null) {
                    return;
                  }else{
                    /*if (brushRotate == 0)
                    {
                      alphacolor = PXaround_x.length - rangeOfbrushx;
                    }*/

                    //teste.style.backgroundColor = color.value;
                    teste.style.backgroundColor = hexToRGB_Brush(color.value, 1);//tento fazer variaçoes da cor
                    //de acordo com o tamanho do brush
                    alphacolor -= 0.2;
                  }
                }
              }
            }
            this.style.backgroundColor = color.value; 
          }
        });
        matrix[i][j].addEventListener('click', function(cli) {//quando clicar tambem é possivel pintar
          this.style.backgroundColor = color.value;//talvez seja redundante, mas é só pra garantir
        });
        grid.appendChild(matrix[i][j]);//adicono as caixas que representarão os pixel 
      }
    }
    //alert(document.querySelectorAll('#grid li').length);
  }
  else{//se o tamanho informado pelo usuario for muito grande surge o alerta
    alert("apenas 100px");
  }
}

var root = document.querySelector(':root');//

function myFunction_set() {
  hexToRGB(color.value, 0.3);
}

function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  var rgbaColor = 0;

  if (alpha) {
      rgbaColor = "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      root.style.setProperty('--cor', rgbaColor);
      root.style.setProperty('--cor2', color.value);
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    rgbaColor = "rgb(" + r + ", " + g + ", " + b + ")";
    root.style.setProperty('--cor', rgbaColor);
    root.style.setProperty('--cor2', color.value);
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

//o nome da função já diz
function hexToRGB_Brush(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  }
}

//função acima retirada do site https://code-examples.net/pt/q/10f36#:~:text=Para%20IE%20%3C10%20e%20Opera%2C%20voc%C3%AA%20precisar%C3%A1%20usar,um%20atributo%20em%20HTML%3A%20%3Cdiv%20id%3D%22foo%22%20unselectable%3D%22on%22%20class%3D%22unselectable%22%3E...%3C%2Fdiv%3E

//para nao selecionar as UL enquanto desenha
//talvez ela não faça nenhuma modificação, mas vou deixar ai
function makeUnselectable(node) {
  if (node.nodeType == 1) {
      node.setAttribute("unselectable", "on");
  }
  var child = node.firstChild;
  while (child) {
      makeUnselectable(child);
      child = child.nextSibling;
  }
}

makeUnselectable(document.getElementById("grid"));