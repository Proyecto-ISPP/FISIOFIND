---
title: "REGISTRO DE REQUISITOS"                           # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "12/02/2025"                                        # CHANGE IF NEEDED
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
header-left: "REGISTRO DE REQUISITOS"                     # CHANGE IF NEEDED
header-right: "12/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  REGISTRO DE REQUISITOS
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
  - [1.1. Recopilación de requisitos](#11-recopilación-de-requisitos)
- [2. ESTRUCTURA DE LOS REQUISITOS](#2-estructura-de-los-requisitos)
- [3. REQUISITOS](#3-requisitos)
  - [3.1. Requisitos Funcionales](#31-requisitos-funcionales)
    - [3.1.1 Rol en el sistema: Usuario invitado](#311-rol-en-el-sistema-usuario-invitado)
    - [3.1.1 Rol en el sistema: Paciente](#311-rol-en-el-sistema-paciente)
    - [3.1.1 Rol en el sistema: Fisioterapeuta](#311-rol-en-el-sistema-fisioterapeuta)
    - [3.1.1 Rol en el sistema: Administrador](#311-rol-en-el-sistema-administrador)
  - [3.2 Requisitos No Funcionales](#32-requisitos-no-funcionales)
  - [3.3 Requisitos de Información](#33-requisitos-de-información)
    - [RI-001: Tabla `user`](#ri-001-tabla-user)
    - [RI-002: Tabla `physiotherapist`](#ri-002-tabla-physiotherapist)
    - [RI-003: Tabla `patient`](#ri-003-tabla-patient)
    - [RI-004: Tabla `appointment`](#ri-004-tabla-appointment)
    - [RI-005: Tabla `review`](#ri-005-tabla-review)
    - [RI-006: Tabla `invoice`](#ri-006-tabla-invoice)
    - [RI-007: Tabla `document`](#ri-007-tabla-document)
    - [RI-008: Tabla `college_data`](#ri-008-tabla-college_data)
    - [RI-009: Tabla `admin`](#ri-009-tabla-admin)
    - [RFI-010: Tabla `terms_conditions`](#rfi-010-tabla-terms_conditions)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Alberto Carmona Sicre, Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernández Caballero, Daniel Alors Romero

- **Fecha de Creación:** 12/02/2025  

- **Versión:** v3.1

<br>

---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 12/02/2025 | v1.0    | Alberto Carmona Sicre, Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernández Caballero, Daniel Alors Romero          | Añadidos los apartados: Introducción, Estructura de los Requisitos y Requisitos. |
| 12/02/2025 | v1.1    | Alberto Carmona Sicre, Daniel Fernández Caballero       | Modificado el apartado de requisitos funcionales |
| 12/02/2025 | v1.2    | Daniel Alors Romero       | Modificados los apartados de requisitos funcionales y no funcionales  |
| 12/02/2025 | v1.3    | Daniel Fernández Caballero      | Añadidos nuevos requisitos funcionales, editados los requisitos funcionales 6, 7, 12, y 23 y añadidos nuevos requisitos no funcionales  |
| 23/02/2025 | v2.0    | Guadalupe Ridruejo Pineda, Julen Redondo Pacheco   | Modificación de los requisitos de acuerdo con la nueva versión de historias de usuario (fisioterapeutas y administradores)  |
| 27/02/2025 | v2.1    | Guadalupe Ridruejo Pineda  | Añadido nuevo requisito de comprobación continua de fisioterapeutas colegiados |
| 27/02/2025 | v2.2    | Guadalupe Ridruejo Pineda  | Numeración de requisitos |
| 27/02/2025 | v3.0    | Guadalupe Ridruejo Pineda  | Requisitos de información |
| 28/02/2025 | v3.1    | Guadalupe Ridruejo Pineda  | Correcciones derivadas de la revisión |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los requisitos contemplados en el proyecto FisioFind.  

## 1.1. Recopilación de requisitos  
La recopilación de requisitos es un proceso esencial para identificar y definir de manera clara y precisa las expectativas de los usuarios y los objetivos estratégicos del proyecto. Este proceso permite asegurar que el sistema a desarrollar satisfaga completamente las demandas del negocio y de los usuarios finales.  
Para este proyecto, enfocado en la relación entre fisioterapeutas y sus clientes, la recopilación de requisitos se llevará a cabo a través de diversas técnicas, garantizando que cada aspecto relevante sea considerado.  

Métodos de Recopilación: 

- **Reunión entre integrantes del grupo**: los propios integrantes del grupo realizarán reuniones para definir aquellos requisitos relacionados con aspectos más técnicos de la aplicación.

- **Formularios**: con el fin de acceder a las verdaderas necesidades de los profesionales, se realizan formularios que permiten a los usuarios proporcionar información relevante.  

Definición y Documentación Inicial:  

- Los requisitos recopilados serán organizados en un primer borrador que incluirá tanto requisitos funcionales como no funcionales.  

- Se asegurará que todos los requisitos estén bien definidos y comprendidos por el equipo técnico.  

<br>

<hr>

# 2. ESTRUCTURA DE LOS REQUISITOS
Primeramente, se hará una separación de requisitos en funcionales, no funcionales y de información, según las siguientes descripciones:  

- **Requisitos funcionales**: Describen las funciones que el sistema debe cumplir para satisfacer las necesidades de los usuarios. Se refieren a las funcionalidades y características visibles que permiten la interacción directa del usuario con el sistema.  

- **Requisitos no funcionales**: Definen atributos de calidad que no están directamente relacionados con las funciones del sistema, pero que son esenciales para su rendimiento. Incluyen aspectos como la seguridad, la escalabilidad, la usabilidad y la eficiencia.  

- **Requisitos de información**: Especifican los datos que el sistema debe gestionar, almacenar, procesar y comunicar para garantizar el cumplimiento de sus funciones.  

Por otro lado, para cada requisito, se define lo siguiente:  

- **Identificador**: dependiendo de si el requisito es funcional o no funcional, contará con un identificador u otro:  

    - **ID requisitos funcionales**: 
      - RFI-XXX (Usuario invitado)
      - RFP-XXX (Paciente)
      - RFF-XXX (Fisioterapeuta)
      - RFA-XXX (Administrador) 

    - **ID requisitos no funcionales**: RNF-XXX. 

    - **ID requisitos de información**: RI-XXX.    

- **Versión**: indica las distintas fases por las que pasa el requisito. La versión empieza en la V1.0 y va aumentando en función de las modificaciones.  

- **Descripción**: una breve descripción de lo que se busca implementar o tener en cuenta con el requisito. 

- **Prioridad**: se definen cuatro distintas prioridades, de mayor a menor importancia:

    - **Crítica:** Estos son los requisitos esenciales para que la solución funcione y cumpla con los objetivos mínimos del proyecto. Sin ellos, el producto no sería viable o no cumpliría las expectativas.  

    - **Importante:** Estos requisitos son muy deseables y tienen un alto valor añadido, pero no son imprescindibles para la operatividad mínima del sistema. Si no se implementan en la primera fase, el proyecto aún sería funcional, aunque con menos eficiencia o atractivo para el usuario.  

    - **Deseable:** Son requisitos que podrían incluirse si los recursos y el tiempo lo permiten, pero no afectan de manera crítica al éxito del proyecto. Su implementación añade valor adicional o mejora la experiencia del usuario, pero su ausencia no compromete el objetivo principal.  

    - **Baja:** Estos requisitos no se implementarán en el alcance actual del proyecto, ya sea porque no son necesarios o porque no son factibles dentro de los plazos y recursos disponibles. Sin embargo, podrían considerarse para fases futuras o como mejoras posteriores.   

<br>

<!-- \newpage -->

<hr>

# 3. REQUISITOS
## 3.1. Requisitos Funcionales
### 3.1.1 Rol en el sistema: Usuario invitado

| **RFI-001** | **Acceso sin registro** |
| --- | --- |
| **Código HU** | HI-001 |
| **Versión** | V1.0 |
| **Descripción** | El usuario invitado podrá acceder a la plataforma sin necesidad de registrarse o iniciar sesión. |
| **Prioridad** | Crítica |

| **RFI-002** | **Navegación por la lista de fisioterapeutas** |
| --- | --- |
| **Código HU** | HI-001 |
| **Versión** | V1.0 |
| **Descripción** | El usuario invitado podrá ver la lista de fisioterapeutas, incluyendo sus perfiles. |
| **Prioridad** | Crítica |

| **RFI-003** | **Búsqueda de fisioterapeutas con filtros** |
| --- | --- |
| **Código HU** | HI-001 |
| **Versión** | V1.0 |
| **Descripción** | El usuario invitado podrá buscar fisioterapeutas aplicando filtros como especialidad y ubicación. |
| **Prioridad** | Crítica |

| **RFI-004** | **Redirección al registro al intentar reservar** |
| --- | --- |
| **Código HU** | HI-001 |
| **Versión** | V1.0 |
| **Descripción** | Si el usuario invitado intenta reservar una cita, será redirigido a la página de registro o inicio de sesión. |
| **Prioridad** | Crítica |

| **RFI-005** | **Acceso sin registro** |
| --- | --- |
| **Código HU** | HI-002 |
| **Versión** | V1.0 |
| **Descripción** | El usuario invitado podrá acceder a la plataforma sin necesidad de registrarse o iniciar sesión y podrá ver la lista de servicios y funcionalidades que la plataforma ofrece a los fisioterapeutas, como gestión de citas, visibilidad ante pacientes y administración de horarios. |
| **Prioridad** | Crítica |

| **RFI-006** | **Información sobre los beneficios de la plataforma** |
| --- | --- |
| **Código HU** | HI-002 |
| **Versión** | V1.0 |
| **Descripción** | El usuario invitado podrá consultar información sobre las ventajas de registrarse como fisioterapeuta, incluyendo visibilidad, gestión de citas y pagos, entre otros. |
| **Prioridad** | Importante |

| **RFI-007** | **Visualización de precios y suscripciones** |
| --- | --- |
| **Código HU** | HI-002 |
| **Versión** | V1.0 |
| **Descripción** | El usuario invitado podrá ver las opciones de suscripción disponibles con sus precios y características. |
| **Prioridad** | Crítica |

| **RFI-008** | **Redirección al registro al intentar interactuar con funciones avanzadas** |
| --- | --- |
| **Código HU** | HI-002 |
| **Versión** | V1.0 |
| **Descripción** | Si el usuario invitado intenta acceder a funciones avanzadas como ofrecer servicios o gestionar citas, será redirigido a la página de registro. |
| **Prioridad** | Crítica |

| **RFI-009** | **Visualización de valoraciones de fisioterapeutas** |
| --- | --- |
| **Código HU** | HI-003 |
| **Versión** | V1.0 |
| **Descripción** | El usuario invitado podrá acceder a las opiniones y valoraciones dejadas por fisioterapeutas registrados sobre la plataforma Fisio Find. Estas deberán mostrarse de forma clara y destacada. |
| **Prioridad** | Crítica |

| **RFI-010** | **Accesibilidad a las valoraciones** |
| --- | --- |
| **Código HU** | HI-003 |
| **Versión** | V1.0 |
| **Descripción** | Antes de registrarse en Fisio Find, los fisioterapeutas deben poder acceder fácilmente a las valoraciones de otros profesionales. Estas valoraciones podrían mostrarse en la *landing page*, en la misma sección donde se detallan los planes de precios. |
| **Prioridad** | Deseable |

| **RFI-011** | **Veracidad de las valoraciones** |
| --- | --- |
| **Código HU** | HI-003 |
| **Versión** | V1.0 |
| **Descripción** | Solo se mostrarán valoraciones verificadas de fisioterapeutas registrados en la plataforma. |
| **Prioridad** | Importante |

| **RFI-012** | **Indicación de estado de suscripción** |
| --- | --- |
| **Código HU** | HI-003 |
| **Versión** | V1.0 |
| **Descripción** |Se indicará si la valoración proviene de un usuario con una suscripción activa en la plataforma. |
| **Prioridad** | Deseable |

| **RFI-013** | **Redirección al registro para interactuar con valoraciones** |
| --- | --- |
| **Código HU** | HI-003 |
| **Versión** | V1.0 |
| **Descripción** | Para dejar una opinión o interactuar con otras valoraciones, el usuario deberá registrarse como fisioterapeuta en la plataforma. |
| **Prioridad** | Crítica |

### 3.1.1 Rol en el sistema: Paciente

| **RFP-001** | **Búsqueda y filtrado de fisioterapeutas** |
| --- | --- |
| **Código HU** | HP-001 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder buscar fisioterapeutas utilizando filtros avanzados, tales como especialidad vinculándola a la patología del paciente, código postal, valoraciones y precio. |
| **Prioridad** | Importante |

| **RFP-002** | **Sistema equitativo de visibilidad en la búsqueda de fisioterapeutas** |
| --- | --- |
| **Código HU** | HP-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema deberá garantizar que todos los fisioterapeutas tengan una distribución equitativa en las búsquedas de pacientes dentro de su nivel de relevancia, evitando favoritismos injustificados. No obstante, los fisioterapeutas con suscripción "Gold" recibirán prioridad y se mostrarán en los primeros resultados dentro de su grupo de relevancia. Para fisioterapeutas con el mismo nivel de relevancia, el orden de aparición se determinará de forma rotativa o aleatoria en cada búsqueda. |
| **Prioridad** | Deseable |

| **RFP-003** | **Criterios de ordenamiento en la búsqueda de fisioterapeutas** |
| --- | --- |
| **Código HU** | HP-001 |
| **Versión** | V1.0 |
| **Descripción** | El orden de aparición de los fisioterapeutas en los resultados de búsqueda se determinará según la siguiente jerarquía de criterios:

1. Especialidad (los fisioterapeutas que coincidan con la especialidad buscada tendrán prioridad).
2. Suscripción Gold (los fisioterapeutas con esta suscripción aparecerán antes que los que no la tengan).
3. Valoraciones (se priorizarán los fisioterapeutas con mejor puntuación promedio).
4. Cercanía (si el paciente ha seleccionado este criterio, se priorizarán los fisioterapeutas más cercanos).

En caso de que dos o más fisioterapeutas tengan la misma prioridad según estos criterios, su orden de aparición se establecerá de forma rotativa o aleatoria en cada búsqueda para garantizar equidad. |
| **Prioridad** | Deseable |

| **RFP-004** | **Registro y validación de usuarios en Fisio Find** |
| --- | --- |
| **Código HU** | HP-002 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma deberá permitir el registro de nuevos usuarios mediante un formulario accesible o autenticación social. Al completar el registro, el sistema deberá validar la información ingresada de la siguiente manera:
- Correo electrónico: Verificación de formato válido y comprobación de si la cuenta ya está en uso.
- Contraseña: Como mínimo la contraseña deberá cumplir con tener al menos 8 caracteres e incluir una mayúscula, una minúscula, un número y un carácter especial. Se implementará un bloqueo temporal tras 5 intentos fallidos para prevenir ataques de fuerza bruta.
- Autenticación social: Validación de credenciales a través de los proveedores de autenticación habilitados.
Si algún dato no cumple con los criterios establecidos, el sistema deberá mostrar un mensaje de error claro y orientar al usuario para corregirlo. |
| **Prioridad** | Crítica |

| **RFP-005** | **Manejo de errores en la validación** |
| --- | --- |
| **Código HU** | HP-002 |
| **Versión** | V1.0 |
| **Descripción** | Si la verificación del usuario no es exitosa, el sistema debe mostrar un mensaje de error claro con los pasos a seguir. |
| **Prioridad** | Crítica |

| **RFP-006** | **Selección de fisioterapeuta** |
| --- | --- |
| **Código HU** | HP-003 |
| **Versión** | V1.0 |
| **Descripción** | El usuario registrado debe poder seleccionar un fisioterapeuta de la lista de resultados de búsqueda o desde su perfil, visualizando información relevante como nombre, especialidad, valoraciones y precio. |
| **Prioridad** | Crítica |

| **RFP-007** | **Calendario para la reserva** |
| --- | --- |
| **Código HU** | HP-003 |
| **Versión** | V1.0 |
| **Descripción** | El usuario debe poder seleccionar la fecha y hora de su cita mediante un calendario interactivo que muestre disponibilidad en tiempo real. |
| **Prioridad** | Crítica |

| **RFP-008** | **Confirmación de disponibilidad** |
| --- | --- |
| **Código HU** | HP-003 |
| **Versión** | V1.0 |
| **Descripción** | Una vez seleccionada la fecha y hora, el sistema debe mostrar un mensaje de confirmación con los detalles de la cita antes de finalizar la reserva. |
| **Prioridad** | Importante |

| **RFP-009** | **Notificaciones de cita** |
| --- | --- |
| **Código HU** | HP-003 |
| **Versión** | V1.0 |
| **Descripción** |El usuario debe recibir notificaciones de confirmación y cambios en su cita por correo electrónico o dentro de la aplicación. |
| **Prioridad** | Deseable |

| **RFP-010** | **Gestión de citas** |
| --- | --- |
| **Código HU** | HP-003 |
| **Versión** | V1.0 |
| **Descripción** |El usuario debe poder cancelar su cita desde su perfil, siempre en una ventana superior a las 48 horas antes de la cita. |
| **Prioridad** | Crítica |

| **RFP-011** | **Disponibilidad del pago en la plataforma** |
| --- | --- |
| **Código HU** | HP-004 |
| **Versión** | V1.0 |
| **Descripción** | *El pago debe registrarse al momento de la reserva y se cobrará automáticamente 48 horas antes de la consulta.* |
| **Prioridad** | Importante |

| **RFP-012** | **Métodos de pago admitidos** |
| --- | --- |
| **Código HU** | HP-004 |
| **Versión** | V1.0 |
| **Descripción** |El sistema debe permitir el pago con tarjetas bancarias (Visa, MasterCard, etc.) y, opcionalmente, incluir otros métodos como PayPal o billeteras digitales. |
| **Prioridad** | Deseable |

| **RFP-013** | **Seguridad en el pago** |
| --- | --- |
| **Código HU** | HP-004 |
| **Versión** | V1.0 |
| **Descripción** | Se implementará una pasarela de pago segura con cifrado de datos, cumpliendo normativas de seguridad como PCI DSS. Se podrá requerir autenticación en dos pasos según la entidad bancaria. |
| **Prioridad** | Importante |

| **RFP-014** | **Confirmación y registro del pago** |
| --- | --- |
| **Código HU** | HP-004 |
| **Versión** | V1.0 |
| **Descripción** | Tras realizar el pago, se generará una confirmación visible en la plataforma y se enviará un recibo al correo del usuario. |
| **Prioridad** | Crítica |

| **RFP-015** | **Visualizacióon y calendario de citas** |
| --- | --- |
| **Código HU** | HP-005 |
| **Versión** | V1.0 |
| **Descripción** |El usuario podrá consultar un listado de sus citas futuras en un apartado específico de su perfil. Además se deberá incluir un calendario interactivo donde se reflejen las citas programadas del paciente. |
| **Prioridad** | Crítica |

| **RFP-016** | **Detalles de la cita** |
| --- | --- |
| **Código HU** | HP-005 |
| **Versión** | V1.0 |
| **Descripción** | Cada cita debe mostrar información relevante como fecha, hora, fisioterapeuta, ubicación y estado de la reserva. Si la cita es online, se deberá incluir el enlace para acceder a la videollamada. |
| **Prioridad** | Crítica |

| **RFP-017** | **Acceso y visualización del perfil** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al paciente acceder a su perfil desde la barra de navegación o la sección de usuario y visualizar su información personal. |
| **Prioridad** | Crítica |

| **RFP-018** | **Edición de datos personales** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al paciente modificar su información personal, incluyendo nombre, correo electrónico y número de teléfono. |
| **Prioridad** | Importante |

| **RFP-019** | **Cambio de contraseña** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | El usuario debe poder actualizar su contraseña de acceso de manera segura desde su perfil. |
| **Prioridad** | Importante |

| **RFP-020** | **Gestión de información médica relevante** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder añadir o modificar información médica relevante, como antecedentes de enfermedades, condiciones preexistentes o historial de tratamientos. |
| **Prioridad** | Deseable |

| **RFP-021** | **Validación y confirmación de los datos** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe validar que los datos ingresados por el paciente sean correctos y completos, notificando al usuario cuando los cambios sean guardados correctamente. |
| **Prioridad** | Crítica |

| **RFP-022** | **Eliminación de la cuenta** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | El usuario debe poder eliminar su cuenta desde el perfil, con un proceso de confirmación para evitar eliminaciones accidentales. |
| **Prioridad** | Importante |

| **RFP-023** | **Historial de citas** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | El perfil del usuario debe mostrar un historial de citas pasadas y futuras, incluyendo detalles como fisioterapeutas consultados, fechas, horas y estado de las citas. |
| **Prioridad** | Importante |

| **RFP-024** | **Restricciones y mensajes de error** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** | Si el usuario intenta ingresar información incorrecta o incompleta, el sistema debe mostrar mensajes de error claros y específicos.|
| **Prioridad** | Crítica |

| **RFP-025** | **Seguridad y privacidad de los datos** |
| --- | --- |
| **Código HU** | HP-006 |
| **Versión** | V1.0 |
| **Descripción** |Los datos del perfil deben estar protegidos de acuerdo con las normativas de privacidad (como GDPR), asegurando que la información médica sea tratada con el máximo nivel de seguridad.|
| **Prioridad** | Importante |

| **RFP-026** | **Condiciones de reembolso por cancelación tardía** |
| --- | --- |
| **Código HU** | HP-007 |
| **Versión** | V1.0 |
| **Descripción** | Si un fisioterapeuta cancela una consulta después del límite de 48 horas antes de la cita, el paciente recibirá un reembolso completo del importe abonado.|
| **Prioridad** | Importante |

| **RFP-027** | **Proceso del reembolso** |
| --- | --- |
| **Código HU** | HP-007 |
| **Versión** | V1.0 |
| **Descripción** |El sistema debe gestionar automáticamente el reembolso sin necesidad de que el paciente lo solicite a la misma cuenta o método de pago empleado en la transacción original, deberá reflejarse en la cuenta del paciente en un plazo máximo de 5 a 7 días.|
| **Prioridad** | Crítica |

| **RFP-028** | **Notificación del reembolso** |
| --- | --- |
| **Código HU** | HP-007 |
| **Versión** | V1.0 |
| **Descripción** |El usuario debe recibir una notificación por correo electrónico y/o en la aplicación cuando se haya procesado el reembolso.|
| **Prioridad** | Importante |

| **RFP-029** | **Estado del reembolso en la plataforma** |
| --- | --- |
| **Código HU** | HP-007 |
| **Versión** | V1.0 |
| **Descripción** |La plataforma debe mostrar un mensaje con el estado del reembolso en el perfil del paciente.|
| **Prioridad** | Deseable |

| **RFP-030** | **Historial de pagos y reembolsos en la plataforma** |
| --- | --- |
| **Código HU** | HP-007 |
| **Versión** | V1.0 |
| **Descripción** |El usuario podrá consultar el estado de su reembolso en el historial de pagos dentro de su perfil.|
| **Prioridad** | Importante |

| **RFP-031** | **Soporte técnico** |
| --- | --- |
| **Código HU** | HP-007 |
| **Versión** | V1.0 |
| **Descripción** |Si el paciente tiene problemas con su reembolso, podrá contactar con el soporte técnico de la plataforma.|
| **Prioridad** | Deseable |

### 3.1.1 Rol en el sistema: Fisioterapeuta

| **RFF-001** | **Registro de datos personales y profesionales**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta ingresar su nombre, apellidos, correo electrónico y contraseña en el formulario de registro. |
| **Prioridad** | Crítica |

| **RFF-002** | **Registro de datos profesionales**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta ingresar su número de colegiado y el nombre del colegio profesional al que pertenece. |
| **Prioridad** | Crítica |

| **RFF-003** | **Verificación automática de colegiación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe verificar automáticamente la validez del número de colegiado y la pertenencia a un colegio profesional registrado en la base de datos oficial. Para ello, se deberán actualizar periódicamente los registros de colegiados de la BBDD para poder realizar la consulta, así como comprobar que los ya registrados en la plataforma siguen estando colegiados. |
| **Prioridad** | Crítica |

| **RFF-004** | **Validación manual de colegiación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Si la verificación automática falla, el sistema debe permitir al fisioterapeuta subir documentación adicional para validar su perfil. |
| **Prioridad** | Deseable |

| **RFF-005** | **Manejo de errores en la validación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Si la verificación del número de colegiado no es exitosa, el sistema debe mostrar un mensaje de error claro con los pasos a seguir. |
| **Prioridad** | Crítica |

| **RFF-006** | **Selección de plan de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Una vez validada la colegiación, el sistema debe permitir al fisioterapeuta seleccionar uno de los dos planes de suscripción disponibles: Fisio Blue o Fisio Gold. |
| **Prioridad** | Crítica |

| **RFF-007** | **Protección de información bancaria para domicialición del pago**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | La información bancaria proporcionada por el fisioterapeuta para la domiciliación del cobro del tipo de suscripción mensual seleccionado solo será visible para el sistema. |
| **Prioridad** | Importante |

| **RFF-008** | **Descripción de los planes de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe proporcionar una descripción clara de las características y beneficios de cada plan antes de que el fisioterapeuta tome una decisión. |
| **Prioridad** | Crítica |

| **RFF-009** | **Cambio de plan de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder cambiar de plan en el futuro después del registro inicial. |
| **Prioridad** | Importante |

| **RFF-010** | **Cancelación del plan de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder darse de baja de la plataforma en el momento que desee y no se realizará ningún cobro adicional a partir de su última mensualidad. |
| **Prioridad** | Importante |

| **RFF-011** | **Prueba gratuita de la plataforma**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Si se considera necesario, el sistema debe ofrecer una opción de prueba con acceso limitado antes de seleccionar un plan definitivo. |
| **Prioridad** | Baja |

| **RFF-012** | **Notificación de prueba gratuita**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Durante la prueba gratuita, el fisioterapeuta debe recibir notificaciones recordándole que su acceso es limitado y que debe elegir un plan definitivo. |
| **Prioridad** | Baja |

| **RFF-013** | **Confirmación de registro**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Una vez finalizado el registro, el fisioterapeuta debe recibir un correo de confirmación con un enlace de activación para validar su cuenta. |
| **Prioridad** | Importante |

| **RFF-014** | **Seguridad de la cuenta**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe garantizar la seguridad de los datos del fisioterapeuta mediante cifrado y almacenamiento seguro de la contraseña. |
| **Prioridad** | Crítica |

| **RFF-015** | **Recuperación de contraseña**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder recuperar su contraseña a través de un proceso de validación de correo electrónico. |
| **Prioridad** | Deseable |

| **RFF-016** | **Accesibilidad y compatibilidad**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El formulario de registro debe ser accesible desde dispositivos móviles y de escritorio. |
| **Prioridad** | Importante |

| **RFF-017** | **Notificación en la aplicación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Una vez registrado correctamente, el fisioterapeuta debe recibir una notificación dentro de la aplicación informándole que su perfil está listo para ser validado. |
| **Prioridad** | Importante |

| **RFF-018** | **Edición de perfil**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá modificar su foto de perfil, especialidad, descripción, y otros datos desde su panel de configuración. |
| **Prioridad** | Crítica |

| **RFF-019** | **Validación de campos obligatorios**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe validar que los campos obligatorios como la información del título y el código postal sean ingresados correctamente. |
| **Prioridad** | Crítica |

| **RFF-020** | **Configuración de precios y servicios**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá establecer y modificar los precios de consulta, incluyendo la opción de ofrecer la primera consulta gratis, así como definir distintos tipos de servicios y bonos. |
| **Prioridad** | Importante |

| **RFF-021** | **Gestión de disponibilidad horaria**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá modificar su disponibilidad horaria y tendrá la opción de desactivar temporalmente su disponibilidad sin eliminar los datos. |
| **Prioridad** | Crítica |

| **RFF-022** | **Protección de información bancaria**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | La información bancaria solo será visible para el sistema y se utilizará exclusivamente para recibir pagos de consultas. |
| **Prioridad** | Crítica |

| **RFF-023** | **Seguridad de datos sensibles**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se aplicarán medidas de seguridad para proteger la información personal y bancaria del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RFF-024** | **Vista previa del perfil**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá una vista previa del perfil antes de publicar los cambios para verificar cómo lo ven los pacientes. |
| **Prioridad** | Deseable |

| **RFF-025** | **Actualización en tiempo real**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes verán el perfil actualizado en tiempo real tras la edición del fisioterapeuta. |
| **Prioridad** | Importante |

| **RFF-026** | **Archivos personalizados**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El sistema deberá permitir a los fisioterapeutas crear y modificar cuestionarios, tests y herramientas de las proporcionadas por la plataforma. |
| **Prioridad** | Crítica |

| **RFF-027** | **Compartir archivos**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá a los fisioterapeutas subir archivos en su perfil en formatos compatibles y que sean visibles para aquellos pacientes a los que se permita el acceso de forma explícita. |
| **Prioridad** | Crítica |

| **RFF-028** | **Validación de archivos**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe validar el tipo y tamaño de los archivos permitidos para garantizar compatibilidad y seguridad. |
| **Prioridad** | Importante |

| **RFF-029** | **Notificación de cambios guardados**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta recibirá una confirmación cuando los cambios en su perfil se hayan guardado correctamente. |
| **Prioridad** | Crítica |

| **RFF-030** | **Alerta de información faltante o incorrecta**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se enviará una alerta en caso de que haya información faltante o incorrecta en el perfil del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RFF-031** | **Visualización del calendario**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá ver su agenda en una vista semanal y mensual, con diferenciación entre citas confirmadas y pendientes. |
| **Prioridad** | Crítica |

| **RFF-032** | **Actualización en tiempo real**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | El calendario se actualizará en tiempo real con los cambios realizados en la agenda del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RFF-033** | **Gestión de disponibilidad**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá modificar la disponibilidad horaria directamente desde el calendario y establecer pausas o días bloqueados. |
| **Prioridad** | Crítica |

| **RFF-034** | **Notificación a pacientes afectados**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Se notificará a los pacientes afectados en caso de cambios en la disponibilidad del fisioterapeuta, ya sea porque el fisioterapeuta modifica su disponibilidad o se da de baja de la plataforma. |
| **Prioridad** | Crítica |

| **RFF-035** | **Interacción con citas**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá ver los detalles de cada cita y tendrá la opción de reprogramarlas o cancelarlas bajo ciertas condiciones. |
| **Prioridad** | Importante |

| **RFF-036** | **Usabilidad y experiencia del usuario**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | La interfaz del calendario deberá ser intuitiva y contar con filtros para visualizar diferentes tipos de citas y disponibilidad. |
| **Prioridad** | Crítica |

| **RFF-037** | **Seguridad y control de acceso**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Solo el fisioterapeuta tendrá acceso para modificar su disponibilidad y se registrarán los cambios realizados en la agenda. |
| **Prioridad** | Crítica |

| **RFF-038** | **Confirmación de cambios en la agenda**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Los cambios en la agenda deberán confirmarse antes de aplicarse para evitar modificaciones accidentales. |
| **Prioridad** | Crítica |

| **RFF-039** | **Notificaciones y recordatorios**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Se enviarán recordatorios automáticos al fisioterapeuta sobre citas próximas y cambios en la agenda. |
| **Prioridad** | Deseable |

| **RFF-040** | **Consulta del estado de la cita**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá consultar el estado actual de una cita (reservada, confirmada, rechazada o terminada) desde su panel de control, con información relevante como fecha, hora, paciente y motivo de la cita. |
| **Prioridad** | Importante |

| **RFF-041** | **Confirmación de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá visualizar y gestionar citas reservadas desde la plataforma. Puede rechazarlas si es necesario, en cuyo caso el estado cambiará a 'rechazada'. Si no se rechaza, la cita se confirmará automáticamente 48 horas antes del pago. |
| **Prioridad** | Crítica |

| **RFF-042** | **Rechazo de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá rechazar una cita, con opción de añadir un motivo. El paciente recibirá una notificación automática con la información y el estado de la cita cambiará a "rechazada". |
| **Prioridad** | Importante |

| **RFF-043** | **Modificación de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá solicitar una modificación de la fecha y hora de una cita reservada, proponiendo múltiples alternativas. El paciente podrá aceptar o rechazar la nueva propuesta. Si acepta, la cita se actualizará manteniendo su estado. Si la rechaza, deberá re-agendar. |
| **Prioridad** | Importante |

| **RFF-044** | **Notificación de citas pendientes**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | Se enviarán notificaciones al fisioterapeuta sobre citas pendientes de rechazar o modificar dentro de un plazo determinado. La notificación incluirá detalles relevantes para agilizar la gestión. |
| **Prioridad** | Importante |

| **RFF-045** | **Consulta historial de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá consultar el estado actual de una cita (reservada, confirmada, rechazada o terminada) desde su panel de control, con información relevante como fecha, hora, paciente y motivo de la cita. Una cita reservada se confirma automáticamente 48 horas antes de la consulta si no ha sido rechazada. |
| **Prioridad** | Baja |

| **RFF-046** | **Confirmación de cambios**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** |Tras rechazar, modificar o confirmar automáticamente una cita, el fisioterapeuta recibirá una notificación confirmando que la acción ha sido registrada correctamente en el sistema.|
| **Prioridad** | Crítica |

| **RFF-047** | **Accesibilidad y usabilidad**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | La funcionalidad de gestión de citas debe ser fácilmente accesible en la interfaz, optimizada para dispositivos móviles y de escritorio. |
| **Prioridad** | Crítica |

| **RFF-048** | **Seguridad en la gestión de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará la protección de las notificaciones y cambios en las citas, asegurando que solo los usuarios autorizados puedan acceder a la información correspondiente. |
| **Prioridad** | Crítica |

| **RFF-049** | **Sistema de valoración**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes podrán valorar la consulta realizada con un sistema de estrellas (1 a 5) y dejar comentarios adicionales en el perfil del fisioterapeuta. |
| **Prioridad** | Importante |

| **RFF-050** | **Publicación y moderación**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Solo los pacientes con una consulta confirmada podrán dejar valoraciones. Los fisioterapeutas no podrán eliminarlas, pero podrán responder a los comentarios. |
| **Prioridad** | Importante |

| **RFF-051** | **Visualización de valoraciones**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Las valoraciones estarán organizadas cronológicamente en el perfil del fisioterapeuta, mostrando el promedio de estrellas y permitiendo filtrarlas por puntuación. |
| **Prioridad** | Importante |

| **RFF-052** | **Notificaciones y alertas**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta recibirá una notificación cuando un paciente deje una valoración. Se enviará una solicitud de valoración automática al paciente después de la consulta. |
| **Prioridad** | Deseable |

| **RFF-053** | **Protección contra abuso**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Un paciente solo podrá valorar una consulta realizada. Se permitirá reportar comentarios ofensivos o falsos para su revisión. |
| **Prioridad** | Baja |

| **RFF-054** | **Acceso a biblioteca de cuestionarios y tests**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá acceder a una biblioteca de cuestionarios y tests prediseñados para su uso. |
| **Prioridad** | Crítica |

| **RFF-055** | **Modificación de cuestionarios existentes**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá modificar textos, preguntas y herramientas de valoración de los cuestionarios prediseñados. |
| **Prioridad** | Crítica |

| **RFF-056** | **Creación de cuestionarios personalizados**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá crear nuevos cuestionarios desde cero y guardarlos como plantillas reutilizables. Por supuesto, estas no podrán ser visualizadas ni modificadas por los pacientes. |
| **Prioridad** | Crítica |

| **RFF-057** | **Tipos de preguntas personalizables**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se podrán agregar preguntas abiertas, cerradas, de opción múltiple y escalas de valoración. |
| **Prioridad** | Crítica |

| **RFF-058** | **Configuración de preguntas**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá configurar preguntas como obligatorias u opcionales dentro de los cuestionarios. |
| **Prioridad** | Deseable |

| **RFF-059** | **Organización y almacenamiento de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas podrán organizar sus cuestionarios en categorías personalizadas y almacenarlos de manera segura. |
| **Prioridad** | Importante |

| **RFF-060** | **Compartir cuestionarios con otros fisioterapeutas**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá compartir cuestionarios entre fisioterapeutas dentro de la plataforma (si la opción está habilitada). |
| **Prioridad** | Baja |

| **RFF-061** | **Asignación de cuestionarios a consultas**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá asignar cuestionarios específicos a pacientes antes o después de una consulta. |
| **Prioridad** | Crítico |

| **RFF-062** | **Acceso a respuestas de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá acceder rápidamente a las respuestas de los pacientes desde su historial de tratamientos. |
| **Prioridad** | Crítico |

| **RFF-063** | **Notificaciones automáticas a pacientes**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se enviarán notificaciones automáticas a los pacientes para completar cuestionarios antes de la sesión. |
| **Prioridad** | Importante |

| **RFF-064** | **Configuración de visibilidad de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá configurar cuestionarios como privados o públicos según su preferencia. |
| **Prioridad** | Baja |

| **RFF-065** | **Vista previa de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se incluirá una opción para previsualizar los cuestionarios antes de enviarlos a los pacientes. |
| **Prioridad** | Deseable |

| **RFF-066** | **Interfaz intuitiva para pacientes**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes podrán completar cuestionarios fácilmente desde cualquier dispositivo. |
| **Prioridad** | Deseable |

| **RFF-067** | **Confirmación de recepción de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se enviará una confirmación al fisioterapeuta cuando un paciente haya enviado su cuestionario completado. |
| **Prioridad** | Deseable |

| **RFF-068** | **Exportación y descarga de cuestionarios y tests**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas podrán descargar los cuestionarios en formato PDF o visualizarlos en línea. |
| **Prioridad** | Deseable |

| **RFF-069** | **Obligación de completar el cuestionario preintervención**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe completar el cuestionario preintervención antes de poder confirmar su cita. No se podrá avanzar en el proceso de reserva hasta que el cuestionario esté completamente rellenado, si así lo ha determinado el fisioterapeuta. |
| **Prioridad** | Crítico |

| **RFF-070** | **Personalización según especialidad del fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir la creación y edición de cuestionarios preintervención personalizados, de acuerdo con la especialidad del fisioterapeuta. |
| **Prioridad** | Crítico |

| **RFF-071** | **Preguntas generales y específicas**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El cuestionario debe contener una versión plantilla con preguntas generales sobre el estado de salud del paciente y preguntas específicas según la especialidad del fisioterapeuta, como historial médico, lesiones previas, hábitos de vida, tipo de dolor, etc. |
| **Prioridad** | Crítico |

| **RFF-072** | **Revisión y corrección de respuestas**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder revisar y corregir sus respuestas antes de confirmar la información del cuestionario. |
| **Prioridad** | Importante |

| **RFF-073** | **Visualización de resultados por el fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a los resultados del cuestionario en su panel de control para realizar un diagnóstico preliminar antes de confirmar la cita. |
| **Prioridad** | Crítico |

| **RFF-074** | **Cumplimiento con regulaciones de privacidad de datos**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | Toda la información contenida en el cuestionario debe ser tratada con seguridad, cumpliendo con regulaciones de privacidad de datos como el RGPD. |
| **Prioridad** | Crítico |

| **RFF-075** | **Accesibilidad desde dispositivos móviles y de escritorio**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El cuestionario debe ser accesible tanto desde dispositivos móviles como de escritorio, adaptándose a diferentes tamaños de pantalla. |
| **Prioridad** | Deseable |

| **RFF-076** | **Validación de respuestas del cuestionario**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe validar que todos los campos obligatorios estén completos y que no haya respuestas incorrectas o fuera de lugar antes de permitir que el paciente envíe el cuestionario. |
| **Prioridad** | Deseable |

| **RFF-077** | **Registro de método de pago**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Los pacientes deberán registrar un método de pago al momento de agendar una consulta para garantizar el cobro automático. |
| **Prioridad** | Crítica |

| **RFF-078** | **Cobro automático 48 horas antes de la consulta**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | El sistema realizará automáticamente el cobro 48 horas antes de la consulta, utilizando el método de pago registrado por el paciente.|
| **Prioridad** | Crítica |

| **RFF-079** | **Restricción de reservas con menos de 72 horas de antelación**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Los pacientes solo podrán reservar citas si la fecha de la consulta está a más de 72 horas de la solicitud. |
| **Prioridad** | Crítica |

| **RFF-080** | **Política de cancelación sin cargo**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Entre las 72 y 48 horas previas a la consulta, el paciente podrá cancelar la cita sin cargo y sin que se realice el cobro. |
| **Prioridad** | Crítica |

| **RFF-081** | **Cobro irrevocable dentro de las 48 horas previas**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Pasadas las 48 horas previas a la consulta, el sistema realizará el cobro automático sin posibilidad de reembolso, salvo que el fisioterapeuta cancele la cita. |
| **Prioridad** | Crítica |

| **RFF-082** | **Reembolso por cancelación del fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Si el fisioterapeuta cancela la cita dentro de las 48 horas previas, el sistema gestionará automáticamente un reembolso completo al paciente. |
| **Prioridad** | Crítica |

| **RFF-083** | **Integración con la agenda del fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Al programar una cita, esta se reflejará en la agenda del fisioterapeuta como "pendiente de cobro". Una vez realizado el cobro automático, la cita pasará a estado "confirmada". |
| **Prioridad** | Crítica |

| **RFF-084** | **Notificación de reserva al paciente**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Al reservar una cita, el paciente recibirá una notificación que incluirá la política de cobro y cancelación. |
| **Prioridad** | Importante |

| **RFF-085** | **Notificación de cobro inminente**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | 48 horas antes de la consulta, el paciente recibirá una notificación recordándole que el cobro automático se realizará en breve. |
| **Prioridad** | Importante |

| **RFF-086** | **Notificación de cancelación y reembolso**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Si el fisioterapeuta cancela la consulta dentro de las 48 horas previas, el paciente recibirá una notificación indicando la cancelación y el reembolso automático. |
| **Prioridad** | Importante |

| **RFF-087** | **Seguridad del proceso de pago**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Todos los pagos deben realizarse de manera segura, cumpliendo con normativas como PCI-DSS. La plataforma debe garantizar que el cobro automático se realice sin errores antes de confirmar la cita. |
| **Prioridad** | Crítica |

| **RFF-088** | **Acceso al historial de pagos**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | Tanto el paciente como el fisioterapeuta podrán acceder al historial de pagos de consultas anteriores para verificar transacciones y estados de pago. |
| **Prioridad** | Importante |

| **RFF-089** | **Verificación del estado de pago**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.1 |
| **Descripción** | El fisioterapeuta podrá consultar en su perfil el estado de pago de cada consulta programada. |
| **Prioridad** | Importante |

| **RFF-0910** | **Generación automática de facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema generará automáticamente una factura por cada consulta realizada. La factura incluirá detalles como: nombre del paciente, especialidad del fisioterapeuta, motivo de la consulta, fecha de la cita, importe, impuestos aplicables y forma de pago. |
| **Prioridad** | Deseable |

| **RFF-091** | **Almacenamiento seguro de facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | Las facturas generadas se almacenarán de manera segura en la base de datos del sistema, accesibles solo por el fisioterapeuta correspondiente. |
| **Prioridad** | Deseable |

| **RFF-092** | **Consulta de facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá consultar y ver todas las facturas generadas, ordenadas por fecha de emisión. |
| **Prioridad** | Deseable |

| **RFF-093** | **Descarga de facturas en formato PDF**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá al fisioterapeuta descargar las facturas generadas en formato PDF. |
| **Prioridad** | Deseable |

| **RFF-094** | **Envío de facturas por correo electrónico**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema enviará una copia de la factura al correo electrónico del fisioterapeuta una vez que se haya generado. |
| **Prioridad** | Deseable |

| **RFF-095** | **Notificación de facturación**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema notificará al fisioterapeuta cuando una factura haya sido generada y esté disponible para su consulta y descarga. |
| **Prioridad** | Deseable |

| **RFF-096** | **Seguridad y privacidad de las facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará que las facturas sean accesibles solo para el fisioterapeuta correspondiente. Además, la información de las facturas estará protegida mediante medidas de seguridad adecuadas, como el cifrado de datos y el acceso autenticado. |
| **Prioridad** | Deseable |

| **RFF-097** | **Iniciar videollamada desde la agenda de citas**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder iniciar la videollamada directamente desde su agenda de citas, mediante un botón o enlace visible en la cita programada. El sistema debe proporcionar una interfaz sencilla para acceder a la videollamada. |
| **Prioridad** | Crítica |

| **RFF-098** | **Temporizador visible durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe mostrar un temporizador visible que indique el tiempo restante de la consulta. Este temporizador debe iniciar automáticamente cuando la videollamada comience y detenerse al finalizar. |
| **Prioridad** | Deseable |

| **RFF-099** | **Restricciones de tiempo para finalizar la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | *El sistema no permitirá al fisioterapeuta finalizar la videollamada hasta que haya transcurrido al menos el 75% del tiempo asignado a la consulta. El fisioterapeuta debe ser notificado cuando el 75% del tiempo haya pasado (esot está pensado porque como el paciente abona el precio de la consulta previo a la misma, para que no reciba un servicio menor de por lo que ha pagado).* |
| **Prioridad** | Deseable |

| **RFF-100** | **Calidad de la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | La videollamada debe tener alta calidad con opciones para ajustar micrófono, video y compartir pantalla si es necesario. El sistema debe garantizar que no haya interrupciones significativas en la calidad de la videollamada (latencia, cortes, etc.). |
| **Prioridad** | Baja |

| **RFF-101** | **Notificación de finalización de la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | Al finalizar la videollamada, el sistema notificará al fisioterapeuta y al paciente que la consulta ha terminado. Además, se guardará un registro de la videollamada en el historial de citas del paciente y fisioterapeuta. |
| **Prioridad** | Deseable |

| **RFF-102** | **Compatibilidad y accesibilidad**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | La videollamada debe ser compatible con dispositivos móviles y de escritorio. Debe ser accesible desde cualquier navegador común sin necesidad de instalar software adicional. |
| **Prioridad** | Importante |

| **RFF-103** | **Seguridad de la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | La videollamada debe estar protegida con cifrado de extremo a extremo para garantizar la privacidad de la consulta. Solo el fisioterapeuta y el paciente deben tener acceso a la videollamada. |
| **Prioridad** | Crítica |

| **RFF-104** | **Resolución de problemas comunes**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe incluir opciones para solucionar problemas comunes durante las videollamadas, como problemas de conexión o de audio/video. En caso de interrupciones, el sistema debe permitir reanudar la llamada o reprogramar la cita. |
| **Prioridad** | Baja |

| **RFF-105** | **Acceso al historial clínico del paciente durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | Durante la videollamada, el fisioterapeuta podrá acceder al historial clínico del paciente almacenado en el sistema, con la opción de modificar la información que sea necesaria. |
| **Prioridad** | Deseable |

| **RFF-106** | **Compartir pantalla durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá compartir su pantalla con el paciente durante la videollamada para mostrar contenido que tenga almacenado en su dispositivo, como diapositivas, documentos o cualquier otra información relevante, sin que la aplicación esté involucrada en el almacenamiento o gestión de dicho material. |
| **Prioridad** | Deseable |

| **RFF-107** | **Acceso al modelo anatómico 3D**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá al fisioterapeuta acceder y utilizar un modelo anatómico 3D para ilustrar al paciente sobre su patología y tratamiento durante la videollamada. |
| **Prioridad** | Importante |

| **RFF-108** | **Acceso a plantillas de test y cuestionarios**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá acceder a plantillas de tests y cuestionarios predefinidos que se podrán personalizar y utilizar durante la videollamada. |
| **Prioridad** | Importante |

| **RFF-109** | **Personalización de cuestionarios y tests**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá crear y personalizar cuestionarios, tests y pautas de ejercicio (como Google Forms), los cuales podrán incluir elementos como mapas de dolor, escalas de evaluación, entre otros. |
| **Prioridad** | Crítica |

| **RFF-110** | **Almacenamiento de información recogida durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | Toda la información recogida mediante cuestionarios, tests, o notas del fisioterapeuta durante la videollamada debe ser almacenada en el sistema para su posterior consulta y análisis. |
| **Prioridad** | Importante |

| **RFF-111** | **Subida y gestión de archivos de vídeo**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá subir archivos de vídeo a su espacio personal en la plataforma, y el sistema debe permitir la modificación de los vídeos ya subidos con opciones para editar (*esto solo hace referencia a los metadatos del vídeo, no ofreceremos un medio para poder editar el contenido del vídeo en sí*), borrar o reemplazar los archivos existentes. |
| **Prioridad** | Crítica |

| **RFF-112** | **Acceso a los vídeos por parte de los pacientes**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá configurar permisos para que solo los pacientes correspondientes puedan acceder a los vídeos. Los pacientes con acceso podrán visualizar los vídeos desde su perfil en la plataforma. |
| **Prioridad** | Crítico |

| **RFF-113** | **Vinculación de vídeos explicativos a ejercicios**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá asociar vídeos explicativos a ejercicios específicos dentro de una planificación de ejercicios. Los pacientes podrán acceder directamente al vídeo desde el ejercicio asignado. |
| **Prioridad** | Deseable |

| **RFF-114** | **Acceso desde cualquier dispositivo**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes podrán acceder a los vídeos subidos desde cualquier dispositivo (móvil o escritorio) de forma sencilla y sin problemas de compatibilidad. |
| **Prioridad** | Deseable |

| **RFF-115** | **Seguridad y privacidad de los vídeos**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | Los vídeos deben estar protegidos por medidas de seguridad adecuadas, como permisos de acceso y cifrado, para garantizar que solo los pacientes autorizados puedan visualizarlos. |
| **Prioridad** | Crítico |

| **RFF-116** | **Control de acceso de los vídeos**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará que solo el fisioterapeuta que subió el vídeo y los pacientes autorizados tengan acceso a los archivos de vídeo. |
| **Prioridad** | Crítico |

| **RFF-117** | **Calidad y optimización de los vídeos**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará que los vídeos subidos mantengan una calidad adecuada para su visualización en diferentes dispositivos. Además, los archivos de vídeo deben optimizarse para evitar tiempos de carga excesivos o problemas de reproducción. |
| **Prioridad** | Baja |

| **RFF-118** | **Acceso y gestión de plantillas predefinidas**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder acceder a plantillas predefinidas para test de valoración, cuestionarios y prescripción de ejercicios dentro de la plataforma. Las plantillas deben ser fácilmente editables para permitir personalización según las necesidades del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RFF-119** | **Creación de test y cuestionarios personalizados**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta crear test y cuestionarios personalizados desde cero, permitiendo definir preguntas y respuestas, tipos de respuestas (por ejemplo, opción múltiple, texto libre, escala de valoración) y establecer criterios de evaluación. |
| **Prioridad** | Crítica |

| **RFF-120** | **Generación de prescripción de ejercicios**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta generar plantillas de prescripción de ejercicios con campos como: nombre del paciente, diagnóstico, frecuencia de los ejercicios, tiempo estimado de la sesión, hora recomendada para realizar los ejercicios (opcional), detalles del ejercicio (nombre, objetivo, descripción, material necesario, series, repeticiones, carga, método de evaluación). El fisioterapeuta debe poder incluir enlaces a vídeos subidos por él para ilustrar los ejercicios. |
| **Prioridad** | Crítica |

| **RFF-121** | **Cuestionarios interactivos para pacientes**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder completar los cuestionarios directamente en la plataforma. Los resultados de los cuestionarios deben ser enviados automáticamente al fisioterapeuta para su revisión. Idealmente, estos podrían ser visualizados como *dashborads* |
| **Prioridad** | Crítica |

| **RFF-122** | **Almacenamiento en el espacio personal del fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | Todos los test, cuestionarios y prescripciones de ejercicios deben almacenarse en el espacio personal del fisioterapeuta dentro de la plataforma. El fisioterapeuta debe poder consultar y acceder a los cuestionarios y ejercicios en cualquier momento. |
| **Prioridad** | Crítica |

| **RFF-123** | **Notificaciones y recordatorios para pacientes**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir que se envíen notificaciones y recordatorios automáticos al paciente sobre la hora recomendada para realizar los ejercicios. El paciente debe tener la opción de ajustar las notificaciones de recordatorio en su sección de tratamiento/seguimiento. |
| **Prioridad** | Importante |

| **RFF-124** | **Seguridad y privacidad de datos**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe garantizar que toda la información personal y los resultados de los cuestionarios estén protegidos por medidas de seguridad adecuadas. Solo el fisioterapeuta que ha creado los test y cuestionarios debe tener acceso completo a ellos, y los pacientes deben tener acceso solo a los cuestionarios que se les han asignado. |
| **Prioridad** | Crítica |

| **RFF-125** | **Acceso a la lista de pacientes activos**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a una lista de todos los pacientes que están bajo su seguimiento activo. La lista debe estar ordenada por fecha de inicio del tratamiento o por cualquier otra métrica relevante para el fisioterapeuta (por ejemplo, nombre del paciente). |
| **Prioridad** | Crítica |

| **RFF-126** | **Visibilidad del progreso de cada paciente**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder ver un resumen de cada paciente, que incluya detalles clave sobre el tratamiento, como el tipo de tratamiento asignado, las fechas de consulta y el progreso general. Los datos de progreso deben incluir informes de ejercicios realizados, evolución del dolor o movilidad, y otros indicadores de tratamiento relevantes (*estos vendrán determinados por los ejercicios pautados*). |
| **Prioridad** | Crítica |

| **RFF-127** | **Acceso a informes de progreso**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder generar y consultar informes detallados del progreso de cada paciente, basados en las evaluaciones previas y en el seguimiento realizado. Los informes deben ser accesibles desde el perfil de cada paciente, y deben incluir gráficos o tablas de evolución. |
| **Prioridad** | Importante |

| **RFF-128** | **Registro de interacciones**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe registrar y mostrar las interacciones pasadas entre el fisioterapeuta y el paciente, incluyendo consultas, notas de evaluación, ajustes en el tratamiento y cualquier comunicación relevante. El fisioterapeuta debe poder agregar notas adicionales sobre cada paciente. |
| **Prioridad** | Deseable |

| **RFF-129** | **Acciones en función del progreso**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | Si un paciente no está siguiendo el tratamiento correctamente, el fisioterapeuta debe poder tomar acciones como enviar recordatorios, modificar el tratamiento o contactar al paciente para discutir el progreso. El sistema debe permitir configurar alertas o notificaciones para los fisioterapeutas si un paciente muestra signos de no seguir el tratamiento. |
| **Prioridad** | Deseable |

| **RFF-130** | **Visualización del cumplimiento del tratamiento**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a un registro claro de cuántos ejercicios han sido completados por el paciente y qué porcentaje del tratamiento se ha seguido correctamente. Esta visualización debe estar disponible en tiempo real para que el fisioterapeuta pueda ajustar el tratamiento según sea necesario. |
| **Prioridad** | Deseable |

| **RFF-131** | **Historial completo de tratamiento**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder ver el historial completo de tratamiento de cada paciente, con detalles sobre todas las citas anteriores, diagnósticos, tratamientos realizados, y resultados obtenidos. |
| **Prioridad** | Importante |

| **RFF-132** | **Comunicación con el paciente**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener una opción para comunicarse directamente con el paciente dentro de la plataforma, ya sea por mensaje o video, si es necesario para discutir el progreso o hacer ajustes en el tratamiento.|
| **Prioridad** | Deseable |

| **RFF-133** | **Filtrado y búsqueda de pacientes**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder filtrar o buscar pacientes según diferentes criterios (por ejemplo, fecha de inicio del tratamiento, tipo de tratamiento, progreso) para facilitar la gestión de su carga de trabajo.|
| **Prioridad** | Importante |

| **RFF-134** | **Notificaciones de consultas**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe enviar recordatorios automáticos a los pacientes sobre la fecha y hora de la consulta agendada, con suficiente antelación.|
| **Prioridad** | Importante |

| **RFF-135** | **Cancelación de consultas**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe tener la opción de cancelar la consulta a través de la plataforma, y el fisioterapeuta debe recibir una notificación cuando esto ocurra.|
| **Prioridad** | Crítica |

| **RFF-136** | **Configuración de recordatorios**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder configurar los recordatorios según sus preferencias, ajustando la antelación y frecuencia de los mismos.|
| **Prioridad** | Deseable |

| **RFF-137** | **Visualización de recordatorios**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder ver los recordatorios programados para cada paciente en su agenda, con la posibilidad de editar o anular los recordatorios si es necesario.|
| **Prioridad** | Deseable |

| **RFF-138** | **Frecuencia y notificación de recordatorios**  |
| --- | --- |
| **Código HU** | HF-016 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe seleccionar la frecuencia y hora específica para enviar los recordatorios, que deben llegar al paciente por aplicación o correo electrónico. |
| **Prioridad** | Deseable |

| **RFF-139** | **Confirmación de ejercicio realizado**  |
| --- | --- |
| **Código HU** | HF-016 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe marcar los ejercicios como realizados, y el fisioterapeuta debe poder ver un resumen de ejercicios completados y no completados. |
| **Prioridad** | Importante |

| **RFF-140** | **Seguimiento y modificación de recordatorios**  |
| --- | --- |
| **Código HU** | HF-016 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe marcar los ejercicios como realizados, y el fisioterapeuta debe poder ver un resumen de ejercicios completados y no completados. |
| **Prioridad** | Importante |

| **RFF-141** | **Recepción y carga de archivos**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder recibir y cargar archivos de los pacientes, principalmente imágenes de diagnóstico, directamente en el perfil del paciente. |
| **Prioridad** | Importante |

| **RFF-142** | **Tipos de archivo soportados y notificaciones**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe admitir formatos comunes como JPG, PNG, PDF, DICOM y notificar a los pacientes cuando su archivo haya sido recibido correctamente. |
| **Prioridad** | Deseable |

| **RFF-143** | **Acceso y organización de archivos**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder acceder a los archivos cargados, organizados por fecha o tipo (ej. radiografía, ecografía), desde el perfil del paciente. |
| **Prioridad** | Deseable |

| **RFF-144** | **Almacenamiento seguro y acceso restringido**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | Los archivos deben almacenarse de forma segura con cifrado y cumplimiento normativo (ej. GDPR) y ser accesibles solo para el fisioterapeuta asignado. |
| **Prioridad** | Importante |

| **RFF-145** | **Acceso al chat durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-019 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a un chat en tiempo real durante la videollamada, sin interferir con la visualización de la sesión. |
| **Prioridad** | Importante |

| **RFF-146** | **Funcionalidad de chat y envío de archivos adjuntos**  |
| --- | --- |
| **Código HU** | HF-019 |
| **Versión** | V1.0 |
| **Descripción** | El chat debe permitir enviar y recibir mensajes de texto sin retrasos, así como archivos adjuntos (documentos, imágenes, enlaces) que deben ser visibles para ambas partes. |
| **Prioridad** | Deseable |

| **RFF-147** | **Notificación de nuevos mensajes y facilidad de uso**  |
| --- | --- |
| **Código HU** | HF-019 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe recibir notificaciones visuales de nuevos mensajes y el diseño del chat debe ser fácil de usar en diferentes dispositivos. |
| **Prioridad** | Baja |

### 3.1.1 Rol en el sistema: Administrador

| **RFA-001** | **Gestión de usuarios**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe poder visualizar y administrar los perfiles de pacientes y fisioterapeutas, así como activar, suspender o eliminar cuentas. También debe gestionar las solicitudes de verificación de fisioterapeutas. |
| **Prioridad** | Crítica |

| **RFA-002** | **Gestión de citas**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe poder monitorear citas programadas, canceladas y completadas. |
| **Prioridad** | Deseable |

| **RFA-003** | **Gestión de pagos y suscripciones**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe supervisar pagos, administrar planes de suscripción (Fisio Blue y Fisio Gold), y gestionar solicitudes de reembolsos o problemas de facturación, siempre que lo permita la pasarela de pago empleada. |
| **Prioridad** | Importante |

| **RFA-004** | **Configuración general del sistema**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador deberá poder gestionar la configuración general de la plataforma a través de un panel de administración. Esto incluirá:

- Términos y condiciones: Su contenido deberá estar almacenado en la base de datos para permitir su modificación desde el panel de administración.
- Parámetros generales: Configuración de horarios, políticas y otros ajustes, que también deberán estar almacenados en la base de datos para su gestión dinámica.
- Validación de fisioterapeutas: Acceso a la base de datos de registros pendientes para aprobar o rechazar solicitudes, asegurando el control de los profesionales en la plataforma.

La implementación deberá garantizar que estos cambios se reflejen en tiempo real y se registren auditorías de modificaciones críticas. |
| **Prioridad** | Crítica |

| **RFA-005** | **Generación de reportes y análisis**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe poder generar reportes sobre la actividad de la plataforma y analizar métricas para mejorar la experiencia de los usuarios. |
| **Prioridad** | Deseable |

---

<br>

## 3.2 Requisitos No Funcionales

| **RNF-001** | **Requisito de calidad** |
| --- | --- |
| **HU** | V1.0 |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe cumplir con al menos los requisitos críticos e importantes. |
| **Prioridad** | Crítica |

| **RNF-002** | **Plataforma web y aplicación móvil** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La solución debe contar con una plataforma web accesible desde navegadores, con soporte para iOS y Android. |
| **Prioridad** | Crítica |

| **RNF-003** | **Multilenguaje** |
| --- | --- |
| **Código HU** | HF-018 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer soporte en varios idiomas, al menos en español e inglés. |
| **Prioridad** | Deseable |

| **RNF-004** | **Cumplimiento con normativa GDPR/LOPD** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe cumplir con las regulaciones de protección de datos como el GDPR en Europa o la LOPD en España. |
| **Prioridad** | Crítica |

| **RNF-005** | **Aceptación de términos y condiciones sobre responsabilidad** |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Durante el registro, el paciente debe aceptar los "Términos y Condiciones" de la plataforma, los cuales especificarán las responsabilidades del paciente, incluyendo la exoneración de responsabilidad del fisioterapeuta en caso de realizar los ejercicios de forma autónoma sin seguimiento directo, entre otros. Este paso será obligatorio para la creación de la cuenta. |
| **Prioridad** | Importante |

| **RNF-006** | **Seguridad y protección de datos** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe garantizar la seguridad de los datos de los usuarios, mediante autenticación segura y cifrado de datos.|
| **Prioridad** | Importante |

| **RNF-007** | **Usabilidad** |  
| --- | --- |
| **Código HU** | HF-018 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ser fácil de usar tanto para fisioterapeutas como para pacientes, con una interfaz intuitiva. |
| **Prioridad** | Crítica |

| **RNF-008** | **Accesibilidad para personas con discapacidad** |  
| --- | --- |
| **Código HU** | HF-018 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ser accesible para personas con discapacidad, incluyendo el cumplimiento de los estándares de accesibilidad web (WCAG) y la garantía de que la interfaz sea compatible con lectores de pantalla, teclados alternativos y otras tecnologías de asistencia. |
| **Prioridad** | Deseable |

| **RNF-009** | **Soporte técnico** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer un servicio de soporte técnico para resolver dudas y problemas que puedan surgir durante el uso de la plataforma. El soporte puede ser ofrecido a través de diferentes canales (chat, correo electrónico, teléfono) y debe estar disponible en horarios convenientes para los usuarios. |
| **Prioridad** | Importante |

| **RNF-010** | **Marca y diseño** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe tener una imagen de marca coherente y un diseño atractivo y profesional. El diseño debe reflejar los valores de la marca y ser consistente en todos los elementos de la plataforma (logo, colores, tipografía, etc.). |
| **Prioridad** | Deseable |

| **RNF-011** | **Integración con pasarelas de pago** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe integrarse con pasarelas de pago seguras y confiables para permitir a los pacientes realizar pagos online de forma segura y cómoda. Se deben ofrecer diferentes opciones de pago (tarjeta de crédito, PayPal, etc.) y garantizar que la información de pago esté protegida en todo momento. |
| **Prioridad** | Crítica |

| **RNF-012** | **Disponibilidad y rendimiento** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe estar disponible para los usuarios de forma continua, con un rendimiento óptimo que permita una navegación fluida y una respuesta rápida a las acciones del usuario. |
| **Prioridad** | Crítica |

---

<br>

## 3.3 Requisitos de Información

### RI-001: Tabla `user`
| Campo       | Tipo        | Descripción |
|------------|------------|-------------|
| id         | Integer    | Identificador único del usuario |
| username   | String     | Nombre de usuario único |
| email      | String     | Correo electrónico del usuario |
| password   | String     | Contraseña segura |
| name       | String     | Nombre del usuario |
| surname    | String     | Apellido del usuario |
| dni        | String     | Documento de identidad |
| phone_number | String  | Número de teléfono |
| postal_code | String   | Código postal |
| photo      | ImageField | Foto de perfil |

### RI-002: Tabla `physiotherapist`
| Campo         | Tipo      | Descripción |
|--------------|----------|-------------|
| id           | Integer  | Identificador único del fisioterapeuta |
| bio          | String   | Descripción breve del fisioterapeuta |
| rating_average | Float  | Puntuación promedio de los pacientes |
| billing_address | String | Dirección de facturación |
| plan        | Enum(PRICING_PLAN) | Plan de suscripción del fisioterapeuta (FISIO_BLUE o FISIO_GOLD)|
| schedule    | JSON     | Horarios de disponibilidad |
| age         | Integer  | Edad del fisioterapeuta |
| gender      | Enum(GENDER) | Género del fisioterapeuta (MASCULINO, FEMENINO O INDEFINIDO) |
| collegiate_number | Integer | Número de colegiado |
| college_name | Integer | Nombre del colegio profesional |
| services    | JSON     | Servicios ofrecidos |
| account_status | Enum(ACCOUNT_STATUS) | Estado de la cuenta (ACTIVA, SUSPENDIDA, ELIMINADA). Este campo puede ser modificado por el administrador para activar, suspender o eliminar cuentas |

### RI-003: Tabla `patient`
| Campo      | Tipo     | Descripción |
|-----------|---------|-------------|
| id        | Integer | Identificador único del paciente |
| age       | Integer | Edad del paciente |
| gender    | Enum(GENDER) | Género del paciente |
| account_status | Enum(ACCOUNT_STATUS) | Estado de la cuenta (ACTIVA, SUSPENDIDA, ELIMINADA). Este campo puede ser modificado por el administrador para activar, suspender o eliminar cuentas |

### RI-004: Tabla `appointment`
| Campo      | Tipo      | Descripción |
|-----------|----------|-------------|
| id        | Integer  | Identificador único de la cita |
| start_time | DateTime | Fecha y hora de inicio de la cita |
| end_time  | DateTime | Fecha y hora de finalización de la cita |
| status    | Enum(STATUS) | Estado de la cita (RESERVADA, CONFIRMADA, RECHAZADA O MODIFICADA) |
| isOnline  | Boolean  | Indica si la consulta es online |
| service   | JSON     | Información sobre el servicio solicitado |

### RI-005: Tabla `review`
| Campo   | Tipo     | Descripción |
|--------|---------|-------------|
| id     | Integer | Identificador único de la reseña |
| rating | Integer | Valoración dada al fisioterapeuta |
| comment | String | Comentario del paciente |

### RI-006: Tabla `invoice`
| Campo   | Tipo     | Descripción |
|--------|---------|-------------|
| id     | Integer | Identificador único de la factura |
| amount | Float   | Monto total de la factura |
| date   | DateTime | Fecha de emisión de la factura |

### RI-007: Tabla `document`
| Campo    | Tipo     | Descripción |
|---------|---------|-------------|
| id      | Integer | Identificador único del documento |
| filename | String | Nombre del archivo |
| URL     | String  | Enlace al documento almacenado |

### RI-008: Tabla `college_data`
| Campo             | Tipo     | Descripción |
|------------------|---------|-------------|
| id              | Integer | Identificador único del colegio |
| college_name    | String  | Nombre del colegio profesional |
| person_name     | String  | Nombre del responsable del colegio |
| collegiate_number | Integer | Número de colegiación |

### RI-009: Tabla `admin`
| Campo | Tipo     | Descripción |
|------|---------|-------------|
| id   | Integer | Identificador único del administrador |

### RFI-010: Tabla `terms_conditions`
| Campo         | Tipo      | Descripción |
|--------------|----------|-------------|
| id        | Integer  | Identificador único de los términos y condiciones. |
| content   | Text     | Contenido de los términos y condiciones en formato HTML o Markdown. |
| version   | String   | Número de versión de los términos y condiciones. |
| created_at | Timestamp | Fecha y hora de creación del registro. |
| updated_at | Timestamp | Fecha y hora de la última modificación. |
| modified_by | Integer  | ID del administrador que realizó la última modificación. |


