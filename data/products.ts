import type { Product } from "@/contexts/cart-context"

export const products: Product[] = []

export const categories = [
  "Todos",
  "Juguetes Íntimos",
  "Lencería y Disfraces",
  "Lubricantes",
  "Accesorios",
  "Categoría 5",
  "Categoría 6",
]

export const featuredProducts = products.filter((product) => product.featured === true)

export const getProductsByCategory = (category: string) => {
  if (category === "Todos") return products
  return products.filter((product) => product.category === category)
}

export const getProductCountByCategory = (category: string) => {
  return getProductsByCategory(category).length
}

export const categoriesData = {
  "juguetes-intimos": {
    title: "Juguetes Íntimos",
    description: "Productos de alta calidad para el placer personal",
    subcategories: [
      "Dildos y Vibradores",
      "Balas y Huevos vibradores",
      "Anillos vibradores y Cockrings",
      "Plugs y Estimulación anal",
      "Masturbadores y Máquinas sexuales",
    ],
  },
  "lenceria-disfraces": {
    title: "Lencería y Disfraces",
    description: "Piezas exclusivas que realzan tu sensualidad",
    subcategories: [
      "Conjuntos y Bodys",
      "Tangas y Panties",
      "Babydolls y Camisones",
      "Disfraces eróticos",
      "Accesorios sensuales",
    ],
  },
  "lubricantes-cosmetica": {
    title: "Lubricantes y Cosmética Íntima",
    description: "Productos para el cuidado y bienestar personal",
    subcategories: [
      "Lubricantes clásicos y híbridos",
      "Lubricantes con sabor y efecto",
      "Lubricantes y geles anales",
      "Cremas y geles estimulantes",
      "Higiene y cuidado íntimo",
    ],
  },
  "juegos-accesorios": {
    title: "Juegos y Accesorios",
    description: "Complementos para una experiencia completa",
    subcategories: [
      "Juegos de mesa eróticos",
      "Cartas y barajas sensuales",
      "Dados eróticos",
      "Llaveros y artículos divertidos",
      "Kits y sets de juego",
    ],
  },
  "energizantes-estimulantes": {
    title: "Energizantes y Estimulantes",
    description: "Suplementos y productos para potenciar tu energía",
    subcategories: [
      "Cápsulas y pastillas",
      "Energizantes líquidos",
      "Gummies y suplementos",
      "Afrodisíacos",
      "Kits energizantes",
    ],
  },
  "condones-proteccion": {
    title: "Condones y Protección",
    description: "Protección segura y placentera para tus encuentros",
    subcategories: [
      "Condones clásicos",
      "Condones de sabores y colores",
      "Condones con texturas y efectos",
      "Condones femeninos",
      "Condones premium",
    ],
  },
}
