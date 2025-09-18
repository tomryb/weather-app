export const CITIES: string[] = ["Warszawa", "Kraków", "Wrocław"]; 

export function normalizeCity(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L");
}


