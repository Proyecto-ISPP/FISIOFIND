import logging
import os
import time
import unicodedata
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import undetected_chromedriver as uc

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Configurar el logger
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",  # Cambia esta ruta según tus necesidades
    filemode="a"
)

class SeleniumScraper:

    def __init__(self):
        logging.info("Inicializando SeleniumScraper")
        if os.getenv("DEBUG") == "True":
            options = webdriver.ChromeOptions()
            options.add_argument("--headless")  # Ejecutar en segundo plano
            options.add_argument("--no-sandbox")
            options.add_argument("--enable-javascript")  # Asegurar que JS está habilitado
            options.add_argument("--disable-dev-shm-usage")
            self.driver = webdriver.Chrome(
                service=Service(executable_path=ChromeDriverManager().install()),
                options=options
            )
            logging.info("SeleniumScraper inicializado en modo DEBUG")
        else:
            options = uc.ChromeOptions()
            options.headless = True  # Ejecutar en segundo plano
            options.add_argument("--no-sandbox")
            options.add_argument("--enable-javascript")  # Asegurar que JS está habilitado
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--disable-dev-shm-usage")
            options.binary_location = "/usr/bin/chromium-browser"
            self.driver = uc.Chrome(options=options, version_main=135)  # Usamos undetected-chromedriver
            logging.info("SeleniumScraper inicializado en modo producción con undetected-chromedriver")

    def obtener_colegiado(
        self, valorBusqueda: str, url: str, xpath: str, loadTime: int = 2, general: str = None
    ) -> BeautifulSoup:
        logging.info("Accediendo a la URL: %s", url)
        self.driver.get(url)
        time.sleep(loadTime)  # Esperar que cargue la página

        if "murcia" in url:
            try:
                num_sort = self.driver.find_element(By.XPATH, '//*[@id="myTable"]/thead/tr/th[3]')
                num_sort.click()
                logging.debug("Click en ordenación realizado en la página de Murcia")
            except Exception as e:
                logging.error("Error al hacer click en ordenación en Murcia: %s", e, exc_info=True)

        if general == "navarra":
            try:
                select = self.driver.find_element(By.XPATH, '//*[@id="colegio"]/option[16]')
                select.click()
                logging.debug("Seleccionado elemento para Navarra")
            except Exception as e:
                logging.error("Error al seleccionar opción para Navarra: %s", e, exc_info=True)

        if general == "canarias":
            try:
                select = self.driver.find_element(By.XPATH, '//*[@id="colegio"]/option[6]')
                select.click()
                logging.debug("Seleccionado elemento para Canarias")
            except Exception as e:
                logging.error("Error al seleccionar opción para Canarias: %s", e, exc_info=True)

        if general == "castilla y leon":
            try:
                select = self.driver.find_element(By.XPATH, '//*[@id="colegio"]/option[9]')
                select.click()
                logging.debug("Seleccionado elemento para Castilla y León")
            except Exception as e:
                logging.error("Error al seleccionar opción para Castilla y León: %s", e, exc_info=True)

        try:
            search_box = self.driver.find_element(By.XPATH, xpath)
            search_box.send_keys(valorBusqueda)  # Ingresar valor de búsqueda
            search_box.send_keys(Keys.RETURN)
            logging.info("Realizada búsqueda con valor: %s", valorBusqueda)
        except Exception as e:
            logging.error("Error al interactuar con el campo de búsqueda: %s", e, exc_info=True)

        if "cpfcyl" in url:
            try:
                xpath_button = '//*[@id="cdk-accordion-child-0"]/div/form/div/web-loading-button/button/span[1]/div'
                search_div = self.driver.find_element(By.XPATH, xpath_button)
                search_div.click()
                logging.debug("Click en botón de búsqueda para cpfcyl realizado")
            except Exception as e:
                logging.error("Error al hacer click en el botón de búsqueda para cpfcyl: %s", e, exc_info=True)

        time.sleep(2)  # Esperar la carga de resultados
        soup = BeautifulSoup(self.driver.page_source, "html.parser")
        logging.info("HTML de la página obtenido")
        return soup

    def cerrar(self):
        try:
            self.driver.quit()
            logging.info("Driver cerrado correctamente")
        except Exception as e:
            logging.error("Error al cerrar el driver: %s", e, exc_info=True)
        try:
            if os.getenv("DEBUG") == "True":
                self.driver.service.stop()
                logging.info("Servicio del driver detenido correctamente")
        except Exception as e:
            logging.error("Error al detener el servicio del driver: %s", e, exc_info=True)


def quitar_tildes(texto):
    return ''.join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')

