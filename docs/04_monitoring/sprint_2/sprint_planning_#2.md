---
title: "SPRINT PLANNING SPRINT 2"                         # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 2"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "15/03/2025"                                        # CHANGE IF NEEDED
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
header-left: "SPRINT PLANNING SPRINT 2"                   # CHANGE IF NEEDED
header-right: "15/03/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<p align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  SPRINT PLANNING SPRINT 2
</p>

<br>


**ÍNDICE**
- [**1. OBJETIVOS DEL SPRINT**](#1-objetivos-del-sprint)
- [**2. SPRINT BACKLOG**](#2-sprint-backlog)
  - [**Épica 6: Pricing plan (fisio)**](#épica-6-pricing-plan-fisio)
  - [**Épica 7: Pasarela de pagos**](#épica-7-pasarela-de-pagos)
  - [**Épica 8: Subida vídeos/archivos**](#épica-8-subida-vídeosarchivos)
  - [**Épica 9: Herramientas de seguimiento**](#épica-9-herramientas-de-seguimiento)
  - [**Épica 10: Elaborar sistema de cookies, SLA, CA**](#épica-10-elaborar-sistema-de-cookies-sla-ca)
  - [\*\*Épica 11: **Corregir errores y problemas de #S1**](#épica-11-corregir-errores-y-problemas-de-s1)
  - [**Tareas aplazadas al #SPRINT 3**](#tareas-aplazadas-al-sprint-3)
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

- **Entregable:** #SPRINT 2

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Antonio Macías Ferrera](https://github.com/antoniommff) (autor) [Delfín Santana Rubio](https://github.com/DelfinSR) (revisor)

- **Fecha de Creación:** 15/03/2025

- **Versión:** v1.0

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por          | Descripción de los cambios                       |
| ---------- | ------- | ---------------------- | ------------------------------------------------ |
| 20/02/2025 | v1.0    | Antonio Macías Ferrera | Elaboración de la primera versión del documento. |
| 16/03/2025 | v1.1    | Delfín Santana Rubio | Corrección de fallos menores. |


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
| Pablo Fernández Pérez | Representante grupo 1, analista, programador |


<br>

<!-- \newpage -->

<br>


# **1. OBJETIVOS DEL SPRINT**

El propósito de este informe es definir los objetivos a lograr durante el Sprint #2 y describir la metodología para alcanzarlos.

**🔴 Sprint Goal:** TOOLS & PAYMENT (Herramientas para fisioterapeutas y gestión de pagos y monetización)

Los objetivos marcados para este Sprint son los siguientes:

- ✅ **Objetivo 1:** Elaborar el sistema de pagos y monetización
- ✅ **Objetivo 2:** Implementar la subida de vídeos y archivos a la plataforma
- ✅ **Objetivo 3:** Implementar las herramientas para fisioterapeutas
- ✅ **Objetivo 4:** Elaborar sistema de cookies, SLA y CA
- ✅ **Objetivo 5:** Corregir errores y problemas del Sprint 1



| Obj | Historia Épica                    | Historias de Usuario           | Asignado (s)                        | Prioridad    | 
| --- | --------------------------------- | ------------------------------ | ----------------------------------- | ------------ | 
| 1 | E-006: **Pricing plan (fisio)**     | HF-001                         | Benjamín I. Maurreira, Ramon Gavira | Semana **1** | 
| 1 | E-007: **Pasarela de pagos**        | HP-004, HP-007, HF-008, HF-009 | **GRUPO 3**                         | Semana **1** | 
| 2 | E-008: Subida vídeos/archivos       | HF-12                          | Julen Redondo, Francisco Mateos     | Semana 2     | 
| 3 | E-009: **Herramientas seguimiento** | HF-006, HF-007, HF-011, HF-013, HF-014 | **GRUPO 1**, Guadalupe Rigruejo | Semana **1** | 
| 4 | E-010: Elaborar sistema de coockies, SLA, CA | RFC-004, RFC-005      | Antonio Macías, Daniel Ruiz         | Semana 2     |
| 5 | E-011: **Corregir errores y problemas de #S1** | RFC-006, RFC-007, RFC-008, RFC-009 | **TODOS**            | Semana **1** | 


<br>

<!-- \newpage -->

<br>


# **2. SPRINT BACKLOG**

## **Épica 6: Pricing plan (fisio)**

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

- Selección de plan de suscripción:
  - Una vez validada la colegiación, el fisioterapeuta debe seleccionar uno de los dos planes de suscripción disponibles: Fisio Blue o Fisio Gold.
  - El sistema debe proporcionar una descripción clara de las características y beneficios de cada plan para que el fisioterapeuta pueda tomar una decisión informada.
  - El fisioterapeuta debe poder cambiar de plan en el futuro si lo desea, una vez que se haya completado el registro inicial.

<br>

<br>

## **Épica 7: Pasarela de pagos**

***HP-004: Pago de citas por la aplicación***
> **Como** paciente,  
> **Quiero** abonar el coste de la cita en la propia plataforma con tarjeta bancaria,  
> **Para** completar el pago de manera segura y cómoda sin necesidad de realizar transferencias externas.  
> **Como** paciente,  
> **Quiero** abonar el coste de la cita en la propia plataforma con tarjeta bancaria,  
> **Para** completar el pago de manera segura y cómoda sin necesidad de realizar transferencias externas.

<br>

<br>

***HP-007: Reembolso en caso de cancelación del fisioterapeuta*** 
> **Como** paciente,
> **Quiero** que, una vez transcurrido el límite de cancelación, si el fisioterapeuta cancela la consulta, recibir un reembolso del coste de esta,
> **Para** no perder el dinero de la consulta.

**Comentarios**: 
- Por defecto, el límite de cancelación estará puesto en 48 horas.

<br>

<br>

***HF-008: Pago previo de la consulta***
> **Como** fisioterapeuta,  
> **Quiero** que el paciente abone de antemano el precio de la consulta,   
> **Para** garantizar el compromiso del paciente y reducir cancelaciones de última hora.

**Comentarios**: 
- Un paciente solo podrá reservar una consulta si la fecha de la cita está a más de 72 horas de la solicitud.
- Entre las 72 y 48 horas previas a la consulta, el paciente podrá cancelar la cita sin cargo.
- Pasadas las 48 horas previas a la consulta, el cobro se realizará automáticamente.
- El único caso en el que un paciente recibirá un reembolso será si el fisioterapeuta cancela la consulta dentro de las 48 horas previas.
- Esta historia excluye a las consultas que estén catalogadas como "GRATUITAS".

<br>

<br>

***HF-009: Registro de facturas*** 
> **Como** fisioterapeuta,  
> **Quiero** que el sistema genere una factura por cada consulta realizada y que se almacenen en el sistema,  
> **Para** que pueda consultarlas y descargarlas.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Generación automática de facturas:
  - El sistema debe generar una factura automáticamente por cada consulta realizada.
  - La factura debe incluir detalles como: nombre del paciente, especialidad del fisioterapeuta, fecha de la cita, importe, impuestos aplicables y forma de pago.

<br>

<br>

## **Épica 8: Subida vídeos/archivos**

***HF-012: Archivos en la nube*** 
> **Como** fisioterapeuta,  
> **Quiero** poder modificar los vídeos subidos en mi espacio personal y darle acceso a los pacientes que correspondan,   
> **Para** que pueda consultar en cualquier momento cómo se realiza un ejercicio o para que tengan acceso a alguna explicación que quiera ofrecerle.

**Comentarios**:
- Se podría considerar la posibilidad de que, por ejemplo, en las planificaciones de ejercicio, un ejercicio ya esté asociado a un vídeo explicativo de la nube del profesor. 
  
<br>

<br>

## **Épica 9: Herramientas de seguimiento**

***HF-006: Personalización de herramientas***  
> **Como** fisioterapeuta,  
> **Quiero** tener un espacio donde poder personalizar los tests y cuestionarios plantilla ofrecidos por la plataforma,   
> **Para** ofrecer un servicio personalizado a mis pacientes.

<br>

<br>

***HF-007: Cuestionario preintervención***   
> **Como** fisioterapeuta,  
> **Quiero** que antes de confirmar la cita de un paciente, esté obligado a rellenar un cuestionario preintervención,   
> **Para** conocer el motivo de la consulta y sus hábitos para realizar un diagnóstico previo.

**Comentarios**: 
- En este cuestionario es donde se debería incluir la herramienta del mapa de dolor, por ejemplo. 
- El cuestionario varía según la especialidad del fisio. 

<br>

<br>

***HF-011: Herramientas en la videollamada*** 
> **Como** fisioterapeuta,  
> **Quiero** poder tener acceso durante el transcurso de la videollamada a las siguientes herramientas y poder modificar la información que se requiera:
> - Historial clínico del paciente almacenado en el sistema
> - Compartir pantalla
> - Modelo anatómico 3D
> - Plantillas de test y cuestionario
> - Mis cuestionarios personalizados    
> **Para** recoger y almacenar información del paciente, así como ilustrarle con diapositivas o el modelo anatómico 3D la información que considere necesaria para enseñarle el por qué de su patología y el por qué de su tratamiento.

**Comentarios**:
- Las herramientas de test y cuestionarios deberían concebirse como Google Forms, es decir, cuestionarios personalizables. Nosotros tendremos digitalizados en el sistema los mapas de dolor, las escalas de evaluación, etc., y estas podrán ser insertadas en los cuestionarios y tests. 

<br>

<br>

***HF-013: Test y cuestionarios ***
> **Como** fisioterapeuta,  
> **Quiero** disponer de plantillas de test, cuestionarios y prescripción de ejercicios,   
> **Para** valuar a mis pacientes, personalizar los tratamientos y almacenarlos en mi espacio dentro de la plataforma para tenerlos siempre disponibles.
> - Tipos de plantillas disponibles:
>   - Test de valoración(Lista de test específicos a definir: X) 
> - Cuestionarios (Lista de cuestionarios específicos a definir: X)
> - Plantilla para prescripción de ejercicios
>   - Datos del paciente:
>     - Nombre
>     - Diagnóstico
>     - Frecuencia de realización de ejercicios
>     - Tiempo estimado de la sesión
>     - (Opcional) Hora recomendada para realizar los ejercicios (esto permitirá que la aplicación envíe notificaciones de recordatorio, ajustables posteriormente por el paciente en su sección de tratamiento/seguimiento).
>   - Detalles del ejercicio:
>     - Nombre
>     - Objetivo (por ejemplo, fortalecimiento de peroneos en caso de esguince)
>     - Descripción del ejercicio (posibilidad de incluir enlace a un vídeo subido por el fisioterapeuta)
>     - Material necesario
>     - Series, repeticiones y carga
>     - Método de evaluación (ejemplo: escala EVA, escala Tinetti, etc.)

**Comentarios**:
- Se podría permitir la creación de test y cuestionarios personalizados desde cero.
- Sería útil que el paciente pudiera completar los cuestionarios directamente en la plataforma para que el fisioterapeuta reciba los resultados automáticamente.
- Para consultar los tipos de tests: https://centromotionis.com/escalas-de-valoracion-en-fisioterapia/ 

<br>

<br>

***HF-014: Seguimiento***    
> **Como** fisioterapeuta,  
> **Quiero** disponer de un apartado en la plataforma que me permita acceder al seguimiento de todos los pacientes que tengo en activo,  
> **Para** poder consultar su progreso e informes sobre cómo están respondiendo al tratamiento, si lo están realizando, etc.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Acceso a la lista de pacientes activos:
  - El fisioterapeuta debe tener acceso a una lista de todos los pacientes que están bajo su seguimiento activo.
  - La lista debe estar ordenada por fecha de inicio del tratamiento o por cualquier otra métrica relevante para el fisioterapeuta (por ejemplo, nombre del paciente).

- Visibilidad del progreso de cada paciente:
  - El fisioterapeuta debe poder ver un resumen de cada paciente, que incluya detalles clave sobre el tratamiento, como el tipo de tratamiento asignado, las fechas de consulta y el progreso general.
  - Los datos de progreso deben incluir informes de ejercicios realizados, evolución del dolor o movilidad, y otros indicadores de tratamiento relevantes.

- Acceso a informes de progreso:
  - El fisioterapeuta debe poder generar y consultar informes detallados del progreso de cada paciente, basados en las evaluaciones previas y en el seguimiento realizado.
  - Los informes deben ser accesibles desde el perfil de cada paciente, y deben incluir gráficos o tablas de evolución, si es posible.

- Registro de interacciones:
  - El sistema debe registrar y mostrar las interacciones pasadas entre el fisioterapeuta y el paciente, incluyendo consultas, notas de evaluación, ajustes en el tratamiento y cualquier comunicación relevante.
  - El fisioterapeuta debe poder agregar notas adicionales sobre cada paciente.

- Acciones en función del progreso:
  - Si un paciente no está siguiendo el tratamiento correctamente, el fisioterapeuta debe poder tomar acciones como enviar recordatorios, modificar el tratamiento o contactar al paciente para discutir el progreso.
  - El sistema debe permitir configurar alertas o notificaciones para los fisioterapeutas si un paciente muestra signos de no seguir el tratamiento.

- Visualización del cumplimiento del tratamiento:
  - El fisioterapeuta debe tener acceso a un registro claro de cuántos ejercicios han sido completados por el paciente y qué porcentaje del tratamiento se ha seguido correctamente.
  - Esta visualización debe estar disponible en tiempo real para que el fisioterapeuta pueda ajustar el tratamiento según sea necesario.

- Historial completo de tratamiento:
  - Los fisioterapeutas deben poder ver el historial completo de tratamiento de cada paciente, con detalles sobre todas las citas anteriores, diagnósticos, tratamientos realizados, y resultados obtenidos.

- Sistema de evaluación de cumplimiento:
  - El sistema debe permitir al fisioterapeuta evaluar y registrar el nivel de cumplimiento del paciente con respecto a su tratamiento, incluyendo la realización de ejercicios, la asistencia a citas, y el seguimiento de recomendaciones.

- Comunicación con el paciente:
  - El fisioterapeuta debe tener una opción para comunicarse directamente con el paciente dentro de la plataforma, ya sea por mensaje o video, si es necesario para discutir el progreso o hacer ajustes en el tratamiento.

- Filtrado y búsqueda de pacientes:
  - El fisioterapeuta debe poder filtrar o buscar pacientes según diferentes criterios (por ejemplo, fecha de inicio del tratamiento, tipo de tratamiento, progreso) para facilitar la gestión de su carga de trabajo.

<br>

<br>


## **Épica 10: Elaborar sistema de cookies, SLA, CA**

***REQUEST FOR CHANGE #4: Integración de Cookies y Políticas***

**Descripción del cambio:**  
Implementación de un sistema de gestión de cookies y consulta de documentos legales (uso de cookies, términos y condiciones, política de privacidad, uso de licencias, LOPD) en la plataforma FisioFind. Incluye banner de cookies, centro de privacidad y apartado de requests (denuncias).

**Motivación e Impacto:**  
- Necesidad de cumplir con la normativa GDPR y ePrivacy.
- Cumplir con los requisitos de fallo del #SPRINT 2.

**Instrucciones:**  
1. Implementar banner/pop-up de cookies con opciones de aceptar/rechazar
2. Crear centro de privacidad (integrando docs md)
3. Implementar un canal de denuncias anónimas (enviar correo a denuncias@fisiofind.com)

<br>

<br>

***REQUEST FOR CHANGE #5: Documentación Legal y Acuerdos***

**Descripción del cambio:**  
Desarrollo e implementación de documentación legal incluyendo uso de cookies, términos y condiciones, política de privacidad, uso de licencias, LOPD para FisioFind.

**Motivación e Impacto:**  
- Necesidad de cumplir con la normativa GDPR y ePrivacy.
- Cumplir con los requisitos de fallo del #SPRINT 2.


**Instrucciones:**  
1. Redactar documentos legales en md
2. Añadirlos a la documentación del proyecto
3. Añadir los documentos al apartado de centro de privacidad de FisioFind

<br>

<br>


## **Épica 11: **Corregir errores y problemas de #S1** 

***REQUEST FOR CHANGE #6: Refactorización Frontend***

**Descripción del cambio:**  
- Actualizar página de **Home** para que tenga una estética más atractiva y con colores similares a la landing page
- Corregir **sidebar**
- Corregir diseño y layout de **formualrios** para hacerlos más uniformes
- Homogeneizar diseños de **botones** y **mensajes de error/alertas**

**Motivación e Impacto:**  
- Mejorar la calidad del código
- Reducir la deuda técnica
- UX: Mejor experiencia de usuario

**Instrucciones:**  
N/A

<br>

<br>

***REQUEST FOR CHANGE #7: Refactorización Backend***

**Descripción del cambio:**  
- Realizar mensajes de errores y exito en todas las entidades
- Eliminar código duplicado
- Homogeneizar nombres de rutas, entidades y carpetas
- Comprobar validaciones de creación, edición y eliminación de entidades

**Motivación:**  
- Mejorar la eficiencia del servidor
- Código más organizado y documentado
- Mejoras en la protección de datos

**Instrucciones:**  
N/A

<br>

<br>

***REQUEST FOR CHANGE #8: Corrección de Errores Funcionales #S1***

**Descripción del cambio:**  
Todos los miembros de grupo deben revisar su funcionalidad/ funcionalidaddes implementadas que se encuentren en MAIN y revisar que se reporduce correctamente su comportamiento esperado. Si no fuera así, corregir con una rama hotfix ***ANTES DEL LUNES***.

**Motivación e impacto:**  
- Permitir un comienzo adecuado de las tareas del #SPRINT 2
- Garantizar la estabilidad y correcto funcionamiento de las funcionalidades implementadas en el primer sprint.

**Instrucciones:**  
1. Revisar tu funcionalidad y comprobar que no hay errores EN MAIN.
2. Si hubiera errores o comportamientos no esperados, crear una rama hotfix/fix-nombre-de-la-rama y corregirlo.
3. Realizar Pull Requests necesarias para incorporar los cambios a MAIN y DEVELOP.

<br>

<br>

***REQUEST FOR CHANGE #9: CD/CI***

**Descripción del cambio:**  
- Solucionar duda acerca del despliegue iterativo (uno para el #SPRINT 1, otro para el #SPRINT 2...)
- Corregir el despliegue del #SPRIT 1 haciendo posible la realización de videollamadas y la visualización correcta de los elementos gráficos estáticos
- Realizar un workflow de CD en el que se realizaen despliegues de forma periódica
- Realizar un workflow de CI en el que se incorporen de manera automática los cambios realizados desde DEVELOP a MAIN.

**Motivación:**  
- Automatizar el proceso de pruebas y despliegue para mejorar la calidad del código y reducir el tiempo de entrega.
- Asegurar un despliegue correcto para las sucesivas entregas de la aplicación.

**Instrucciones:**  
N/A

<br>

<br>


## **Tareas aplazadas al #SPRINT 3**

Queda pendiente para el #S2 la siguiente petición de cambio:

***REQUEST FOR CHANGE #10: Cifrado de Datos de Usuario***

**Descripción del cambio:**  
Implementación de un sistema de cifrado end-to-end para los datos sensibles de usuarios en la plataforma FisioFind, cifrando los datos sensibles DEL USUARIO (email, dni, contraseña)

**Motivación e Impacto:**  
Garantizar la seguridad y privacidad de la información personal y médica de los usuarios, cumpliendo con los estándares de protección de datos y regulaciones aplicables.

**Instrucciones:**  
N/A



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
