export function get_id_from_url() {
    // Separa la url por / y retorna el ultimo elemento
    const url_splited = window.location.pathname.split("/")
    return url_splited[url_splited.length - 1]
}

export function print_time(received_time) {
    // Muestra en pantalla la fecha con los valores pasados en español
    const date_parsed = Date.parse(received_time)

    return Intl.DateTimeFormat("es-ES",{
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"}).format(date_parsed)
  }
  