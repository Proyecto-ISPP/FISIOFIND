from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import unicodedata

class SeleniumScraper:
    def __init__(self):
        # Configurar Selenium (se requiere que JS esté habilitado)
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")  # Ejecutar en segundo plano
        options.add_argument("--no-sandbox")  
        options.add_argument("--enable-javascript")  # Asegurar que JS está habilitado
        options.add_argument("--disable-dev-shm-usage")  
        
        # Inicializar WebDriver
        self.driver = webdriver.Chrome(
            service=Service(executable_path=ChromeDriverManager().install()),
            options=options
        )

    def obtener_colegiado(self, valorBusqueda: str, url: str, xpath: str, loadTime: int = 2, general: str = None) -> BeautifulSoup:
        self.driver.get(url)
        time.sleep(loadTime)  # Esperar que cargue la página
        
        if "murcia" in url:
            num_sort = self.driver.find_element(By.XPATH, '//*[@id="myTable"]/thead/tr/th[3]')
            num_sort.click()
            
        if general == "navarra":
            select = self.driver.find_element(By.XPATH, '//*[@id="colegio"]/option[16]')
            select.click()
        
        if general == "canarias":
            select = self.driver.find_element(By.XPATH, '//*[@id="colegio"]/option[6]')
            select.click()
            
        if general == "castilla y leon":
            select = self.driver.find_element(By.XPATH, '//*[@id="colegio"]/option[9]')
            select.click()
    
        search_box = self.driver.find_element(By.XPATH, xpath)
        search_box.send_keys(valorBusqueda)  # Ingresar valor de búsqueda (nombre o número)
        search_box.send_keys(Keys.RETURN)
        
        # Para el caso de castilla y leon, hay que hacer click en el botón de buscar
        if "cpfcyl" in url:
            search_div = self.driver.find_element(By.XPATH, '//*[@id="cdk-accordion-child-0"]/div/form/div/web-loading-button/button/span[1]/div')
            search_div.click()
    
        time.sleep(2)  # Esperar la carga de resultados
    
        soup = BeautifulSoup(self.driver.page_source, "html.parser")
        return soup

    def cerrar(self):
        try:
            self.driver.quit()
        except Exception as e:
            print("Error al cerrar el driver:", e)
        # Intentar detener el servicio para asegurarnos que se mata el proceso
        try:
            self.driver.service.stop()
        except Exception as e:
            print("Error al detener el servicio del driver:", e)


def quitar_tildes(texto):
    return ''.join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')


