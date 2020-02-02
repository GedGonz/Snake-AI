function snakeAILoop(game) {

    let _nuevaDireccion = 'E';
    let PASOS = 1;

    ConfiurarConteo(this);
    let _posicionActual = new Position(this.getHead().x, this.getHead().y);

    _nuevaDireccion = buscarComida(this.direction, game.food, _posicionActual);
    _nuevaDireccion = CambiarDireccionOpuesta(this.direction, _nuevaDireccion);

    let nuevopaso = agregarPaso(_nuevaDireccion, this.getHead().x, this.getHead().y, PASOS);

    let _estaEnElLimite = estaEnElLimite(this.direction, _nuevaDireccion, nuevopaso, game.width, game.height);

    let _tieneObstaculo = tienObstaculo(game.obstacles, nuevopaso);

    let _chocaranSusCuerpo = chocaraConUnCuerpo(_nuevaDireccion, this.body, _posicionActual.x, _posicionActual.y);

    let _chocaraConOtraSnake = (game.snakes.length > 1) ?
        chocaraConUnCuerpo(_nuevaDireccion, game.snakes[1].body, _posicionActual.x, _posicionActual.y) :
        false;

    let nohayComida = (!_nuevaDireccion);

    var _cambiardeDireccion = (_tieneObstaculo || _chocaranSusCuerpo || _estaEnElLimite || nohayComida || _chocaraConOtraSnake);

    _nuevaDireccion = (_cambiardeDireccion) ? CambiardeDireccion(this.direction, game, this.getHead().x, this.getHead().y) : _nuevaDireccion;

    return _nuevaDireccion;
};

function ConfiurarConteo(snake) {

    if (!snake.memory.counter) {
        snake.memory.counter = (snake.body.length);
    }

    let LongitudSnake = (snake.body.length - snake.memory.counter);

    if (LongitudSnake == 1000) {

        console.log("Lo hice!! XD");
    }
}

function CambiardeDireccion(direccionActual, game, x, y) {

    let PASOS = 1;
    let _tieneObstaculo = true;
    let _chocaranSusCuerpo = true;
    let countIntentos = 0;
    let _estaEnElLimite = true;
    let _chocaraConOtraSnake = true;
    let obstaculos = game.obstacles;
    let cuerpo = game.snakes[0].body;

    let nuevaDireccion;


    while (_tieneObstaculo || _chocaranSusCuerpo || _estaEnElLimite || _chocaraConOtraSnake) {

        nuevaDireccion = ObtenerDireccion();
        nuevaDireccion = CambiarDireccionOpuesta(direccionActual, nuevaDireccion);
        let nuevopaso = agregarPaso(nuevaDireccion, x, y, PASOS);

        _tieneObstaculo = tienObstaculo(obstaculos, nuevopaso);

        _estaEnElLimite = estaEnElLimite(direccionActual, nuevaDireccion, nuevopaso, game.width, game.height);

        _chocaranSusCuerpo = chocaraConUnCuerpo(nuevaDireccion, cuerpo, x, y);

        _chocaraConOtraSnake = (game.snakes.length > 1) ?
            chocaraConUnCuerpo(nuevaDireccion, game.snakes[1].body, x, y) : false;

        countIntentos += 1;

        if (countIntentos >= 50) {
            console.log(`No encontro salida en ${countIntentos} intentos`);
            break;
        }
    }

    return nuevaDireccion;
}

