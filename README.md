# 🌍 Fun With Flags

**Fun With Flags** es un juego móvil de preguntas y respuestas desarrollado con React Native y Expo. El objetivo es poner a prueba los conocimientos de geografía mediante banderas y capitales de distintos países del mundo.

El juego utiliza APIs para obtener información de países y sus banderas, e incorpora un sistema de puntuación, un temporizador, pistas y un ranking de jugadores.

## 🎮 Funcionalidades

- **Adivinar banderas:** observar una bandera e ingresar el nombre del país al que pertenece.
- **Modo capitales:** seleccionar la capital correcta entre tres opciones.
- **Sistema de puntuación:** sumar 10 puntos por cada respuesta correcta y restar 1 punto por cada respuesta incorrecta.
- **Temporizador:** contar con 15 segundos para responder cada pregunta.
- **Puntos adicionales:** sumar los segundos restantes cuando se responde correctamente.
- **Sistema de pistas:** revelar letras del nombre del país o de su capital a cambio de 2 segundos.
- **Ranking de jugadores:** guardar y mostrar los mejores puntajes.
- **Almacenamiento persistente:** conservar el ranking mediante AsyncStorage.
- **Selección aleatoria:** elegir países al azar para generar nuevas preguntas.
- **Interfaz móvil:** diseño adaptable para utilizar el juego desde un dispositivo físico.

## 🛠️ Tecnologías utilizadas

- [React Native](https://reactnative.dev/): desarrollo de la interfaz móvil.
- [Expo](https://expo.dev/): herramientas para desarrollar y ejecutar la aplicación.
- JavaScript: lenguaje de programación.
- React Context API: administración compartida del estado y de la lógica del juego.
- `useState`: gestión del estado.
- `useEffect`: carga inicial de datos y control del temporizador.
- `useContext`: acceso al contexto desde los componentes.
- `createContext`: creación del contexto global.
- AsyncStorage: almacenamiento local y persistente del ranking.
- Fetch API: consulta de datos externos.

## 🌐 APIs utilizadas

### 1. Banderas y países

**Endpoint:**

https://countriesnow.space/api/v0.1/countries/flag/images

Esta API proporciona información sobre países y sus banderas, que se utilizan en el modo de adivinanza.

### 2. Capitales

**Endpoint:**

https://countriesnow.space/api/v0.1/countries/capital

Esta API proporciona los nombres de las capitales que se utilizan en el modo capitales.

La aplicación combina la información obtenida de ambas APIs para relacionar cada país con su bandera y su capital.

## 📁 Estructura del proyecto

```text
FunWithFlags/
├── App.js
├── README.md
├── package.json
└── src/
    ├── context/
    │   └── GameContext.js
    └── components/
        ├── Flag.jsx
        ├── GuessForm.jsx
        ├── ScoreBoard.jsx
        ├── Timer.jsx
        └── Leaderboard.jsx
```

### Descripción de los archivos

| Archivo | Responsabilidad |
|---|---|
| `App.js` | Define la pantalla principal y envuelve la aplicación con `GameProvider`. |
| `GameContext.js` | Centraliza los estados y las funciones del juego. |
| `Flag.jsx` | Muestra la bandera del país seleccionado. |
| `GuessForm.jsx` | Permite ingresar respuestas, seleccionar opciones y solicitar pistas. |
| `ScoreBoard.jsx` | Muestra el puntaje y el nombre del jugador. |
| `Timer.jsx` | Visualiza el tiempo restante de cada ronda. |
| `Leaderboard.jsx` | Muestra los mejores puntajes almacenados. |

## 🧠 Administración del estado con Context

La aplicación utiliza un contexto llamado `GameContext`, creado mediante `createContext` y consumido mediante `useContext`.

El contexto es accesible a través de `GameProvider`, que envuelve los componentes de la aplicación. De esta manera, los componentes pueden acceder directamente a los datos y las funciones compartidas, sin necesidad de pasar información mediante props.

Entre los estados administrados se encuentran:

- Lista de países.
- País actual.
- Puntaje del jugador.
- Nombre del jugador.
- Modo de juego seleccionado.
- Tiempo restante.
- Pistas reveladas.
- Opciones de respuesta.
- Ranking de jugadores.
- Estado de la partida y mensajes de respuesta.

Esta organización permite mantener la lógica del juego centralizada y separar la administración de datos de la presentación visual.

## 📊 Reglas del juego

| Acción | Resultado |
|---|---|
| Respuesta correcta | +10 puntos y puntos adicionales según el tiempo restante. |
| Respuesta incorrecta | −1 punto. |
| Solicitar una pista | −2 segundos. |
| Tiempo agotado | Se finaliza la ronda y se pasa a otra pregunta. |
| Terminar partida | Se guarda el resultado en el ranking. |

El temporizador comienza en 15 segundos para cada nueva ronda.

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js instalado.
- Visual Studio Code u otro editor de código.
- Expo Go instalado en un dispositivo móvil físico.
- Conexión a internet para consultar las APIs.

### 1. Clonar el repositorio

Si el proyecto está publicado en GitHub, ejecutar:

```bash
git https://github.com/kiaribrukk/TP13_Banderas.git
```

### 2. Entrar en la carpeta

```bash
cd TP13_Banderas
```

### 3. Instalar las dependencias

```bash
npm install
npx expo install @react-native-async-storage/async-storage
```

### 4. Iniciar la aplicación

```bash
npx expo start --tunnel
```

### 5. Ejecutar en un dispositivo físico

1. Abrir Expo Go en el celular.
2. Escanear el código QR que aparece al iniciar Expo.
3. Esperar a que se cargue la aplicación.
4. Comprobar que se muestren las banderas y que las preguntas funcionen correctamente.

**Importante:** la aplicación debe probarse en un dispositivo móvil físico mediante Expo Go, según el requisito de entrega. La ejecución en el navegador de la computadora no reemplaza esta prueba.

## 🏆 Ranking

Los resultados se almacenan localmente mediante AsyncStorage, utilizando la clave:

```text
@fun_with_flags_ranking
```

El ranking conserva los mejores diez resultados registrados y permite consultar las puntuaciones entre sesiones en el mismo dispositivo.

## 🔮 Posibles mejoras futuras

- Agregar más modos de juego y categorías geográficas.
- Incorporar niveles de dificultad.
- Evitar que se repitan países hasta completar una vuelta.
- Mejorar las animaciones y los mensajes visuales.
- Incorporar estadísticas de partidas y porcentajes de aciertos.
- Implementar un ranking compartido entre distintos dispositivos mediante un servidor.

## 👩‍💻 Autora

Proyecto académico desarrollado como práctica de programación móvil con React Native y Expo.

## 📄 Licencia

Proyecto desarrollado con fines educativos.
