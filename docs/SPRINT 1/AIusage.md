---
title: "REPORTE DE IA DEL SPRINT 1"
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 1"
author: ["Daniel Ruiz López", "Daniel Fernández Caballero"]
date: "12/03/2025"
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../../.backgrounds/background4V.pdf"
header-left: "IA REPORT S1"
header-right: "12/03/2025"
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- Imagen del logo (comentar al exportar a PDF) -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<!-- Título centrado -->
<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND - REPORTE DE IA DEL SPRINT 1
</h1>

<br>

## **Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND  
- **Número de Grupo:** Grupo 6  
- **Entregable:** #SPRINT 1
- **Miembros del grupo:**  
  Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García,  
  Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús,  
  Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco,  
  Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez,  
  Rafael Pulido Cifuentes.  
- **Autores:** Daniel Fernández Caballero (autor), Antonio Macías Ferrera (revisor)
- **Fecha de Creación:** 12/03/2025  
- **Versión:** v1.1  

---

## Histórico de Modificaciones

| Fecha      | Versión | Realizada por                                         | Descripción de los cambios                  |
|-----------|---------|-------------------------------------------------------|---------------------------------------------|
| 12/03/2025 | v1.0   | Daniel Fernández Caballero                            | Elaboración de la primera versión del documento. |
| 13/03/2025 | v1.1   | Antonio Macías Ferrera                             | Revisión y correcciones ortográficas |


---

## INTRODUCCIÓN

Para el primer Sprint, tras la revisión intermedia del trabajo, se decidió implementar métricas cuantitativas para evaluar la efectividad de la IA en función de los prompts utilizados. Las métricas establecidas son las siguientes:

- **Calificación de conversaciones** (escala de 1 a 5).
- **Cantidad de prompts** empleados en cada conversación.
- **Análisis estadístico** de estos datos, incluyendo promedio, desviación estándar y tendencias.

Además, debido a la rectificación del equipo respecto a las métricas, se realizará una diferenciación entre los prompts utilizados en la primera y la segunda semana.

En general, todos los integrantes se han ceñido al **_ia commitment_**, utilizando a la ia siempre con finalidades éticas y revisando sus resultados para siempre tener una última revisión humana.

## PROMPTS UTILIZADOS EN LA PRIMERA SEMANA

A continuación, se listan los diferentes prompts utilizados en esta primera fase del Sprint 1,  organizados por categoría para una mejor comprensión.  