function buscarComida(direccionactual, comidas, poiscion) {

    let direccion;
    let ComidaCercana = comidamasCercana(comidas, poiscion.x);

    if (ComidaCercana) {
        if (direccionactual == 'E') {
            if (poiscion.x > ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'S';
                } else {
                    direccion = 'N'
                }

            } else if (poiscion.x < ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'S';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'E'
                } else {
                    direccion = 'N'
                }
            } else if (poiscion.x == ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'E';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'E'
                } else {
                    direccion = 'N'
                }
            }

        }
        if (direccionactual == 'S') {
            if (poiscion.x > ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'S';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'W'
                } else {
                    direccion = 'W'
                }

            } else if (poiscion.x < ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'S';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'E'
                } else {
                    direccion = 'W'
                }
            } else if (poiscion.x == ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'S';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'S'
                } else {
                    direccion = 'E'
                }
            }

        }
        if (direccionactual == 'W') {
            if (poiscion.x > ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'W';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'W'
                } else {
                    direccion = 'N'
                }

            } else if (poiscion.x < ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'S';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'N'
                } else {
                    direccion = 'N'
                }
            } else if (poiscion.x == ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'S';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'W'
                } else {
                    direccion = 'N'
                }
            }

        }
        if (direccionactual == 'N') {
            if (poiscion.x > ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'W';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'W'
                } else {
                    direccion = 'N'
                }

            } else if (poiscion.x < ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'E';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'E'
                } else {
                    direccion = 'N'
                }
            } else if (poiscion.x == ComidaCercana.x) {
                if (poiscion.y < ComidaCercana.y) {
                    direccion = 'E';
                } else if (poiscion.y == ComidaCercana.y) {
                    direccion = 'N'
                } else {
                    direccion = 'N'
                }
            }

        }
    }
    return direccion;
}

function comidamasCercana(comidas, num) {
    let i = 0;
    let MenorDiferencia = 1000;
    let nuevaPosicion;
    for (i in comidas) {
        let m = Math.abs(num - comidas[i].x);
        if (m < MenorDiferencia) {
            MenorDiferencia = m;
            nuevaPosicion = new Position((comidas[i].x), (comidas[i].y));
        }
    }
    return nuevaPosicion;
}

function tienObstaculo(obstaculo, posicion) {

    let hayObstaculo = false;

    hayObstaculo = (obstaculo) ? obstaculo.some(cuerpo => { return (posicion.x == cuerpo.x && posicion.y == cuerpo.y); }) : false;

    return hayObstaculo;
}

function chocaraConUnCuerpo(direccion, cuerposnake, x, y) {

    let hayObstaculo = false;
    let PASOS = 1;
    hayObstaculo = cuerposnake.some(body => {
        let posicion = agregarPaso(direccion, x, y, PASOS++);
        return cuerposnake.some(cuerpo => { return (posicion.x == cuerpo.x && posicion.y == cuerpo.y); });
    })
    return hayObstaculo;
}


function agregarPaso(direction, x, y, nPasos) {

    let newPosition = new Position(x, y);

    switch (direction) {
        case 'N':
            newPosition.y -= nPasos;
            break;
        case 'E':
            newPosition.x += nPasos;
            break;
        case 'S':
            newPosition.y += nPasos;
            break;
        case 'W':
            newPosition.x -= nPasos;
            break;
    }

    return newPosition;
}

function ObtenerDireccion() {

    let directions = ['N', 'E', 'S', 'W'];
    let index = Math.floor(Math.random() * directions.length);
    let Direction = directions[index];

    return Direction;
}

function CambiarDireccionOpuesta(direccionActual, nuevadireccion) {
    let Direccion;

    switch (direccionActual) {
        case 'N':
            Direccion = nuevadireccion == 'S' ? 'E' : nuevadireccion;

            break;

        case 'E':
            Direccion = nuevadireccion == 'W' ? 'N' : nuevadireccion;

            break;

        case 'S':
            Direccion = nuevadireccion == 'N' ? 'E' : nuevadireccion;

            break;

        case 'W':
            Direccion = nuevadireccion == 'E' ? 'N' : nuevadireccion;

            break;
    }

    return Direccion;
}

function estaEnElLimite(direccionacutal, nuevadireccion, snakeHead, width, height) {


    let retorno = (snakeHead.x < 0 || snakeHead.x >= width || snakeHead.y < 0 || snakeHead.y >= height);

    console.log(`DIRECCION ACTUAL = ${direccionacutal} DIRECION NUEVA ${nuevadireccion}`);
    console.log(`POSICION SNAKE: X= ${snakeHead.x} Y= ${snakeHead.y}`);
    console.log(`RETORNO = ${retorno}`);

    return retorno;
}