def quitar_solo_tildes(texto):
    # Normaliza el texto en forma NFD para separar las letras de sus marcas
    normalized = unicodedata.normalize('NFD', texto)
    result_chars = []
    for i, c in enumerate(normalized):
        if unicodedata.combining(c):
            # Si es una marca de combinación...
            if c == "\u0303":
                # Si la marca es la tilde y el carácter base es 'n' o 'N', la conservamos
                if i > 0 and normalized[i-1] in ("n", "N"):
                    result_chars.append(c)
                # En otros casos (p. ej. tilde en otra letra) se elimina
            else:
                # Elimina cualquier otra marca (como la tilde aguda)
                continue
        else:
            result_chars.append(c)
    # Recompone la cadena en forma NFC
    return unicodedata.normalize('NFC', ''.join(result_chars))

def validar_colegiacion(nombre: str, numero: str, comunidad: str) -> bool:
    logging.info("Iniciando validación de colegiación para '%s' en %s", nombre, comunidad)
    scraper = SeleniumScraper()
    try:
        match comunidad.lower():
            case "andalucia":
                url = "https://colfisio.org/registro-censo-fisioterapeutas"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="input-462"]')
                    resultado = soup.find("div", class_="title-of-the-card")
                    if resultado:
                        datos = quitar_tildes(resultado.text.replace("\n", "").strip())
                        num = datos.split(" ")[1]
                        valid = numero == num
                        logging.info("Validación en Andalucía %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Andalucía")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Andalucía: %s", e, exc_info=True)
                    return False

            case "aragon":
                url = "https://ventanilla.colfisioaragon.org/buscador-colegiados"
                try:
                    soup = scraper.obtener_colegiado(numero, url, "//*[@id='numeroColegiado']")
                    resultado = soup.find("div", class_="card-body")
                    if resultado:
                        datos = quitar_tildes(resultado.h4.text.strip().upper())
                        valid = datos == quitar_tildes(nombre)
                        logging.info("Validación en Aragón %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Aragón")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Aragón: %s", e, exc_info=True)
                    return False

            case "asturias":
                url = "https://www.cofispa.org/censo-colegiados"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="number"]')
                    resultado = soup.find("tbody").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        datos = quitar_tildes(f"{datos[1]} {datos[2]} {datos[3]}")
                        if "Mª" in datos:
                            datos = datos.replace("Mª", "MARIA")
                        valid = datos == quitar_tildes(nombre)
                        logging.info("Validación en Asturias %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Asturias")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Asturias: %s", e, exc_info=True)
                    return False

            case "baleares":
                url = "http://www.colfisiobalear.org/es/area-social-y-ciudadana/profesionales-colegiados/"
                try:
                    soup = scraper.obtener_colegiado(numero, url, "//*[@id='student_number']")
                    resultado = soup.find("div", {"data-number": numero})
                    if resultado:
                        datos = resultado.div.p.text.upper().split(", ")
                        datos = quitar_tildes(f"{datos[1]} {datos[0]}")
                        valid = datos == quitar_tildes(nombre)
                        logging.info("Validación en Baleares %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Baleares")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Baleares: %s", e, exc_info=True)
                    return False

            case "canarias":
                url = "https://www.consejo-fisioterapia.org/vu_colegiados.html"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="nombre"]')
                    resultado = soup.find("tr", class_="colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[1]
                        logging.info("Validación en Canarias %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Canarias")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Canarias: %s", e, exc_info=True)
                    return False

            case "cantabria":
                url = "https://colfisiocant.org/busqueda-profesionales/"
                try:
                    soup = scraper.obtener_colegiado(quitar_solo_tildes(nombre), url, "//*[@id='tablepress-1_filter']/label/input")
                    resultado = soup.find("tbody", class_="row-hover").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[0]
                        logging.info("Validación en Cantabria %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Cantabria")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Cantabria: %s", e, exc_info=True)
                    return False

            case "castilla-la mancha":
                url = "https://www.coficam.org/ventanilla-unica/censo-colegial"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                    resultado = soup.find("tr", class_="linea_colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        datos = quitar_tildes(f"{datos[1]}").split(", ")
                        cadena = f"{datos[1]} {datos[0]}".upper()
                        valid = cadena == quitar_tildes(nombre)
                        logging.info("Validación en Castilla-la Mancha %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Castilla-la Mancha")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Castilla-la Mancha: %s", e, exc_info=True)
                    return False

            case "castilla y leon":
                url = "https://www.consejo-fisioterapia.org/vu_colegiados.html"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="nombre"]')
                    resultado = soup.find("tr", class_="colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[1]
                        logging.info("Validación en Castilla y León %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Castilla y León")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Castilla y León: %s", e, exc_info=True)
                    return False

            case "cataluña":
                url = "https://www.fisioterapeutes.cat/es/ciudadanos/profesionales"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="ncol"]')
                    resultado = soup.find("div", class_="card-header")
                    if resultado:
                        datos = quitar_tildes(resultado.text.upper())
                        if "Mª" in datos:
                            datos = datos.replace("Mª", "MARIA")
                        valid = datos == quitar_tildes(nombre)
                        logging.info("Validación en Cataluña %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Cataluña")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Cataluña: %s", e, exc_info=True)
                    return False

            case "extremadura":
                url = "https://cofext.org/cms/colegiados.php"
                try:
                    xpath = '//*[@id="example_filter"]/label/input'
                    soup = scraper.obtener_colegiado(quitar_solo_tildes(nombre), url, xpath)
                    resultado = soup.find("tr", class_="odd")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[2]
                        logging.info("Validación en Extremadura %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Extremadura")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Extremadura: %s", e, exc_info=True)
                    return False

            case "galicia":
                url = "https://www.cofiga.org/ciudadanos/colegiados"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                    resultado = soup.find("tr", class_="linea_colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        datos = quitar_tildes(datos[1].upper()).split(", ")
                        cadena = f"{datos[1]} {datos[0]}"
                        valid = cadena == quitar_tildes(nombre)
                        logging.info("Validación en Galicia %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Galicia")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Galicia: %s", e, exc_info=True)
                    return False

            case "la rioja":
                url = "https://www.coflarioja.org/ciudadanos/listado-de-fisioterapeutas/buscar-colegiados"
                try:
                    xpath = '//*[@id="busqueda-colegiados-search-input"]/div/input'
                    soup = scraper.obtener_colegiado(quitar_tildes(nombre), url, xpath)
                    resultado = soup.find("tbody").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[0]
                        logging.info("Validación en La Rioja %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en La Rioja")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en La Rioja: %s", e, exc_info=True)
                    return False

            case "madrid":
                url = "https://cfisiomad.com/#/ext/buscarcolegiado"
                try:
                    xpath = "/html/body/app-root/app-externos/section/div/app-search-collegiate/div/div/form/input[1]"
                    soup = scraper.obtener_colegiado(nombre, url, xpath, 10)
                    resultado = soup.find("tbody").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[0]
                        logging.info("Validación en Madrid %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Madrid")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Madrid: %s", e, exc_info=True)
                    return False

            case "murcia":
                url = "https://cfisiomurcia.com/buscador-de-colegiados/"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="myTable_filter"]/label/input')
                    resultado = soup.find("tr", class_="odd")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        cadena = quitar_tildes(f"{datos[0]} {datos[1]}")
                        if "Mª" in cadena:
                            cadena = cadena.replace("Mª", "MARIA")
                        valid = cadena == quitar_tildes(nombre)
                        logging.info("Validación en Murcia %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Murcia")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Murcia: %s", e, exc_info=True)
                    return False

            case "navarra":
                url = "https://www.consejo-fisioterapia.org/vu_colegiados.html"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="nombre"]', general=comunidad)
                    resultado = soup.find("tr", class_="colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[1]
                        logging.info("Validación en Navarra %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Navarra")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Navarra: %s", e, exc_info=True)
                    return False

            case "pais vasco":
                url = "https://cofpv.org/es/colegiados.asp"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="busqueda"]')
                    resultado = soup.find("table", class_="tabletwo").tbody.tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        valid = numero == datos[0]
                        logging.info("Validación en País Vasco %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en País Vasco")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en País Vasco: %s", e, exc_info=True)
                    return False

            case "comunidad valenciana":
                url = "https://app.colfisiocv.com/college/collegiatelist/"
                try:
                    xpath = '//*[@id="root"]/div/div[2]/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/input'
                    soup = scraper.obtener_colegiado(numero, url, xpath)
                    resultado = soup.find("tr", class_="bg-white border-b")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        cadena = quitar_tildes(f"{datos[2]} {datos[3]}").upper()
                        valid = cadena == quitar_tildes(nombre)
                        logging.info("Validación en Comunidad Valenciana %s", "exitosa" if valid else "fallida")
                        return valid
                    else:
                        logging.warning("No se encontró el resultado esperado en Comunidad Valenciana")
                        return False
                except Exception as e:
                    logging.error("Error durante la validación en Comunidad Valenciana: %s", e, exc_info=True)
                    return False

            case _:
                logging.warning("Comunidad no reconocida: %s", comunidad)
                return False
    finally:
        scraper.cerrar()
        logging.info("Finalizada la validación de colegiación para '%s'", nombre)
