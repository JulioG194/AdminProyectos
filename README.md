# GuGo-Web

Es la versión web de la aplicación de administración de proyectos, y control de tareas, con envío de notificaciones en tiempo real.

## Tecnologías usadas

- Angular
- Angular material
  

Los datos del sistema como bases de datos, autenticación y notificaciones se [encuentran configurados en Firebase](https://firebase.google.com/).

## Instalación


1. Descarga el código fuente
2. Descarga e instala `nodeJS` en tu computador, lo puedes [descargar su página oficial para Windows ó Mac](https://nodejs.org/es/download/)
3. [Descarga VSCode](https://code.visualstudio.com/download) para visualizar el código fuente y correr el proyecto
4. Ejecuta VSCode, presiona `Ctrl + O` ó `Command + O` para seleccionar el directorio del proyecto
5. Una vez seleccionado el proyecto presiona `Ctrl + J` ó `Command + J`, esto abrirá una terminal en la parte inferior de la pantalla
6. Nos posicionamos en la terminal e ingresamos el siguiente comando y esperamos a que termine
   ```
   npm install
   ```
7. Una vez termine el comando anterior ejecutamos el siguiente comando:
   ```
   ng serve -o
   ```
8. Abrimos nuestro navegador prefereido (recomendación abrir Chrome) y vamos a la siguiente dirección [http://localhost:4200](http://localhost:3000)

## Funcionalidades

- Flujo de autenticación del usuario
- Flujo de registro de un usuario
- Flujo de recuperación de contraseña
- Flujo de creación de Proyectos
- Flujo de creación de Actividades
- Flujo de creación de Tareas
- Flujo de creación de Cronograma
- Flujo de notificaciones
- Flujo de chat
- Conexión con Firebasae Auth, Firestore y Push Notifications
- Login con email

**Creadores:** 
- Julio González
- Alexandra Gualotuña

**Dirigido por:** 
- Ing. Pablo Hidalgo
               
