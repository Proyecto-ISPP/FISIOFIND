---
title: "SPRINT PLANNING SPRINT 1"                         # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "20/02/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../../.backgrounds/background4V.pdf"  # CHANGE IF NEEDED
header-left: "SPRINT PLANNING SPRINT 1"                   # CHANGE IF NEEDED
header-right: "20/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<p align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  SPRINT PLANNING SPRINT 1
</p>

<br>


**ÍNDICE**
- [**1. OBJETIVOS DEL SPRINT**](#1-objetivos-del-sprint)
- [**2. SPRINT BACKLOG**](#2-sprint-backlog)
  - [**Épica 1: Formación**](#épica-1-formación)
  - [**Épica 2: Gestión usuarios**](#épica-2-gestión-usuarios)
  - [**Épica 3: Videollamada**](#épica-3-videollamada)
  - [**Épica 4: Landing page**](#épica-4-landing-page)
  - [**Épica 5: Cita/Calendario**](#épica-5-citacalendario)
- [**3. METODOLOGÍA INTERNA**](#3-metodología-interna)
  - [3.1. Gestión de Tareas en GitHub Project](#31-gestión-de-tareas-en-github-project)
  - [3.2. Flujo de Trabajo](#32-flujo-de-trabajo)
  - [3.3. Flujo de desarrollo](#33-flujo-de-desarrollo)
  - [3.4. Definición de Hecho (DoD) de una Historia de Usuario](#34-definición-de-hecho-dod-de-una-historia-de-usuario)
  - [3.5. Gestión de la Configuración](#35-gestión-de-la-configuración)
  - [3.6. Gestión del Cambio](#36-gestión-del-cambio)
  - [3.7. Gestión de los Riesgos](#37-gestión-de-los-riesgos)
  - [3.8. Uso de la Inteligencia Artificial](#38-uso-de-la-inteligencia-artificial)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>


---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Antonio Macías Ferrera

- **Fecha de Creación:** 20/02/2025

- **Versión:** v1.0

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por          | Descripción de los cambios                       |
| ---------- | ------- | ---------------------- | ------------------------------------------------ |
| 20/02/2025 | v1.0    | Antonio Macías Ferrera | Elaboración de la primera versión del documento. |


<br>


---

**Participantes**

| Nombre completo           | Rol                                              | Contacto              |
| ------------------------- | ------------------------------------------------ | --------------------- |
| Antonio Macías Ferrera    | Scrum Master, analista, programador              | antmacfer1@alum.us.es |
| Delfín Santana Rubio      | Secretario, analista, programador                | delsanrub@alum.us.es  |
| Guadalupe Ridruejo Pineda | Analista, programadora                           | guaridpin@alum.us.es  |
| Miguel Encina Martínez    | Representante grupo 3, analista, programador, QA | migencmar@alum.us.es  |
| Ramón Gavira Sánchez      | Representante grupo 2, analista, programador     | ramgavsan@alum.us.es  |
| Rafael Pulido Cifuentes   | Representante grupo 1, analista, programador     | rafpulcif@alum.us.es  |

<br>

<!-- \newpage -->

<br>


# **1. OBJETIVOS DEL SPRINT**

El propósito de este informe es definir los objetivos a lograr durante el Sprint #1 y describir la metodología para alcanzarlos.

**🔴 Sprint Goal:** CORE USE CASES (Casos de uso principales)

Los siguientes **objetivos** del *Sprint* harán referencia a las épicas desglosadas en la plataforma *GitHub Project*.

- ✅ **Objetivo 1:** Formar al equipo
- ✅ **Objetivo 2:** Implementar una gestión de usuarios básica
- ✅ **Objetivo 3:** Implementar las funcionalidades correspondientes a los casos de uso *'core'*.
- ✅ **Objetivo 4:** Desplegar una '*landing page*' estética y accesible para posicionar y mostrar al público nuestra aplicación.


| Historia Épica   | Historias de Usuario                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| Formación        | HA-002                                                                 |
| Gestión usuarios | HF-001, HF-002, HI-001, HI-002, HP-001, HP-002, HP-003, HP-006, HA-001 |
| Videollamada     | HF-010, HF-019                                                         |
| Landing page     | HA-003                                                                 |
| Cita/Calendario  | HP-005, HF-003, HF-004                                                 |

<br>

<!-- \newpage -->

<br>


# **2. SPRINT BACKLOG**

## **Épica 1: Formación**

***HA-002: Formación del equipo ***

> **Como** administrador de la plataforma,  
> **Quiero** poder formar a mi equipo de desarrollo en las tecnologías decididas por el equipo de planificación.
> **Para** asegurar un buen arranque del proyecto.

<br>

<br>


## **Épica 2: Gestión usuarios**

***HF-001: Registro como fisioterapeuta***

> **Como** fisioterapeuta,
> **Quiero** poder registrarme en la plataforma proporcionando mis datos personales y profesionales,
> **Para** validar mi perfil y comenzar a ofrecer mis servicios.
> Los datos requeridos para el registro son:
> - Nombre
> - Apellidos
> - Correo electrónico
> - Contraseña
> - Colegio profesional
> - Número de colegiado


***HF-002: Personalización del perfil de fisioterapeuta*** 

> **Como** fisioterapeuta, una vez registrado en el sistema,
> **Quiero** poder personalizar mi perfil modificando la siguiente información,
> **Para** que los pacientes puedan conocer mejor mis servicios y experiencia.
> Los datos editables incluyen:
> - Foto de perfil
> - Especialidad 
> - Descripción (bio) 
> - Información del título 
> - Cursos y certificaciones 
> - Teléfono de contacto 
> - Código postal 
> - Clínica (si aplica) 
> - Número de cuenta bancaria para recibir ingresos de consultas 
> - Disponibilidad horaria 
> - Precios de consulta (incluyendo la opción de ofrecer la primera consulta gratis) 
> - Tipos de servicios y bonos (Ejemplos:) 
>   - Consulta de valoración (opcionalmente gratuita) 
>   - Sesiones semanales durante 3-6 meses 
>   - Dos sesiones por semana durante X meses 
>   - Una sesión cada quince días durante X meses 
> - Archivos personalizados, como cuestionarios y herramientas específicas para el tratamiento de los pacientes


***HI-001: Acceso como paciente invitado***

> **Como** usuario invitado,
> **Quiero** poder acceder a la plataforma de Fisio Find y realizar búsquedas de fisioterapeutas que se adapten a mis necesidades sin necesidad de estar registrado,  
> **Para** explorar opciones de profesionales y disponibilidad horaria antes de crear una cuenta.


***HI-002: Acceso como fisioterapeuta invitado*** 

> **Como** usuario invitado,
> **Quiero** poder acceder a la información de los servicios que ofrece la plataforma de Fisio Find,  
> **Para** valorar si me interesa registrarme como fisioterapeuta y ofrecer mis consultas a los pacientes.

**Comentarios**: Vacío intencionadamente.


***HP-001: Búsqueda avanzada***

> **Como** usuario,
> **Quiero** poder buscar al mejor fisioterapeuta basándome en:
> - Palabras clave introducidas en la búsqueda
> - Especialidad
> - Código postal (información del perfil)
> - Valoraciones del fisioterapeuta
> - Precio 
> **Para** encontrar un fisioterapeuta que se ajuste a mis necesidades.


***HP-002: Registro en Fisio Find***

> **Como** usuario invitado,
> **Quiero** poder registrarme en la plataforma,
> **Para** facilitar mis datos a los fisioterapeutas al reservar una cita y acceder a todas las funcionalidades de Fisio Find.


***HP-003: Reserva de citas como usuario registrado*** 

> **Como** usuario registrado,
> **Quiero** una vez he seleccionado el fisioterapeuta idóneo para mi patología, quiero poder escoger mediante un calendario la fecha y hora que más me convenga para la cita,
> **Para** gestionar mi disponibilidad de manera eficiente.


***HP-006: Mi perfil***

> **Como** paciente,
> **Quiero** poder consultar mi información y modificar cualquier parámetro permitido por la aplicación,
> **Para** mantener mis datos actualizados y personalizados según mis necesidades.


***HA-001: Administración de sistema***

> **Como** administrador,  
> **Quiero** poder gestionar los usuarios, fisioterapeutas, citas y configuración general del sistema,  
> **Para** asegurar el correcto funcionamiento del servicio y garantizar una buena experiencia tanto para los fisioterapeutas como para los pacientes.

<br>

<br>


## **Épica 3: Videollamada**

***HF-010: Videollamada***

> **Como** fisioterapeuta,  
> **Quiero** poder iniciar la consulta con un paciente desde mi agenda de citas,  
> **Para** iniciar la videollamada.


***HF-019: Chat***

> **Como** fisioterapeuta,  
> **Quiero** tener acceso a un chat durante la videollamada con el paciente,  
> **Para** poder garantizar una comunicación fluida y eficiente en caso de problemas técnicos, aclaraciones o envío de indicaciones sin interrumpir la sesión verbalmente.

<br>

<br>


## **Épica 4: Landing page**

***HA-003: Landing page***

> **Como** administrador de la plataforma,  
> **Quiero** poder disponer de una landing page para poder indexar en los motores de búsqueda, y que al iniciar sesión redirija a la plataforma,
> **Para** asegurar un buen posicionamiento en el SEO.

<br>

<br>


## **Épica 5: Cita/Calendario**

***HP-005: Mis citas***

> **Como** paciente,
> **Quiero** poder consultar mis futuras citas en un apartado de mi perfil y/o en un calendario interactivo con recordatorios dentro de la aplicación,
> **Para** gestionar mis consultas de manera organizada y evitar olvidos.


***HF-003: Agenda y calendario***

> **Como** fisioterapeuta,
> **Quiero** poder acceder a un calendario donde se muestren mis citas agendadas y tener la posibilidad de modificar mi disponibilidad horaria
> **Para** gestionar mi agenda de manera eficiente.


***HF-004: Aceptación, rechazarla y modificación de citas***

> **Como** fisioterapeuta,  
> **Quiero** poder consultar el estado de una cita solicitada y poder aceptarla, rechazarla o solicitar una modificación de fecha y hora, notificando al paciente sobre cualquier cambio.   
> **Para** gestionar de manera eficiente mi agenda.

<br>

<!-- \newpage -->

<br>


# **3. METODOLOGÍA INTERNA**

En el siguiente apartado se resumirá la metodología interna seguida por el equipo de desarrollo. Para consultar la metodología con más detalle ver el *Sprint Planning General*.

## 3.1. Gestión de Tareas en GitHub Project

El equipo utiliza *GitHub Project* como herramienta de gestión de tareas donde las actividades están organizadas en distintas columnas que reflejan su estado dentro del flujo de trabajo. Esta herramienta cuenta con un **tablero Kanban** para facilitar el seguimiento de las tareas, generación de **gráficas Burn-down** que nos serán útiles en las retrospectivas, y asignación y **estimación de tareas** además de otras funciones que procurarán una buena organización del trabajo.

## 3.2. Flujo de Trabajo

La organización del trabajo, dado el gran número de participantes del proyecto, se ha llevado a cabo siguiendo una estructura doble: por un lado, una **división horizontal** en 3 subgrupos, y por otro lado, una **división transversal** en función de las tareas a realizar. Para ver en más detalle la división del trabajo, consultar el *Plan de Recursos Humanos*. 

La **organización horizontal** está compuesta por tres grupos de trabajo, en los que cada uno tiene un representante y un secretario.
Cada miembro del equipo será responsable de gestionar el estado de sus tareas ateniéndose al siguiente procedimiento:

| GRUPO 1                                 | GRUPO 2                               | GRUPO 3                                |
| --------------------------------------- | ------------------------------------- | -------------------------------------- |
| ALBERTO CARMONA SICRE (secretario)      | ANTONIO MACÍAS FERRERA (Scrum Master) | DANIEL TORTORICI BARTUS                |
| DANIEL ALORS ROMERO                     | BENJAMÍN I. MAUREIRA FLORES           | DANIEL VELA CAMACHO (secretario)       |
| DANIEL FERNÁNDEZ CABALLERO              | DELFÍN SANTANA RUBIO (secretario)     | FRANCISCO CAPOTE GARCÍA                |
| DANIEL RUIZ LÓPEZ                       | GUADALUPE RIDRUEJO PINEDA             | Francisco Mateos Villarejo             |
| PABLO FERNÁNDEZ PÉREZ                   | JULEN REDONDO PACHECO                 | MIGUEL ENCINA MARTÍNEZ (representante) |
| RAFAEL PULIDO CIFUENTES (representante) | RAMÓN GAVIRA SÁNCHEZ (representante)  |                                        |



Por otro lado, la **organización transversal** a lo largo de los equipos asignará distintos **roles** a los miembros del equipo para realizar tareas más ajenas al desarrollo de la aplicación. Estas serán tareas de planificación, documentación, publicidad...:


| RRSS Y PUBLICIDAD  | PLANIFICACIÓN      | SECRETARIOS     | QA                   |
| ------------------ | ------------------ | --------------- | -------------------- |
| ANTONIO MACÍAS     | ANTONIO MACÍAS     | ALBERTO CARMONA | BENJAMÍN I. MAUREIRA |
| FRANCISCO CAPOTE   | GUADALUPE RIDRUEJO | DANIEL VELA     | DANIEL ALORS         |
| FRANCISCO MATEOS   | MIGUEL ENCINA      | DELFÍN SANTANA  | FRANCISCO MATEOS     |
| GUADALUPE RIDRUEJO | PABLO FERNÁNDEZ    |                 | MIGUEL ENCINA        |
| PABLO FERNÁNDEZ    | RAFAEL PULIDO      |                 |                      |
| RAFAEL PULIDO      | RAMÓN GAVIRA       |                 |                      |
| DANIEL RUIZ        |                    |                 |                      |



| PRESENTACIONES     | TIEMPO          | IA               | FORMACIÓN     |
| ------------------ | --------------- | ---------------- | ------------- |
| ANTONIO MACÍAS     | ALBERTO CARMONA | DANIEL FERNÁNDEZ | RAFAEL PULIDO |
| GUADALUPE RIDRUEJO | RAFAEL PULIDO   | DANIEL RUIZ      | RAMÓN GAVIRA  |
|                    |                 |                  |               |


## 3.3. Flujo de desarrollo

1. **Inicio de la Tarea**
    - El desarrollador selecciona una tarea de la columna "Product Backlog" y la traslada a "Todo".
    - Esta acción indica que la tarea ha sido priorizada para su ejecución.

2. **Trabajo en Progreso**
    - Cuando se comienza a trabajar en la tarea, se mueve a la columna "In Progress".
    - Se debe registrar el tiempo de trabajo en **Clockify** de acuerdo al protocolo y la política de nombrado especificada en el ***Plan De Gestión De La Configuración***.

3. **Revisión de Código: Revisión por pares**
    - Al finalizar la implementación, el responsable de la tarea crea una *Pull Request (PR)* y traslada la tarea a la columna "In Review".
    - El otro miembro del equipo asignado se encarga de analizar el código y verificar su calidad.
    - Si la revisión es satisfactoria, el revisor aprueba la PR y fusiona los cambios.
    - Si se identifican errores o mejoras necesarias, la tarea se devuelve a "In Progress", notificando los ajustes requeridos.
    - Por norma general, el *testing* será realizado también acorde a la revisión por pares.


## 3.4. Definición de Hecho (DoD) de una Historia de Usuario

Para que una historia de usuario (HU) se considere terminada, debe cumplir con los siguientes requisitos:

- La funcionalidad **debe** estar completamente desarrollada y *cumplir con los requisitos* especificados en la *HU*.

- Se deben **satisfacer** las **expectativas** del producto en términos de **comportamiento y usabilidad**.

- El código **debe seguir las buenas prácticas** establecidas por el equipo.

- Se debe **garantizar** la **legibilidad**, **mantenibilidad** y escalabilidad del código fuente.

- Todo el código **debe ser revisado por al menos un miembro distinto** al desarrollador original.

- El revisor debe verificar que el código funciona correctamente y cumple con los estándares definidos.

- Cada issue debe contar con al menos **un comentario positivo** de otro miembro del equipo antes de su aprobación final.


## 3.5. Gestión de la Configuración

Desde la **política de versionado** de documentos y de código, hasta la **política de nombrado de ramas**, pasando por el **criterio de mensajes de commits** y el **flujo** de trabajo **GitHub Project - GitHub - Clockify** se encuentra definido en detalle en el ***Plan De Gestión De La Configuración***.



## 3.6. Gestión del Cambio

Los cambios no pueden ser implementados de manera arbitraria, sino que deben de seguir un proceso que cubra las fases de registro, análisis, aceptación, implantación, evaluación y seguimiento. La gestión del cambio se hará tal y como se describe en el documento *Plan de Gestión del Cambio*. 

<br>

## 3.7. Gestión de los Riesgos

La gestión del riesgo se hará tal y como se describe en el documento *Plan de Gestión de los Riesgos*. En este documento, entre otras cosas, se explica que se deberá de hacer seguimiento a los riesgos y actualizar el registro de riesgos periódicamente.

<br>

## 3.8. Uso de la Inteligencia Artificial

El uso de la inteligencia artificial estará regulado por el *Acuerdo de IA* y se deberán de hacer informes periódicos de su uso. Uno de los puntos a destacar de este acuerdo es la importancia de la intervención humana en la aplicación de soluciones IA en el proyecto.


<br>

<br>


---
**Aprobado por:**  

**Scrum Master:** Antonio Macías Ferrera  
**Rol:** Scrum Master, analista, programador

**Representante grupo 3:** Miguel Encina Martínez  
**Rol:** Representante grupo 3, analista, programador, QA

**Representante grupo 2:** Ramón Gavira Sánchez  
**Rol:** Representante grupo 2, analista, programador

**Representante grupo 1:** Rafael Pulido Cifuentes  
**Rol:** Representante grupo 1, analista, programador
