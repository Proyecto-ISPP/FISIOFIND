---
title: "GUIA DE USO Y REVISIÓN"                           # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 2"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "11/03/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"  # CHANGE IF NEEDED
header-left: "GUIA DE USO Y REVISIÓN"                     # CHANGE IF NEEDED
header-right: "27/03/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  GUIA DE USO Y REVISIÓN
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. ACCESO A LA APLICACIÓN](#2-acceso-a-la-aplicación)
- [3. DESCRIPCIÓN DE FUNCIONALIDADES NO TERMINADAS](#3-descripción-de-funcionalidades-no-terminadas)
- [4. DESCRIPCIÓN DE LOS CASOS DE USO MVP](#4-descripción-de-los-casos-de-uso-mvp)
  - [4.1. Cuestionario de preintervención](#41-cuestionario-de-preintervención)
  - [4.2. Solicitud de una cita](#42-solicitud-de-una-cita)
  - [4.3. Gestión del calendario](#43-gestión-del-calendario)
  - [4.4. Videollamada y herramientas de la videollamada](#44-videollamada-y-herramientas-de-la-videollamada)
  - [4.5. Gestión de subida de archivos](#45-gestión-de-subida-de-archivos)
  - [4.6. Planes de precio](#46-planes-de-precio)
  - [4.7. Tratamientos](#47-tratamientos)
- [5. DESPLIEGUE LOCAL](#5-despliegue-local)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->


<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND
- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 2

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** [Delfín Santana Rubio](https://github.com/DelfinSR) (autor)

- **Fecha de Creación:** 27/03/2025  

- **Versión:** v1.0

<br>

<!-- \newpage -->

<br>


---

**Historial de modificaciones**

| Fecha          | Versión  | Realizada por            | Descripción de los cambios                |
| -------------- | -------- | ------------------------ | ----------------------------------------- |
|  27/03/2025    | v1.0     | Delfín Santana Rubio   | Versión inicial del documento             |

<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

FISIOFIND es una plataforma de consulta en línea diseñada para conectar fisioterapeutas y pacientes. La aplicación permite la gestión de citas, realización de consultas virtuales y procesamiento de pagos, facilitando la organización y seguimiento de sesiones terapéuticas de forma segura y eficiente. La solución se orienta a dos grandes grupos de usuarios: fisioterapeutas y pacientes.

En este documento, se detalla una guía para el despliegue en local de la apliación además de un desglose en detalle para la realización de las prueba del MVP.



<br>

<!-- \newpage -->

<br>


# 2. ACCESO A LA APLICACIÓN

Se podrá acceder a nuestra aplicación desplegada mediante el siguiente enlace: https://s2.fisiofind.com/

Además, se podrá visitar nuestra landing page en la que nos publicitamos en: https://fisiofind-landing-page.netlify.app/

Toda nuestra documentación actualizada en: https://fisiofind.vercel.app/ 

Y, nuestro repositorio en GitHub: https://github.com/Proyecto-ISPP/FISIOFIND 

Una vez en nuestra aplicación, se podrá acceder sin necesidad de iniciar sesión a nuestra página principal y realizar una primeras búsquedas de fisioterapeutas. De todas formas, para probar nuestras funcionalidades completas, facilitamos los siguientes credenciales:

El panel de admin hemos decidido utilizar un subdominio para tenerlo. Esta práctica está recomendada desde el punto de vista de la seguridad y es una práctica extendida: https://s2-api.fisiofind.com/admin
. No obstante, el administrador puede iniciar sesión en el frontend para editar los documentos legales más fácilmente.

Credenciales: 

- Administrador:
  - Username: Administrador
  - Password: 65471364R65471364R

- Fisioterapeuta 1:
  - Username: Alberto
  - Password: 20029911Q20029911Q

- Fisioterapeuta 2:
  - Username: Lucía
  - Password: 41653473J41653473J
  
- Paciente 1: 
  - Username: Nerea
  - Password: 92956178E92956178E
  
- Paciente 2: 
  - Username: Claudia
  - Password: 36372053Z36372053Z


Video demo: [https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/demo_2.webp](https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/demo_2.webm)

URL Clokify: [Tiempo S2](https://app.clockify.me/shared/67e5978c492c8e6e4f275422)

La aplicación implementa validación de fisioterapeutas por número de colegiado. Si se quiere crear un nuevo fisioterapeuta se recomienda coger datos de estas urls que tienen datos de colegiados:
- Aragón: https://ventanilla.colfisioaragon.org/buscador-colegiados
- Cantabria: https://colfisiocant.org/busqueda-profesionales/
- Galicia: https://www.cofiga.org/ciudadanos/colegiados
- Madrid: https://cfisiomad.com/#/ext/buscarcolegiado
- Murcia: https://cfisiomurcia.com/buscador-de-colegiados/
- Andalucía: https://colfisio.org/registro-censo-fisioterapeutas
- Asturias: https://www.cofispa.org/censo-colegiados
- Islas Baleares: http://www.colfisiobalear.org/es/area-social-y-ciudadana/profesionales-colegiados/
- Islas Canarias: https://www.consejo-fisioterapia.org/vu_colegiados.html
- Castilla-La mancha: https://www.coficam.org/ventanilla-unica/censo-colegial
- Extremadura: https://cofext.org/cms/colegiados.php
- Castilla y León: https://www.consejo-fisioterapia.org/vu_colegiados.html
- Cataluña: https://www.fisioterapeutes.cat/es/ciudadanos/profesionales
- La Rioja: https://www.coflarioja.org/ciudadanos/listado-de-fisioterapeutas/buscar-colegiados
- Navarra: https://www.consejo-fisioterapia.org/vu_colegiados.html
- País Vasco: https://cofpv.org/es/colegiados.asp
- Comunidad Valenciana: https://app.colfisiocv.com/college/collegiatelist/

<br>

<!-- \newpage -->

<br>


# 3. DESCRIPCIÓN DE FUNCIONALIDADES NO TERMINADAS

Las funcionalidades de cuestionarios en la videollamada y seguimiento está avanzado pero no está terminado. Por esta razón, estas funcionalidades se encuentran mockeadas.

El siguiente caso de uso a veces da errores porque el servidor lo detecta como spam. En local si se ha conseguido que funcione el 100% de las veces. Por eso lo ponemos aquí. De todas formas, consideramos este caso de uso como un plus de funcionalidad.

Caso de uso:
1. El fisioterapeuta o el paciente modifica el estado de una cita (crea una cita, acepta una cita, etc.).
2. Según la acción ejecutada, el fisioterapeuta o el paciente reciben un correo de notificación de la acción.
3. Dependiendo de lo que ha causado la acción de notificación, se podrán hacer acciones desde el propio correo (botones que abren links en Fisio Find que ejecutan acciones).


# 4. DESCRIPCIÓN DE LOS CASOS DE USO MVP

En esta sección se explican los casos de uso que se entregan para el Sprint 2. Muchos de estos casos ya se prueban en la demo.

# 4.1. **Cuestionario de preintervención**

Caso de uso 1:
1. Un usuario (paciente o que o ha iniciado sesión) accede a la vista de reservar una cita con un fisioterapeuta.
2. Cuando selecciona el servicio y avanza en la vista, se le muestra un cuestionario de preintervención (porque se hace antes de la intervención) diseñado por el fisioterapeuta.
3. El usuario rellena el cuestionario, avanza en la vista y termina de reservar la cita.

Caso de uso 2:
1. Un fisioterapeuta accede a su la vista de edición de su perfil.
2. Hay una sección para modificar sus servicios y sus cuestionarios de preintervención asociados.
3. El fisioterapeuta crea o edita un servicio o un cuestionario de preintervención.
4. Cuando el fisioterapeuta guarda, el sistema queda actualizado.

# 4.2. **Solicitud de una cita**

Caso de uso 3:
1. Un usuario con rol paciente busca por especialidad en la página principal.
2. Se muestran los fisioterapeutas que tienen esa especialidad.
3. El paciente hace click en un fisioterapeuta.
4. Le lleva a una vista de reservar cita, en la que se muestra los servicios disponibles del fisioterapeuta y las fechas y horarios disponibles para la cita según avanza en la vista.
5. Cuando la vista lo muestre en el proceso, el paciente rellena el cuestionario de preintervención asociado al servicio seleccionado.
6. En el proceso, el usuario puede pagar y generar una factura.
7. El paciente finalmente la acepta.

# 4.3. **Gestión del calendario**

Caso de uso 4:
1. Un fisioterapeuta entra en la sección de sus citas.
2. Puede visualizar las citas que han seleccionado los pacientes.
3. El fisioterapeuta puede aceptar la cita, cancelarla o proponer un cambio. No puede cambiar el horario de la cita sin enviar una propuesta de cambio y que el paciente lo acepte.
4. Si el paciente acepta el cambio, la cita queda confirmada.

# 4.4. **Videollamada y herramientas de la videollamada**
Actualmente esta funcionalidad tiene una sección que se plantea integrar en el siguiente sprint  y está mockeado en la vista de videollamada. No se ha eliminado para no tener que rehacerlo después.

Caso de uso 5:
1. Un fisioterapeuta abre la sección de videollamadas.
2. El sistema detecta que es un usuario con rol de fisioterapeuta y le deja crear una sala.
3. Al crear la sala se crea un código de sala (necesario para que el paciente pueda acceder).
4. El fisioterapeuta envía el código al paciente por un método fuera de la plataforma.
5. El fisioterapeuta puede ver al paciente y hablar con él cuando este se conecte.

Caso de uso 6:
1. Un paciente abre la sección de videollamadas.
2. El sistema detecta que es un paciente y le permite introducir el código que le ha facilitado el fisioterapeuta.
2. Se une a la sala con el código que le ha pasado el fisioterapeuta.
3. El paciente puede ver al fisioterapeuta y hablar con él cuando este se conecta.

Caso de uso 7:
1. Un fisioterapeuta se conecta con un paciente a una videollamada.
2. El fisioterapeuta comparte su pantalla para compartir lo que necesite de su dispositivo.
3. El paciente lo visualiza correctamente.
4. El fisioterapeuta deja de compartir pantalla y vuelve a verse su cámara.

Caso de uso 8:
1. Un fisioterapeuta se conecta con un paciente a una videollamada.
2. El fisioterapeuta y el paciente tienen funcionalidades generales de videollamadas (silenciar audio, dejar de compartir cámara, etc.) y un chat para poder hablar.
3. Estas funcionalidades pueden activarse y desactivarse y no causan problemas con la videollamada.

Caso de uso 9:
1. Un fisioterapeuta se conecta con un paciente a una videollamada.
2. El fisioterapeuta tiene acceso a mapas de dolor (cuerpos humanos con los que se puede interactuar) que puede enviar al paciente como herramienta para ejercer su labor.
3. Cuando el paciente recibe el mapa de dolor, el fisioterapeuta y el paciente pueden interaccionar en tiempo real con el mapa de dolor.
4. Cuando el fisioterapeuta deja de necesitar el mapa de dolor, puede dejar de compartirlo.
5. Si el fisioterapeuta vuelve a enviar el mapa de dolor, el estado en el que se dejó se recupera. Esto solo funciona durante la videollamada (hasta que se cuelga o se recarga la página).

Caso de uso 10:
1. Un fisioterapeuta se conecta con un paciente a una videollamada.
2. El fisioterapeuta dispone de modelos 3D del cuerpo humano (sus músculos) y de ciertos músculos que resultan interesantes para un fisioterapeuta.
3. El fisioterapeuta puede resolver sus dudas anatómicas o tener referencia para ayudar al paciente.
4. El fisioterapeuta también puede compartir pantalla para poder enseñárselo al paciente.

# 4.5. **Gestión de subida de archivos**

Actualmente, estamos trabajando en el plus de funcionalidad de poder actualizar un archivo subido(editar título,descripción,etc.). Sin embargo, esta funcionalidad actualmente no está terminada porque solo funciona con los ids de los pacientes. No la borramos para no tener que rehacerla, pero está pensada para terminarse en el S3 ya que es un añadido a la funcionalidad de subir archivo.

Caso de uso 11:
1. El fisioterapeuta entra en la sección de subida de archivos.
2. Selecciona el archivo que quiere subir y pone un título, una descripción, y los emails de los pacientes a los que quiere enviárselo.
3. Si se equivoca en el correo (correo que no existe, mal escrito, que no pertenece a ningún paciente, etc.), el sistema lo notifica.
4. Cuando completa el formulario, se añade una nueva entrada dentro del listado de archivos que ha subido.
5. Cuando el fisio deja de querer compartir el material, borra la entrada y así el sistema se actualiza y se deja de compartir.

Caso de uso 12:
1. El paciente entra en la sección de archivos.
2. El paciente puede ver e interactuar con los archivos que les han enviado fisioterapeutas.

# 4.6. **Planes de precio**

Caso de uso 13:
1. Un fisioterapeuta no registrado quiere abrirse una cuenta en fisio find
2. Accede a la vista de registrarse como fisioterapeuta
3. Avanza rellenando campos hasta que se le da a elegir un plan de precio
4. Cuando lo selecciona se permite seguir con el registro y finalmente completarlo

# 4.7. **Tratamientos**

Caso de uso 14:
1. Un fisioterapeuta entra en la sección de tratamientos.
2. En ella puede ver aquellos pacientes con los que tiene un tratamiento, que son aquellos con los que tiene una cita finalizada.
3. El fisioterapeuta entra en uno de los tratamientos y ve un resumen de la información tratamiento (algunos elementos, como la gráfica, están mockeados).
4. Entra en la sección de nuevo ejercicio y puede crear un nuevo ejercicio desde cero o seleccionar uno existente.

Caso de uso 15:
1. Un fisioterapeuta entra en la sección de tratamientos
2. En ella puede ver aquellos pacientes con los que tiene un tratamiento
3. El fisioterapeuta entra en uno de los tratamientos y modifica algún dato
4. Cuanto termina, acepta el cambio y el sistema se actualiza

<br>

<!-- \newpage -->

<br>


# 5. DESPLIEGUE LOCAL

Por último, en este epígrade se muestran las instrucciones para la puesta en funcionamiento del proyecto en un entorno local. También se pueden consular estas instrucciones en el archivo README del proyecto: https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/README.md 


## Despliegue Local

###  Prerrequisitos

Antes de comenzar con FISIOFIND, asegúrese de que su entorno de ejecución cumpla con los siguientes requisitos:

- **Lenguaje de Programación:** Python
- **Gestor de Paquetes:** Npm, Pip
- **Base de Datos:** Postgres


###  Instalación

Instale FISIOFIND utilizando uno de los siguientes métodos:

1. Clone el repositorio de FISIOFIND:
```sh
❯ git clone https://github.com/Proyecto-ISPP/FISIOFIND
```

1. Navegue al directorio del proyecto:
```sh
❯ cd FISIOFIND
```

1. Instale las dependencias del proyecto:

**Usando `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

Primero, cree y active un entorno virtual de Python en el directorio `backend`:

```sh
❯ cd backend
❯ python -m venv venv
❯ source venv/bin/activate
```
Luego proceda a instalar las dependencias:

```sh
❯ pip install -r requirements.txt
```
**Usando `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

Ahora instalamos las dependencias del framework frontend en el directorio `frontend`:

```sh
❯ cd ../frontend
❯ npm install
```

### Configuración de la Base de Datos

Para configurar la base de datos para FISIOFIND, siga estos pasos:

1. **Crear la Base de Datos:**

  Asegúrese de tener PostgreSQL instalado y en ejecución. Luego, cree una nueva base de datos llamada `fisiofind`:

  ```sh
  ❯ psql -U postgres
  postgres=# CREATE DATABASE fisiofind;
  postgres=# \q
  ```

2. **Configurar Variables de Entorno:**

  Copie el archivo `.env.example` para crear un nuevo archivo `.env` en el directorio `backend`:

  ```sh
  ❯ cd backend
  ❯ cp .env.example .env
  ```

  Abra el archivo `.env` y actualice la configuración de la base de datos con sus credenciales de PostgreSQL:

  ```env
  DATABASE_NAME=fisiofind
  DATABASE_USER=your_postgres_user
  DATABASE_PASSWORD=your_postgres_password
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  ```

  Reemplace `your_postgres_user` y `your_postgres_password` con su nombre de usuario y contraseña de PostgreSQL.

3. **Aplicar Migraciones:**

  Con el entorno virtual activado, aplique las migraciones de la base de datos para configurar el esquema inicial:

  ```sh
  ❯ python manage.py makemigrations
  ❯ python manage.py migrate
  ```

4. **Crear un Superusuario:**

  Cree una cuenta de superusuario para acceder al panel de administración de Django:

  ```sh
  ❯ python manage.py createsuperuser
  ```

  Siga las indicaciones para configurar las credenciales del superusuario.

Una vez completados estos pasos, su base de datos debería estar configurada y lista para usar con FISIOFIND.


###  Uso

La primera vez que el proyecto se despliega localmente, necesitamos crear un archivo .env en el directorio `backend` según el archivo `.env.example`.

Para ejecutar el servidor backend, siga estos pasos en el directorio `backend` **y con el entorno virtual activado**:

```sh
❯ cd .\fisio_find
❯ python .\manage.py makemigrations
❯ python .\manage.py migrate
❯ python .\manage.py runserver
```
Adicionalmente, la primera vez que el proyecto se despliega localmente, necesitamos crear un superusuario para acceder al panel de administración:

```sh
❯ python.\manage.py createsuperuser
```

Después de que el servidor backend local esté en funcionamiento, podemos ejecutar el servidor frontend **en una nueva ventana de terminal**:

**Usando `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ cd ../../frontend
❯ npm run dev
```

### Ejecución de la Aplicación

Una vez que tanto el backend como el frontend estén corriendo, podrá acceder a la aplicación a través de la URL de la landing page (`http://localhost:3000`). Desde allí se podrá navegar entre las diferentes secciones de la aplicación, según el perfil de usuario (fisioterapeuta, paciente o administrador).

---
