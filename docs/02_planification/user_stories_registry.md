---
title: "REGISTRO DE HISTORIAS DE USUARIO"                                     # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 1"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "13/02/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
# toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"  # CHANGE IF NEEDED
header-left: "USER STORIES"                               # CHANGE IF NEEDED
header-right: "13/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIOFIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<p align="center" style="font-size: 30px; font-weight: bold;">
  FISIOFIND  -  REGISTRO DE HISTORIAS DE USUARIO
</p>
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>


**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 1

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Guadalupe Ridruejo Pineda](https://github.com/guaridpin) (autor), [Delfín Santana Rubio](https://github.com/DelfinSR) (revisor), [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (autor), [Daniel Fernández Caballero](https://github.com/DaniFdezCab) (autor), [Daniel Alors Romero](https://github.com/DanielAlors) (autor), [Alberto Carmona Sicre](https://github.com/albcarsic) (autor), [Francisco Mateos Villarejo](https://github.com/pacomateos10) (autor), [Daniel Tortorici Bartús](https://github.com/dantorbar) (autor), [Daniel Vela Camacho](https://github.com/danvelcam) (autor), [Ramón Gavira Sánchez](https://github.com/rgavira123) (revisor)

- **Fecha de Creación:** 13/02/2025  

- **Versión:** v1.4

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 13/02/2025 | v1.0    | Daniel Ruiz López, Alberto Carmona Sicre, Daniel Fernández Caballero, Daniel Alors Romero | Añadidas las historias de usuario. |
| 18/02/2025 | v1.1    | Delfín Santana Rubio, Guadalupe Ridruejo Pineda |  Actualizadas las historias de usuario en markdown (copiadas de la actualización del word que hizo Guadalupe). |
| 19/02/2025 | v1.2    | Delfín Santana Rubio  |  Corregido estilo de algunas historias de usuario, añadido títulos para separar las historias por rol (2.1., 2.2., 2.3. y 2.4.) y añadida HF 16 que no se había añadido por error. |
| 19/02/2025 | v1.3    | Daniel Fernández Rubio, Daniel Alors Romero  |  Hemos añadido todos los criterios de aceptación de las distintas historias de usuario. |
| 24/02/2025 | v1.4    | Francisco Mateos Villarjo, Daniel Tortorici Bartús, Daniel Vela Camacho, Ramón Gavira Sánchez | Actualizado el sistema de modificación de citas |

<br>

<!-- \newpage -->

<br>


# 1. ESTRUCTURA DE LAS HISTORIAS DE USUARIO  

Las historias de usuario en este proyecto siguen una estructura estandarizada para garantizar claridad, consistencia y comprensión de los requisitos funcionales.  

Cada historia de usuario se redacta utilizando el siguiente formato:  

## Formato General  
> **Como** [tipo de usuario],  
> **Quiero** [acción o funcionalidad deseada],  
> **Para** [beneficio o valor esperado].  
<br>  

## Elementos Claves de una Historia de Usuario  

Cada historia de usuario debe cumplir con los siguientes elementos esenciales:  

1. **Usuario**: Define quién utilizará la funcionalidad.  
2. **Funcionalidad**: Describe qué acción se desea realizar.  
3. **Objetivo / Beneficio**: Explica la razón por la cual se requiere la funcionalidad. 

Esta estructura permite definir claramente los requerimientos y facilita la planificación y ejecución del desarrollo.  

## Leyenda sobre el índice de historias de usuario
Se explica el índice de las historias de usuario:
- HI-00x: Historia de usuario para rol invitado.
- HP-00x: Historia de usuario para rol paciente.
- HF-00x: Historia de usuario para rol fisioterapeuta.
- HA-00x: Historia de usuario para rol admin.

# 2. HISTORIAS DE USUARIO

## 2.1. HISTORIAS DE USUARIO PARA ROL INVITADO

### HI-001: Acceso como paciente invitado
> **Como** usuario invitado,
> **Quiero** poder acceder a la plataforma de Fisio Find y realizar búsquedas de fisioterapeutas que se adapten a mis necesidades sin necesidad de estar registrado,  
> **Para** explorar opciones de profesionales y disponibilidad horaria antes de crear una cuenta.

**Comentarios**: El usuario invitado tendrá la posibilidad de ver la disponibilidad de los fisioterapeutas, pero una vez quiera reservar se le redirigirá al registro en la plataforma. 

**Criterios de aceptación**:
- Acceso a la plataforma sin registro:
  - El usuario invitado puede acceder a la página principal de Fisio Find sin necesidad de registrarse o iniciar sesión.
  - El acceso incluye poder navegar por la lista de fisioterapeutas y visualizar sus perfiles, especialidades y disponibilidad horaria.

- Búsqueda de fisioterapeutas:
  - El usuario invitado puede realizar búsquedas de fisioterapeutas según filtros (por ejemplo, especialidad, ubicación, etc.).
  - Los resultados de la búsqueda deben incluir información sobre la especialidad y la disponibilidad horaria de los fisioterapeutas.

- Visualización de la disponibilidad horaria:
  - El usuario invitado puede ver las franjas horarias disponibles de cada fisioterapeuta.
  - La disponibilidad debe actualizarse en tiempo real para reflejar cambios de horario o citas reservadas.

- Redirección al registro al intentar realizar una reserva:
  - Al intentar reservar una cita con un fisioterapeuta, el usuario invitado es redirigido a la página de registro o inicio de sesión.
  - En esta página, se proporcionan opciones para registrarse, como a través de un correo electrónico o mediante opciones de autenticación como Google, GitHub, ORCID.

- Acción sin registro para funciones limitadas:
  - El acceso de un usuario invitado está restringido solo a la navegación y búsqueda de información. Cualquier intento de realizar acciones que requieran interacción (como reservar una cita) debe desencadenar el proceso de registro.

- Comportamiento en múltiples dispositivos:
  - El acceso como usuario invitado debe ser funcional en dispositivos móviles y de escritorio, garantizando una experiencia de usuario coherente.

---

### HI-002: Acceso como fisioterapeuta invitado  
> **Como** usuario invitado,
> **Quiero** poder acceder a la información de los servicios que ofrece la plataforma de Fisio Find,  
> **Para** valorar si me interesa registrarme como fisioterapeuta y ofrecer mis consultas a los pacientes.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:
- Acceso a la plataforma sin registro:
  - El usuario invitado puede acceder a la página principal de Fisio Find sin necesidad de registrarse o iniciar sesión.
  - El acceso incluye poder navegar por la lista de servicios y funcionalidades que la plataforma ofrece a los fisioterapeutas.

- Visualización de servicios ofrecidos:
  - El usuario invitado puede ver la descripción detallada de los servicios que la plataforma ofrece a los fisioterapeutas, como la gestión de citas, la visibilidad ante pacientes, la administración de horarios, etc.
  - Los servicios deben ser claros y accesibles para que el fisioterapeuta pueda comprender cómo la plataforma puede beneficiarlo.

- Información sobre la plataforma:
  - El usuario invitado puede consultar información sobre las ventajas de registrarse como fisioterapeuta, incluyendo beneficios de visibilidad, gestión simplificada de citas y pagos, entre otros.
  - La información debe ser fácilmente accesible sin necesidad de registro.

- Información sobre precios y suscripciones:
  - El usuario invitado puede visualizar las opciones de suscripción disponibles (por ejemplo, Fisio Blue y Fisio Gold), junto con sus precios y características asociadas.
  - La plataforma debe proporcionar información clara sobre cómo los fisioterapeutas pueden beneficiarse de estas suscripciones.

- Redirección al registro al intentar interactuar con funciones avanzadas:
  - Al intentar realizar cualquier acción que requiera ser fisioterapeuta registrado (como ofrecer servicios, modificar disponibilidad o gestionar citas), el usuario invitado debe ser redirigido a la página de registro.
  - En esta página, se proporcionan opciones para registrarse, como a través de un correo electrónico o mediante opciones de autenticación.

- Funcionalidad en múltiples dispositivos:
  - El acceso como fisioterapeuta invitado debe ser funcional en dispositivos móviles y de escritorio, garantizando una experiencia de usuario coherente en todos los dispositivos.
  
---

### HI-003: Valoración de otros fisioterapeutas
> **Como** usuario invitado,
> **Quiero** poder conocer la opinión de otros fisioterapeutas registrados en la plataforma,
> **Para** saber si los servicios que ofrece Fisio Find merecen la pena.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:
- Acceso a valoraciones de fisioterapeutas:
  - El usuario invitado puede visualizar las opiniones y valoraciones dejadas por fisioterapeutas registrados sobre la plataforma Fisio Find.
  - La información mostrada debe ser clara y destacada para facilitar la comprensión de la experiencia de otros profesionales.

- Seguridad y veracidad de las opiniones:
  - Solo se mostrarán valoraciones verificadas de fisioterapeutas registrados en la plataforma.
  - Se indicará si la opinión proviene de un usuario con una suscripción activa.

- Restricción de interacción:
  - El usuario invitado solo podrá leer valoraciones, sin la posibilidad de dejar comentarios o responder a opiniones.
  - Para dejar una opinión o interactuar con ellas, se requerirá estar registrado como fisioterapeuta en la plataforma.

- Compatibilidad con múltiples dispositivos:
  - La funcionalidad debe ser accesible tanto desde dispositivos móviles como de escritorio sin pérdida de información o usabilidad.

---

## 2.2. HISTORIAS DE USUARIO PARA ROL PACIENTE

### HP-001: Búsqueda avanzada
> **Como** usuario,
> **Quiero** poder buscar al mejor fisioterapeuta basándome en:
> - Palabras clave introducidas en la búsqueda
> - Especialidad
> - Código postal (información del perfil)
> - Valoraciones del fisioterapeuta
> - Precio 
> **Para** encontrar un fisioterapeuta que se ajuste a mis necesidades.

**Comentarios**: La barra de búsqueda debe poder asociar el motivo de consulta que indicaría un paciente en una llamada telefónica o presencial (p.e: dolor lumbar, dolor de cuello, traumatismo, hernia, fascitis plantar, etc.) con los fisioterapeutas especialistas en esas patologías, para ello, será necesario tener registrada una asociación especialización-patología. 

**Criterios de aceptación**:
- Barra de búsqueda avanzada:
  - El usuario puede introducir palabras clave en una barra de búsqueda para filtrar fisioterapeutas.
  - La barra de búsqueda debe ser capaz de identificar tanto palabras sueltas como combinaciones, permitiendo encontrar resultados relacionados con las patologías más comunes (p. ej., dolor lumbar, hernia, fascitis plantar).

- Filtro por especialidad:
  - El usuario puede seleccionar o introducir una especialidad (p. ej., fisioterapeuta especializado en dolor lumbar, rehabilitación postquirúrgica) para refinar los resultados de la búsqueda.
  - Las especialidades deben estar asociadas con las patologías más comunes y definidas claramente en la plataforma.

- Filtro por código postal:
  - El usuario puede introducir un código postal para filtrar los fisioterapeutas cercanos a su ubicación.
  - El sistema debe mostrar los fisioterapeutas dentro de un rango de distancia configurable desde el código postal introducido.

- Filtro por valoraciones:
  - El usuario puede ordenar o filtrar los resultados de búsqueda según las valoraciones de otros pacientes, asegurando que los fisioterapeutas mejor valorados se muestren primero si así lo desean.
  - Las valoraciones deben ser claras y fáciles de interpretar (por ejemplo, una escala de 1 a 5 estrellas).

- Filtro por precio:
  - El usuario puede filtrar fisioterapeutas según el precio de sus consultas.
  - El filtro debe incluir un rango de precios ajustable, permitiendo que el usuario seleccione el rango que se ajuste a su presupuesto.

- Resultados de búsqueda claros:
  - Los resultados de la búsqueda deben incluir información relevante, como el nombre del fisioterapeuta, la especialidad, las valoraciones, el precio, y la localización (código postal).
  - La plataforma debe proporcionar una vista previa de cada fisioterapeuta, destacando la información más relevante.

- Asociación especialización-patología:
  - La plataforma debe tener una base de datos que relacione las especialidades de los fisioterapeutas con las patologías correspondientes, de modo que el sistema pueda asociar correctamente las búsquedas de patologías con los fisioterapeutas que las tratan.
  - Esta asociación debe ser automática y asegurar que el sistema ofrezca resultados relevantes cuando un usuario busque una patología en particular.

- Funcionalidad en múltiples dispositivos:
  - La funcionalidad de la búsqueda avanzada debe ser accesible y usable en dispositivos móviles y de escritorio, garantizando una experiencia de usuario coherente en todos los dispositivos.


---

### HP-002: Registro en Fisio Find
> **Como** usuario invitado,
> **Quiero** poder registrarme en la plataforma,
> **Para** facilitar mis datos a los fisioterapeutas al reservar una cita y acceder a todas las funcionalidades de Fisio Find.

**Comentarios**: De aquí queremos sacar la restricción de que si, sin estar registrado, quieres seleccionar una cita o hacer cualquier acción que no sea buscar fisios, tienes que estar registrado. 

**Criterios de aceptación**:
- Proceso de registro accesible:
  - El usuario invitado debe poder registrarse a través de un formulario claro y accesible desde cualquier parte de la plataforma.
  - Se ofrecerá la opción de registro mediante correo electrónico y contraseña, así como autenticación social (Google, Facebook, etc.).

- Validación de datos:
  - El sistema debe validar que los datos ingresados sean correctos (correo válido, contraseña segura, etc.).
  - Se debe enviar un correo de confirmación para activar la cuenta antes de permitir el acceso completo a la plataforma.

- Restricción de acciones sin registro:
  - Un usuario no registrado solo podrá buscar fisioterapeutas.
  - Para seleccionar una cita, contactar a un fisioterapeuta o realizar cualquier otra acción dentro de la plataforma, se le pedirá que complete el registro.

- Accesibilidad y usabilidad:
  - El proceso de registro debe ser intuitivo y rápido, permitiendo la navegación fluida sin interrupciones innecesarias.
  - Compatible con dispositivos móviles y de escritorio.

- Mensajes informativos y de error:
  - En caso de error en el registro, se mostrará un mensaje claro indicando el problema (ejemplo: "El correo ya está en uso").
  - Confirmación visual y notificación del éxito del registro.

- Seguridad y protección de datos:
  - Los datos del usuario deben almacenarse de manera segura cumpliendo con la normativa de protección de datos.
  - Se implementarán medidas de prevención contra registros fraudulentos (ejemplo: captcha, validación por correo).


---

### HP-003: Reserva de citas como usuario registrado 
> **Como** usuario registrado,
> **Quiero** una vez he seleccionado el fisioterapeuta idóneo para mi patología, quiero poder escoger mediante un calendario la fecha y hora que más me convenga para la cita,
> **Para** gestionar mi disponibilidad de manera eficiente.

**Comentarios**: Una vez que hemos reservado la cita podemos referirnos al usuario registrado como paciente, de aquí sacamos el requisito de información del usuario registrado.

**Criterios de aceptación**:
- Selección de fisioterapeuta:
  - El usuario registrado debe poder seleccionar un fisioterapeuta de la lista de resultados de búsqueda o desde su perfil.
  - La plataforma debe mostrar la información del fisioterapeuta seleccionado como el nombre, especialidad, valoraciones y precio del fisioterapeuta, para asegurar que el usuario toma una decisión informada.

- Calendario para la reserva:
  - Después de seleccionar el fisioterapeuta, el usuario debe ser capaz de acceder a un calendario interactivo con las fechas y horas disponibles para la consulta.
  - El calendario debe ser visualmente claro y fácil de usar, permitiendo a los usuarios seleccionar un día y hora de manera rápida.
  - La disponibilidad del fisioterapeuta debe estar actualizada en tiempo real para evitar que el usuario seleccione una fecha u hora que ya esté ocupada.

- Confirmación de disponibilidad:
  - Una vez seleccionada la fecha y hora, la plataforma debe mostrar un mensaje de confirmación que asegure al usuario que la cita ha sido registrada correctamente.
  - El usuario debe poder revisar los detalles de la cita (fisioterapeuta, fecha, hora, lugar) antes de confirmar la reserva.

- Notificaciones:
  - El usuario debe recibir una notificación de confirmación por correo electrónico o dentro de la aplicación (según preferencia del usuario) con los detalles de la cita.
  - En caso de que haya cambios en la cita, como la cancelación o modificación de la hora, el usuario debe ser notificado inmediatamente.

- Gestión de citas:
  - El usuario debe tener la posibilidad de revisar, modificar o cancelar su cita directamente desde su perfil de usuario.
  - Las citas modificadas o canceladas deben reflejarse en tiempo real en el calendario del fisioterapeuta.

- Información del paciente:
  - El sistema debe asociar la cita con el perfil del usuario registrado (ahora paciente) y mostrar la información relevante, como nombre, especialidad de la patología y cualquier detalle relacionado con la consulta (si es aplicable).

- Acceso desde dispositivos móviles:
  - La funcionalidad de reserva de citas debe ser completamente funcional en dispositivos móviles y de escritorio, asegurando que los usuarios puedan realizar reservas cómodamente desde cualquier dispositivo.

- Restricciones y validación:
  - El sistema debe validar que el paciente haya completado su registro y haya ingresado toda la información relevante antes de poder realizar una cita.
  - No se deben permitir reservas si la información del usuario es incompleta o si no está registrado en la plataforma.


---

### HP-004: Pago de citas por la aplicación  
> **Como** paciente,  
> **Quiero** abonar el coste de la cita en la propia plataforma con tarjeta bancaria,  
> **Para** completar el pago de manera segura y cómoda sin necesidad de realizar transferencias externas.

**Comentarios**: 
- El pago de la cita solicitada se podrá realizar hasta 48 horas previas a la cita. Esto sirve por si cancelo antes de las 48 horas para que no sea necesario pagar y evitar el cargo en la tarjeta.
- Si el pago no se ha realizado dentro de las 48 horas previas a la cita, la cita será automáticamente cancelada.
- Si la cita está pagada dentro de las 48 horas previas a la cancelación, se aplicará un reembolso según las políticas de la plataforma.
- El paciente podrá realizar el pago de la cita de inmediato con un plazo máximo de un día, aplicando también los términos de cancelación de las 48 horas previas.

**Criterios de aceptación**:
- Disponibilidad del pago en la plataforma:
  - La opción de pago debe estar visible y accesible en la interfaz del usuario hasta las 48 horas previas a la cita.
  - El sistema debe notificar al usuario cuando el pago esté habilitado.
  
- Métodos de pago admitidos:
  - Se debe permitir el pago con tarjetas bancarias (Visa, MasterCard, etc.).
  - Opcionalmente, se podrán incluir otros métodos como PayPal o billeteras digitales.
  
- Seguridad en el pago:
  - Se implementará una pasarela de pago segura con cifrado de datos.
  - Cumplimiento con normativas de seguridad como PCI DSS.
  - Autenticación en dos pasos si es requerida por la entidad bancaria.
  
- Confirmación y registro del pago:
  - Una vez realizado el pago, se debe generar una confirmación visible en la plataforma.
  - Se enviará un recibo al correo del usuario con los detalles de la transacción.
  - El estado de la cita debe actualizarse automáticamente en el sistema como "Pagada".
  
- Condiciones de pago y cancelación:
  - El pago solo podrá realizarse dentro de las 48 horas previas a la cita.
  - Si el pago no se ha realizado dentro de las 48 horas antes de la cita, la cita será automáticamente cancelada.
  - Si la cita ha sido pagada dentro de las 48 horas previas, y el paciente decide cancelarla, se aplicará un reembolso según las políticas de la plataforma.
  - El pago de citas podrá realizarse de inmediato, pero en este caso, la cita solo podrá cancelarse con reembolso si se realiza dentro de un plazo máximo de un día tras el pago.
  
- Experiencia de usuario y accesibilidad:
  - La interfaz de pago debe ser clara, intuitiva y optimizada para móviles y escritorio.
  - Se deben mostrar mensajes informativos sobre el proceso de pago y tiempos de confirmación.


---

### HP-005: Mis citas 
> **Como** paciente,
> **Quiero** poder consultar mis futuras citas en un apartado de mi perfil y/o en un calendario interactivo con recordatorios dentro de la aplicación,
> **Para** gestionar mis consultas de manera organizada y evitar olvidos.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:
- Visualización de citas:
  - El usuario podrá ver un listado de sus citas futuras en un apartado específico de su perfil.
  - Se debe incluir un calendario interactivo donde se reflejen las citas programadas.

- Detalles de la cita:
  - Cada cita debe mostrar información relevante como fecha, hora, fisioterapeuta, ubicación y estado de la reserva (pendiente, confirmada, pagada, etc.).
  - Si la cita es online, se debe incluir el enlace para acceder a la videollamada en el momento oportuno.

- Gestión de citas:
  - Los pacientes podrán cancelar sus citas dentro del periodo permitido por la plataforma.
  - Se debe permitir reprogramar citas si el fisioterapeuta lo permite y hay disponibilidad de horarios.

- Recordatorios y notificaciones:
  - El sistema debe enviar recordatorios automáticos a los pacientes antes de la cita (por ejemplo, con 24 horas y 1 hora de anticipación).
  - Se debe permitir la configuración de notificaciones vía correo electrónico y/o notificaciones push en la aplicación.

- Accesibilidad y usabilidad:
  - La interfaz debe ser intuitiva y accesible tanto en dispositivos móviles como en escritorio.
  - El usuario podrá filtrar sus citas por estado (pendientes, confirmadas, pasadas).


---

### HP-006: Mi perfil
> **Como** paciente,
> **Quiero** poder consultar mi información y modificar cualquier parámetro permitido por la aplicación,
> **Para** mantener mis datos actualizados y personalizados según mis necesidades.

**Comentarios**: 
- De aquí se deriva un requisito de edición de perfil. 
- Podría incluirse la opción de añadir información médica relevante si la plataforma lo considera útil.

**Criterios de aceptación**:
- Acceso a perfil:
  - El paciente debe poder acceder a su perfil desde la barra de navegación o la sección de usuario dentro de la plataforma.
  - El perfil debe mostrar de manera clara toda la información personal del paciente, como nombre, dirección de correo electrónico, número de teléfono, entre otros.

- Edición de perfil:
  - El paciente debe poder editar su información personal, como nombre, dirección de correo electrónico, número de teléfono, y cualquier otra información que haya proporcionado durante el registro.
  - La plataforma debe permitir actualizar las contraseñas de acceso de manera segura.
  - Si la plataforma lo permite, el paciente debe poder añadir o modificar su información médica relevante, como antecedentes de enfermedades, condiciones preexistentes, o historial de tratamientos (si aplica).
  
- Validación de cambios:
  - Una vez que el paciente realice cambios en su perfil, el sistema debe validar que los nuevos datos sean correctos y completos.
  - El paciente debe recibir una notificación de confirmación cuando los cambios sean guardados correctamente.

- Seguridad y privacidad:
  - Los cambios realizados en el perfil deben ser seguros, protegiendo la privacidad del paciente y asegurando que los datos sean tratados de acuerdo con las políticas de privacidad y regulaciones legales aplicables (como GDPR).
  - Los campos sensibles como la información médica deben ser gestionados con el mayor nivel de seguridad posible, permitiendo al paciente decidir qué información compartir.

- Acciones permitidas:
  - El paciente debe poder añadir o eliminar información médica relevante según lo considere necesario o en función de lo que permita la plataforma.
  - El paciente debe poder eliminar su cuenta, con una opción clara y accesible en su perfil. Esta acción debe ser confirmada para evitar eliminaciones accidentales.
  
- Visualización de historial de citas:
  - El perfil debe mostrar un historial de citas pasadas y futuras, incluyendo los fisioterapeutas con los que ha consultado, fechas, horas y el estado de las citas (completadas, pendientes, canceladas).

- Acceso desde dispositivos móviles:
  - La opción de consultar y modificar el perfil debe ser completamente funcional en dispositivos móviles y de escritorio, garantizando que el paciente pueda gestionar su perfil desde cualquier dispositivo.

- Restricciones:
  - Si el paciente intenta ingresar información incompleta o errónea, la plataforma debe ofrecer mensajes de error claros y específicos para guiarlo a completar los campos correctamente.

---

### HP-007: Reembolso en caso de cancelación del fisioterapeuta 
> **Como** paciente,
> **Quiero** que, una vez transcurrido el límite de cancelación, si el fisioterapeuta cancela la consulta, recibir un reembolso del coste de esta,
> **Para** no perder el dinero de la consulta.

**Comentarios**: 
- Por defecto, el límite de cancelación estará puesto en 48 horas.	

**Criterios de aceptación**:

- Condiciones de reembolso:
  - Si el fisioterapeuta cancela la consulta después del límite de cancelación (48 horas antes de la cita), el paciente recibirá un reembolso completo del importe pagado.
  - En caso de cancelación antes del límite de 48 horas, no se generará ninguna transacción, ya que el pago aún no se habrá efectuado.

- Proceso de reembolso:
  - El sistema debe procesar automáticamente el reembolso sin necesidad de que el paciente lo solicite.
  - El reembolso se efectuará en la misma cuenta o método de pago utilizado en la transacción original.
  - Se notificará al paciente sobre el reembolso mediante correo electrónico y/o notificación en la aplicación.

- Tiempos y plazos:
  - El reembolso debe reflejarse en la cuenta del paciente en un plazo máximo de 5 a 7 días hábiles, dependiendo del proveedor de pagos.
  - Se mostrará un mensaje en la plataforma indicando el estado del reembolso.

- Transparencia y soporte:
  - El paciente podrá consultar el estado del reembolso en el historial de pagos dentro de su perfil.
  - En caso de problemas con el reembolso, el usuario podrá contactar con el soporte técnico de la plataforma.

- Registro de cancelaciones:
  - El sistema debe registrar y almacenar un historial de cancelaciones realizadas por fisioterapeutas para su control y análisis.
  - En caso de cancelaciones reiteradas por parte de un fisioterapeuta, se podrá generar una alerta para revisión administrativa.


---

## 2.3. HISTORIAS DE USUARIO PARA ROL FISIOTERAPEUTA

### HF-001: Registro como fisioterapeuta
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

**Comentarios**: 
- El sistema deberá verificar que el fisioterapeuta está debidamente colegiado en España mediante la base de datos oficial de colegios y colegiados. Solo tras esta validación podrá continuar con el - proceso de registro. 
- Antes de finalizar el registro, el fisioterapeuta deberá seleccionar uno de los dos planes de suscripción disponibles (Fisio Blue o Fisio Gold). 
- Se podría considerar la opción de permitir la subida de documentación adicional para casos en los que la verificación automática falle. 
- Podría añadirse la opción de probar la plataforma antes de elegir un plan definitivo. 

**Criterios de aceptación**:
- Registro de datos personales y profesionales:
  - El fisioterapeuta debe poder proporcionar su nombre, apellidos, correo electrónico y contraseña en el formulario de registro.
  - El fisioterapeuta debe ingresar su número de colegiado y el nombre del colegio profesional al que pertenece.
  - El sistema debe verificar automáticamente la validez del número de colegiado y la pertenencia a un colegio profesional registrado en la base de datos oficial.
  
- Validación de colegiación:
  - Si el sistema no puede verificar automáticamente la colegiación, debe ofrecer la opción de subir documentación adicional (como un certificado de colegiación o un documento oficial) para validar el perfil.
  - La validación del número de colegiado y la verificación del colegio deben completarse antes de que el fisioterapeuta pueda continuar con el registro.
  - El sistema debe mostrar un mensaje de error claro si la verificación del número de colegiado no es exitosa.

- Selección de plan de suscripción:
  - Una vez validada la colegiación, el fisioterapeuta debe seleccionar uno de los dos planes de suscripción disponibles: Fisio Blue o Fisio Gold.
  - El sistema debe proporcionar una descripción clara de las características y beneficios de cada plan para que el fisioterapeuta pueda tomar una decisión informada.
  - El fisioterapeuta debe poder cambiar de plan en el futuro si lo desea, una vez que se haya completado el registro inicial.

- Prueba de la plataforma:
  - El sistema debe ofrecer la opción de probar la plataforma antes de seleccionar un plan definitivo, permitiendo al fisioterapeuta acceder a funciones limitadas del sistema durante un periodo de prueba (si se considera necesario).
  - El fisioterapeuta debe recibir una notificación recordando que el acceso de prueba es limitado y que debe seleccionar un plan para acceder a todas las funcionalidades (si se considera necesario).

- Confirmación de registro:
  - Una vez que todos los campos de registro estén completos y verificados, el fisioterapeuta debe recibir un correo electrónico de confirmación de su registro en la plataforma.
  - El correo debe incluir un enlace de activación para validar la cuenta y finalizar el proceso de registro.

- Seguridad de la cuenta:
  - La plataforma debe garantizar que los datos proporcionados durante el registro estén protegidos mediante cifrado y que la contraseña se almacene de forma segura.
  - El fisioterapeuta debe poder restablecer su contraseña si la olvida, mediante un proceso de recuperación de contraseña que requiera la validación de la dirección de correo electrónico.

- Accesibilidad y compatibilidad:
  - El formulario de registro debe ser accesible y funcional en dispositivos móviles y de escritorio, asegurando que el fisioterapeuta pueda registrarse desde cualquier dispositivo.
  
- Notificaciones:
  - El fisioterapeuta debe recibir una notificación de confirmación en la aplicación una vez que su perfil haya sido registrado correctamente y esté listo para ser validado.


---

### HF-002: Personalización del perfil de fisioterapeuta 
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


**Comentarios**: 
- Podría incluirse la opción de desactivar temporalmente la disponibilidad sin eliminar los datos. 
- Se recomienda permitir una vista previa del perfil para comprobar cómo lo ven los pacientes. 

**Criterios de aceptación**:

- Edición de perfil:
  - El fisioterapeuta podrá modificar su foto de perfil, especialidad, descripción, y otros datos desde su panel de configuración.
  - Los cambios deberán guardarse correctamente y reflejarse en la vista pública del perfil.
  - El sistema debe validar los campos obligatorios, como la información del título y el código postal.

- Información de servicios y precios:
  - Se permitirá establecer y modificar precios de consulta, incluyendo la opción de ofrecer la primera consulta gratis.
  - El fisioterapeuta podrá configurar diferentes tipos de servicios y bonos, con opciones de personalización.

- Configuración de disponibilidad:
  - El fisioterapeuta podrá modificar su disponibilidad horaria para gestionar mejor su agenda.
  - Se deberá incluir una opción para desactivar temporalmente la disponibilidad sin eliminar los datos.

- Validación y seguridad:
  - La información bancaria solo será visible para el sistema y se usará exclusivamente para recibir pagos de consultas.
  - Se aplicarán medidas de seguridad para proteger los datos sensibles.

- Experiencia del usuario:
  - Se permitirá una vista previa del perfil antes de publicar los cambios.
  - Los pacientes verán el perfil actualizado en tiempo real tras la edición.

- Carga de archivos personalizados:
  - Se permitirá a los fisioterapeutas subir cuestionarios y herramientas de tratamiento en formatos compatibles.
  - El sistema debe validar el tipo y tamaño de archivo permitido.

- Notificaciones:
  - El fisioterapeuta recibirá una confirmación cuando los cambios en su perfil se hayan guardado correctamente.
  - Se enviará una alerta en caso de información faltante o incorrecta.



---

### HF-003: Agenda y calendario 
> **Como** fisioterapeuta,
> **Quiero** poder acceder a un calendario donde se muestren mis citas agendadas y tener la posibilidad de modificar mi disponibilidad horaria
> **Para** gestionar mi agenda de manera eficiente.

**Comentarios**: 
- Podría añadirse la opción de establecer pausas o días bloqueados en la disponibilidad. 
- Se recomienda una vista semanal y mensual para una mejor planificación. 

**Criterios de aceptación**:

- Visualización del calendario:
  - El fisioterapeuta podrá ver su agenda en una vista semanal y mensual.
  - Las citas confirmadas y pendientes se mostrarán claramente diferenciadas.
  - El calendario se actualizará en tiempo real con los cambios realizados.

- Gestión de disponibilidad:
  - Se permitirá modificar la disponibilidad horaria directamente desde el calendario.
  - El fisioterapeuta podrá establecer pausas o días bloqueados en su agenda.
  - Se notificará a los pacientes afectados en caso de cambios en la disponibilidad.

- Interacción con las citas:
  - El fisioterapeuta podrá ver los detalles de cada cita (paciente, fecha, hora, servicio reservado).
  - Se permitirá reprogramar o cancelar citas bajo ciertas condiciones predefinidas.

- Usabilidad y experiencia del usuario:
  - La interfaz deberá ser intuitiva y de fácil navegación.
  - Se incluirán filtros para visualizar diferentes tipos de citas y disponibilidad.

- Seguridad y control:
  - Solo el fisioterapeuta tendrá acceso a la modificación de su disponibilidad.
  - Los cambios en la agenda deberán confirmarse antes de aplicarse.
  - Se generarán registros de cambios para futuras consultas.

- Notificaciones y alertas:
  - Se enviarán recordatorios automáticos al fisioterapeuta sobre citas próximas.


---

### HF-004: Aceptación, rechazarla y modificación de citas   
> **Como** fisioterapeuta,  
> **Quiero** poder consultar el estado de una cita solicitada y poder aceptarla, rechazarla o solicitar una modificación de fecha y hora, notificando al paciente sobre cualquier cambio.   
> **Para** gestionar de manera eficiente mi agenda.

**Comentarios**: 
- Se podría incluir un sistema de notificación que recuerde al fisioterapeuta sobre citas pendientes de aceptar o modificar. 
- Podría añadirse una opción para realizar un seguimiento del historial de citas modificadas o rechazadas. 

**Criterios de aceptación**:
- Consulta del estado de la cita:
  - El fisioterapeuta debe poder ver el estado actual de una cita solicitada (pendiente, aceptada, rechazada o modificada) desde su panel de control.
  - El sistema debe mostrar claramente la información relevante de la cita, como la fecha, hora, paciente y motivo de la cita.
  
- Aceptación de citas:
  - El fisioterapeuta debe poder aceptar una cita mediante un botón o acción dentro de la plataforma.
  - Una vez aceptada, el paciente debe recibir una notificación automática confirmando la cita.
  - El sistema debe actualizar el estado de la cita a "aceptada" y reflejar el cambio tanto para el fisioterapeuta como para el paciente.

- Rechazo de citas:
  - El fisioterapeuta debe poder rechazar una cita, proporcionando una opción para agregar un motivo (opcional).
  - El paciente debe recibir una notificación automática notificando que la cita ha sido rechazada y, si se proporciona un motivo, se incluirá en la notificación.
  - El estado de la cita debe cambiar a "rechazada" y la agenda del fisioterapeuta debe reflejar el cambio.

- Modificación de citas:
  - El proceso se basaría en una interfaz donde el fisioterapeuta puede proponer múltiples alternativas de fechas y horas garantizadas para la sesión.  
  - El sistema debe enviar una notificación al paciente para informarle sobre la solicitud de modificación y permitirle aceptar o rechazar las nuevas propuestas.  
  - Una vez que el paciente confirme la modificación, la cita debe actualizarse con la nueva fecha y hora en ambas agendas (la del fisioterapeuta y la del paciente). En caso de que el paciente rechace las nuevas propuestas, se cancelará la solicitud de modificación y el paciente deberá re-agendar la cita desde cero.
  
- Notificación de citas pendientes:
  - El sistema debe notificar al fisioterapeuta sobre las citas pendientes de aceptar, rechazar o modificar dentro de un plazo determinado.
  - La notificación debe incluir detalles relevantes de la cita para facilitar la toma de decisiones rápidas.

- Historial de citas modificadas o rechazadas:
  - El fisioterapeuta debe poder consultar un historial de citas rechazadas o modificadas desde su panel de control.
  - El sistema debe mostrar la fecha original de la cita, el motivo de rechazo o la nueva fecha y hora si la cita fue modificada.
  
- Confirmación de cambios:
  - Tras aceptar, rechazar o modificar una cita, el fisioterapeuta debe recibir una notificación dentro de la plataforma confirmando que su acción fue registrada correctamente.
  
- Accesibilidad y usabilidad:
  - La funcionalidad de aceptación, rechazo y modificación de citas debe ser fácilmente accesible desde la interfaz del fisioterapeuta, sin necesidad de navegación compleja.
  - El sistema debe permitir al fisioterapeuta gestionar citas desde dispositivos móviles y de escritorio.
  
- Seguridad:
  - El sistema debe garantizar que las notificaciones y cambios de cita estén protegidos y que los pacientes no puedan acceder a la información de otras citas o perfiles sin autorización.


---

### HF-005: Valoración del fisioterapeuta
> **Como** fisioterapeuta,  
> **Quiero** que los pacientes puedan evaluar la consulta realizada y dejar comentarios en mi perfil,
> **Para** que futuros pacientes puedan tener referencias de mi trabajo.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Sistema de valoración:
  - Los pacientes podrán valorar la consulta con un sistema de estrellas (1 a 5).
  - Se permitirá dejar comentarios adicionales junto con la valoración.
  - Las valoraciones y comentarios serán visibles en el perfil del fisioterapeuta.

- Publicación y moderación:
  - Solo los pacientes que hayan tenido una consulta confirmada podrán dejar una valoración.
  - Los fisioterapeutas no podrán eliminar valoraciones, pero podrán responder a los comentarios.

- Visualización de las valoraciones:
  - Las valoraciones estarán organizadas cronológicamente en el perfil del fisioterapeuta.
  - Se mostrará el promedio de estrellas basado en todas las valoraciones recibidas.
  - Los comentarios podrán filtrarse por puntuación (más altas, más bajas, recientes).

- Notificaciones y alertas:
  - El fisioterapeuta recibirá una notificación cuando un paciente deje una valoración.
  - Se enviará una solicitud de valoración automáticamente al paciente después de la consulta.
  - Si un paciente no deja una valoración en 48 horas, se podrá enviar un recordatorio opcional.

- Protección contra abuso:
  - Un paciente solo podrá valorar una consulta realizada, evitando spam o múltiples valoraciones sobre la misma.
  - Se permitirá reportar comentarios ofensivos o falsos para revisión por el equipo de soporte.
  - Se aplicarán políticas contra valoraciones fraudulentas o manipuladas.

---

### HF-006: Personalización de herramientas  
> **Como** fisioterapeuta,  
> **Quiero** tener un espacio donde poder personalizar los tests y cuestionarios plantilla ofrecidos por la plataforma,   
> **Para** ofrecer un servicio personalizado a mis pacientes.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Gestión de cuestionarios y tests:
  - El fisioterapeuta podrá acceder a una biblioteca de cuestionarios y tests prediseñados.
  - Se permitirá modificar los textos, preguntas y escalas de valoración según las necesidades del fisioterapeuta.
  - Posibilidad de crear cuestionarios desde cero y guardarlos como plantillas reutilizables.

- Personalización avanzada:
  - Opción para agregar preguntas abiertas, cerradas, de opción múltiple y escalas de valoración.
  - Configuración de preguntas obligatorias u opcionales.

- Gestión y almacenamiento:
  - Los fisioterapeutas podrán organizar los cuestionarios en categorías personalizadas.
  - Opción para compartir cuestionarios entre fisioterapeutas dentro de la plataforma (si se habilita).
  - Almacenamiento seguro de los cuestionarios completados en el perfil de cada paciente.

- Integración con consultas:
  - Posibilidad de asignar cuestionarios específicos a pacientes antes o después de una consulta.
  - Acceso rápido a las respuestas de los pacientes desde su historial de tratamientos.
  - Notificaciones automáticas al paciente para completar el cuestionario antes de la sesión.

- Control y visibilidad:
  - Configuración de acceso: cuestionarios privados o públicos según preferencia del fisioterapeuta.
  - Vista previa antes de enviar el cuestionario a un paciente.

- Experiencia del paciente:
  - Interfaz intuitiva para que los pacientes completen los cuestionarios desde cualquier dispositivo.
  - Confirmación de recepción cuando un paciente haya enviado su cuestionario completado.
  - Posibilidad de descargar los cuestionarios en formato PDF o verlos en línea.


---

### HF-007: Cuestionario preintervención   
> **Como** fisioterapeuta,  
> **Quiero** que antes de confirmar la cita de un paciente, esté obligado a rellenar un cuestionario preintervención,   
> **Para** conocer el motivo de la consulta y sus hábitos para realizar un diagnóstico previo.

**Comentarios**: 
- En este cuestionario es donde se debería incluir la herramienta del mapa de dolor, por ejemplo. 
- El cuestionario varía según la especialidad del fisio. 

**Criterios de aceptación**:

- Obligación de rellenar el cuestionario:
  - El fisioterapeuta debe requerir que el paciente complete un cuestionario preintervención antes de confirmar la cita.
  - El cuestionario debe ser obligatorio y no permitir la confirmación de la cita hasta que no esté completamente relleno.

- Personalización del cuestionario:
  - El cuestionario debe adaptarse según la especialidad del fisioterapeuta. Por ejemplo, un fisioterapeuta especializado en dolor lumbar debe tener un cuestionario diferente al de un fisioterapeuta especializado en fisioterapia deportiva.
  - El sistema debe permitir la creación y edición de cuestionarios según las especialidades definidas.

- Preguntas generales y específicas:
  - El cuestionario debe incluir tanto preguntas generales sobre el estado de salud del paciente como preguntas específicas relacionadas con la especialidad del fisioterapeuta y el motivo de la consulta.
  - Las preguntas pueden incluir sobre historial médico, lesiones previas, hábitos de vida, tipo de dolor, etc.

- Confirmación de respuesta:
  - El sistema debe permitir al paciente revisar las respuestas antes de enviarlas, con la opción de corregir cualquier información antes de la confirmación.
  
- Visualización de resultados por el fisioterapeuta:
  - Una vez que el paciente haya completado el cuestionario, el fisioterapeuta debe poder acceder a la información del cuestionario en su panel de control, antes de confirmar la cita.
  - El cuestionario debe ser claro y fácil de leer para que el fisioterapeuta pueda hacer un diagnóstico preliminar basado en las respuestas del paciente.

- Notificación de completitud:
  - El paciente debe recibir una notificación de recordatorio si no completa el cuestionario dentro de un plazo determinado antes de la cita.
  - El sistema debe garantizar que el cuestionario esté completamente relleno antes de permitir la finalización del proceso de reserva de la cita.

- Seguridad y privacidad:
  - Toda la información contenida en el cuestionario debe ser tratada con la máxima confidencialidad y seguridad, cumpliendo con las regulaciones de privacidad de datos (como el RGPD en Europa).
  - El cuestionario debe ser accesible solo para el paciente y el fisioterapeuta correspondiente.

- Accesibilidad:
  - El cuestionario debe ser accesible desde dispositivos móviles y de escritorio, y debe adaptarse correctamente a distintos tamaños de pantalla.

- Validación de datos:
  - El sistema debe validar las respuestas del cuestionario para asegurarse de que los campos obligatorios estén completos y que no haya respuestas incorrectas o fuera de lugar antes de permitir que el paciente envíe el cuestionario.


---

### HF-008: Pago previo de la consulta
> **Como** fisioterapeuta,  
> **Quiero** que el paciente abone de antemano el precio de la consulta,   
> **Para** garantizar el compromiso del paciente y reducir cancelaciones de última hora.

**Comentarios**: 
- Un paciente solo podrá reservar una consulta si la fecha de la cita está a más de 72 horas de la solicitud.
- Entre las 72 y 48 horas previas a la consulta, el paciente podrá cancelar la cita sin cargo.
- Pasadas las 48 horas previas a la consulta, el cobro se realizará automáticamente.
- El único caso en el que un paciente recibirá un reembolso será si el fisioterapeuta cancela la consulta dentro de las 48 horas previas.
- Esta historia excluye a las consultas que estén catalogadas como "GRATUITAS".

**Criterios de aceptación**:

- Opciones de pago previo:
  - Los pacientes deberán registrar un método de pago al momento de agendar una consulta.
  - El pago se procesará automáticamente 48 horas antes de la consulta.

- Política de cancelación:
  - Los pacientes solo podrán reservar citas con al menos 72 horas de antelación.
  - Entre las 72 y 48 horas previas a la consulta, el paciente podrá cancelar la cita sin cargo.
  - Pasadas las 48 horas previas a la consulta, el sistema realizará el cobro automático sin posibilidad de reembolso.
  - En caso de cancelación por parte del fisioterapeuta dentro de las 48 horas previas, el paciente recibirá un reembolso completo.

- Integración con la agenda:
  - Una vez programada, la cita se reflejará en la agenda del fisioterapeuta como "pendiente de cobro" hasta 48 horas antes.
  - Cuando se realice el cobro automático, la cita pasará a estado "confirmada".

- Notificación al paciente:
  - El paciente recibirá una notificación al reservar la cita, indicando la política de cobro y cancelación.
  - 48 horas antes de la consulta, el paciente será notificado sobre el cobro inminente.
  - Si el fisioterapeuta cancela la cita dentro de las 48 horas previas, el paciente será notificado y recibirá un reembolso automático.

- Seguridad del pago:
  - Todos los pagos deben realizarse de manera segura, cumpliendo con normativas como PCI-DSS.
  - La plataforma debe garantizar que el cobro automático se realice sin errores antes de confirmar la cita.

- Historial de pagos:
  - Tanto el paciente como el fisioterapeuta podrán acceder al historial de pagos de consultas anteriores.
  - El fisioterapeuta podrá verificar el estado de pago de cada consulta programada.

---

### HF-009: Registro de facturas 
> **Como** fisioterapeuta,  
> **Quiero** que el sistema genere una factura por cada consulta realizada y que se almacenen en el sistema,  
> **Para** que pueda consultarlas y descargarlas.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Generación automática de facturas:
  - El sistema debe generar una factura automáticamente por cada consulta realizada.
  - La factura debe incluir detalles como: nombre del paciente, especialidad del fisioterapeuta, fecha de la cita, importe, impuestos aplicables y forma de pago.

- Almacenamiento de facturas:
  - Las facturas generadas deben ser almacenadas de manera segura en la base de datos del sistema.
  - El fisioterapeuta debe poder acceder a sus facturas en cualquier momento desde su perfil de usuario.
  
- Consultas y descargas de facturas:
  - El fisioterapeuta debe poder consultar y ver todas las facturas generadas, ordenadas por fecha de emisión.
  - El sistema debe permitir descargar las facturas en formato PDF.
  
- Envío de facturas por correo electrónico:
  - El sistema debe enviar una copia de la factura al correo electrónico del fisioterapeuta una vez que se haya generado.
  
- Notificación al fisioterapeuta:
  - El sistema debe notificar al fisioterapeuta cuando una factura haya sido generada y esté disponible para su consulta y descarga.

- Seguridad y privacidad:
  - El sistema debe garantizar que las facturas solo sean accesibles para el fisioterapeuta correspondiente.
  - La información de las facturas debe estar protegida con medidas de seguridad adecuadas (por ejemplo, cifrado de datos y acceso autenticado).


---


### HF-010: Videollamada  
> **Como** fisioterapeuta,  
> **Quiero** poder iniciar la consulta con un paciente desde mi agenda de citas,  
> **Para** iniciar la videollamada.

**Comentarios**:
- La videollamada podrá incluir un temporizador para saber el tiempo restante de consulta y que este tiempo no se exceda.  
- La llamada no podrá finalizar hasta que haya transcurrido un 75% del tiempo destinado a la consulta.  

**Criterios de aceptación**:

- Iniciar la videollamada:
  - El fisioterapeuta debe poder iniciar la videollamada directamente desde su agenda de citas, con un botón o enlace visible en la cita programada.
  - El sistema debe proporcionar un enlace o interfaz para acceder a la videollamada de manera rápida y sencilla.

- Temporizador para la consulta:
  - El sistema debe mostrar un temporizador visible durante toda la videollamada que indique el tiempo restante de la consulta.
  - El temporizador debe iniciar automáticamente cuando la videollamada comience y detenerse al finalizar la consulta.

- Restricciones de tiempo:
  - El sistema no debe permitir que la videollamada se termine hasta que haya transcurrido al menos el 75% del tiempo destinado para la consulta.
  - El fisioterapeuta deberá ser notificado cuando el 75% del tiempo de consulta haya pasado para que pueda finalizarla solo cuando sea apropiado.

- Calidad de la videollamada:
  - La videollamada debe ser de alta calidad con opciones para ajustar el micrófono, video y compartir pantalla si es necesario.
  - El sistema debe garantizar que no haya interrupciones significativas en la calidad de la videollamada (por ejemplo, latencia o cortes).

- Notificación de finalización:
  - Al finalizar la videollamada, el sistema debe notificar al fisioterapeuta y al paciente que la consulta ha terminado.
  - El sistema debe guardar un registro de la videollamada en el historial de citas del paciente y fisioterapeuta.

- Accesibilidad y compatibilidad:
  - La videollamada debe ser compatible con dispositivos móviles y de escritorio.
  - El sistema debe ser accesible desde cualquier navegador común sin necesidad de instalar software adicional.

- Seguridad en la videollamada:
  - La videollamada debe estar protegida con cifrado de extremo a extremo para garantizar la privacidad de la consulta.
  - Solo el fisioterapeuta y el paciente deben tener acceso a la videollamada, y no debe ser posible que otras personas se unan sin autorización.

- Resolución de problemas:
  - El sistema debe incluir opciones para solucionar problemas comunes de videollamadas, como problemas de conexión o de audio/video.
  - En caso de interrupciones, el sistema debe permitir que la llamada se retome rápidamente o, si es necesario, reprogramar la cita.

---

### HF-011: Herramientas en la videollamada 
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

**Criterios de aceptación**

- **Acceso al historial clínico**:
  - El fisioterapeuta debe poder acceder al historial clínico del paciente durante la videollamada desde la plataforma.
  - El historial clínico debe ser completamente accesible, permitiendo visualizar datos médicos relevantes y actualizarlos en tiempo real.
  - Los cambios realizados en el historial clínico deben guardarse automáticamente y estar disponibles para futuras consultas.

- **Funcionalidad de compartir pantalla**:
  - El fisioterapeuta debe poder compartir su pantalla con el paciente durante la videollamada.
  - La opción para compartir pantalla debe estar claramente visible y ser fácilmente accesible.
  - El fisioterapeuta debe poder dejar de compartir la pantalla en cualquier momento sin interrupciones.

- **Modelo anatómico 3D**:
  - El fisioterapeuta debe tener acceso a un modelo anatómico 3D interactivo durante la videollamada.
  - El modelo debe ser de fácil manejo, permitiendo rotar, acercar o alejar para ilustrar mejor la información sobre la patología o tratamiento.
  - El paciente debe poder visualizar el modelo de manera clara durante la consulta.

- **Plantillas de test y cuestionarios**:
  - El fisioterapeuta debe tener acceso a plantillas de test y cuestionarios predefinidos en el sistema durante la videollamada.
  - Los cuestionarios deben incluir herramientas como mapas de dolor, escalas de evaluación y otros formularios importantes para el diagnóstico.
  - El fisioterapeuta debe poder adaptar los cuestionarios a las necesidades del paciente en tiempo real.

- **Cuestionarios personalizados**:
  - El fisioterapeuta debe poder acceder a sus cuestionarios personalizados, creados previamente y almacenados en la plataforma.
  - Los cuestionarios personalizados deben ser modificables durante la consulta, permitiendo al fisioterapeuta agregar o ajustar preguntas.
  - La integración de escalas de evaluación y mapas de dolor en los cuestionarios debe ser sencilla y eficiente.

- **Almacenaje de la información**:
  - Toda la información recopilada durante la videollamada, incluidos los cuestionarios y el historial clínico actualizado, debe ser almacenada en el sistema bajo el perfil del paciente.
  - El sistema debe proporcionar un registro visible que confirme que los datos se han guardado correctamente.

- **Interfaz intuitiva**:
  - Las herramientas deben ser fáciles de localizar y utilizar por el fisioterapeuta durante la videollamada.
  - La interfaz debe ser clara, optimizada para no interferir con el flujo de la consulta y permitir un acceso rápido a las funciones esenciales.


---

### HF-012: Archivos en la nube 
> **Como** fisioterapeuta,  
> **Quiero** poder modificar los vídeos subidos en mi espacio personal y darle acceso a los pacientes que correspondan,   
> **Para** que pueda consultar en cualquier momento cómo se realiza un ejercicio o para que tengan acceso a alguna explicación que quiera ofrecerle.

**Comentarios**:
- Se podría considerar la posibilidad de que, por ejemplo, en las planificaciones de ejercicio, un ejercicio ya esté asociado a un vídeo explicativo de la nube del profesor. 

**Criterios de aceptación**:

- Subida y gestión de archivos:
  - El fisioterapeuta debe poder subir archivos de vídeo a su espacio personal de la plataforma.
  - El sistema debe permitir la modificación de los vídeos ya subidos, con opciones para editar, borrar o reemplazar los archivos existentes.
  
- Acceso a los pacientes:
  - El fisioterapeuta debe poder configurar permisos para que solo los pacientes correspondientes puedan acceder a los vídeos.
  - Los pacientes que tengan acceso deben poder visualizar los vídeos desde su perfil en la plataforma.

- Vinculación de ejercicios y vídeos:
  - El sistema debe permitir asociar vídeos explicativos a ejercicios específicos dentro de una planificación de ejercicios.
  - Cuando un fisioterapeuta asocie un vídeo a un ejercicio, los pacientes deben poder acceder directamente al vídeo desde el ejercicio asignado.

- Acceso desde cualquier dispositivo:
  - Los pacientes deben poder acceder a los vídeos subidos desde cualquier dispositivo (móvil o escritorio) de forma sencilla y sin problemas de compatibilidad.

- Seguridad y privacidad:
  - Los vídeos deben estar protegidos por medidas de seguridad adecuadas, como permisos de acceso y cifrado, para garantizar que solo los pacientes autorizados puedan visualizarlos.
  - El sistema debe garantizar que solo el fisioterapeuta que subió el vídeo y los pacientes autorizados tengan acceso al contenido.

- Calidad de los archivos:
  - El sistema debe garantizar que los vídeos subidos mantengan una calidad adecuada para su visualización en diferentes dispositivos.
  - El sistema debe optimizar los archivos de vídeo para que no haya tiempos de carga excesivos o problemas de reproducción.


---

### HF-013: Test y cuestionarios 
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

**Criterios de aceptación**:

- Plantillas disponibles:
  - El fisioterapeuta debe poder acceder a plantillas predefinidas para test de valoración, cuestionarios y prescripción de ejercicios dentro de la plataforma.
  - Las plantillas deben ser fácilmente editables para permitir personalización según las necesidades del fisioterapeuta.
  
- Creación de test y cuestionarios personalizados:
  - El sistema debe permitir al fisioterapeuta crear test y cuestionarios personalizados desde cero.
  - El fisioterapeuta debe poder definir preguntas y respuestas, tipos de respuestas (por ejemplo, opción múltiple, texto libre, escala de valoración) y establecer criterios de evaluación.

- Prescripción de ejercicios:
  - El sistema debe permitir al fisioterapeuta generar plantillas de prescripción de ejercicios con los siguientes campos:
    - Nombre del paciente
    - Diagnóstico
    - Frecuencia de los ejercicios
    - Tiempo estimado de la sesión
    - Hora recomendada para realizar los ejercicios (opcional)
    - Detalles del ejercicio (nombre, objetivo, descripción, material necesario, series, repeticiones, carga, método de evaluación)
  - El fisioterapeuta debe poder incluir enlaces a vídeos subidos por él para ilustrar los ejercicios.

- Cuestionarios interactivos para pacientes:
  - El paciente debe poder completar los cuestionarios directamente en la plataforma.
  - Los resultados de los cuestionarios deben ser enviados automáticamente al fisioterapeuta para su revisión.
  
- Acceso y almacenamiento en el espacio del fisioterapeuta:
  - Todos los test, cuestionarios y prescripciones de ejercicios deben almacenarse en el espacio personal del fisioterapeuta dentro de la plataforma.
  - El fisioterapeuta debe poder consultar y acceder a los cuestionarios y ejercicios en cualquier momento.
  
- Notificaciones y recordatorios:
  - El sistema debe permitir que se envíen notificaciones y recordatorios automáticos al paciente sobre la hora recomendada para realizar los ejercicios.
  - El paciente debe tener la opción de ajustar las notificaciones de recordatorio en su sección de tratamiento/seguimiento.

- Seguridad y privacidad:
  - El sistema debe garantizar que toda la información personal y los resultados de los cuestionarios estén protegidos por medidas de seguridad adecuadas.
  - Solo el fisioterapeuta que ha creado los test y cuestionarios debe tener acceso completo a ellos, y los pacientes deben tener acceso solo a los cuestionarios que se les han asignado.


---

### HF-014: Seguimiento    
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
 
---

### HF-015: Recordatorios de consultas   
> **Como** fisioterapeuta,  
> **Quiero** poder recordarle a mi paciente cuándo tiene agendada una consulta,  
> **Para** que no se le olvide o para que la cancele a tiempo si así lo desea.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Recepción de archivos:
  - El fisioterapeuta debe poder recibir archivos de los pacientes a través de la plataforma, principalmente imágenes de diagnóstico como ecografías, radiografías, etc.
  - Los archivos deben poder ser cargados directamente en el perfil del paciente desde la interfaz de la aplicación.
  
- Tipos de archivo soportados:
  - La plataforma debe soportar los tipos de archivo más comunes para imágenes de diagnóstico, como JPG, PNG, PDF, DICOM, entre otros.
  - Se debe informar a los pacientes sobre los tipos de archivos aceptados y su tamaño máximo permitido para garantizar que se puedan cargar sin problemas.

- Acceso a los archivos:
  - Los fisioterapeutas deben poder acceder a los archivos cargados por los pacientes directamente desde su perfil o desde el historial de consultas.
  - Los archivos deben estar organizados de forma clara y fácil de encontrar, etiquetados por fecha o tipo de archivo (por ejemplo, "Radiografía", "Ecografía", etc.).

- Almacenamiento seguro:
  - Los archivos deben ser almacenados de manera segura, cumpliendo con las normativas de protección de datos y privacidad como GDPR (si aplica) o cualquier otra legislación vigente relacionada con la protección de datos médicos.
  - La plataforma debe cifrar los archivos en tránsito y en reposo para garantizar su seguridad.

- Notificaciones al paciente:
  - Los pacientes deben recibir una notificación (por ejemplo, correo electrónico o mensaje dentro de la aplicación) cuando su archivo haya sido recibido y esté disponible para el fisioterapeuta.
  
- Acceso restringido:
  - El acceso a los archivos debe ser restringido al fisioterapeuta asignado al paciente, garantizando que solo las personas autorizadas puedan consultarlos.
  - Los pacientes deben tener la opción de eliminar o actualizar sus archivos en cualquier momento desde su perfil, con las notificaciones correspondientes al fisioterapeuta.

- Historial de archivos:
  - La plataforma debe permitir que tanto el paciente como el fisioterapeuta tengan acceso a un historial de los archivos enviados, con la posibilidad de visualizar las versiones anteriores de los archivos (si hay actualizaciones).
  
- Visualización de imágenes:
  - Los fisioterapeutas deben poder visualizar las imágenes de diagnóstico sin necesidad de descargarlas, con opciones de zoom y desplazamiento para una revisión detallada.
  - En caso de formatos específicos como DICOM, debe ser posible visualizarlos correctamente dentro de la plataforma.

- Compatibilidad con dispositivos móviles:
  - Los fisioterapeutas deben poder acceder y visualizar los archivos de los pacientes en dispositivos móviles, con una interfaz adecuada para pantallas más pequeñas.
  
- Cumplimiento normativo:
  - La plataforma debe cumplir con las normativas legales sobre el almacenamiento y compartición de archivos clínicos en la región donde se utilice (por ejemplo, HIPAA en EE. UU., GDPR en Europa, etc.).
 
---

### HF-016: Recordatorios de ejercicio 
> **Como** fisioterapeuta,  
> **Quiero** poder enviar un recordatorio de “inicio de sesión de ejercicio” a los pacientes que tengan asignado como tratamiento una sesión de entrenamiento,  
> **Para** que no se olviden de realizar el ejercicio pautada.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Configuración de recordatorios:
  - El fisioterapeuta debe poder configurar recordatorios para los ejercicios que el paciente debe realizar.
  - Los recordatorios deben incluir detalles sobre el ejercicio, como el nombre del ejercicio, el objetivo y la duración o repeticiones recomendadas.

- Frecuencia de los recordatorios:
  - El fisioterapeuta debe poder elegir la frecuencia con la que se envían los recordatorios (por ejemplo, diario, semanal, antes de la sesión programada).
  - Los pacientes deben recibir recordatorios a una hora específica, seleccionada por el fisioterapeuta, para garantizar que los ejercicios se realicen en el momento adecuado.

- Notificación del recordatorio:
  - Los pacientes deben recibir una notificación (en la aplicación o por correo electrónico) con los detalles del ejercicio a realizar.
  - La notificación debe ser clara y visible para que el paciente sepa qué ejercicio realizar y cómo acceder a los detalles del tratamiento.

- Confirmación de ejercicio realizado:
  - El paciente debe tener la opción de marcar el ejercicio como realizado una vez completado.
  - Los fisioterapeutas deben tener acceso a una visualización de los ejercicios completados y no completados por cada paciente.

- Historial de recordatorios:
  - Los fisioterapeutas deben poder revisar el historial de los recordatorios enviados a cada paciente, verificando si han sido recibidos y si los ejercicios se han realizado.

- Seguimiento de cumplimiento:
  - El sistema debe permitir al fisioterapeuta visualizar estadísticas de cumplimiento de los ejercicios, mostrando cuántos ejercicios fueron realizados en tiempo y forma por cada paciente.

- Posibilidad de modificación de recordatorios:
  - Los fisioterapeutas deben poder modificar los recordatorios, como la fecha, la hora y la descripción del ejercicio, en caso de que cambien las pautas del tratamiento.

- Personalización de recordatorios:
  - El fisioterapeuta debe poder personalizar el mensaje del recordatorio, incluyendo instrucciones específicas o motivacionales para cada paciente.

- Reenvío de recordatorios:
  - Los pacientes deben tener la opción de recibir un recordatorio adicional si no han marcado el ejercicio como realizado después de un tiempo determinado (por ejemplo, si no han completado el ejercicio en las primeras horas del día).

- Accesibilidad del recordatorio:
  - Los pacientes deben poder acceder a los detalles del ejercicio directamente desde el recordatorio, permitiéndoles visualizar las instrucciones y la información relevante sin tener que buscarla en otro lugar de la plataforma.
 
---

### HF-017: Compartir archivos clínicos   
> **Como** fisioterapeuta,  
> **Quiero** poder recibir archivos de mis pacientes, principalmente imágenes de diagnóstico (ecografías, radiografías, etc.) y que se almacenen en un lugar de su perfil de pacientes al que yo pueda acceder,  
> **Para** consultarlos en cualquier momento y tomar decisiones sobre su valoración y tratamiento.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Recepción de archivos:
  - El fisioterapeuta debe poder recibir archivos de los pacientes a través de la plataforma, principalmente imágenes de diagnóstico como ecografías, radiografías, etc.
  - Los archivos deben poder ser cargados directamente en el perfil del paciente desde la interfaz de la aplicación.
  
- Tipos de archivo soportados:
  - La plataforma debe soportar los tipos de archivo más comunes para imágenes de diagnóstico, como JPG, PNG, PDF, DICOM, entre otros.
  - Se debe informar a los pacientes sobre los tipos de archivos aceptados y su tamaño máximo permitido para garantizar que se puedan cargar sin problemas.

- Acceso a los archivos:
  - Los fisioterapeutas deben poder acceder a los archivos cargados por los pacientes directamente desde su perfil o desde el historial de consultas.
  - Los archivos deben estar organizados de forma clara y fácil de encontrar, etiquetados por fecha o tipo de archivo (por ejemplo, "Radiografía", "Ecografía", etc.).

- Almacenamiento seguro:
  - Los archivos deben ser almacenados de manera segura, cumpliendo con las normativas de protección de datos y privacidad como GDPR (si aplica) o cualquier otra legislación vigente relacionada con la protección de datos médicos.
  - La plataforma debe cifrar los archivos en tránsito y en reposo para garantizar su seguridad.

- Notificaciones al paciente:
  - Los pacientes deben recibir una notificación (por ejemplo, correo electrónico o mensaje dentro de la aplicación) cuando su archivo haya sido recibido y esté disponible para el fisioterapeuta.
  
- Acceso restringido:
  - El acceso a los archivos debe ser restringido al fisioterapeuta asignado al paciente, garantizando que solo las personas autorizadas puedan consultarlos.
  - Los pacientes deben tener la opción de eliminar o actualizar sus archivos en cualquier momento desde su perfil, con las notificaciones correspondientes al fisioterapeuta.

- Historial de archivos:
  - La plataforma debe permitir que tanto el paciente como el fisioterapeuta tengan acceso a un historial de los archivos enviados, con la posibilidad de visualizar las versiones anteriores de los archivos (si hay actualizaciones).
  
- Visualización de imágenes:
  - Los fisioterapeutas deben poder visualizar las imágenes de diagnóstico sin necesidad de descargarlas, con opciones de zoom y desplazamiento para una revisión detallada.
  - En caso de formatos específicos como DICOM, debe ser posible visualizarlos correctamente dentro de la plataforma.

- Compatibilidad con dispositivos móviles:
  - Los fisioterapeutas deben poder acceder y visualizar los archivos de los pacientes en dispositivos móviles, con una interfaz adecuada para pantallas más pequeñas.
  
- Cumplimiento normativo:
  - La plataforma debe cumplir con las normativas legales sobre el almacenamiento y compartición de archivos clínicos en la región donde se utilice (por ejemplo, HIPAA en EE. UU., GDPR en Europa, etc.).


---

### HF-018: Accesibilidad 
> **Como** fisioterapeuta,  
> **Quiero** que la aplicación sea accesible, especialmente para personas con discapacidad que suelen constituir un gran porcentaje de los pacientes, 
> **Para** ofrecer un servicio inclusivo a todos los perfiles de usuarios de la plataforma.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Cumplimiento con estándares de accesibilidad:
  - La aplicación debe cumplir con los estándares internacionales de accesibilidad (WCAG 2.1, ADA, etc.) para garantizar que todos los usuarios, incluidos los pacientes con discapacidad, puedan acceder y utilizar la plataforma sin barreras.
  - Deben realizarse auditorías de accesibilidad periódicas para identificar y corregir posibles problemas en la plataforma.

- Soporte para tecnología asistiva:
  - La aplicación debe ser compatible con tecnologías asistivas, como lectores de pantalla, ampliadores de pantalla, y teclados alternativos.
  - Las funcionalidades clave de la plataforma, como el registro, la búsqueda de fisioterapeutas y la gestión de citas, deben ser accesibles mediante solo el teclado, sin necesidad de usar un ratón.

- Contrastes de color:
  - La interfaz de usuario debe proporcionar suficiente contraste entre el texto y el fondo para facilitar la lectura de los pacientes con deficiencias visuales.
  - El diseño debe ser ajustable para permitir que los usuarios puedan cambiar los colores y las fuentes según sus necesidades (por ejemplo, modo alto contraste).

- Texto alternativo para imágenes:
  - Todas las imágenes, botones e iconos deben tener texto alternativo (alt text) descriptivo para que los usuarios con discapacidad visual que usan lectores de pantalla puedan entender su contenido.
  - Las imágenes decorativas deben estar marcadas correctamente para ser ignoradas por los lectores de pantalla.

- Subtítulos y transcripciones:
  - Las videollamadas y otros contenidos multimedia deben ofrecer subtítulos o transcripciones para personas con discapacidad auditiva.
  - Los subtítulos deben ser sincronizados correctamente con el contenido hablado y ofrecer opciones para ajustar su tamaño y color.

- Diseño adaptable:
  - La plataforma debe ser completamente adaptable a diferentes tamaños de pantalla y dispositivos (responsive design), permitiendo que los usuarios con diversas discapacidades puedan interactuar con ella de forma efectiva, ya sea en móviles, tabletas o computadoras de escritorio.
  
- Facilidad de navegación:
  - La navegación debe ser clara y sencilla, con etiquetas descriptivas y botones de acción bien identificados.
  - El flujo de navegación debe ser intuitivo, de modo que cualquier usuario, independientemente de su discapacidad, pueda completar tareas como reservar citas, acceder a la información de contacto de un fisioterapeuta, etc.

- Pruebas de accesibilidad:
  - La aplicación debe ser probada con usuarios reales que tengan discapacidades para verificar que la accesibilidad esté completamente implementada.
  - Las pruebas de accesibilidad deben incluir personas con discapacidades visuales, auditivas, motrices y cognitivas para asegurar que la plataforma sea inclusiva.

- Mensajes y notificaciones accesibles:
  - Todos los mensajes de la plataforma, como las notificaciones de confirmación de citas, deben ser accesibles, ya sea por medio de voz (para usuarios con discapacidad visual) o texto ampliado (para usuarios con discapacidad cognitiva).
  - Las alertas o notificaciones deben tener un comportamiento claro y ser fácilmente entendidas por todas las personas, incluidas aquellas con discapacidades.

- Documentación de accesibilidad:
  - La plataforma debe proporcionar documentación sobre cómo configurar y utilizar la aplicación de manera accesible, especialmente para pacientes con discapacidades, incluyendo guías para usuarios de tecnologías asistivas.

---

### HF-019: Chat
> **Como** fisioterapeuta,  
> **Quiero** tener acceso a un chat durante la videollamada con el paciente,  
> **Para** poder garantizar una comunicación fluida y eficiente en caso de problemas técnicos, aclaraciones o envío de indicaciones sin interrumpir la sesión verbalmente.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Acceso al chat durante la videollamada:
  - El fisioterapeuta debe tener acceso a un chat en tiempo real durante la videollamada con el paciente.
  - El chat debe estar claramente visible en la interfaz de la videollamada, sin interferir con la visualización de la sesión.

- Funcionalidad de chat:
  - El chat debe permitir enviar y recibir mensajes de texto sin retrasos significativos.
  - Los mensajes enviados a través del chat deben ser visibles para ambas partes (fisioterapeuta y paciente).
  - El chat debe ser privado, asegurando que solo el fisioterapeuta y el paciente puedan ver los mensajes intercambiados.

- Envío de archivos adjuntos:
  - El chat debe permitir el envío de archivos adjuntos (por ejemplo, documentos, imágenes o enlaces) para compartir indicaciones o material adicional relevante para el tratamiento.
  - Los archivos adjuntos deben poder ser visualizados correctamente por ambas partes.

- Notificación de nuevos mensajes:
  - Cuando se reciba un nuevo mensaje en el chat, el fisioterapeuta debe recibir una notificación visual (por ejemplo, un icono de mensaje o un cambio de color).
  - El fisioterapeuta debe poder configurar notificaciones de mensajes durante la videollamada para asegurarse de no perder ningún mensaje importante.

- Facilidad de uso y accesibilidad:
  - El diseño del chat debe ser intuitivo y fácil de usar, con la posibilidad de escribir, enviar y leer mensajes sin complicaciones.
  - El chat debe ser accesible a través de teclados y pantallas táctiles para facilitar su uso en diferentes dispositivos (móviles, tablets, ordenadores).

- Registro de conversaciones:
  - El chat debe mantener un historial de mensajes enviado durante la videollamada, permitiendo que tanto el fisioterapeuta como el paciente consulten los mensajes previos durante o después de la sesión.
  - El historial de mensajes debe estar disponible solo durante la sesión en curso y borrarse automáticamente una vez la videollamada termine (si así se ha especificado).

- Seguridad y privacidad:
  - La comunicación en el chat debe estar encriptada para garantizar la privacidad de los mensajes intercambiados entre el fisioterapeuta y el paciente.
  - Se deben cumplir todas las normativas de protección de datos aplicables (por ejemplo, GDPR) en el manejo de los mensajes y archivos.

- Pruebas de funcionamiento:
  - El chat debe ser probado en diferentes plataformas y dispositivos para garantizar su funcionamiento adecuado (ordenadores, dispositivos móviles, tablets, etc.).
  - Se debe realizar una prueba de rendimiento para verificar que el chat funciona sin problemas incluso durante videollamadas de alta calidad y con múltiples usuarios conectados simultáneamente.


---

## 2.4. HISTORIAS DE USUARIO PARA ROL ADMINISTRADOR

### HA-001: Administración de sistema  
> **Como** administrador,  
> **Quiero** poder gestionar los usuarios, fisioterapeutas, citas y configuración general del sistema,  
> **Para** asegurar el correcto funcionamiento del servicio y garantizar una buena experiencia tanto para los fisioterapeutas como para los pacientes.

**Comentarios**: 
- Se podría incluir un sistema de alertas para notificar al administrador sobre incidencias críticas. 
- Puede ser útil agregar roles con diferentes niveles de permisos dentro del panel de administración. 

**Criterios de aceptación**:
- Gestión de usuarios: 
  - Visualizar y administrar los perfiles de pacientes y fisioterapeutas. 
  - Activar, suspender o eliminar cuentas según las políticas de la plataforma. 
  - Gestionar solicitudes de verificación de fisioterapeutas. 
- Gestión de citas: 
  - Monitorear citas programadas, canceladas y completadas. 
  - Intervenir en disputas entre pacientes y fisioterapeutas si es necesario. 
- Gestión de pagos y suscripciones: 
  - Supervisar pagos realizados en la plataforma.
  - Administrar planes de suscripción (Fisio Blue y Fisio Gold).
  - Gestionar solicitudes de reembolsos o problemas de facturación. 
- Configuración general del sistema:
  - Modificar términos y condiciones de uso.
  - Configurar parámetros generales de la plataforma (horarios, políticas, etc.).
  - Administrar bases de datos de colegios y colegiados para la validación de fisioterapeutas.
- Gestión de contenido:
  - Administrar plantillas de test, cuestionarios y ejercicios.
  - Modificar información de ayuda, preguntas frecuentes y documentación. 
- Generación de reportes y análisis:
  - Generar reportes sobre la actividad de la plataforma (citas realizadas, cancelaciones, ingresos, etc.).
  - Analizar métricas de uso para mejorar la experiencia de los usuarios. 

---

### HA-002: Formación del equipo 
> **Como** administrador de la plataforma,  
> **Quiero** poder formar a mi equipo de desarrollo en las tecnologías decididas por el equipo de planificación,  
> **Para** asegurar un buen arranque del proyecto.

**Comentarios**: 
- MongoDB
- NextJS
- Django Rest 

**Criterios de aceptación**:

- Formación en MongoDB:
  - El equipo de desarrollo debe recibir formación completa sobre MongoDB, cubriendo los siguientes aspectos:
    - Fundamentos de bases de datos NoSQL y el modelo de datos de MongoDB.
    - Uso de colecciones, documentos y operaciones CRUD.
    - Implementación de índices y optimización de consultas.
    - Uso de herramientas como MongoDB Atlas para la gestión en la nube.
  - Los miembros del equipo deben ser capaces de realizar operaciones básicas y avanzadas en MongoDB.

- Formación en Next.js:
  - El equipo debe aprender a usar Next.js, con los siguientes enfoques:
    - Configuración y estructura de proyectos con Next.js.
    - Desarrollo de aplicaciones utilizando rutas y páginas dinámicas.
    - Uso de funciones como `getServerSideProps`, `getStaticProps`, y `getInitialProps` para la carga de datos.
    - Implementación de características como la optimización automática de imágenes, precarga de enlaces y manejo de SEO en páginas.
    - Integración con APIs para el consumo de datos dinámicos.
  - Al finalizar la formación, los miembros deben ser capaces de crear aplicaciones web utilizando Next.js de manera efectiva.

- Formación en Django Rest Framework:
  - El equipo debe recibir formación sobre Django Rest Framework (DRF) cubriendo:
    - Configuración de Django y DRF para la creación de API RESTful.
    - Uso de vistas y serializadores para convertir objetos de Python en formatos JSON.
    - Autenticación y permisos en API (por ejemplo, autenticación por token o JWT).
    - Implementación de filtros, paginación y validación en las APIs.
    - Pruebas de APIs y manejo de errores en DRF.
  - El equipo debe ser capaz de construir y mantener APIs RESTful con Django y DRF de manera eficiente.

- Evaluación y pruebas del aprendizaje:
  - Se deben realizar exámenes prácticos y pruebas de conocimiento después de cada sección de la formación.
  - Cada miembro del equipo debe completar un proyecto de ejemplo que integre MongoDB, Next.js y Django Rest para demostrar su comprensión de las tecnologías.
  
- Accesibilidad a recursos de formación:
  - El equipo debe tener acceso a documentación oficial, tutoriales, y videos de formación en línea sobre MongoDB, Next.js, y Django Rest.
  - Los recursos deben ser accesibles durante todo el proceso de desarrollo para facilitar la consulta.

- Soporte y seguimiento:
  - El administrador debe ofrecer sesiones de seguimiento para resolver dudas y problemas durante el aprendizaje.
  - Se debe crear un canal de comunicación donde los miembros del equipo puedan compartir problemas y soluciones.


---

### HA-003: Landing page  
> **Como** administrador de la plataforma,  
> **Quiero** poder disponer de una landing page para poder indexar en los motores de búsqueda, y que al iniciar sesión redirija a la plataforma,
> **Para** asegurar un buen posicionamiento en el SEO.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Página de aterrizaje (Landing Page):
  - La página de aterrizaje debe estar accesible sin necesidad de estar autenticado.
  - La página debe contener información relevante sobre los servicios de la plataforma Fisio Find (ventajas, funcionalidades, testimonios, etc.).
  - Debe incluir enlaces claros para el registro o inicio de sesión, así como un botón visible para redirigir a los usuarios hacia la plataforma principal.
  
- SEO y optimización:
  - La página debe estar optimizada para SEO, con metaetiquetas adecuadas (títulos, descripciones, palabras clave) que favorezcan su indexación en los motores de búsqueda.
  - La estructura HTML debe ser semánticamente correcta, asegurando la mejor indexación posible.
  - La landing page debe cargarse rápidamente para mejorar la experiencia del usuario y el posicionamiento en los motores de búsqueda.

- Redirección al iniciar sesión:
  - Cuando un usuario inicie sesión en la plataforma, debe ser redirigido automáticamente a la página principal de la plataforma.
  - El sistema debe verificar que el usuario haya iniciado sesión correctamente antes de redirigirlo.

- Accesibilidad y diseño:
  - La página de aterrizaje debe ser accesible para todos los usuarios, incluyendo aquellos con discapacidades, cumpliendo con las pautas WCAG.
  - El diseño debe ser responsivo, asegurando una visualización adecuada en dispositivos móviles y ordenadores de escritorio.

- Análisis de tráfico:
  - Se debe permitir la integración con herramientas de análisis de tráfico (por ejemplo, Google Analytics) para medir el rendimiento y la efectividad de la landing page.
  - El tráfico generado a través de la página debe ser rastreado y reportado al administrador.

- Contenido dinámico:
  - El contenido de la página debe poder actualizarse fácilmente desde el panel de administración (por ejemplo, cambios en los testimonios, promociones o novedades).
  - El administrador debe tener la opción de agregar nuevos contenidos y secciones sin la necesidad de intervención técnica.


---
