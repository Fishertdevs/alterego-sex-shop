"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Search, X, Upload, Percent } from "lucide-react"
import Image from "next/image"
import {
  getAdminProducts,
  saveAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  convertImageToBase64,
  type AdminProduct,
} from "@/lib/admin-storage"
import { categoriesData } from "@/data/products"

const categoryOptions = [
  { key: "juguetes-intimos", label: "Juguetes Íntimos" },
  { key: "lenceria-disfraces", label: "Lencería y Disfraces" },
  { key: "lubricantes-cosmetica", label: "Lubricantes y Cosmética Íntima" },
  { key: "juegos-accesorios", label: "Juegos y Accesorios" },
  { key: "energizantes-estimulantes", label: "Energizantes y Estimulantes" },
  { key: "condones-proteccion", label: "Condones y Protección" },
]

export function ProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)

  useEffect(() => {
    setProducts(getAdminProducts())
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    description: "",
    stock: "",
    images: [] as string[],
    featured: false,
    discount: "",
  })

  const getSubcategories = (categoryKey: string) => {
    const category = categoriesData[categoryKey as keyof typeof categoriesData]
    return category?.subcategories || []
  }

  const calculateDiscountedPrice = (price: string, discount: string) => {
    const priceNum = Number.parseFloat(price)
    const discountNum = Number.parseFloat(discount)
    if (isNaN(priceNum) || isNaN(discountNum) || discountNum <= 0) return null
    return priceNum * (1 - discountNum / 100)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newImages: string[] = []
    for (const file of files) {
      try {
        const base64 = await convertImageToBase64(file)
        newImages.push(base64)
      } catch (error) {
        console.error("[v0] Error converting image:", error)
      }
    }

    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }))
  }

  const handleRemoveImage = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const price = Number.parseFloat(newProduct.price)
    const discount = newProduct.discount ? Number.parseFloat(newProduct.discount) : undefined

    const finalPrice = discount && discount > 0 ? price * (1 - discount / 100) : price

    const product = saveAdminProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: finalPrice,
      originalPrice: discount && discount > 0 ? price : undefined,
      discount: discount && discount > 0 ? discount : undefined,
      category: newProduct.category,
      subcategory: newProduct.subcategory || undefined,
      stock: Number.parseInt(newProduct.stock) || 0,
      images: newProduct.images,
      featured: newProduct.featured,
    })

    setProducts(getAdminProducts())
    setIsAddDialogOpen(false)
    setNewProduct({
      name: "",
      price: "",
      category: "",
      subcategory: "",
      description: "",
      stock: "",
      images: [],
      featured: false,
      discount: "",
    })
  }

  const handleEditProduct = () => {
    if (!editingProduct) return

    updateAdminProduct(editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price,
      originalPrice: editingProduct.originalPrice,
      discount: editingProduct.discount,
      category: editingProduct.category,
      subcategory: editingProduct.subcategory,
      stock: editingProduct.stock,
      images: editingProduct.images,
      featured: editingProduct.featured,
    })

    setProducts(getAdminProducts())
    setIsEditDialogOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      deleteAdminProduct(id)
      setProducts(getAdminProducts())
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestión de Productos</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Precio (COP) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="1000"
                        placeholder="Ej: 150000"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="Ej: 10"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="discount">Descuento (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Ej: 20"
                        value={newProduct.discount}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, discount: e.target.value }))}
                      />
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {newProduct.price && newProduct.discount && Number.parseFloat(newProduct.discount) > 0 && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Precio original</p>
                        <p className="text-sm line-through">
                          ${Number.parseFloat(newProduct.price).toLocaleString("es-CO")} COP
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Precio con descuento</p>
                        <p className="text-lg font-bold text-accent">
                          ${calculateDiscountedPrice(newProduct.price, newProduct.discount)?.toLocaleString("es-CO")}{" "}
                          COP
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ahorro: $
                          {(
                            Number.parseFloat(newProduct.price) *
                            (Number.parseFloat(newProduct.discount) / 100)
                          ).toLocaleString("es-CO")}{" "}
                          COP
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) =>
                        setNewProduct((prev) => ({ ...prev, category: value, subcategory: "" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.key} value={category.key}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {newProduct.category && (
                    <div>
                      <Label htmlFor="subcategory">Subcategoría</Label>
                      <Select
                        value={newProduct.subcategory}
                        onValueChange={(value) => setNewProduct((prev) => ({ ...prev, subcategory: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar subcategoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSubcategories(newProduct.category).map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Imágenes del Producto</Label>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="flex-1"
                          id="image-upload"
                        />
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Imágenes
                        </Label>
                      </div>

                      {newProduct.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {newProduct.images.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Producto ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={newProduct.featured}
                      onCheckedChange={(checked) => setNewProduct((prev) => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured">Producto Destacado</Label>
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    Agregar Producto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No hay productos. Agrega tu primer producto para comenzar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">Sin imagen</div>
                      )}
                      {product.images.length > 1 && (
                        <Badge className="absolute top-2 left-2" variant="secondary">
                          +{product.images.length - 1}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {categoryOptions.find((c) => c.key === product.category)?.label || product.category}
                        </Badge>
                        {product.subcategory && (
                          <Badge variant="outline" className="text-xs">
                            {product.subcategory}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="space-y-1">
                        {product.discount && product.originalPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground line-through">
                              ${product.originalPrice.toLocaleString("es-CO")}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              -{product.discount}%
                            </Badge>
                          </div>
                        ) : null}
                        <span className="font-bold text-accent block">
                          ${product.price.toLocaleString("es-CO")} COP
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setEditingProduct(product)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre del Producto</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Precio (COP)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="1000"
                    value={editingProduct.originalPrice || editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              price: Number.parseFloat(e.target.value),
                              originalPrice: prev.discount ? Number.parseFloat(e.target.value) : undefined,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct((prev) => (prev ? { ...prev, stock: Number.parseInt(e.target.value) } : null))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-discount">Descuento (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-discount"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Ej: 20"
                    value={editingProduct.discount || ""}
                    onChange={(e) => {
                      const discount = Number.parseFloat(e.target.value)
                      const originalPrice = editingProduct.originalPrice || editingProduct.price
                      const newPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice

                      setEditingProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              discount: discount > 0 ? discount : undefined,
                              originalPrice: discount > 0 ? originalPrice : undefined,
                              price: newPrice,
                            }
                          : null,
                      )
                    }}
                  />
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </div>
                {editingProduct.discount && editingProduct.discount > 0 && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Precio original</p>
                    <p className="text-sm line-through">${editingProduct.originalPrice?.toLocaleString("es-CO")} COP</p>
                    <p className="text-sm text-muted-foreground mt-1">Precio con descuento</p>
                    <p className="text-lg font-bold text-accent">${editingProduct.price.toLocaleString("es-CO")} COP</p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="edit-category">Categoría</Label>
                <Select
                  value={editingProduct.category}
                  onValueChange={(value) =>
                    setEditingProduct((prev) => (prev ? { ...prev, category: value, subcategory: "" } : null))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingProduct.category && (
                <div>
                  <Label htmlFor="edit-subcategory">Subcategoría</Label>
                  <Select
                    value={editingProduct.subcategory || ""}
                    onValueChange={(value) =>
                      setEditingProduct((prev) => (prev ? { ...prev, subcategory: value } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategories(editingProduct.category).map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Imágenes del Producto</Label>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || [])
                        const newImages: string[] = []
                        for (const file of files) {
                          try {
                            const base64 = await convertImageToBase64(file)
                            newImages.push(base64)
                          } catch (error) {
                            console.error("[v0] Error converting image:", error)
                          }
                        }
                        setEditingProduct((prev) => (prev ? { ...prev, images: [...prev.images, ...newImages] } : null))
                      }}
                      className="flex-1"
                      id="edit-image-upload"
                    />
                    <Label
                      htmlFor="edit-image-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Agregar
                    </Label>
                  </div>

                  {editingProduct.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {editingProduct.images.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Producto ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() =>
                              setEditingProduct((prev) =>
                                prev ? { ...prev, images: prev.images.filter((_, i) => i !== index) } : null,
                              )
                            }
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={editingProduct.featured}
                  onCheckedChange={(checked) =>
                    setEditingProduct((prev) => (prev ? { ...prev, featured: checked } : null))
                  }
                />
                <Label htmlFor="edit-featured">Producto Destacado</Label>
              </div>
              <Button onClick={handleEditProduct} className="w-full">
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