### General  
- [Saber si los prompts del chat de GitHub Copilot en Visual Studio se pueden compartir de la misma manera que estos prompts](https://chatgpt.com/share/67b9bf4e-03a8-800b-9569-ad5fd7858d71)  
- [Obtener una traducción al español de los puntos clave sobre la matriz RACI en gestión de proyectos](https://chatgpt.com/share/67ba070e-b540-8011-9feb-e8fa4fbd9e36)  
- [Obtener la descripción de los roles de cada categoría en la matriz RACI: Responsable, Aprobador, Consultado e Informado](https://chatgpt.com/share/67ba070e-b540-8011-9feb-e8fa4fbd9e36)  

### Desarrollo en Django  
- [Dudas sobre modelos de datos y Serializer en Django](https://chatgpt.com/share/67b9dac9-1538-800b-b896-d1eb1c62425b)  
- [Recomendaciones CRUD de AppUser](https://chatgpt.com/share/67b9dac9-1538-800b-b896-d1eb1c62425b)  
- [Migraciones en Django](https://chatgpt.com/share/67bafd0b-5b50-8011-8fd7-3f53fc2d4366)  
- [Pregunta sobre validaciones automáticas en Django REST Framework (DRF)](https://chatgpt.com/share/67c5f644-2410-8011-882a-d12c9dc9d593)  
- [Dudas sobre parámetros de modelos en Django REST Framework](https://chatgpt.com/share/67c1ef78-54b0-800b-b90d-ccca58d41de2)  
- [Saber dónde y cómo configurar las rutas en el frontend de un proyecto con Django REST Framework](https://chatgpt.com/share/67c95092-3b20-800f-9211-b54b90289720)  

### Desarrollo Web y Frontend  
- [Interfaz en TypeScript](https://chatgpt.com/share/67c451fe-d098-8011-9c58-e030bbbc134d)  
- [Funcionalidades y estilos de FullCalendar](https://chatgpt.com/share/67c451fe-d098-8011-9c58-e030bbbc134d)  
- [Aplicación de estilos en frontend](https://chatgpt.com/share/67c6c55d-698c-8009-aa43-43d812ab5e80)  

### Infraestructura y Herramientas  
- [Saber cómo hacer que una plantilla de pull request aparezca automáticamente al crear una en GitHub](https://chatgpt.com/share/67bda80f-1a9c-8012-97e6-c8ce7676c086)  
- [Corrección de error de actualización de Node.js](https://chatgpt.com/share/67c83eb2-d6f4-8012-b520-99b41154b950)  

### Documentación y Revisión  
- [Obtener faltas de ortografía de un documento](https://chatgpt.com/share/67bc28d7-011c-8012-bcba-c9df94e09eea)  
- [Reformular mensajes manteniendo la idea](https://chatgpt.com/share/67c2195d-4320-8000-a228-50367005027a)  
- [Sugerencias en el UML](https://chatgpt.com/share/67bdbc53-13e0-8012-8e11-764db244f985)  
- [Obtener sugerencias sobre qué epígrafes añadir a una plantilla de reuniones](https://chatgpt.com/share/67bf4ce6-cbb4-8011-94ce-6c2635225c86)  

### Datos y Base de Datos  
- [Borrar todas las tablas de la base de datos](https://chatgpt.com/share/67bc28d7-011c-8012-bcba-c9df94e09eea)  
- [Obtener una guía sobre cómo crear un archivo con datos de prueba para poblar una base de datos PostgreSQL](https://chatgpt.com/share/67c6c7f6-df24-800b-bfeb-03d7440bce64)  
- [Generar un archivo JSON con datos de prueba para poblar la base de datos](https://chatgpt.com/share/67c6c7f6-df24-800b-bfeb-03d7440bce64)  

---

## Prompts Utilizados Tras la Revisión del Sprint 1

A continuación se presentan los distintos prompts evaluados junto con sus respectivas puntuaciones:

1. **[Prompt 1](https://chatgpt.com/share/67cc57f9-72bc-8012-a3a4-79366576edfc)**
   - Puntuación: 4
   - Prompts: 5

2. **[Prompt 2](https://chatgpt.com/share/67cd7418-3028-800b-a982-db0054a2ac5c)**
   - Puntuación: 2
   - Prompts: 4

3. **[Prompt 3](https://chatgpt.com/share/67cc189e-627c-800b-8672-e9f17c2ce9b3)**
   - Puntuación: 4
   - Prompts: 5

4. **[Prompt 4](https://chatgpt.com/share/67cdb636-729c-8011-a655-60ab22ce97cd)**
   - Puntuación: 5
   - Prompts: 4

5. **[Prompt 5](https://chatgpt.com/share/67cdd84d-e9f0-8000-9b8d-79a97763f334)**
   - Puntuación: 4
   - Prompts: 19

6. **[Prompt 6](https://chatgpt.com/share/67cde9d6-8f9c-8011-b824-e23c14838d80)**
   - Puntuación: 5
   - Prompts: 23

7. **[Prompt 7](https://grok.com/share/bGVnYWN5_9591ccf9-4679-4a92-ae5c-2724a8f1f041)**
   - Puntuación: 5
   - Prompts: 15

8. **[Prompt 8](https://claude.ai/share/f571d3bd-6073-4280-be82-7ffe211cb30c)**
   - Puntuación: 5
   - Prompts: 3

9. **[Prompt 9](https://chatgpt.com/share/67cec6d5-300c-800b-968d-ab02cd099ae3)**
   - Puntuación: 5
   - Prompts: 2

10. **[Prompt 10](https://chatgpt.com/share/67d06759-22c0-8004-84ea-9babe0017b77)**
    - Puntuación: 5
    - Prompts: 10

11. **[Prompt 11](https://chatgpt.com/share/67d0b466-6824-8000-b53e-c4b2267f40f4)**
    - Puntuación: 1
    - Prompts: 5

12. **[Prompt 12](https://chatgpt.com/share/67d0b47f-2b74-8000-9f32-09b9b42de3af)**
    - Puntuación: 2
    - Prompts: 2

13. **[Prompt 13](https://chatgpt.com/share/67d0b491-ccf8-8000-bb76-87ce1d647516)**
    - Puntuación: 2
    - Prompts: 4

14. **[Prompt 14](https://chatgpt.com/share/67d0b49d-6b98-8000-999d-91b2638eddee)**
    - Puntuación: 1
    - Prompts: 2

15. **[Prompt 15](https://claude.ai/share/21030b3a-414f-4a43-903a-b45dc0ce0055)**
    - Puntuación: 0
    - Prompts: 4

16. **[Prompt 16](https://claude.ai/share/c4405a3f-0b1b-4865-baa8-1017eed1cf36)**
    - Puntuación: 5
    - Prompts: 7

17. **[Prompt 17](https://chatgpt.com/share/67d0b7e5-5100-800b-b121-b423dfcc199c)**
    - Puntuación: 2
    - Prompts: 6

18. **[Prompt 18](https://chatgpt.com/share/67d0b84c-6e7c-800b-a709-8cd64c13c4de)**
    - Puntuación: 3
    - Prompts: 13

19. **[Prompt 19](https://chatgpt.com/share/67d0b894-5244-800b-96bf-07c44076c360)**
    - Puntuación: 5
    - Prompts: 6

20. **[Prompt 20](https://chatgpt.com/share/67d13c6a-7fb8-800b-9354-0784857a067c)**
    - Puntuación: 5
    - Prompts: 4

## Análisis estadístico

### Datos iniciales

Los datos a analizar son los siguientes: 

- Puntuaciones: 4, 2, 4, 5, 4, 5, 5, 5, 5, 5, 1, 2, 2, 1, 0, 5, 2, 3, 5, 5
- Número de prompts: 5, 4, 5, 4, 19, 23, 15, 3, 2, 10, 5, 2, 4, 2, 4, 7, 6, 13, 6, 4

### Análisis de las puntuaciones

#### 1. Promedio (Media)

Para calcular el **promedio** de las puntuaciones, sumamos todos los valores y los dividimos entre el número total de casos (20):

$$
\text{Promedio} = \frac{70}{20} = 3.5
$$

 
El promedio de las puntuaciones es **3.5**, lo que indica que, en general, las puntuaciones están por encima del punto medio de la escala (2.5 en una escala de 0 a 5).

#### 2. Desviación estándar

La **desviación estándar** mide la dispersión de las puntuaciones respecto al promedio. Para calcularla, primero necesitamos la **varianza**.

##### Paso 1: Calcular la varianza

Restamos el promedio (3.5) a cada puntuación, elevamos esa diferencia al cuadrado, sumamos todos esos valores y dividimos entre el número total de casos (20).

$$
\text{Varianza} = \frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n}
$$

Aplicando esta fórmula a nuestros datos:
$$
\text{Varianza} = \frac{54.5}{20} = 2.725
$$

##### Paso 2: Calcular la desviación estándar

La **desviación estándar** es la raíz cuadrada de la varianza:

$$
\sqrt{2.725} \approx 1.65
$$

La desviación estándar es aproximadamente **1.65**, lo que significa que las puntuaciones tienden a variar en promedio **1.65 puntos** alrededor de la media de 3.5, lo que indica una dispersión moderada.

#### 3. Distribución de las puntuaciones

Veamos cómo se distribuyen las puntuaciones contando cuántas veces aparece cada valor:

- 0: 1 vez (5%)
- 1: 2 veces (10%)
- 2: 5 veces (25%)
- 3: 1 vez (5%)
- 4: 4 veces (20%)
- 5: 7 veces (35%)

Observación: La puntuación más común es 5, que aparece en un 35% de los casos, seguida de 2 con un 25%. Las puntuaciones altas (4 y 5) suman el 55% del total, lo que sugiere un desempeño generalmente bueno. Sin embargo, también hay un 40% de puntuaciones bajas (0, 1 y 2), lo que indica cierta polarización en los resultados.


### Análisis de las puntuaciones


#### 1. Promedio (Media)

Para calcular el **promedio** del número de prompts, sumamos todos los valores y los dividimos entre el número total de casos (20):

$$
\text{Promedio} = \frac{143}{20} = 7.15
$$

El promedio del número de prompts es **7.15**, lo que indica que, en promedio, cada caso tiene alrededor de 7 prompts, aunque existe una gran variación en los datos.

#### 2. Desviación estándar

La **desviación estándar** mide la dispersión de los valores respecto al promedio. Para calcularla, primero necesitamos la **varianza**.

##### Paso 1: Calcular la varianza

Restamos el promedio (7.15) a cada valor, elevamos esa diferencia al cuadrado, sumamos todos esos valores y dividimos entre el número total de casos (20).

$$
\text{Varianza} = \frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n}
$$

Aplicando esta fórmula a nuestros datos:

$$
\text{Varianza} = \frac{669.55}{20} = 33.4775
$$

##### Paso 2: Calcular la desviación estándar

La **desviación estándar** es la raíz cuadrada de la varianza:

$$
\sqrt{33.4775} \approx 5.79
$$

La desviación estándar es aproximadamente **5.79**, lo que indica que los valores tienden a variar en promedio casi **6 puntos** alrededor de la media de 7.15, lo que refleja una dispersión bastante alta.

#### 3. Rango

El **rango** nos da una idea de la amplitud de los datos:

- **Mínimo**: 2 prompts
- **Máximo**: 23 prompts

$$
\text{Rango} = 23 - 2 = 21
$$

El número de prompts varía considerablemente, desde interacciones muy cortas (2 prompts) hasta interacciones largas (23 prompts). La alta desviación estándar de **5.79** confirma esta gran dispersión en los datos.

### Relación entre puntuaciones y número de prompts

Queremos saber si hay alguna relación entre el número de prompts y las puntuaciones. Para esto, calculamos el coeficiente de correlación de Pearson, que mide si las dos variables tienden a moverse juntas y en qué grado.

#### Paso 1: Calcular los productos cruzados y sumas necesarias

Suma de puntuaciones (∑x) = 70  
Suma de prompts (∑y) = 143  
Suma del producto de puntuaciones y prompts (∑xy) = 564  
Suma de puntuaciones al cuadrado (∑x²) = 304  
Suma de prompts al cuadrado (∑y²) = 1417

#### Paso 2: Aplicar la fórmula de Pearson

La fórmula es:

$$
r = \frac{n \times \sum{xy} - \sum{x} \times \sum{y}}{\sqrt{(n \times \sum{x^2} - (\sum{x})^2) \times (n \times \sum{y^2} - (\sum{y})^2)}}
$$

Sustituyendo los valores:

$$
r = \frac{20 \times 564 - 70 \times 143}{\sqrt{(20 \times 304 - 70^2) \times (20 \times 1417 - 143^2)}}
$$

$$
r = \frac{11280 - 10010}{\sqrt{(6080 - 4900) \times (28340 - 20449)}}
$$

$$
r = \frac{1270}{\sqrt{1180 \times 7891}} = \frac{1270}{\sqrt{9311338}} \approx \frac{1270}{3051.45} \approx 0.416
$$


El coeficiente de correlación es aproximadamente **0.42**.

Un valor de **0.42** indica una correlación positiva moderada. Esto significa que, en general, a medida que aumenta el número de prompts, las puntuaciones tienden a ser más altas, pero la relación no es muy fuerte. Hay otros factores en juego.


## Conclusiones

1. **Desempeño positivo pero polarizado**: La mayoría de las puntuaciones son altas, pero una porción significativa de resultados es insatisfactoria, sugiriendo que hay inconsistencias en la calidad de las interacciones.
2. **Correlación moderada**: Hay una relación moderada entre el número de prompts y las puntuaciones, pero no siempre más prompts generan mejores resultados.
3. **Diversidad en interacciones**: Las interacciones varían considerablemente en la cantidad de prompts, mostrando una alta dispersión y sin un patrón uniforme.
4. **Variabilidad en puntuaciones**: Aunque predominan las puntuaciones altas (4 y 5), existe una dispersión notable en los resultados.

## Recomendaciones

1. **Optimizar la calidad de los prompts**: Focalizarse en la claridad y efectividad de cada prompt más que en su cantidad.
2. **Ajustar el número de prompts**: Personalizar la cantidad de prompts según el caso, evitando interacciones innecesarias o excesivamente largas.
3. **Investigar excepciones**: Estudiar los casos en los que pocos prompts obtienen puntuaciones altas para identificar factores clave.

## Aprobado por  
**Scrum Master:** Antonio Macías Ferrera