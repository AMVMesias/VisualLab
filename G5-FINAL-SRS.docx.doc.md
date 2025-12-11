

|  |
| :---- |

**Especificación de requisitos de software**

**Proyecto:**   
Revisión 

| ![][image1] |  |   |
| :---: | :---: | ----: |

**Instrucciones para el uso de este formato**  
*Este formato es una plantilla tipo para documentos de requisitos del software.*

*Está basado y es conforme con el estándar IEEE Std 830-1998.*

*Las secciones que no se consideren aplicables al sistema descrito podrán de forma justificada indicarse como no aplicables (NA).*

*Notas:*  
*Los textos en color azul son indicaciones que deben eliminarse y, en su caso, sustituirse por los contenidos descritos en cada apartado.*

*Los textos entre corchetes del tipo “” permiten la inclusión directa de texto con el color y estilo adecuado a la sección, al pulsar sobre ellos con el puntero del ratón.*

*Los títulos y subtítulos de cada apartado están definidos como estilos de MS Word, de forma que su numeración consecutiva se genera automáticamente según se trate de estilos “Titulo1, Titulo2 y Titulo3”.*

*La sangría de los textos dentro de cada apartado se genera automáticamente al pulsar Intro al final de la línea de título. (Estilos Normal indentado1, Normal indentado 2 y Normal indentado 3).*

*El índice del documento es una tabla de contenido que MS Word actualiza tomando como criterio los títulos del documento.*  
*Una vez terminada su redacción debe indicarse a Word que actualice todo su contenido para reflejar el contenido definitivo.*

De la plantilla de formato del documento © & Coloriuris http://www.qualitatis.org  
.

**Ficha del documento**

| Fecha | Revisión | Autor | Verificado dep. calidad. |
| ----- | ----- | ----- | :---: |
|  |  |  |  |

Documento validado por las partes en fecha: 

| Por el cliente | Por la empresa suministradora |
| ----- | ----- |
|  |   |
| Fdo. D./ Dña  | Fdo. D./Dña  |

**Contenido**

