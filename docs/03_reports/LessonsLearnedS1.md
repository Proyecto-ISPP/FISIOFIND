<!-- ---
title: "Lecciones aprendidas #S1"                        # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #PPL"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "23/04/2025"                                       # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background2V.pdf" # CHANGE IF NEEDED
header-left: "FEEDBACK"                                  # CHANGE IF NEEDED
header-right: "23/04/2025"                               # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"  
--- -->

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  Lecciones aprendidas #S1
</h1>

<br>

**ÍNDICE**
- [1. Metodología y roles](#1-metodología-y-roles)
- [2. Metodología para el análisis de los problemas](#2-metodología-para-el-análisis-de-los-problemas)
- [3. Datos recolectados](#3-datos-recolectados)
  - [3.1 Datos recolectados en la reunión con el revisor](#31-datos-recolectados-en-la-reunión-con-el-revisor)
  - [3.2 Datos recolectados en la encuesta](#32-datos-recolectados-en-la-encuesta)
- [4. Resumen de datos recolectados](#4-resumen-de-datos-recolectados)
  - [4.1 Resumen hecho por ChatGPT - Problemas principales](#41-resumen-hecho-por-chatgpt---problemas-principales)
    - [4.1.1. Despliegue tardío y fallido](#411-despliegue-tardío-y-fallido)
    - [4.1.2. Falta de estructura común en el backend](#412-falta-de-estructura-común-en-el-backend)
    - [4.1.3. Problemas con Git y control de versiones](#413-problemas-con-git-y-control-de-versiones)
    - [4.1.4. Fallos de planificación y organización general](#414-fallos-de-planificación-y-organización-general)
  - [4.2 Resumen hecho por secretario](#42-resumen-hecho-por-secretario)
- [5. Análisis de las condiciones de fallo](#5-análisis-de-las-condiciones-de-fallo)
- [6. Soluciones tomadas](#6-soluciones-tomadas)
- [7. Lecciones aprendidas](#7-lecciones-aprendidas)
- [Anexo](#anexo)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->


<br>


**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #PPL

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Delfín Santana Rubio](https://github.com/DelfinSR) (autor), [Antonio Macías Ferrera](https://github.com/antoniommff) (revisor), [Guadalupe Ridruejo Pineda](https://github.com/guaridpin) (revisor), [Miguel Encina Martínez](https://github.com/MiguelEncina) (revisor)

- **Fecha de creación:** 23/04/2025  

- **Versión:** v1.1

<br>

---

**Historial de modificaciones**

| Fecha        | Versión   | Realizada por             | Descripción de los cambios                                      |
| ------------ | --------- | ------------------------- | --------------------------------------------------------------- |
| 23/04/2025   | v1.0      | [Delfín Santana Rubio](https://github.com/DelfinSR)      | Versión inicial del documento                                   |
| 24/04/2025   | v1.1      | [Antonio Macías Ferrera](https://github.com/antoniommff) | Correcciones de ortografía y errores menores.                  |

<br>

<!-- \newpage -->

<br>


# 1. Metodología y roles
El equipo utiliza *GitHub Project* como herramienta de gestión de tareas, donde las actividades están organizadas en distintas columnas (Product Backlog, ToDo, In Progress, Ready For Test, Done) que reflejan su estado dentro del flujo de trabajo. Esta herramienta cuenta con un **tablero Kanban** para facilitar el seguimiento de las tareas, la generación de **gráficas Burn-down** útiles en las retrospectivas, y la asignación y **estimación de tareas**, además de otras funciones que procuran una buena organización del trabajo.

Todas las tareas a ejecutar en el *Sprint* se encontrarán inicialmente en la columna "Product Backlog", habiendo sido previamente asignadas y estimadas por el equipo de **planificación**.

Roles:
- Antonio Macías: RRSS y Publicidad, Planificación, Presentaciones, Project Manager.
- Francisco Capote: RRSS y Publicidad.
- Francisco Mateo: RRSS y Publicidad, QA.
- Guadalupe Ridruejo: RRSS y Publicidad, Planificación, Presentaciones.
- Pablo Fernández: RRSS y Publicidad, Planificación.
- Rafael Pulido: RRSS y Publicidad, Planificación, Presentaciones, Tiempo, Formación.
- Daniel Ruiz: RRSS y Publicidad, IA.
- Alberto Carmona: Secretario, Tiempo.
- Daniel Vela: Secretario.
- Delfín Santana: Secretario.
- Miguel Encina: Planificación, QA.
- Benjamín I. Maureira: QA.
- Daniel Alors: QA.
- Ramón Gavira: Planificación, Formación.
- Daniel Fernández: IA.

Los roles **planificación** y **analista** son sinónimos. Estos son responsables de planificar las tareas.

Los **representantes** serán necesarios para favorecer una buena comunicación y dividir las tareas en cada grupo. De este modo, las tareas son asignadas por los analistas, pero hay un "gestor" de las tareas por cada grupo.

Los **secretarios** serán los encargados de tomar actas de las reuniones internas y registrar el *feedback* de los profesores.

Por otro lado, todos los integrantes del equipo son desarrolladores.

Los 17 integrantes se dividen a su vez en 3 grupos:

**Grupo 1:**
- Alberto Carmona Sicre (secretario).
- Daniel Alors Romero.
- Daniel Fernández Caballero.
- Daniel Ruiz López.
- Pablo Fernández Pérez.
- Rafael Pulido Cifuentes (representante).

**Grupo 2:**
- Antonio Macías Ferrera (Project Manager).
- Benjamín I. Maureira Flores.
- Delfín Santana Rubio (secretario).
- Guadalupe Ridruejo Pineda.
- Julen Redondo Pacheco.
- Ramón Gavira Sánchez (representante).

**Grupo 3:**
- Daniel Tortorici Bartus.
- Daniel Vela Camacho (secretario).
- Francisco Capote García.
- Francisco Mateos Villarejo.
- Miguel Encina Martínez (representante).

Cada miembro del equipo será responsable de gestionar el estado de sus tareas ateniéndose al siguiente procedimiento:

1. **Inicio de la Tarea**
    - El desarrollador selecciona una tarea de la columna "Product Backlog" y la traslada a "ToDo".
    - Esta acción indica que la tarea ha sido priorizada para su ejecución.
    - Los representantes de cada grupo serán responsables de estimar y asignar las tareas a realizar por ese grupo.

2. **Trabajo en Progreso**
    - Cuando se comienza a trabajar en la tarea, se mueve a la columna "In Progress".
    - Se debe registrar el tiempo de trabajo en **Clockify** de acuerdo al protocolo y la política de nombrado especificada en el ***Plan de Gestión de la Configuración***.

3. **Revisión de Código: Revisión por pares**
    - Al finalizar la implementación, el responsable de la tarea crea una *Pull Request (PR)* y traslada la tarea a la columna "Ready for Test".
    - Otro miembro del equipo asignado se encarga de analizar el código y verificar su calidad.
    - Si la revisión es satisfactoria, el revisor aprueba la PR y fusiona los cambios.
    - Si se identifican errores o mejoras necesarias, la tarea se devuelve a "In Progress", notificando los ajustes requeridos.
    - Por norma general, el *testing* será realizado también acorde a la revisión por pares.


<br>


# 2. Metodología para el análisis de los problemas
La metodología consta de tres fases:
- Recolección
- Análisis
- Redacción de conclusiones

Para la recolección se tomaron dos acciones:

- Reunión con el revisor: El project manager de Fisio Find se reunió con el revisor para revisar el entregable. Pese a que el equipo de Fisio Find tenía conocimientos sobre los errores que había cometido, se decidió solicitar una reunión para obtener *feedback* directo y así descubrir causas del suspenso que no habíamos tenido en cuenta y una visión real del estado del entregable.

- Encuesta grupal: El equipo de Fisio Find pasó una encuesta interna para recolectar los problemas que cada miembro del equipo pensaba que se habían tenido. Esta encuesta estuvo diseñada con los contenidos y estructuras necesarias especificadas en el documento "Grade Recovery Guidelines" que se encuentra en EV. Las respuestas hechas por otros compañeros estaban disponibles durante la encuesta, ya que se indicó que no se debían de repetir problemas reportados para así facilitar el análisis.

Para el análisis y la redacción de conclusiones se designó a un secretario del grupo la tarea de analizar los datos recolectados y redactar las conclusiones a las que se han llegado.

<br>


# 3. Datos recolectados
## 3.1 Datos recolectados en la reunión con el revisor
Esta información fue recolectada por el *product manager* que fue quien tuvo la reunión con el revisor. 

La razón principal del suspenso que nos comentó el revisor fueron los problemas en el despliegue. El sistema desplegado no era igual que el mostrado en la demo y tenía diversos problemas. Uno de ellos era que no se cargaban las imágenes.

Por otro lado, comentó también faltas en el estilo de los documentos. Sin embargo, esto no fue razón del suspenso, pero como se comentó en la metodología, es un problema que desconocíamos.

## 3.2 Datos recolectados en la encuesta
La encuesta se compartió por el canal interno de anuncios importantes (en el que solo cierta gente tiene permisos para mandar comunicados) el sábado 19 de abril. En el mismo mensaje en el que se compartió la encuesta, se puso como límite para completar la encuesta el lunes 21 de abril a las 23:59. En el Anexo se incluyen las respuestas separadas por comas.

Aunque solo suspendimos el entregable S1, decidimos aprovechar para hacer una encuesta para las entregas S1 y S2 para así analizar las soluciones tomadas para los problemas del S1. De este modo, a continuación solo se listan los problemas del S1 y en la sección en la que se analicen las decisiones tomadas se comentarán los resultados del S2.

# 4. Resumen de datos recolectados

## 4.1 Resumen hecho por ChatGPT - Problemas principales

### 4.1.1. Despliegue tardío y fallido
- **Descripción**: El despliegue se dejó para el último momento, lo que provocó múltiples errores y la calificación "suspenso" en este sprint.
- **Causas**: Mala planificación, falta de CI/CD, y descoordinación general.
- **Soluciones propuestas**:
  - Comenzar el despliegue desde la primera semana.
  - Adoptar integración continua (ya implementada para S3).
  - Gestionar mejor el tiempo y no esperar al último día.

### 4.1.2. Falta de estructura común en el backend
- **Descripción**: Uso inconsistente de `APIView` vs funciones directas.
- **Causa**: Falta de acuerdo sobre una arquitectura común y (comentario no generado por chatgpt a continuación) falta de experiencia previa con la tecnología.
- **Solución**: Definir y documentar convenciones técnicas desde el inicio.

### 4.1.3. Problemas con Git y control de versiones
- **Descripción**: Se perdió código por mala gestión de ramas.
- **Causa**: No seguir Gitflow adecuadamente.
- **Solución**: Seguir estrictamente Gitflow y educar al equipo en su uso.

### 4.1.4. Fallos de planificación y organización general
- **Descripción**: Se subestimaron tareas y no se gestionaron dependencias entre funcionalidades.
- **Impacto**: Caos el último día y funcionalidades clave sin integrar.
- **Solución**: Crear un cronograma con fechas intermedias y gestionar las dependencias entre tareas.


## 4.2 Resumen hecho por secretario
Todos los problemas apuntan a una mala comunicación y organización. A continuación, se muestran los títulos de los problemas que han puesto los encuestados junto a la descripción proporcionada con el compañero:

- Error en el despliegue: Rafa y yo estuvimos intentando el despliegue pero había muchos problemas de cara a la entrega

- Integración continua: Problemas con la integración continua, fallos al hacer el despliegue y código que desapareció por mala política de ramas

- Refactorización de Backend S1: Al principio del desarrollo no se acordó ninguna estructura o modelo a seguir para realizar las llamadas API del backend, por lo que resultó en varias aplicaciones, cada una con una estructura diferente, algunos utilizaban clases APIView que proporcionaba DjangoRest y otros definían las funciones directamente. Tras una discusión del equipo se acordó seguir una estructura predeterminada para facilitar la legibilidad y homogeneidad del código.

- Despliegue tardío: Según recuerdo, se esperó a que todo el equipo terminase de desarrollar hasta el último día para desplegar. Según tengo entendido, se comenzó a desplegar el día anterior a la entrega y surgieron complicaciones que causaron que no se pudiera desplegar hasta horas antes de la hora límite de la entrega. Sin embargo, aunque se consiguió desplegar, este tenía errores, que fue la causa del suspenso según tengo entendido.	

- Fallo en la organización: Los del equipo de planificación no tuvimos en cuenta dejar tiempo para resolver errores debido a la gran cantidad de funcionalidades que queríamos implementar para el S1 y se puso como fecha límite para terminar las funcionalidades pues el día de antes de la entrega. El problema surgió debido a que había unas funcionalidades que dependían de otras, por lo tanto, como esas funcionalidades claves se terminaron el último día, hubo que hacer un gran esfuerzo al final para terminar algunas funcionalidades dependientes. Esto provocó que surgieran errores al intentar integrar todo de golpe el último día por lo que ya no había tiempo para solucionar los errores, además de desplegar la aplicación, que también se dejó para el final. Deberíamos de haber establecido límites para que aquellas funcionalidades clave estuvieran listas la primera semana, para poder terminar el resto de funcionalidades la segunda. Además, deberíamos haber aplicado de forma más cuidadosa la política de ramas y la integración contínua, realizando numerosos merges de develop en las ramas correspondientes para evitar perder código y solucionar los errores que puedan surgir con antelación. Tambien deberíamos haber empezado antes a desplegar, aunque fuera con una versión sin funcionalidades de la aplicación.

Todos los problemas relacionados están relacionados con el despliegue, la integración y la coordinación entre el despliegue y desarrollo de funcionalidades. Por otro lado, también se reporta falta de coordinación y acuerdos entre compañeros a la hora de desarrollar.

También, es importante entender que el S1 fue nuestro primer contacto con muchas de las tecnologías que hemos utilizado para el desarrollo, por lo que es normal que ocurran problemas. Sin embargo, esto debería de haberse tenido más en cuenta en la planificación.

Destaca que la mayoría de los problemas (4 de 5) fueron reportados antes de la entrega. El problema con título "Integración continua" fue el único que se encontró después de la entrega.

La mala planificación, el mal uso de la política de ramas y la falta de acuerdos y coordinación causaron que existieran errores en el código (en ocasiones causados por conflictos entre ramas) y que no hubiera tiempo para solucionarlos. Estos se trasladaron al despliegue, el cual por mala planificación tuvo sus propios problemas. De este modo, se entregó un producto con problemas en el despliegue por haber desplegado mal y porque el propio código tenía bugs.

<br>


# 5. Análisis de las condiciones de fallo
A continuación se hace un análisis de las condiciones de fallo respecto a 

- T-1. Not informing that a member is absent: No sucedió y no es un problema que se haya reportado.

- T-2. Taking longer than the stipulated time for the presentation: No sucedió y no es un problema que se haya reportado.

- T-3. Finishing the presentation before the last minute: No sucedió y no es un problema que se haya reportado.

- T-4. Having a divergence of the actual presentation with respect to the one that was part of the deliverable registered in the EV platform: No sucedió y no es un problema que se haya reportado.

- T-5. Not respecting or not reacting to the feedback given in class without an explicit justification explained in the presentation: No sucedió y no es un problema que se haya reportado. (En el feedback se ha dicho en varias ocasiones que el deploy es un fallo recurrente en los años anteriores. Se puede entender que no hemos reaccionado al feedback. Sin embargo, no se marca como incumplida porque hay otra condición de fallo que recoge mejor el problema.)

- T-6. Omitting in the presentation any of the aspects that are expected to be seen as they were explained in the previous class discussion: No sucedió y no es un problema que se haya reportado.

- T-7. Having text in the slides that is not readable by the presenter from the back of the class: No sucedió y no es un problema que se haya reportado.

- T-8. Presenting a document as part of a deliverable without a proper cover page that should include at least: No sucedió y no es un problema que se haya reportado.

- T-9. Performing an incorrect delivery: No sucedió y no es un problema que se haya reportado.

- **T-10. In all deliverables including software, incurring in any of the following software failure conditions:** El primer error incumple directamente la condición de fallo T-10 en su apartado "A legal interaction with your system does not have the expected behavior". Cuando entras en el despliegue del S1 (conectarse a una web e interactuar con ella es una acción legal), no aparecen las imágenes y no se comporta como en el video de la demo, que es el comportamiento esperado.

	- Origen del problema a nivel técnico: desconocimiento de la tecnología del despliegue y de la configuración necesaria del código para desplegar en esa tecnología concreta y errores en el código.

	- Origen a nivel de proceso: Mala organización, fallos en el seguimiento de las tareas, no se pusieron fechas límite a las tareas y fallos en la gestión de ramas. 

	- Fuente del problema (Person/People or System who introduced or generated the specific failure condition): teóricamente, la mala planificación es responsabilidad del equipo de planificación, el mal despliegue es principalmente del equipo de despliegue y los errores en el desarrollo de todo el equipo. Sin embargo, los fallos se retroalimentan, por lo que realmente es responsable todo el equipo.

	- Responsables del problema (Person/People who allowed the failure condition to be part of the deliverable): Igual que la fuente, todo el equipo.

	- Acciones de mitigación: De esto se habla en la siguiente sección.

<br>


# 6. Soluciones tomadas
El equipo era consciente de este problema, y para solucionarlo, en el siguiente sprint (S2) se cambiaron las personas asignadas al despliegue y se priorizó esa tarea desde el principio del sprint. Respecto a los errores de código y el mal uso de la política de ramas, el equipo tomó consciencia de ello y se comprometió a hacer merges de develop continuamente, que eventualmente se convirtió en una métrica (número de conflictos en pull request). Por otro lado, al estar desplegado desde el primer momento, se consiguieron resolver los errores en el despliegue de forma más eficiente. Estas acciones solucionaron el problema y se consiguió desplegar correctamente. Las soluciones específicas más importantes fueron:
- Se hizo un vídeo y se explicó de nuevo en una reunión la política de ramas y gestión de documentation as code.
- El despliegue no solo se hizo desde el principio del sprint sino que se hizo continuo (no estaba automatizado todavía en el S2 pero se desplegaba muy a menudo).
- Se pusieron fechas límite para terminar la tareas varios días antes que el día de la entrega.
De este modo, el único problema que causó el suspenso fue solucionado (está en estado resuelto) y así conseguimos aprobar el S2.

Analizando las decisiones tomadas junto a los problemas reportados del S2 en la encuesta, destaca que la solución tomada tras el despliegue fallido del S2 fue intentar hacer despliegue continuo. Sin embargo, esto no se consiguió directamente en el S2, por lo que en este entregable había dos personas responsables de desplegar continuamente. Por otro lado, se han reportado otros problemas de planificación en el S2. Cabe remarcar que en el S2 la organización del grupo cambió momentáneamente para abarcar mejor las tareas asignadas, lo que es probable que cause problemas de comunicación. También se reportan problemas en el reparto del esfuerzo y en la comunicación con usuarios pilotos. Analizar el estado de estos problemas no es objetivo de este documento, pero dado que son distintos que los detectados en el S1, se concluye que los problemas del S1 fueron solucionados pero surgieron nuevos problemas en el S2.

<br>


# 7. Lecciones aprendidas
- Las tareas más importantes se deben empezar al principio del sprint.
- La integración del código y la dependencia entre funcionalidades es algo a lo que se le debe de prestar atención.
- Gastar recursos en una buena planificación puede hacernos ahorrar tiempo y esfuerzo del sprint.

<br>


# Anexo
[Link a Excel](https://uses0-my.sharepoint.com/:x:/g/personal/delsanrub_alum_us_es/EazKWAh6m99Jiu-RwekAUXUB39w6iHQ9QEHFFToq65VfHg?e=BYhLfj)

Marca temporal,Nombre completo,Correo (uvus@alum.us.es),Rol en el equipo,Título o breve nombre del error/problema,Descripción breve del error/problema,¿A qué entrega pertenece?,¿Cuándo fue identificado?,¿Quién lo identificó?,¿Crees que fue un problema técnico?,"En caso afirmativo, ¿cuál fue el origen técnico del problema?",¿Crees que fue un problema de proceso o metodología?,"En caso afirmativo, ¿cuál fue el origen a nivel de proceso?",¿Quién introdujo el error o condición de fallo?,¿Quién permitió que llegara a la entrega final sin ser corregido?,¿Qué impacto tuvo este error en el resultado?,¿Qué solución técnica propones para evitar este error en el futuro?,¿Qué cambio propones en la forma de trabajo o metodología del equipo?,¿Consideras que este problema ya ha sido resuelto en entregas posteriores?,¿Qué podrías haber hecho mejor como miembro del equipo para evitar o detectar este error antes?,¿Qué aprendizaje personal sacas de este caso en concreto?
19/04/2025 15:05:40,Redactado,Redactado,"Analista, Desarrollador",Error en el despliegue,Rafa y yo estuvimos intentando el despliegue pero había muchos problemas de cara a la entrega,S1,Antes de la entrega,Yo,No,,Sí,No gestionar bien los tiempos y dejarlo para el último dia," No sé qué responder a esto, fue la “mala planificación” de hacerlo el última dia","Todo el grupo, se intentó hasta el final y hasta 4 compañeros más se integraron",Suspender el S1 por el despligue,Ninguna,"Ya la hemos añadido, hemos predeterminado que se debe tener todo el martes para que el miércoles y jueves se arreglen posibles fallos",Sí,"Creo que ha sido algo normal, por nuestra inexperiencia ",Que hay que intentar adelantar el trabajo lo antes posibles de los deadlines para evitar esto
19/04/2025 16:26:44,Redactado,Redactado,Desarrollador,Integracion continua,"Problemas con la integracion continua, fallos al hacer el despliegue y codigo que desaparecio por mala politica de ramas",S1,Después de la entrega (por el equipo),Otro miembro del equipo,No,,Sí,Problema de politica de ramas,Todos,Todos,El suspenso,Solucionado ya,Solucionado ya,Sí,Seguir a rajatabla gitflow,Que hay que seguir gitflow
19/04/2025 16:40:08,Redactado,Redactado,"Desarrollador, Tester",Refactorización de Backend S1,"Al principio del desarrollo no se acordo ninguna estructura o modelo a seguir para realizar las llamadas API del backend, por lo que resulto en varias aplicaciones, cada una con una estructura diferente, algunos utilizaban clases APIView que proporcionaba DjanjoRest y otros definían las funciones directamente. Tras una discusión del equipo se acordó seguir una estructura predeterminada para facilitar la legibilidad y homogeneidad del código.",S1,Antes de la entrega,Otro miembro del equipo,No,,Sí,No haber acordado entre los miembros del desarrollo backend un modelo a seguir o una estructura esperada.,Todos al no acordar como es correcto hacerlo,Nadie,Tiempo de trabajo que pudo ser empleado en otras tareas,"Que se utilice un framework que todo el equipo sepa utilizar y desarrollar un documento de como debe estar estructurada tanto las clases, carpetas y código",Ninguna,Sí,Revisar el trabajo de los compañeros para notificar de esta discrepancia en el desarrollo,Que es muy importante plantear todos los escenarios posible al inicio del proyecto para empezar todos con buen pie y dedicar tiempo a las revisiones del trabajo realizado por los compañero
19/04/2025 18:05:31,Redactado,Redactado,"Analista, Desarrollador",Comunicación con usuarios piloto,"En un principio se estableció que las comunicaciones con todos los usuarios piloto se realizasen mediante nuestro correo corporativo info@fisiofind.com. Esto generó dos problemas: 
1. Mucha gente no respondió a los formularios de prueba porque no tuvimos en cuenta que los correos podían llegar a spam (esto ha sido solucionado, supuestamente, para el S3). 
2. No mantener una comunicación continua con ellos por otros medios o mantenerlos al tanto de los avances del proyecto contribuyó a que, cuando llegó el correo con la prueba, muchos ignoraron el mensaje y, al ser la mayoría gente ajena a nuestros círculos más cercanos, no teníamos otra forma de contactar con ellos ni de exigirles una respuesta, a pesar de que se habían comprometido.",S2,Antes de la entrega,Yo,Sí,El desconocimiento de que había que configurar parámetros en los servidores de correo de IONOS para evitar esas llegadas de los mensajes a SPAM y confiar en la respuesta de los UP y no haber previsto esta situación.,Sí,No mantener comunicaciones continuas con los UP.,Antonio y yo,Antonio y yo,La falta de feedback de la plataforma,"Animar a todos los UP a seguirnos en nuestras RRSS para mantenerse informados sobre los avances del proyecto, solucionar el problema del SPAM con los servidores y el formato de la prueba y la forma de comunicarse.",En la forma de trabajo del equipo ninguno,Sí,Haberme informado sobre cómo gestionan en empresas importantes la comunicación con los usuarios piloto,Haberme tomado el tiempo necesario para haber previsto este tipo de cosas
19/04/2025 18:15:25,Redactado,Redactado,"Analista, Desarrollador",Mala estimación de tareas,Hay determinados miembros en el equipo que asumen más responsabilidades de las que pueden abarcar en 10 horas de trabajo diario.,S2,Antes de la entrega,Yo,Sí,"Subestimar que las tareas como: preparar pruebas para UP, preparar presentaciones, grabar y editar las demos, aprobar PRs... llevan poco tiempo cuando son tareas que de forma natural se desarrollan en 10 horas de trabajo bien hecho.",Sí,No realizar una estimación previa de las tareas por parte de todo el equipo.,Todos,Todos,"Pues que hay gente dedicando más de 25 horas semanales al proyecto pero que, para cumplir con los estándares de la asignatura, no registra todas sus horas en Clockify.",Estimar de forma rigurosa las tareas por parte de todo el equipo de planificación al comienzo de las semanas de trabajo.,"Estimar las tareas y poner una norma de un máximo de tareas por persona (Antonio, Delfín, Miguel y yo, entre otros, hemos llegado a tener el doble de tareas asignadas en el Project que el resto de personas del equipo).",Pendiente de análisis,"Ser más consciente de mis limitaciones y del tiempo que suelo emplear en tareas como preparar la presentación y las demos, para dedicar menos tiempo a otras tareas de código, dado que ya tenemos una responsabilidad muy grande que es preparar las presentaciones que determinan en gran parte nuestra nota del proyecto.","Saber analizar la importancia y magnitud de las tareas en las que estoy involucrada, pero supongo que es un aprendizaje que se da con la experiencia."
19/04/2025 19:43:23,Redactado,Redactado,"Analista, Desarrollador, Tester",Depliegue tardío,"Según recuerdo, se esperó a que todo el equipo terminase de desarrollar hasta el último día para desplegar. Según tengo entendido, se comenzó a desplegar el día anterior a la entrega y surgieron complicaciones que causaron que no se pudiera desplegar hasta horas antes de la hora límite de la entrega. Sin embargo, aunque se consiguió desplegar, este tenía errores, que fue la causa del suspenso según tengo entendido.",S1,Antes de la entrega,Otro miembro del equipo,No,,Sí,Se debería de haber haber desplegado desde el primer momento.,"Nadie realmente, todo el equipo debería de haber trabajado en solucionar la entrega y no fue así. Muchos intentamos ayudar pero siendo 17 personas en el mismo grupo no todos nos implicamos en solucionar un problema que sabiamos que era condicion de fallo. Es cierto que empezar a desplegar el día de antes es un error, pero tampoco es una decision facil, la situacion era muy caotica.",Todos,El suspenso,Ya se solucionó con el CI/CD,Las tareas que son más importantes deberían de empezarse al principio del sprint y ser revisadas continuamente para poder tomar medidas.,Sí,"Siento que actue correctamente y sinceramente di el maximo de mi en aquel suceso. Me implique directamente en ayudar a desplegar y en solucionar errores. Por otro lado, es cierto que podria haber presionado mas al equipo para desplegar antes, porque cuando segun recuerdo se sabia que se iba a desplegar el dia de antes y creo recordar que no comente nada aunque me parecio una mala idea.",Decir las cosas que me parecen mal. Las cosas mas importantes no se pueden hacer el dia de antes y tampoco puedo dejar que otros compañeros lo hagan o lo permitan.
20/04/2025 19:34:57,Redactado,Redactado,"Analista, Desarrollador",Refactorización del frontend,Para la refactorización del frontend no se estableció una fecha ni acuerdo con los desarrolladores de para evitar que se solapasen los cambios o realizarlos antes de que una funcionalidad estuviera lista.,S2,Antes de la entrega,Otro miembro del equipo,Sí,Mala coordinación de tareas,No,,"No fue alguien en concreto, fue la forma en la que la tarea estaba planteada",Todo el equipo,Había pequeños bugs visuales en pantallas de alta complejidad como las citas,Refactorización robusta y solo cuando se haya completado al 100% una funcionalidad,Que no sea una tarea que se haga al final de la entrega sino que se vaya haciendo conforme las funcionalidades se van terminando,Sí,Estar mas al tanto de que es lo que mis compañeros están llevando a cabo para localizar e identificar posibles errores antes de que puedan ocurrir,Que muchas veces tareas mas sencillas pero transversales como la refactorización son las que más deuda técnica pueden generar si no se llevan a cabo adecuadamente
20/04/2025 22:00:39,Redactado,Redactado,"Analista, Desarrollador, Tester",Comunicación,Problemas para solucionar dudas al no trabajar con mis compañeros del grupo 3,S2,Antes de la entrega,Yo,No,,Sí,No asignar la tarea junto con un miembro del grupo 3.,Supongo que los planificadores,El desarrollo del sprint,Un desvío en el tiempo de realización de mis tareas,Daily meetings entre los miembros de cada grupo.,Asignar las tareas a miembros de un mismo equipo,Sí,,A trabajar de forma independiente y a buscar la forma de avanzar por mi cuenta.
21/04/2025 17:01:12,Redactado,Redactado,"Analista, Desarrollador",Despliegue manual,"El despliegue en el s2 cambio de responsables, pese a estar casi listo la primera semana del sprint, no se automatizó, lo que requeria que los miembros encargados del despliegue tuvieran que estar presentes cada vez que alguien solicitaba un redespliegue, para probar las funcionalidades en produccion.",S2,Antes de la entrega,Yo,No,,Sí,No introducimos los workflows de integracion continua para automatizar el proceso,Benjamin y Ramon,"Los mismos, creiamos que debiamos arrastrar esa deuda hasta acabar el sprint y automatizarlo de cara al s3","Medio, ya que en muchas ocasiones se atrasaba al equipo al encontrar los fallos de una manera tardía en producción.",Implementacion de CD con workflows (ya esta hecho),"Ninguna",Sí,"Planificar de una manera mas exhaustiva el despliegue, nos lanzamos a apagar un fuego (el despliegue fallido) sin planificarlo de primeras, por lo que no pensamos en el CD hasta que habiamos terminado.",Planification is key.
21/04/2025 19:51:12,Redactado,Redactado,"Analista, Desarrollador, Tester",Fallo en la organización,"Los del equipo de planificación no tuvimos en cuenta dejar tiempo para resolver errores debido a la gran cantidad de funcionalidades que queriamos implementar para el S1 y se puso como fecha límite para terminar las funcionalidades pues el día de antes de la entrega. El problema surgió debido a que había unas funcionalidades que dependían de otras, por lo tanto, como esas funcionalidades claves se terminaron el último día, hubo que hacer un gran esfuerzo al final para terminar algunas funcionalidades dependientes. Esto provocó que surgieran errores al intentar integrar todo de golpe el último día por lo que ya no había tiempo para solucionar los errores, además de desplegar la aplicación, que también se dejó para el final. Deberíamos de haber establecido límites para que aquellas funcionalidades clave estuvieran listas la primera semana, para poder terminar el resto de funcionalidades la segunda. Además, deberíamos haber aplicado de forma más cuidadosa la política de ramas y la integración contínua, realizando numerosos merges de develop en las ramas correspondientes para evitar perder código y solucionar los errores que puedan surgir con antelación. Tambien deberíamos haber empezado antes a desplegar, aunque fuera con una versión sin funcionalidades de la aplicación.",S1,Antes de la entrega,Yo,Sí,Las dificultades del despliegue y el desconocimiento acerca de como funcionarian en despliegue las funcionalidades innovadoras como las videollamadas,Sí,"Fallo la planificación, que deberíamos haber establecido un cronograma mas estricto donde se indicara la fecha limite de cada tarea, como hacíamos en PGPI","Principalmente el equipo de planificación, pero fue provocado por todo el equipo en general",Todos,Suspendimos el Sprint debido a que el despliegue fue un desastre,Estudiar antes las formas de despliegue,"Realizar un cronograma en el momento de la planificación donde se indique la fecha limite de cada tarea asi como la dependencia entre tareas. Por otro lado, seguir de forma mas estricta la politica de ramas y la integración continua",En progreso,"Como pertenezco al equipo de planificación, pues hacer lo que he mencionado anteriormente. También podría haber metido mas presión a aquellas personas encargadas de las tareas de las que dependíamos y a los encargados del despliegue","Que la planificación es el proceso mas importante del ciclo de vida de un proyecto. Por mucha habilidad y destreza que tengan los desarrolladores, si no se ha hecho una planificación cuidadosa y precisa, se pueden complicar muchas cosas. Otro punto importante es la comunicación, conocer el trabajo de los compañeros y solicitar ayuda cuando se necesite"
