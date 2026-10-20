export interface CareCity {
  name: string
  aliases: string[]
  lat: number
  lng: number
}

export const careCities: CareCity[] = [
  { name: "Casablanca", aliases: ["casablanca", "casa"], lat: 33.5731, lng: -7.5898 },
  { name: "Rabat", aliases: ["rabat"], lat: 34.0209, lng: -6.8416 },
  { name: "Salé", aliases: ["sale"], lat: 34.0531, lng: -6.7985 },
  { name: "Marrakech", aliases: ["marrakech", "marrakesh"], lat: 31.6295, lng: -7.9811 },
  { name: "Fès", aliases: ["fes", "fez"], lat: 34.0331, lng: -5.0003 },
  { name: "Tanger", aliases: ["tanger", "tangier"], lat: 35.7595, lng: -5.834 },
  { name: "Agadir", aliases: ["agadir"], lat: 30.4278, lng: -9.5981 },
  { name: "Meknès", aliases: ["meknes"], lat: 33.8935, lng: -5.5473 },
  { name: "Oujda", aliases: ["oujda"], lat: 34.6814, lng: -1.9086 },
  { name: "Tétouan", aliases: ["tetouan"], lat: 35.5889, lng: -5.3626 },
  { name: "Kénitra", aliases: ["kenitra"], lat: 34.261, lng: -6.5802 },
  { name: "Mohammedia", aliases: ["mohammedia"], lat: 33.6866, lng: -7.383 },
]