**[FICHA DEL DOCUMENTO	3](#.)**

[**CONTENIDO	4**](#contenido)

[**1**	**INTRODUCCIÓN	6**](#heading=h.1t3peko7zuj)

[**1.1**	**Propósito	6**](#la-introducción-de-la-especificación-de-requisitos-de-software-\(srs\)-debe-proporcionar-una-vista-general-de-la-srs.-debe-incluir-el-objetivo,-el-alcance,-las-definiciones-y-acrónimos,-las-referencias,-y-la-vista-general-del-srs.)

[**1.2**	**Alcance	6**](#audiencia-a-la-que-va-dirigido)

[**1.3**	**Personal involucrado	6**](#heading=h.x5uwweln3bzy)

[**1.4**	**Definiciones, acrónimos y abreviaturas	6**](#heading=h.45rvb8exxeg)

[**1.5**	**Referencias	6**](#heading=h.g3ieg7gh1k2c)

[**1.6**	**Resumen	6**](#relación-completa-de-todos-los-documentos-relacionados-en-la-especificación-de-requisitos-de-software,-identificando-de-cada-documento-el-titulo,-referencia-\(si-procede\),-fecha-y-organización-que-lo-proporciona.)

[**2**	**DESCRIPCIÓN GENERAL	7**](#heading=h.l045o234vlcc)

[**2.1**	**Perspectiva del producto	7**](#heading=h.mhs769x8jluj)

[**2.2**	**Funcionalidad del producto	7**](#heading=h.qtn98nujx11n)

[**2.3**	**Características de los usuarios	7**](#heading=h.vkuh39j2y8ps)

[**2.4**	**Restricciones	7**](#heading=h.ohnx1d6ppu9v)

[**2.5**	**Suposiciones y dependencias	7**](#heading=h.603egsrr11om)

[**2.6**	**Evolución previsible del sistema	7**](#heading=h.7a79un2jze11)

[**3**	**REQUISITOS ESPECÍFICOS	7**](#heading=h.1zwsr0k0pvmv)

[**3.1**	**Requisitos comunes de los interfaces	8**](#la-distribución-de-los-párrafos-que-forman-este-punto-puede-diferir-del-propuesto-en-esta-plantilla,-si-las-características-del-sistema-aconsejan-otra-distribución-para-ofrecer-mayor-claridad-en-la-exposición.)  
[3.1.1	Interfaces de usuario	8](#heading=h.lowbvmxgr87f)  
[3.1.2	Interfaces de hardware	8](#describir-los-requisitos-del-interfaz-de-usuario-para-el-producto.-esto-puede-estar-en-la-forma-de-descripciones-del-texto-o-pantallas-del-interfaz.-por-ejemplo-posiblemente-el-cliente-ha-especificado-el-estilo-y-los-colores-del-producto.-describa-exacto-cómo-el-producto-aparecerá-a-su-usuario-previsto.)  
[3.1.3	Interfaces de software	8](#especificar-las-características-lógicas-para-cada-interfaz-entre-el-producto-y-los-componentes-de-hardware-del-sistema.-se-incluirán-características-de-configuración.)  
[3.1.4	Interfaces de comunicación	8](#definición-del-interfaz:-contiendo-y-formato)

[**3.2**	**Requisitos funcionales	8**](#heading=h.70998hogvh8j)  
[3.2.1	Requisito funcional 1	9](#heading=h.u614sshyilcu)  
[3.2.2	Requisito funcional 2	9](#requisito-funcional-2)  
[3.2.3	Requisito funcional 3	9](#requisito-funcional-3)  
[3.2.4	Requisito funcional n	9](#requisito-funcional-n)

[**3.3**	**Requisitos no funcionales	9**](#heading=h.7frxl9bia7yl)  
[3.3.1	Requisitos de rendimiento	9](#heading=h.4kgjp57z39f4)  
[3.3.2	Seguridad	9](#heading=h.598fjpmexx7u)  
[3.3.3	Fiabilidad	9](#heading=h.o65tojpb1pu3)  
[3.3.4	Disponibilidad	9](#heading=h.xlw44q415y87)  
[3.3.5	Mantenibilidad	10](#heading=h.ooioj7iydwz4)  
[3.3.6	Portabilidad	10](#heading=h.yt8l8km2gtpg)

[**3.4**	**Otros requisitos	10**](#uso-de-un-determinado-sistema-operativo.)

[**4**	**APÉNDICES	10**](#heading=h.rxlz31h15657)

1. **Introducción**

*La introducción de la Especificación de requisitos de software (SRS) debe proporcionar una vista general de la SRS. Debe incluir el objetivo, el alcance, las definiciones y acrónimos, las referencias, y la vista general del SRS.*

1. **Propósito**

* *Propósito del documento*  
* *Audiencia a la que va dirigido*

  2. **Alcance**

* *Identificación del producto(s) a desarrollar mediante un nombre*  
* *Consistencia con definiciones similares de documentos de mayor nivel (ej. Descripción del sistema) que puedan existir*

  3. **Personal involucrado**

| Nombre |  |
| :---- | :---- |
| Rol |  |
| Categoría profesional |  |
| Responsabilidades |  |
| Información de contacto |  |
| Aprobación |  |

*Relación de personas involucradas en el desarrollo del sistema, con información de contacto.*  
*Esta información es útil para que el gestor del proyecto pueda localizar a todos los participantes y recabar la información necesaria para la obtención de requisitos, validaciones de seguimiento, etc.*

4. **Definiciones, acrónimos y abreviaturas**

*Definición de todos los términos, abreviaturas y acrónimos necesarios para interpretar apropiadamente este documento. En ella se pueden indicar referencias a uno o más apéndices, o a otros documentos.*

| *Acronimo* |  |  |
| :---- | :---- | :---- |
| *SRI* | *Servicio de Rentas Internas* |  |
| *Mp* |  |  |
| *Avreviatura* |  |  |
| *No.* | *Número* |  |
|  | *Materia prima* |  |

5. **Referencias**

| Referencia | Titulo | Ruta | Fecha | Autor |
| ----- | ----- | ----- | ----- | ----- |
|  |  |  |  |  |
|  |  |  |  |  |

*Relación completa de todos los documentos relacionados en la especificación de requisitos de software, identificando de cada documento el titulo, referencia (si procede), fecha y organización que lo proporciona.*

6. **Resumen**

* *Descripción del contenido del resto del documento*  
* *Explicación de la organización del documento*

2. **Descripción general**

   1. **Perspectiva del producto**

*Indicar si es un producto independiente o parte de un sistema mayor. En el caso de tratarse de un producto que forma parte de un sistema mayor, un diagrama que sitúe el producto dentro del sistema e identifique sus conexiones  facilita la comprensión.*

2. **Funcionalidad del producto**

*Resumen de las funcionalidades principales que el producto debe realizar, sin entrar en información de detalle.*  
*En ocasiones la información de esta sección puede tomarse de un documento de especificación del sistema de mayor nivel (ej. Requisitos del sistema).*  
*Las funcionalidades deben estar organizadas de manera que el cliente o cualquier interlocutor pueda entenderlo perfectamente. Para ello se pueden utilizar métodos textuales o gráficos.*

3. **Características de los usuarios**

| Tipo de usuario |  |
| :---- | :---- |
| Formación |  |
| Habilidades |  |
| Actividades |  |

*Descripción de  los usuarios del producto, incluyendo nivel educacional, experiencia y experiencia técnica.*

4. **Restricciones**

*Descripción de aquellas limitaciones a tener en cuenta a la hora de diseñar y desarrollar el sistema, tales como el empleo de determinadas metodologías de desarrollo, lenguajes de programación, normas particulares, restricciones de hardware, de sistema operativo etc.*

5. **Suposiciones y dependencias**

*Descripción de aquellos factores que, si cambian, pueden afectar a los requisitos. Por ejemplo una asunción puede ser que determinado sistema operativo está disponible para el hardware requerido. De hecho, si el sistema operativo no estuviera disponible, la SRS debería modificarse*.

6. **Evolución previsible del sistema**

*Identificación de futuras mejoras al sistema, que podrán analizarse e implementarse en un futuro.*

3. **Requisitos específicos**

*Esta es la sección más extensa y más importante del documento.*   
*Debe contener una lista detallada y completa de los requisitos que debe cumplir el sistema a desarrollar. El nivel de detalle de los requisitos debe ser el suficiente para que el equipo de desarrollo pueda diseñar un sistema que satisfaga los requisitos y los encargados de las pruebas puedan determinar si éstos se satisfacen.*

*Los requisitos se dispondrán en forma de listas numeradas para su identificación, seguimiento, trazabilidad y validación (ej. RF 10, RF 10.1, RF 10.2,...).*

*Para cada requisito debe completarse la siguiente tabla:*

| Número de requisito |  |  |  |
| :---- | :---- | :---- | :---- |
| Nombre de requisito |  |  |  |
| Tipo | ☐ Requisito | ☐ Restricción |  |
| Fuente del requisito |  |  |  |
| Prioridad del requisito | ☐ Alta/Esencial | ☐ Media/Deseado | ☐ Baja/ Opcional |

*y realizar la descripción del requisito*

*La distribución de los párrafos que forman este punto puede diferir del propuesto en esta plantilla, si las características del sistema aconsejan otra distribución para ofrecer mayor claridad en la exposición.*

1. **Requisitos comunes de los interfaces**

*Descripción detallada de todas las entradas y salidas del sistema de software.*

1. **Interfaces de usuario**

   

   *Describir  los requisitos del interfaz de usuario para el producto. Esto puede estar en la forma de descripciones del texto o pantallas del interfaz. Por ejemplo posiblemente el cliente ha especificado el estilo y los colores del producto. Describa exacto cómo el producto aparecerá a su usuario previsto.*

   2. **Interfaces de hardware**

   

   *Especificar las características lógicas para cada interfaz entre el producto y los componentes de hardware del sistema. Se incluirán características de configuración.*

      3. **Interfaces de software**

   

   *Indicar si hay que integrar el producto con otros productos de software.*

   *Para cada producto de software debe especificarse lo siguiente:*

* *Descripción del producto software utilizado*  
* *Propósito del interfaz*  
* *Definición del interfaz: contiendo y formato*

  4. **Interfaces de comunicación**


  *Describir los requisitos del interfaces de comunicación si hay comunicaciones con otros sistemas y cuales son las protocolos de comunicación.*

  2. **Requisitos funcionales**

*Definición de acciones fundamentales que debe realizar el software al recibir información, procesarla y producir resultados.*   
*En ellas se incluye:*

* *Comprobación de validez de las entradas*  
* *Secuencia exacta de operaciones*  
* *Respuesta a situaciones anormales (desbordamientos, comunicaciones, recuperación de errores)*  
* *Parámetros*  
* *Generación de salidas*  
* *Relaciones entre entradas y salidas (secuencias de entradas y salidas, formulas para la conversión de información)*  
* *Especificación de los requisitos lógicos para la información que será  almacenada en base de datos (tipo de información, requerido)*

*Las requisitos funcionales pueden ser divididos en sub-secciones.*

1. **Requisito funcional 1**

   2. **Requisito funcional 2**

      3. **Requisito funcional 3**

      4. **Requisito funcional n**

   3. **Requisitos no funcionales**

      1. **Requisitos de rendimiento**

   

   *Especificación de los requisitos relacionados con la carga que se espera tenga que soportar el sistema. Por ejemplo, el número de terminales, el número esperado de usuarios simultáneamente conectados, número de transacciones por segundo que deberá soportar el sistema, etc.*

   *Todos estos requisitos deben ser mesurables. Por ejemplo, indicando “el 95% de las transacciones deben realizarse en menos de 1 segundo”, en lugar de “los operadores no deben esperar a que se complete la transacción”.*

      2. **Seguridad**

   

   *Especificación de elementos que protegerán al software de accesos, usos y sabotajes maliciosos, así como de modificaciones o destrucciones maliciosas o accidentales. Los requisitos pueden especificar:*

* *Empleo de técnicas criptográficas.*  
* *Registro de ficheros con “logs” de actividad.*  
* *Asignación de determinadas funcionalidades a determinados módulos.*  
* *Restricciones de comunicación entre determinados módulos.*  
* *Comprobaciones de integridad de información crítica.*

  3. **Fiabilidad**


  *Especificación de los factores de fiabilidad necesaria del sistema. Esto se expresa generalmente como el tiempo entre los incidentes permisibles, o el total de incidentes permisible.*

     4. **Disponibilidad**


  *Especificación de los factores de disponibilidad final exigidos al sistema. Normalmente expresados en % de tiempo en los que el software tiene que mostrar disponibilidad.*

     5. **Mantenibilidad**


  *Identificación del tipo de mantenimiento necesario del sistema.* 

  *Especificación de quien debe realizar las tareas de mantenimiento, por ejemplo usuarios, o un desarrollador.*

  *Especificación de cuando debe realizarse las tareas de mantenimiento. Por ejemplo, generación de estadísticas de acceso semanales y mensuales.*

     6. **Portabilidad**


  *Especificación de atributos que debe presentar el software para facilitar su traslado a otras plataformas u entornos. Pueden incluirse:*

* *Porcentaje de componentes dependientes del servidor.*  
* *Porcentaje de código dependiente del servidor.*  
* *Uso de un determinado lenguaje por su portabilidad.*  
* *Uso de un determinado compilador o plataforma de desarrollo.*  
* *Uso de un determinado sistema operativo.*

  4. **Otros requisitos**

*Cualquier otro requisito que no encaje en ninguna de las secciones anteriores.*

*Por ejemplo:*   
*Requisitos culturales y políticos*  
*Requisitos Legales*

4. **Apéndices**

*Pueden contener todo tipo de información relevante para la SRS pero que, propiamente, no forme parte de la SRS.*

[image1]: <data:image/png;base64,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>