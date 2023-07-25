export function getTimeFromString(timeString: string): Date {
    // Separamos la cadena de tiempo en horas y minutos
    const [hours, minutes] = timeString.split(':').map(Number);
  
    // Creamos un objeto Date con la fecha actual y la hora especificada
    const date = new Date();
    date.setHours(hours, minutes);
  
    return date;
  }