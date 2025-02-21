---
title: "PLAN DE GESTIÓN DE LA CONFIGURACIÓN"              # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "04/02/2025"                                        # CHANGE IF NEEDED
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
header-left: "PLAN DE GESTIÓN DE LA CONFIGURACIÓN"        # CHANGE IF NEEDED
header-right: "04/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  PLAN DE GESTIÓN DE LA CONFIGURACIÓN
</h1>

<br>

**ÍNDICE**
- [**1. NORMAS Y PROCEDIMIENTOS APLICABLES**](#1-normas-y-procedimientos-aplicables)
- [**2. ELEMENTOS CONFIGURABLES**](#2-elementos-configurables)
- [**3. HERRAMIENTAS A UTILIZAR**](#3-herramientas-a-utilizar)
- [**4. CONTROL y POLÍTICA DE VERSIONADO**](#4-control-y-política-de-versionado)
  - [**4.1. Versionado de Documentación y Registros**](#41-versionado-de-documentación-y-registros)
  - [**4.2. HU, tareas y actividades**](#42-hu-tareas-y-actividades)
  - [**4.3.  Control del tiempo**](#43--control-del-tiempo)
  - [**4.4. Versionado de Código Fuente en Git y GitHub**](#44-versionado-de-código-fuente-en-git-y-github)
  - [**4.5. Solicitudes de cambio (Registro de cambios)**](#45-solicitudes-de-cambio-registro-de-cambios)
- [**5. ESTRATEGIA DE RAMAS**](#5-estrategia-de-ramas)
- [**6. ESTÁNDARES DE CODIFICACIÓN**](#6-estándares-de-codificación)
  - [**6.1. Python (Backend)**](#61-python-backend)
      - [**1. Nombrado**](#1-nombrado)
      - [**2. Indentación y espaciado**](#2-indentación-y-espaciado)
      - [**3. Docstrings y comentarios**](#3-docstrings-y-comentarios)
      - [**4. Manejo de excepciones**](#4-manejo-de-excepciones)
  - [**6.2. JavaScript (Frontend)**](#62-javascript-frontend)
      - [**1. Nombrado**](#1-nombrado-1)
      - [**2. Uso de `let` y `const`**](#2-uso-de-let-y-const)
      - [**3. Formato y espaciado**](#3-formato-y-espaciado)
      - [**4. Manejo de promesas**](#4-manejo-de-promesas)
- [**7. ORGANIZACIÓN DE LA DOCUMENTACIÓN**](#7-organización-de-la-documentación)
  - [**7.1. OneDrive**](#71-onedrive)
  - [**7.2. Repositorio de GitHub**](#72-repositorio-de-github)
    - [**7.3. Documentación como código**](#73-documentación-como-código)
- [**8. CONCLUSIÓN**](#8-conclusión)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores

- **Fecha de Creación:** 04/02/2025  

- **Versión:** v2.2

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 04/02/2025 | v1.0    | Antonio Macías Ferrera           | Elaboración de la plantilla del documento. |
| 05/02/2025 | v2.0    | Benjamín Ignacio Maureira Flores | Completado según la metodología a seguir en el proyecto. |
| 13/02/2025 | v2.1    | Antonio Macías Ferrera | Adecuación al nuevo proyecto Fisio Find. |
| 15/02/2025 | v2.2    | Antonio Macías Ferrera | Adecuación al feedback de la clase del 14/02/2025. Sustitución de Taiga.io por GitHub Project, estructuración de la documentación y adición de apartado *Gestión del Cambio* y *Gestión de los Riesgos*. |

<br>

<!-- \newpage -->

<br>


# **1. NORMAS Y PROCEDIMIENTOS APLICABLES**

Este plan contiene la información sobre cómo el equipo de trabajo realizará el seguimiento y control del cambio durante el desarrollo del proyecto, además de cómo se llevará a cabo el control de versiones a lo largo del mismo.

<br>

<br>


# **2. ELEMENTOS CONFIGURABLES**

Los elementos configurables del proyecto incluyen aquellos artefactos y entregables que pueden estar sujetos a modificaciones durante el desarrollo. Cada uno de estos elementos tendrá un identificador único y se someterá a control de versiones.

1. **Documentación**: todos los documentos que surjan a lo largo de todas las fases del proyecto deberán estar sujetos a un sistema de control de versiones específico y unificado.

2. **Requisitos, CU e HU**: define los requisitos del sistema. De este documento saldrán también los registros de HU y de casos de uso del sistema, que también serán configurables y estarán debidamente trazados.

3. **Código fuente**: código del producto software, sujeto a control de versiones.

4. **Tareas**: las fechas y condiciones para la entrega de los principales entregables de cada Sprint también serán elementos configurables.

<br>

<br>

<!-- \newpage -->


# **3. HERRAMIENTAS A UTILIZAR**

| Tecnología | Elementos Configurables | Descripción |
|------------|--------------------------|-------------|
| Pandoc y Eisvogel   | Documentación, Registros  | Plataforma para la edición de documentos en Markdown. |
| Clockify   | Tareas                    | Seguimiento del tiempo de trabajo por actividad. |
| GitHub Project   | Hitos, requisitos, HU     | Herramienta ágil para gestión de proyectos. |
| Git        | Código fuente             | Control de versiones del código fuente. |
| GitHub     | Código fuente, Hitos, HU  | Gestión del desarrollo colaborativo. |

<br>

<br>

<!-- \newpage -->


# **4. CONTROL y POLÍTICA DE VERSIONADO**

## **4.1. Versionado de Documentación y Registros**
Se sigue un esquema de versionado semántico:  

- **Mayor:** Cambios significativos en el contenido (reestructuración o nueva sección).

- **Menor:** Actualizaciones dentro de secciones existentes o correcciones menores.

**Se deberá modificar la versión siempre que se realice alguna modificación en el documento**. La versión se indicará tanto en el título del documento como en la tabla de control de versiones que se encontrará tras el índice del documento.

Ejemplo de versionado: `v1.2` (vMayor.Menor)


## **4.2. HU, tareas y actividades**
Cada historia de usuario y caso de uso tiene un identificador único asignado tras su creación.

Cambios importantes en la descripción o criterios de aceptación de una HU se anotan y actualizan la versión. Se seguirá un versionado similar al visto en el punto anterior. La versión de cada elemento se añadirá en un campo específico que encontraremos en su tabla.

- **Mayor**: Cambios significativos en el contenido debido a un cambio en los requisitos.

- **Menor**: Actualización de información, correcciones ortográficas, formato o pequeños ajustes de expresión.

Ejemplo de versionado: `v1.2` (vMayor.Menor).

A la hora de crear nuevas tareas en *GitHub Project* en base a las HU, se deberá usar un nombre descriptivo y breve, similar al título de la HU asociada. Como esta tarea estará asociada a una Issue de GitHub irá acompañada de un código de la Issue(#XX). ***Esto ayudará a llevar una trazabilidad entre Issue - Tarea - HU - Clockify***.

La nomenclatura a seguir para los distintos requisitos, CU e HU será un esquema de numeración para cada tipo de registro: 


| **Categoría**                                            | **Código**    |
|----------------------------------------------------------|---------------|
| Objetivos de alto nivel                                  | OBJ-XXX       |
| Requisitos del proyecto                                  | PRO-XXX       |
| Requisitos de información                                | RI-XXX        |
| Requisitos de reglas de negocio                          | RN-XXX        |
| Requisitos de conducta                                   | CON-XXX       |
| Requisitos de fiabilidad                                 | FIB-XXX       |
| Requisitos de portabilidad                               | POR-XXX       |
| Requisitos de seguridad                                  | SEG-XXX       |
| Requisitos de organización (incluye entrega, uso de estándares y tecnología) | ORG-XXX |
| Requisitos de factores ambientales (incluye requisitos legislativos y de privacidad) | FA-XXX |
| Cambios                                                  | CAM-XXX       |
| Historias de usuario                                     | HU-XXX        |
| Casos de Uso                                             | CU-XXX        |



## **4.3.  Control del tiempo**
*Clockify* no tiene control de versiones explícito, pero el seguimiento se realiza registrando las entradas de tiempo y las tareas completadas para cada miembro del equipo siguiendo la misma nomenclatura que las tareas del *GitHub Project*.

Las tareas se numeran en orden cronológico y deben incluir un identificador único en el formato `#XX`.

Se excluyen de esta nomenclatura las tareas de las fases de Inicio y Planificación. Todas
las tareas deberán estar asignadas a UNA SOLA persona y a un proyecto de Clockify previamente
creado. Esto ayudará a evaluar mejor el desempeño y el tiempo empleado en las tareas.

Ejemplo de versionado: `Realización de ventana de inicio de sesión #53`.

## **4.4. Versionado de Código Fuente en Git y GitHub**

***Estructura de Ramas***
- **`main`** → Producción

- **`develop`** → Desarrollo

- **`feat/nueva_funcionalidad`** → Funcionalidades nuevas

- **`test/nueva_funcionalidad`** → Ramas de pruebas

- **`hotfix/corrección`** → Correcciones urgentes


***Versionado semántico***

***X.y.z***

- **X - Versión mayor**: Cambios mayores, rompe la compatibilidad de la API, la versión inicial será 0.y.z, la versión 1.0.0 definirá la primera API pública.

- **y - Versión menor**: Cambios menores, no rompen la compatibilidad de la API, incluyen nuevas funcionalidades y mejoras, puede incluir parches.

- **z - Parche**: Eliminación de bugs, no rompen la compatibilidad de la API, sólo cambios internos para arreglar comportamientos incorrectos.

- **Reglas de versionado**: Cuando la versión mayor sea incrementada se resetean las demás, cuando se incremente la versión menor, se resetea el parche. Seguramente se hagan de manera automática usando un workflow.

***Commits (Conventional Commits)***
La política de nombrado de commits se ajustará a las directrices de *Conventional Commits*, siendo el cuerpo de estos **siempre en ESPAÑOL**:

```
<tipo>: <descripción breve>
[opcional] Cuerpo detallado del mensaje
[opcional] Pie de mensaje (referencias a tickets, breaking changes, etc.)
    El <tipo> especifica la naturaleza del cambio realizado. Los tipos más comunes incluyen:
    - feat: Una nueva funcionalidad.
    - fix: Corrección de errores.
    - docs: Cambios en la documentación (no relacionados con el código).
    - style: Cambios que no afectan la lógica del código (formato, espacios en blanco, etc.).
    - refactor: Cambios en el código que no corrigen errores ni añaden funcionalidades.
    - test: Adición o modificación de pruebas.
```

La **descripción** debe ser concisa y clara, expresando en una sola línea el propósito del commit. Se recomienda utilizar el modo imperativo (por ejemplo, "add...”, "fix...”) y evitar el uso de mayúsculas al inicio, salvo para nombres propios.

El **cuerpo** se utiliza para detallar el contexto del cambio, explicar el por qué detrás del commit, y describir cualquier implicación importante.

El **pie** del mensaje puede incluir:
- Referencias a tickets o tareas: Refs #123.
- Cambios significativos (breaking changes): BREAKING CHANGE: seguido de una descripción del cambio.

Se recomienda encarecidamente usar **. Closes #XX** al final de un commit cuando éste sirva para cerrar una *Issue*, para hacer los commits y las Issues lo más trazable posible.

<br>

***Ejemplo de mensaje de commit***

```
feat: add support for token-based authentication Close #01

This change introduces a new authentication system based on JWT tokens. The user module has been updated, and a new dependency has been added. 

BREAKING CHANGE: The login API now requires a JWT token instead of a cookie-based session.
```


## **4.5. Solicitudes de cambio (Registro de cambios)**
Los registros se mantienen como archivos en formato *Markdown*. Cada cambio, HU o caso de uso tiene un identificador único (ejemplo: HU-001, CU-003). Cambios aprobados se reflejan en el historial de cambios del documento correspondiente actualizando su versión acorde a lo mencionado anteriormente.

Para las solicitudes de cambio formales, se deberá seguir la plantilla ubicada en el ***Plan De Gestión Del Cambio***.

Dentro del sistema de control de versiones de *GitHub*, los cambios que se gestionen mediante *Issues* deberá seguir la plantilla especificada, siendo el cuerpo de estas **siempre en ESPAÑOL**:


<br>

<br>


<!-- \newpage -->


# **5. ESTRATEGIA DE RAMAS**

La estrategia de ramas se basa en **Git Flow** con algunas modificaciones para garantizar un desarrollo ágil y seguro.

**Desarrollo de ramas que añadan funcionalidad:**  
  1. Crear una rama `feat/` desde `develop`.
  2. Desarrollar la funcionalidad en la rama creada.
  3. Hacer Pull Request solicitando a un revisor del equipo antes de fusionar con `develop`.

**Desarrollo de ramas que prueben una funcionalidad:**
  1. Crear una rama `test/` desde `develop` una vez se haya fusionado la funcionalidad a probar.
  2. Desarrollar y ejecutar los tests en la rama creada.
  3. Hacer Pull Request solicitando a un revisor del equipo antes de fusionar con `develop`.

**Preparación de releases**
  - Se usará un workflow para hacer commit diario desde la rama `develop` a `main`, de manera que siempre tengamos un producto funcional actualizado en producción.

**Arreglar bugs en producción**
  1. Crear una rama de hotfix desde `main`.
  2. Corregir el error.
  3. Fusionar la rama de hotfix con `main` y `develop`.


<br>

***Revisión de las Pull Requests***
Una vez acabada una tarea, se creará una Pull Request y se tendrá que notificar al resto de miembros del equipo, para que, con la mayor brevedad posible, un miembro la revise y dé feedback (aprobándola o solicitando cambios).

Se recomienda encarecidamente **no aprobar una Pull Request si no se han pasado los checks a la hora de ejecutar los workflows correspondientes**, para no arrastrar errores.

<br>

<br>

<!-- \newpage -->


# **6. ESTÁNDARES DE CODIFICACIÓN**

Para garantizar la consistencia, legibilidad y mantenibilidad del código, seguiremos estándares de codificación reconocidos en la industria para Python (backend) y JavaScript (frontend). A continuación, se detallan las prácticas recomendadas y ejemplos ilustrativos.

## **6.1. Python (Backend)**

#### **1. Nombrado**
- **Positivo**:
```python
# Variables en camelCase y funciones en snake_case
userName = "John"
def calculate_total_price(items):
    pass

# Constantes en UPPER_CASE
MAX_CONNECTIONS = 100
```

- **Negativo**:
```python
  # Variables en UPPER_CASE (no recomendado)
USER_NAME = "John"

# Constantes en snake_case (no recomendado)
max_connections = 100
```

#### **2. Indentación y espaciado**
- **Positivo**:
```python
# Usar 4 espacios para la indentación
def greet(name):
    if name:
        print(f"Hello, {name}!")
    else:
        print("Hello, World!")
```

- **Negativo**:
```python
# Usar tabulaciones o 2 espacios (no recomendado)
def greet(name):
  if name:
    print(f"Hello, {name}!")
  else:
    print("Hello, World!")
```

#### **3. Docstrings y comentarios**
- **Positivo**:
```python
# Docstrings para documentar funciones
def add(a, b):
    """
    Suma dos números y devuelve el resultado.
    
    :param a: Primer número
    :param b: Segundo número
    :return: Suma de a y b
    """
    return a + b

# Comentarios para explicar algo específico
counter = 0  # inicializa el contador
```

- **Negativo**:
```python
# Sin docstrings o comentarios (no recomendado)
def add(a, b):
    return a + b

# Usando comentarios como docstrings y viceversa
def add(a, b):
    # Suma dos números y devuelve el resultado.
    
    # :param a: Primer número
    # :param b: Segundo número
    # :return: Suma de a y b
    return a + b

counter = 0  '''inicializa el contador'''
```

#### **4. Manejo de excepciones**
- **Positivo**:
```python
# Capturar excepciones específicas
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
```

- **Negativo**:
```python
# Capturar excepciones genéricas (no recomendado)
try:
    result = 10 / 0
except:
    print("Ocurrió un error")
```

## **6.2. JavaScript (Frontend)**

#### **1. Nombrado**
- **Positivo**:
```javascript
// Variables y funciones en camelCase
let userName = "John";
function calculateTotalPrice(items) {
    // ...
}

// Constantes en UPPER_CASE
const MAX_CONNECTIONS = 100;
```

- **Negativo**:
```javascript
// Variables en snake_case (no recomendado en JavaScript)
let user_name = "John";

// Constantes en camelCase (no recomendado)
const maxConnections = 100;
```

#### **2. Uso de `let` y `const`**
- **Positivo**:
```javascript
// Usar `const` para valores que no cambian
const PI = 3.1416;

// Usar `let` para valores que pueden cambiar
let counter = 0;
counter += 1;
```

- **Negativo**:
```javascript
// Usar `var` (no recomendado)
var counter = 0;

// Usar `let` para constantes (no recomendado)
let PI = 3.1416;
```

#### **3. Formato y espaciado**
- **Positivo**:
```javascript
// Usar llaves y espacios consistentemente
function greet(name) {
    if (name) {
        console.log(`Hello, ${name}!`);
    } else {
        console.log("Hello, World!");
    }
}
```

- **Negativo**:
```javascript
// Formato inconsistente (no recomendado)
function greet(name){
if(name){
console.log(`Hello, ${name}!`);
}else{
console.log("Hello, World!");
}}
```

#### **4. Manejo de promesas**
- **Positivo**:
```javascript
// Usar async/await para manejar promesas
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
```

- **Negativo**:
```javascript
// Usar callbacks o .then() en exceso (no recomendado)
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error fetching data:", error));
```

Todos estos ejemplos son una muestra de los más importantes que tendremos en cuenta (que quiere decir que no tenemos en cuenta el estandar al 100%), es responsabilidad de cada miembro del grupo adherirse a los estándares de código para garantizar un trabajo correcto.

<br>

<br>

<!-- \newpage -->


# **7. ORGANIZACIÓN DE LA DOCUMENTACIÓN**

Se han establecido dos canales principales para el almacenamiento y control de la documentación: el repositorio del proyecto en **GitHub**, y una carpeta compartida en **OneDrive**. Estas unidades de almacenamiento tendrán usos bastante diferenciados, y se organizarán de la siguiente forma:

## **7.1. OneDrive**

En esta carpeta compartida a todos los miembros del grupo se almacenarán archivos y documentos que NO son entregables del proyecto. Son, por ejemplo, vídeos, hojas de cálculo, documentación de consulta, material de clase, etc. Se ha decidido utilizar la siguiente estructura: 

```
└── ISPP/
  ├── Diseño/
  │   └── [Portadas de documentos, logos y demás material gráfico necesario para la imagen de marca del producto.]
  |
  ├── Organización/
  │   └── [Documentos varios relacionados con la planificación y organización del proyecto: hojas de cálculo de los costes, vídeos explicativos, información recabada para la idea de negocio, etc.]
  |
  ├── Presentaciones/
  │   └── [Versión .pdf y versión .pttx de las presentaciones realizadas cada semana.]
  |
  ├── Publicidad y RRSS/
  │   └── [Material audiovisual usado para las publicaciones en redes sociales y la publicidad.]
  |
  └── Trabajo semanal/
        └── [Esta carpeta ayudará al equipo de QA a organizar los informes de rendimiento del equipo, almacenarán un registro del trabajo realizado cada semana por parte de cada miembro del equipo.]
```

## **7.2. Repositorio de GitHub**

En la carpeta `docs` del repositorio del proyecto se almacenará toda la documentación necesaria para los entregables del proyecto. Aquí entran: documentación ágil (sprint planning, retrospective, review), acuerdos grupales (acuerdo de compromiso, acuerdo de uso de IA), actas de reuniones, planes, registros de requisitos, reportes y la base de conocimiento. Se ha decidido seguir la siguiente estructura:

```
└── docs/
  ├── .img/
  │   └── ...
  |
  ├── .backgrounds/
  │   └── ...
  |
  |
  ├── 01_organization/
  │   └── [Acuerdos grupales y documentos de análisis (agile inception, competidores, costes...)]
  |
  |
  ├── 02_planification/
  │   └── [Planes y registros de CU, HU, requisitos y trazabilidad]
  |
  |
  ├── 03_reports/
  │   ├── ia_reports/ [Informes de uso de Inteligencia Artificial]
  |   |
  │   └── time_reports/ [Informes de rendimiento semanal]
  |
  |
  ├── 04_monitoring/
  │   ├── meetings/ [Actas de reuniones]
  |   |
  │   ├── sprint_1/ [Sprint Planning, Review y Retrospective del Sprint 1]
  |   |
  │   ├── sprint_2/ [Sprint Planning, Review y Retrospective del Sprint 2]
  |   |
  │   └── sprint_3/ [Sprint Planning, Review y Retrospective del Sprint 3]
  |
  |
  ├── 05_knowledge_base/
  │   └── [Feedback semanal de las clases y los apuntes de los vídeos]
  |
  |
  ├── templates/
  │   └── ...
  |
  ├── build-examples.sh
  └── eisvogel.latex
```

### **7.3. Documentación como código**

Siguiendo la filosofía ***Docs as Code*** se ha creado un repositorio de documentación externo al repositorio principal en el que, haciendo uso de la herramienta Docusaurus, se ha montado una página estática que recoge toda la documentación del proyecto.

La estructura del repositorio es la siguiente

```
└── fisio-find
    └── docs 
    │   ├── 01. Organización/
    │   │   └── [Acuerdos grupales y documentos de análisis (agile inception, competidores, costes...)]
    │   |
    │   ├── 02. Planificación/
    │   │   └── [Planes y registros de CU, HU, requisitos y trazabilidad]
    │   |
    │   ├── 03. Informes/
    │   |   ├── 3.1. Informes de horas/
    │   │   |   └── [Informes de tiempo usando la herramienta Clockify]
    │   |   |
    │   |   ├── 3.2. Informes de rendimiento/
    │   │   |   └── [Informes de rendimiento semanal]
    │   |   |
    │   |   └── 3.3. Informes de IA/
    │   |       └── [Informes de uso de Inteligencia Artificial]
    │   |
    │   ├── 04. Seguimiento/
    │   |   ├── 4.1. Reuniones/
    │   │   |   └── [Actas de reuniones]
    │   |   |
    │   |   └── 4.2. Sprint 1/
    │   │   |   └── [Sprint Planning, Review y Retrospective del Sprint 1]
    │   |   |
    │   |   ├── 4.3. Sprint 2/
    │   │   |   └── [Sprint Planning, Review y Retrospective del Sprint 2]
    │   |   |    
    │   |   └── 4.4. Sprint 3/
    │   │       └── [Sprint Planning, Review y Retrospective del Sprint 3]
    │   |
    │   |
    │   ├── 05. Recursos/
    │   |   └── 5.1. Feedbacks/
    │   |       └──[Feedback semanal de las clases]
    │   |
    │   └── Inicio.md
    |
    ├── src/
    |   └── [Lógica de la aplicación estática]
    .
    .
    .
    (Resto del código )
```

Se puede observar que, con respecto al repositorio principal, en la página se mantiene la misma documentación y una estructura similiar, adaptada para un mayor entendimiento por parte del usuario.
Así mismo, todos los cambios en los documentos son revisados de forma diaria para mantener la página actualizada constantemente.


Toda la documentación deberá seguir en todo momento la **política de versionado y control** especificada en el punto 4 de este documento, y además deberá atenerse al ***Plan de Gestión del Cambio***.


# **8. CONCLUSIÓN**
Este documento define las políticas de gestión de configuración del proyecto **FISIO FIND**. Es crucial que estas buenas prácticas sean aplicadas por todos los miembros del equipo a lo largo de todo el proyecto para procurar un orden, trazabilidad y, en resumen, una buena calidad en el desarrollo y resultado del producto.

<br>
