<!-- ---
title: "REPORTE DE IA DEL PPL (25/04/25) - (01/05/25)"
subtitle: "FISIO FIND - Grupo 6 - #PPL"
author: [Daniel Fernández Caballero, Daniel Ruiz López]
date: "01/05/2025"
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
header-left: "IA REPORT"
header-right: "01/05/2025"
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
--- -->

<!-- Imagen del logo (comentar al exportar a PDF) -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<!-- Título centrado -->
<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND - REPORTE DE IA PPL (25/04/25) - (01/05/25)
</h1>

<br>

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #PPL

- **Miembros del grupo:**
  Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García,  
  Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús,  
  Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco,  
  Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez,  
  Rafael Pulido Cifuentes.

- **Contribuidores:** [Daniel Fernández Caballero](https://github.com/DaniFdezCab) [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (autores)

- **Fecha de Creación:** 01/05/2025

- **Versión:** v1.0

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                                         | Descripción de los cambios                  |
|-----------|---------|-------------------------------------------------------|---------------------------------------------|
| 01/05/2025 | v1.0   | Daniel Fernández Caballero, Daniel Ruiz López                            | Elaboración de la primera versión del documento. |


---

## PROMPTS UTILIZADOS

A continuación se presentan los distintos prompts evaluados junto con sus respectivas puntuaciones, cantidad de prompts y porcentaje de alucinaciones.

1. **[Prompt 1](https://chatgpt.com/share/68061b21-4de8-8012-8853-e5e9830b96e0)**  
   - Puntuación: 2  
   - Prompts: 2  
   - Alucinaciones: 0% 

2. **[Prompt 2](https://chatgpt.com/share/68061b4b-aa60-8012-886a-1e8689fbc329)**  
   - Puntuación: 2  
   - Prompts: 1 
   - Alucinaciones: 0%

3. **[Prompt 3](https://chatgpt.com/share/68065efc-4cc4-8000-983f-e39d7c63fd06)**  
   - Puntuación: 4  
   - Prompts: 19  
   - Alucinaciones: 5%

4. **[Prompt 4](https://chatgpt.com/share/6807e612-c068-800f-ab18-76e13d1754fe)**  
   - Puntuación: 5  
   - Prompts: 41  
   - Alucinaciones: 12.2% 

5. **[Prompt 5](https://chatgpt.com/share/6808af8a-90c8-800f-af1f-ee54300054c7)**  
   - Puntuación: 3  
   - Prompts: 6
   - Alucinaciones: 50%

6. **[Prompt 6](https://chatgpt.com/share/6808c68b-7a14-800f-87fb-b063202ba1bb)**  
   - Puntuación: 5
   - Prompts: 14 
   - Alucinaciones: 0% 

7. **[Prompt 7](https://chatgpt.com/share/68090737-1724-800f-9c2d-9fb90da465f4)**  
   - Puntuación: 5  
   - Prompts: 11
   - Alucinaciones: 0% 

8. **[Prompt 8](https://chatgpt.com/share/6809219c-f980-800f-b9d8-7e6fdb99c0ec)**  
   - Puntuación: 5  
   - Prompts: 28
   - Alucinaciones: 35.7% 

9. **[Prompt 9](https://chatgpt.com/share/680a0a68-bb54-8012-8689-304014081579)**  
   - Puntuación: 3  
   - Prompts: 1
   - Alucinaciones: 20% 

10. **[Prompt 10](https://chatgpt.com/share/680f31f8-641c-800f-96c7-eea40445815b)**  
   - Puntuación: 5  
   - Prompts: 8
   - Alucinaciones: 25% 

11. **[Prompt 11](https://chatgpt.com/share/680f3217-78a8-800f-9a8b-bf1f7869943e)**  
   - Puntuación: 5  
   - Prompts: 3
   - Alucinaciones: 60% 

12. **[Prompt 12](https://chatgpt.com/share/680f40a9-7d10-8000-bdc1-d7c4b462d429)**  
   - Puntuación: 5  
   - Prompts: 4
   - Alucinaciones: 0% 

13. **[Prompt 13](https://chatgpt.com/share/6811dd95-2ebc-800f-862e-87fd5f51ad56)**  
   - Puntuación: 5  
   - Prompts: 16
   - Alucinaciones: 0% 

14. **[Prompt 14](https://chatgpt.com/share/680f48fb-3520-800f-90c0-e00b291de656)**  
   - Puntuación: 5  
   - Prompts: 13
   - Alucinaciones: 0% 

15. **[Prompt 15](https://chatgpt.com/share/6811f0ee-0f90-800f-8f28-d6339def4e20)**  
   - Puntuación: 5  
   - Prompts: 10
   - Alucinaciones: 60%


## ANÁLISIS ESTADÍSTICO

En esta sección, realizaremos un análisis estadístico completo basado en las puntuaciones, el número de prompts y el porcentaje de alucinaciones de los 15 casos documentados en este reporte. Calcularemos medidas como el promedio, la desviación estándar, la distribución y las correlaciones entre las variables, para luego extraer conclusiones sobre el desempeño de la IA en las consultas realizadas.

### Datos iniciales

Los datos a analizar son los siguientes:

- **Puntuaciones:** 2, 2, 4, 5, 3, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5  
- **Número de prompts:** 2, 1, 19, 41, 6, 14, 11, 28, 1, 8, 3, 4, 16, 13, 10  
- **Alucinaciones (%):** 0, 0, 5, 12.2, 50, 0, 0, 35.7, 20, 25, 60, 0, 0, 0, 60  

Estos valores corresponden a los 15 prompts evaluados, cada uno con su respectiva puntuación (escala de 1 a 5), cantidad de prompts utilizados y porcentaje de alucinaciones.

---

### Análisis de las puntuaciones

#### 1. Promedio (Media)

Para calcular el promedio de las puntuaciones, sumamos todos los valores y los dividimos entre el número total de casos, que es 15.

Suma de las puntuaciones:  
2 + 2 + 4 + 5 + 3 + 5 + 5 + 5 + 3 + 5 + 5 + 5 + 5 + 5 + 5 = 64  

Promedio:  
64 ÷ 15 ≈ 4.267  

El promedio de las puntuaciones es **4.267**. Esto indica un desempeño generalmente muy bueno en las consultas, aunque con algunas variaciones en la calidad percibida.

#### 2. Desviación estándar

La desviación estándar mide cuánto se alejan las puntuaciones del promedio. Primero calculamos la varianza.

##### Paso 1: Calcular la varianza

Restamos el promedio (4.267) a cada puntuación, elevamos al cuadrado, sumamos y dividimos entre 15:  
(2 - 4.267)² = 5.128489  
(2 - 4.267)² = 5.128489  
(4 - 4.267)² = 0.071289  
(5 - 4.267)² = 0.537289  
(3 - 4.267)² = 1.604489  
(5 - 4.267)² = 0.537289  
(5 - 4.267)² = 0.537289  
(5 - 4.267)² = 0.537289  
(3 - 4.267)² = 1.604489  
(5 - 4.267)² = 0.537289  
(5 - 4.267)² = 0.537289  
(5 - 4.267)² = 0.537289  
(5 - 4.267)² = 0.537289  
(5 - 4.267)² = 0.537289  
(5 - 4.267)² = 0.537289  

Suma de las diferencias al cuadrado:  
5.128489 + 5.128489 + 0.071289 + 0.537289 + 1.604489 + 0.537289 + 0.537289 + 0.537289 + 1.604489 + 0.537289 + 0.537289 + 0.537289 + 0.537289 + 0.537289 + 0.537289 = 19.463356  

Varianza:  
19.463356 ÷ 15 ≈ 1.297557  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√1.297557 ≈ 1.139  

La desviación estándar es aproximadamente **1.139**, indicando una dispersión moderada. Las puntuaciones muestran cierta variabilidad alrededor del promedio.

#### 3. Distribución de las puntuaciones

Contamos cuántas veces aparece cada valor:  
- 2: 2 veces (13.33%)  
- 3: 2 veces (13.33%)  
- 4: 1 vez (6.67%)  
- 5: 10 veces (66.67%)  

**Observación:** La puntuación dominante es 5 (66.67%), reflejando un desempeño mayoritariamente excelente, aunque la presencia de puntuaciones más bajas (2 y 3) indica algunas inconsistencias.

---

### Análisis del número de prompts

#### 1. Promedio (Media)

Sumamos todos los valores del número de prompts y dividimos entre 15.

Suma de los prompts:  
2 + 1 + 19 + 41 + 6 + 14 + 11 + 28 + 1 + 8 + 3 + 4 + 16 + 13 + 10 = 177  

Promedio:  
177 ÷ 15 = 11.8  

El promedio del número de prompts es **11.8**, sugiriendo interacciones de longitud moderada, aunque con variaciones significativas.

#### 2. Desviación estándar

##### Paso 1: Calcular la varianza

Restamos el promedio (11.8) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 15:  
(2 - 11.8)² = 96.04  
(1 - 11.8)² = 116.64  
(19 - 11.8)² = 51.84  
(41 - 11.8)² = 852.64  
(6 - 11.8)² = 33.64  
(14 - 11.8)² = 4.84  
(11 - 11.8)² = 0.64  
(28 - 11.8)² = 262.44  
(1 - 11.8)² = 116.64  
(8 - 11.8)² = 14.44  
(3 - 11.8)² = 77.44  
(4 - 11.8)² = 60.84  
(16 - 11.8)² = 17.64  
(13 - 11.8)² = 1.44  
(10 - 11.8)² = 3.24  

Suma:  
96.04 + 116.64 + 51.84 + 852.64 + 33.64 + 4.84 + 0.64 + 262.44 + 116.64 + 14.44 + 77.44 + 60.84 + 17.64 + 1.44 + 3.24 = 1709.44  

Varianza:  
1709.44 ÷ 15 ≈ 113.962667  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√113.962667 ≈ 10.675  

La desviación estándar es **10.675**, mostrando una dispersión alta debido al valor extremo de 41 prompts.

#### 3. Rango

- Mínimo: 1 prompt  
- Máximo: 41 prompts  
- Rango = 41 - 1 = 40  

**Observación:** El rango amplio y la alta desviación estándar reflejan una gran variabilidad en la longitud de las interacciones.

---

### Análisis de las alucinaciones

#### 1. Promedio (Media)

Sumamos los porcentajes de alucinaciones y dividimos entre 15:  
0 + 0 + 5 + 12.2 + 50 + 0 + 0 + 35.7 + 20 + 25 + 60 + 0 + 0 + 0 + 60 = 267.9  

Promedio:  
267.9 ÷ 15 ≈ 17.86  

El promedio de alucinaciones es **17.86%**, indicando un nivel moderado de error en promedio, influido por casos extremos.

#### 2. Desviación estándar

##### Paso 1: Calcular la varianza

Restamos el promedio (17.86) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 15:  
(0 - 17.86)² = 318.9796  
(0 - 17.86)² = 318.9796  
(5 - 17.86)² = 165.3796  
(12.2 - 17.86)² = 32.0356  
(50 - 17.86)² = 1032.4096  
(0 - 17.86)² = 318.9796  
(0 - 17.86)² = 318.9796  
(35.7 - 17.86)² = 317.1964  
(20 - 17.86)² = 4.5796  
(25 - 17.86)² = 51.1224  
(60 - 17.86)² = 1775.5844  
(0 - 17.86)² = 318.9796  
(0 - 17.86)² = 318.9796  
(0 - 17.86)² = 318.9796  
(60 - 17.86)² = 1775.5844  

Suma:  
318.9796 + 318.9796 + 165.3796 + 32.0356 + 1032.4096 + 318.9796 + 318.9796 + 317.1964 + 4.5796 + 51.1224 + 1775.5844 + 318.9796 + 318.9796 + 318.9796 + 1775.5844 = 7887.7496  

Varianza:  
7887.7496 ÷ 15 ≈ 525.849973  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√525.849973 ≈ 22.931  

La desviación estándar es **22.931**, indicando una dispersión alta, influida por valores extremos como 60% y 50%.

#### 3. Distribución de las alucinaciones

- 0%: 7 veces (46.67%)  
- 5%: 1 vez (6.67%)  
- 12.2%: 1 vez (6.67%)  
- 20%: 1 vez (6.67%)  
- 25%: 1 vez (6.67%)  
- 35.7%: 1 vez (6.67%)  
- 50%: 1 vez (6.67%)  
- 60%: 2 veces (13.33%)  

**Observación:** Casi la mitad de los casos no presentan alucinaciones (46.67%), pero valores altos (hasta 60%) afectan significativamente la percepción general de precisión.

---

### Relación entre variables

#### 1. Puntuaciones y número de prompts

- ∑x = 64, ∑y = 177, ∑xy = 2×2 + 2×1 + ... + 5×10 = 821, ∑x² = 302, ∑y² = 3229  
- r = [15 × 821 - 64 × 177] ÷ √{[15 × 302 - 64²] × [15 × 3229 - 177²]}  
- r = [12315 - 11328] ÷ √{[4530 - 4096] × [48435 - 31329]} ≈ 987 ÷ √{434 × 17106} ≈ 0.362  

**Resultado:** Correlación **0.362** (positiva moderada). Un mayor número de prompts tiende a estar asociado con puntuaciones más altas, aunque la relación no es fuerte.

#### 2. Puntuaciones y alucinaciones

- ∑x = 64, ∑y = 267.9, ∑xy = 2×0 + 2×0 + ... + 5×60 = 685, ∑x² = 302, ∑y² = 10379.73  
- r = [15 × 685 - 64 × 267.9] ÷ √{[15 × 302 - 64²] × [15 × 10379.73 - 267.9²]}  
- r = [10275 - 17146.56] ÷ √{[4530 - 4096] × [155695.95 - 71770.41]} ≈ -6871.56 ÷ √{434 × 83925.54} ≈ -0.359  

**Resultado:** Correlación **-0.359** (negativa moderada). Las alucinaciones tienden a reducir las puntuaciones, aunque la relación es menos fuerte de lo esperado.

#### 3. Número de prompts y alucinaciones

- ∑x = 177, ∑y = 267.9, ∑xy = 2×0 + 1×0 + ... + 10×60 = 2275.6, ∑x² = 3229, ∑y² = 10379.73  
- r = [15 × 2275.6 - 177 × 267.9] ÷ √{[15 × 3229 - 177²] × [15 × 10379.73 - 267.9²]}  
- r = [34134 - 47418.3] ÷ √{[48435 - 31329] × [155695.95 - 71770.41]} ≈ -13284.3 ÷ √{17106 × 83925.54} ≈ -0.111  

**Resultado:** Correlación **-0.111** (negativa débil). El número de prompts tiene una relación mínima con las alucinaciones.

---

### Tendencias y observaciones

1. **Puntuaciones:** Promedio de 4.267 y desviación de 1.139 reflejan un desempeño muy bueno, con una mayoría de puntuaciones altas (5), pero con casos de puntuaciones bajas (2 y 3) que indican inconsistencias.  
2. **Número de prompts:** Promedio de 11.8 y desviación de 10.675 muestran alta variabilidad, con un outlier (41), reflejando diferencias en la complejidad de las consultas.  
3. **Alucinaciones:** Promedio de 17.86% y desviación de 22.931 indican una precisión variable, con casos extremos (hasta 60%) que afectan la calidad percibida.  
4. **Relaciones:** Las alucinaciones tienen un impacto moderado en la reducción de puntuaciones (-0.359), mientras that un mayor número de prompts está ligeramente asociado con mejores puntuaciones (0.362). La relación entre prompts y alucinaciones es débil (-0.111).

---

### Conclusión del análisis estadístico

El análisis revela varios aspectos importantes sobre el desempeño de la IA:

1. **Calidad general:** Con un promedio de puntuaciones de 4.267 y una desviación estándar de 1.139, el sistema demuestra un rendimiento consistentemente alto, aunque con margen de mejora en casos específicos.

2. **Extensión de las interacciones:** La variabilidad en el número de prompts (promedio 11.8, desviación 10.675) refleja la flexibilidad del sistema para manejar tanto consultas simples como complejas. Las interacciones más extensas tienden a recibir mejores evaluaciones, posiblemente debido a la oportunidad de clarificar y refinar las respuestas.

3. **Control de alucinaciones:** El promedio de 17.86% en alucinaciones, con una desviación significativa de 22.931, señala un área de mejora importante. Es notable que casi la mitad de los casos no presentan alucinaciones, pero los casos con altos porcentajes (50-60%) requieren atención especial.

4. **Recomendaciones para mejora:**
   - Implementar estrategias específicas para reducir las alucinaciones en casos complejos
   - Fomentar interacciones más estructuradas y detalladas cuando sea necesario
   - Desarrollar mecanismos de verificación adicionales para los casos que muestran mayor propensión a errores
   - Investigar los patrones comunes en las consultas que generan puntuaciones más bajas


## Aprobado por  
**Scrum Master:** Antonio Macías Ferrera