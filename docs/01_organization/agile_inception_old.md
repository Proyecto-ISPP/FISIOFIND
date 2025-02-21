---
title: "AGILE INCEPTION"                                  # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "05/02/2025"                                        # CHANGE IF NEEDED
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
header-left: "AGILE INCEPTION"                            # CHANGE IF NEEDED
header-right: "05/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  AGILE INCEPTION
</h1>

<br>

**ÍNDICE**
- [**1. RESUMEN**](#1-resumen)
- [**2. PROBLEMA PRINCIPAL Y RELEVANCIA**](#2-problema-principal-y-relevancia)
- [**3. CONTEXTO Y CIRCUNSTANCIAS**](#3-contexto-y-circunstancias)
- [**4. NECESIDADES DEL PROYECTO**](#4-necesidades-del-proyecto)
- [**5. ARQUITECTURA SPL**](#5-arquitectura-spl)
  - [**5.1. CORE**](#51-core)
  - [**5.2. MÓDULOS EXTRA (ADDONS)**](#52-módulos-extra-addons)
  - [**5.3. FUERA DEL SCOPE**](#53-fuera-del-scope)
- [**6. USUARIOS OBJETIVO**](#6-usuarios-objetivo)
- [**Meet your Neighbours (La comunidad)**](#meet-your-neighbours-la-comunidad)
- [**7. MONETIZACIÓN**](#7-monetización)
- [**8. COSTE ESTIMADO**](#8-coste-estimado)
- [**9. IMPLEMENTACIÓN Y JUSTIFICACIÓN DE SPL**](#9-implementación-y-justificación-de-spl)
- [**10. IMPACTO ESPERADO**](#10-impacto-esperado)
- [**11. COMPETIDORES POTENCIALES**](#11-competidores-potenciales)
  - [**11.1. GVAM / SITUM**](#111-gvam--situm)
  - [**11.2. SMARTIFY**](#112-smartify)
  - [**11.3. EXPLORE - AMNH OFFICIAL APP**](#113-explore---amnh-official-app)
  - [**11.4. OTROS COMPETIDORES**](#114-otros-competidores)
- [**12. DIFERENCIACIÓN DEL PROYECTO**](#12-diferenciación-del-proyecto)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>


---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Ramón Gavira Sánchez, Daniel Vela Camacho, Delfín Santana Rubio

- **Fecha de Creación:** 04/02/2025  

- **Versión:** v1.4

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 04/02/2025 | v1.0    | Ramón Gavira Sánchez, Daniel Vela Camacho, Delfín Santana Rubio           | Elaboración de la primera versión del documento. |
| 05/02/2025 | v1.1    | Delfín Santana Rubio          | Desarrollo de apartados. |
| 06/02/2025 | v1.2    | Daniel Alors Romero           | Traspaso de documentación y corrección del formato. |
| 06/02/2025 | v1.3    | Delfín Santana Rubio        | Modificación de Tecnologías y Herramientas Clave y Monetización. |
| 06/02/2025 | v1.4  | Miguel Encina Martínez      | Corrección de errores ortográficos  |

<br>

<!-- \newpage -->

<br>

# **1. RESUMEN**

**FISIO FIND es una aplicación personalizada para museos que permite planificar rutas óptimas según el tiempo o las preferencias del visitante**. A diferencia de visitas guiadas en tiempo real o audioguías, ofrecemos un mapa digitalizado como grafo y recomendaciones inteligentes, optimizando cada recorrido. Es una solución escalable y adaptable a las necesidades de cada museo.

# **2. PROBLEMA PRINCIPAL Y RELEVANCIA**
El proyecto aborda la carencia de una herramienta digital generalizada que permita a los visitantes de museos planificar rutas óptimas basadas en criterios personalizados. La propuesta busca mejorar la experiencia del visitante y optimizar el tiempo dedicado en museos de gran tamaño o compleja estructura.

# **3. CONTEXTO Y CIRCUNSTANCIAS**
Esta solución está basada en el siguiente contexto:

- La mayoría de las personas llevan consigo dispositivos inteligentes (*smartphone*, *tablet*...).

- Las visitas a los museos pueden dificultarse dependiendo de las dimensiones y del aforo que este tenga.

- Los mapas se convierten en una herramienta fácilmente exportable a estructuras matemáticas como grafos en los que, mediante herramientas matemáticas, calcular rutas óptimas se convierte en algo sencillo.

La solución se basa en la estrategia **Software Product Line (SPL)** lo que permite ofrecer un conjunto de funcionalidades básicas (core) y módulos adicionales personalizables según los requisitos de cada museo.

<br>

<!-- \newpage -->

<br>


# **4. NECESIDADES DEL PROYECTO**
**¿Cómo se llegó a la necesidad de llevar a cabo el proyecto?**
Un miembro del grupo vivió esta problemática en primera persona durante su visita al *Museo del Louvre* en París, donde se sintió abrumado por las dimensiones y la cantidad de obras que tenía el museo, donde un simple mapa en papel no era suficiente para planificar una ruta adaptada a su tiempo y preferencias.


# **5. ARQUITECTURA SPL**

## **5.1. CORE** 

- Digitalización del mapa del museo:
    - Representación de las salas como nodos en un grafo interactivo, unidos con aristas con un peso (tiempo invertido por sala) y con obras en cada nodo (con sus conjuntos de metadatos que requiera el cliente).

- Sistema de creación de rutas:
    - Generación de rutas optimizadas en función de nodos, preferencias de los usuarios o tiempo disponible.

- Descripción de los nodos:
    - Cada sala tiene un listado de las obras presentes en dicha sala, y una descripción de dicha obra (No ofreceríamos la ficha técnica a priori).

- Gestión de los usuarios (No es una red social):
    - Marcar tus gustos (favoritos, que me gusta, que no me gusta).
    - Los usuarios se registran y pueden guardar sus rutas. 
    - Los usuarios pueden llevar el porcentaje de salas visitadas del museo (¡Incitamos a conseguir el 100%!).
    - En base a las rutas hechas, las salas visitadas, etc. ofrecemos una personalización aún mayor (las rutas de arriba pueden hacerse como usuario anónimo).
    - Crea tu propia ruta y genera un enlace para compartirse (como cuando compartes un mazo en el clash royale, no se sube a ningún foro).

- Administradores:
    - Rutas predeterminadas.
    - Fácil gestión de sus salas (modificar los nodos y las obras que tiene dentro).

## **5.2. MÓDULOS EXTRA (ADDONS)**

- Módulo Social:
    - Publicación de las rutas en un portal público.
    - Valoración y puntuación de rutas por otros usuarios.
    - Discusión (foro) por sala y obra.
    - Identificación de rutas más populares o menos recorridas.

- Módulos de anuncios oficiales:
    - Espacio para que el museo publique anuncios.
    - Log y anuncios de cambios en el museo (Esta obra pasa a X sala, nueva exposición X...).

- Módulos de integraciones propias:
    - Hemos llamado a este módulo así porque nos referimos a integrar cosas que ellos ya tienen, como por ejemplo, venta de entradas, colección de obras o una integración de una tienda.

- Módulo Trivia:
    - Para hacerlo más dinámico proponer un trivial de preguntas, foto y pregunta de cuál es esta obra...

## **5.3. FUERA DEL SCOPE**

- ❌ No es una audioguía o visita guiada.
- ❌ No es una visita virtual inmersiva ni con reconstrucción 3D.
- ❌ No es una aplicación que te ubique en tiempo real, más bien es para planificar.
- ❌ No gestiona el aforo o la afluencia del museo.

<br>

<!-- \newpage -->

<br>


# **6. USUARIOS OBJETIVO**
# **Meet your Neighbours (La comunidad)**

- Visitantes del museo:
    - Planifican rutas personalizadas basadas en su tiempo y preferencias.
    - Guardan rutas.
    - Almacenan % de museo visitado.
    - Reciben recomendaciones.

- Museos (administradores)
    - Gestionan el contenido del mapa digital, salas, obras y rutas predeterminadas.
    - Eligen sobre los módulos opcionales.
    - Quedamos abiertos a solicitudes que necesiten. (Como tenemos el core, somos escalables, si el addon no lo consideramos inicialmente).

- Desarrolladores
    - Mantener el core actualizado y eficiente, así como los addons predeterminados.
    - Implementar nuevas funcionalidades específicas para los requisitos de los museos.

# **7. MONETIZACIÓN**
Hemos decidido ofrecer un Software as a Service a partir de planes mensuales. Estos planes dependerán del tamaño del museo. A partir de una investigación hemos podido recopilar los siguientes datos sobre algunos museos:
- Bellas artes: 14 salas, 7,775 m<sup>2</sup>
- Louvre: cerca de 300 salas, 210,000 m<sup>2</sup>
- Museo Nacional Centro de Arte Reina Sofía: 84,048 m<sup>2</sup>

Las fuentes de estos datos son planos oficiales de los museos o consultadas directamente desde *Wikipedia*.

A partir de estos datos, en un primer momento hemos decidido ofrecer los siguientes planes para las entidades privadas:

- **Menos de 14 salas** (14 salas NO incluido): **200 euros** mensuales + componentes no incluidos elegidos.
  - Incluye el core más 2 componentes extra.
  - Cada componente extra elegido suma 50 euros al precio mensual.

- **Entre 14 y 30 salas**: **300 euros** mensuales + componentes no incluidos elegidos.
  - Incluye el core más 1 componente extra.
  - Cada componente extra elegido suma 100 euros al precio mensual.

- **Entre 30 y 50 salas**: **500 euros** mensuales + componentes no incluidos elegidos.
  - Incluye solo el core.
  - Cada componente extra elegido suma 200 euros al precio mensual.

- **Más de 50 salas**: deben de contactar con nosotros para ofrecer una solución o precio personalizado.

Sin embargo, si hiciera falta participar en concurso público para dar nuestros servicios, el plan y de este modo el contrato se deberá de hacer a medida. Asimismo, el precio y las condiciones serían a medida.

# **8. COSTE ESTIMADO** 
Haced una estimación de las horas que vamos a hacer (10h semanales x semanas x 17 personas x X€/hora).

# **9. IMPLEMENTACIÓN Y JUSTIFICACIÓN DE SPL**

**Qué vamos a hacer nosotros (Por qué un SPL)**

Integraremos una versión con el CORE con datos de prueba, optamos por el SPL porque queremos ofrecer un servicio personalizado a cada cliente. 

Como primer cliente ficticio usaremos los datos del Louvre, que son públicos para demostrar todas las capacidades de FISIO FIND como solución software.

**Tecnologías y Herramientas Clave**

- Dispositivos móviles

- SPL

- React Native

- Django

- PostgreSQL

# **10. IMPACTO ESPERADO**

- Mejora de la satisfacción del visitante al permitirle optimizar su recorrido.

- Reducción del tiempo perdido buscando obras o salas específicas.

- Posibilidad de que los museos monitoreen patrones de comportamiento y ajusten la oferta de rutas o exposiciones en base a los datos recolectados.

- Mayor flexibilidad para los museos, que podrán personalizar la aplicación con módulos según sus necesidades sin afectar al core del sistema.

# **11. COMPETIDORES POTENCIALES**

## **11.1. GVAM / SITUM**

**Puntos fuertes:**

1. Situm ofrece la geolocalización dentro del establecimiento mediante una tecnología innovadora (*Indoor Maps*), para poder localizar determinados elementos dentro del recinto.

2. GVAM ofrece soluciones software a los museos donde poder incluir audioguías, recomendadores de contenido, ayudas de ubicación y recreaciones virtuales:
    - Ofrece servicios adicionales como posibles actividades de entretenimiento antes y después de la visita (hoteles, restaurantes).
    - También ofrece soluciones para poder gestionar y actualizar guías interactivas.
    - Ofrece audioguías completas relativas a una ruta, ya sea determinada por ellos o por el propio museo.

**Monetización:**  
- Parece ofrecer soluciones personalizadas a los diferentes museos interesados en servicios y mejoras específicas.

---

## **11.2. SMARTIFY**

**Puntos fuertes:**

1. Aplicación donde se pueden adquirir entradas para una gran cantidad de museos o puntos culturales.

2. Ofrece audioguías de muchos museos, tanto gratuitas como de pago.

3. Tiene una sección de recomendaciones de exposiciones temporales, guías de arte por época y obras destacadas cercanas al usuario.

4. Ofrece una tienda de *merchandising* relacionado con el arte.

5. Dispone de un sistema de búsqueda por el nombre de la obra o autor, y muestra en qué museo se encuentra, con redirección para comprar las entradas.

6. Identifica obras de arte online.

**Monetización:**  

- Venta de entradas, acordada mediante un modelo de *split* económico con los museos.  

- Venta de productos de *merchandising*.

---

## **11.3. EXPLORE - AMNH OFFICIAL APP**

**Puntos fuertes:**

1. Es la aplicación oficial del museo.

2. Tiene un mapa digitalizado interactivo del plano del museo, incluyendo puntos de interés y obras.

3. Cuenta con un sistema de geolocalización dentro del museo: Sistema para localizar elementos como parkings, estaciones, cargadores, escaleras y ascensores, guiando al usuario mediante un sistema similar a un GPS.

4. Incluye la opción de comprar entradas y gestionar las membresías del museo.

5. Sistema de preferencias de obras para priorizar la información mostrada en el mapa interactivo.

6. Sección de información general del museo: entradas, horarios, etc.

7. Configuración para limitar recursos como notificaciones, uso de la ubicación, etc.

8. Sistema de feedback anónimo sobre la experiencia del usuario.

9. Para cada obra ofrece información y una sección interactiva con datos curiosos en forma de trivias.

**Monetización:**

- Al ser una aplicación propia del museo, la monetización proviene directamente de la venta de entradas y membresías a través de la aplicación.

---

## **11.4. OTROS COMPETIDORES**

Existen numerosas aplicaciones que ofrecen guías de visita estáticas de museos específicos, algunas con mapas breves o rutas predefinidas establecidas por el creador. En general, estas rutas no se generan dinámicamente según los intereses y el tiempo del usuario. También hay aplicaciones que recopilan obras de arte de varios museos, y algunas incluyen audioguías limitadas.

- [Muchas de las aplicaciones dirigidas a museos](https://evemuseografia.com/2023/12/30/mejor-software-para-museos-en-2023/): Se basan simplemente en gestión de inventario/ventas/visitantes:
    - [Coeli](https://www.coeli.cat/es/): Gestión de colecciones.
    - [Booking kit](https://bookingkit.com/es/industry/museos/): Venta de entradas.
    - [Intuiface](https://es.intuiface.com/museums-digital-signage): Para pantallas táctiles estáticas.

- [Rotas Art](https://www.rotas.com):
    - Tiene cierta personalización de la ruta. 
    - Obtiene todos los datos de las obras.
    - La funcionalidad del mapa no parece la más desarrollada.

- [Museo altamira](https://play.google.com/store/apps/details?id=com.gvam.altamira&hl=es): Es solo de altamira.

- [tuinbit](https://tuinbit.com/app-de-audioguias-para-museos/): 
    - Todo incluido pero solo audioguías.
    - Tiene funcionalidad de anuncios.

- [Museos virtuales](https://ecobnb.es/blog/2021/07/museos-virtuales-mundo-online-visitar-gratis/) y [Google Arts](https://www.juntadeandalucia.es/organismos/culturaydeporte/areas/cultura/museos-arte/vistas-virtuales.html): Permite visitas virtuales pero parece no dejar crear rutas.

# **12. DIFERENCIACIÓN DEL PROYECTO**

**Elementos a Tener en Cuenta:**
- No parece existir un monopolio o una competencia con un gigantesco nivel técnico o de influencia en el sector.

- **FISIO FIND** se encuadra en el sector **Service and Innovation** (similar a *Netflix*).

**Razones por las cuales no pertenecemos a los otros modelos:**
- No somos una aplicación basada en el *matchmaking* como Airbnb o Uber, ya que no conectamos personas para satisfacer servicios específicos.

- No es un proyecto de servicio que utilice la monetización basada en los datos de los usuarios, como *LinkedIn*.

**Razones por las cuales nos parecemos a Netflix:**
- ✔ Es un servicio digital innovador que mejora la experiencia del usuario dentro del museo.  

- ✔ Su valor está en la optimización de rutas personalizadas y la digitalización del museo.  

- ✔ No monetizamos a los usuarios finales como LinkedIn, sino que vendemos directamente la solución a los museos como un servicio adaptable.