def validar_colegiacion(nombre: str, numero: str, comunidad: str) -> bool:
    """
    Valida si un fisioterapeuta está colegiado en su comunidad autónoma.
    Devuelve True o False según la validación y se asegura de cerrar el driver.
    """
    scraper = SeleniumScraper()
    try:
        match comunidad.lower():
            case "andalucia":  # Por número y nombre, ver caso 00001
                url = "https://colfisio.org/registro-censo-fisioterapeutas"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="input-458"]')
                    resultado = soup.find("div", class_="title-of-the-card")
                    if resultado:
                        datos = quitar_tildes(resultado.text.replace("\n", "").strip())
                        num = datos.split(" ")[1]
                        return numero == num
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "aragon":  # Por número y nombre
                url = "https://ventanilla.colfisioaragon.org/buscador-colegiados"
                try:
                    soup = scraper.obtener_colegiado(numero, url, "//*[@id='numeroColegiado']")
                    resultado = soup.find("div", class_="card-body")
                    if resultado:
                        datos = quitar_tildes(resultado.h4.text.strip().upper())
                        return datos == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "asturias":  # Por número y nombre
                url = "https://www.cofispa.org/censo-colegiados"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="number"]')
                    resultado = soup.find("tbody").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        datos = quitar_tildes(f"{datos[1]} {datos[2]} {datos[3]}")
                        if("Mª" in datos):
                            datos = datos.replace("Mª", "MARIA")
                        return datos == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "baleares":  # Por número y nombre
                url = "http://www.colfisiobalear.org/es/area-social-y-ciudadana/profesionales-colegiados/"
                try:
                    soup = scraper.obtener_colegiado(numero, url, "//*[@id='student_number']")
                    resultado = soup.find("div", {"data-number": numero})
                    if resultado:
                        datos = resultado.div.p.text.upper().split(", ")
                        datos = quitar_tildes(f"{datos[1]} {datos[0]}")
                        return datos == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "canarias":  # Por número y nombre (NO FUNCIONA CON HEADLESS)
                url = "https://www.consejo-fisioterapia.org/vu_colegiados.html"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="nombre"]')
                    resultado = soup.find("tr", class_="colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        return numero == datos[1]
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "cantabria":  # Por número y nombre
                url = "https://colfisiocant.org/busqueda-profesionales/"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, "//*[@id='tablepress-1_filter']/label/input")
                    resultado = soup.find("tbody", class_="row-hover").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        while len(numero) < 3:
                            numero = "0" + numero
                        return numero == datos[0].replace("39/", "")
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "castilla-la mancha":  # Por número y nombre
                url = "https://www.coficam.org/ventanilla-unica/censo-colegial"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                    resultado = soup.find("tr", class_="linea_colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        datos = quitar_tildes(f"{datos[1]}").split(", ")
                        cadena = f"{datos[1]} {datos[0]}".upper()
                        return cadena == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "castilla y leon":  # Por número y nombre (NO FUNCIONA CON HEADLESS)
                url = "https://www.consejo-fisioterapia.org/vu_colegiados.html"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="nombre"]')
                    resultado = soup.find("tr", class_="colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        return numero == datos[1]
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "cataluña":  # Por número y nombre
                url = "https://www.fisioterapeutes.cat/es/ciudadanos/profesionales"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="ncol"]')
                    resultado = soup.find("div", class_="card-header")
                    if resultado:
                        datos = quitar_tildes(resultado.text.upper())
                        if "Mª" in datos:
                            datos = datos.replace("Mª", "MARIA")
                        return datos == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "extremadura":  # Por número y nombre
                url = "https://cofext.org/cms/colegiados.php"
                try:
                    soup = scraper.obtener_colegiado(quitar_tildes(nombre), url, '//*[@id="example_filter"]/label/input')
                    resultado = soup.find("tr", class_="odd")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        return numero == datos[2]
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "galicia":  # Por número y nombre
                url = "https://www.cofiga.org/ciudadanos/colegiados"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                    resultado = soup.find("tr", class_="linea_colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        datos = quitar_tildes(datos[1].upper()).split(", ")
                        cadena = f"{datos[1]} {datos[0]}"
                        return cadena == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "la rioja":  # Por número y nombre (se haría por nombre, pero si se rellena el número con ceros, no debe haber problema)
                url = "https://www.coflarioja.org/ciudadanos/listado-de-fisioterapeutas/buscar-colegiados"
                try:
                    while len(numero) < 4:
                        numero = "0" + numero
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="busqueda-colegiados-search-input"]/div/input')
                    resultado = soup.find("tbody").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        cadena = quitar_tildes(f"{datos[1]} {datos[2]}".upper())
                        if "Mª" in cadena:
                            cadena = cadena.replace("Mª", "MARIA")
                        return cadena == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "madrid":  # Por nombre
                url = "https://cfisiomad.com/#/ext/buscarcolegiado"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, "/html/body/app-root/app-externos/section/div/app-search-collegiate/div/div/form/input[1]", 10)
                    resultado = soup.find("tbody").tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        return numero == datos[0]
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "murcia":  # Por número y nombre
                url = "https://cfisiomurcia.com/buscador-de-colegiados/"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="myTable_filter"]/label/input')
                    resultado = soup.find("tr", class_="odd")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        cadena = quitar_tildes(f"{datos[0]} {datos[1]}")
                        if "Mª" in cadena:
                            cadena = cadena.replace("Mª", "MARIA")
                        return cadena == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "navarra":  # Por nombre, se valida en la web general de colegiados
                url = "https://www.consejo-fisioterapia.org/vu_colegiados.html"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="nombre"]', general=comunidad)
                    resultado = soup.find("tr", class_="colegiado")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        return numero == datos[1]
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "pais vasco":  # Por nombre (TARDA MUCHO)
                url = "https://cofpv.org/es/colegiados.asp"
                try:
                    soup = scraper.obtener_colegiado(nombre, url, '//*[@id="busqueda"]')
                    resultado = soup.find("table", class_="tabletwo").tbody.tr
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        return numero == datos[0]
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case "comunidad valenciana":  # Por número y nombre
                url = "https://app.colfisiocv.com/college/collegiatelist/"
                try:
                    soup = scraper.obtener_colegiado(numero, url, '//*[@id="root"]/div/div[2]/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/input')
                    resultado = soup.find("tr", class_="bg-white border-b")
                    if resultado:
                        datos = [td.text.strip() for td in resultado.find_all("td")]
                        cadena = quitar_tildes(f"{datos[2]} {datos[3]}").upper()
                        return cadena == quitar_tildes(nombre)
                    else:
                        return False
                except Exception as e:
                    print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                    return False
            
            case _:
                return False
    finally:
        scraper.cerrar()
