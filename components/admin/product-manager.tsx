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
import { Plus, Edit, Trash2, Search, X, Upload, Percent, Video } from "lucide-react"
import Image from "next/image"
import { convertImageToBase64, type AdminProduct } from "@/lib/admin-storage"
import { categoriesData } from "@/data/products"
import { put } from "@vercel/blob"
import { createProduct, getProducts, convertSupabaseToAdmin } from "@/lib/supabase-storage"
import { createBrowserClient } from "@/lib/supabase/client"

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
    const fetchProducts = async () => {
      const productsFromSupabase = await getProducts()
      setProducts(productsFromSupabase.map(convertSupabaseToAdmin))
    }
    fetchProducts()
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
    videos: [] as string[], // Agregar soporte para videos
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

  const formatNumber = (value: string): string => {
    // Eliminar todo excepto números
    const numbers = value.replace(/\D/g, "")

    // Si está vacío, retornar cadena vacía
    if (!numbers) return ""

    // Formatear con separadores de miles (puntos)
    return Number.parseInt(numbers).toLocaleString("es-CO")
  }

  const parseFormattedNumber = (value: string): number => {
    const numbers = value.replace(/\D/g, "")
    return numbers ? Number.parseInt(numbers) : 0
  }

  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category ||
      !newProduct.subcategory ||
      !newProduct.description
    ) {
      alert(
        "Por favor completa todos los campos obligatorios: nombre, precio, stock, categoría, subcategoría y descripción",
      )
      return
    }

    if (newProduct.images.length === 0 && newProduct.videos.length === 0) {
      alert("Por favor agrega al menos una imagen o un video del producto")
      return
    }

    console.log("[v0] Creating product with data:", {
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      price: newProduct.price,
      stock: newProduct.stock,
      discount: newProduct.discount,
      images: newProduct.images.length,
      videos: newProduct.videos.length,
    })

    const price = parseFormattedNumber(newProduct.price)
    const discount = newProduct.discount ? Number.parseFloat(newProduct.discount) : undefined

    const finalPrice = discount && discount > 0 ? price * (1 - discount / 100) : price

    const productData = {
      name: newProduct.name,
      description: newProduct.description,
      price: finalPrice,
      original_price: discount && discount > 0 ? price : undefined,
      discount: discount && discount > 0 ? discount : undefined,
      category: newProduct.category,
      subcategory: newProduct.subcategory || undefined,
      stock: parseFormattedNumber(newProduct.stock),
      images: newProduct.images,
      videos: newProduct.videos,
      featured: newProduct.featured,
    }

    console.log("[v0] Product data to save:", productData)

    const savedProduct = await createProduct(productData)

    if (!savedProduct) {
      console.error("[v0] Failed to save product")
      alert("Error al guardar el producto. Por favor intenta de nuevo.")
      return
    }

    console.log("[v0] Product saved successfully:", savedProduct)

    const updatedProducts = await getProducts()
    setProducts(updatedProducts.map(convertSupabaseToAdmin))

    setIsAddDialogOpen(false)
    setNewProduct({
      name: "",
      price: "",
      category: "",
      subcategory: "",
      description: "",
      stock: "",
      images: [],
      videos: [],
      featured: false,
      discount: "",
    })
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    try {
      const supabase = createBrowserClient()

      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          original_price: editingProduct.originalPrice,
          discount: editingProduct.discount,
          category: editingProduct.category,
          subcategory: editingProduct.subcategory,
          stock: editingProduct.stock,
          images: editingProduct.images,
          videos: editingProduct.videos,
          featured: editingProduct.featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingProduct.id)

      if (error) {
        console.error("[v0] Error updating product:", error)
        alert("Error al actualizar el producto. Por favor intenta de nuevo.")
        return
      }

      console.log("[v0] Product updated successfully")

      // Recargar productos
      const updatedProducts = await getProducts()
      setProducts(updatedProducts.map(convertSupabaseToAdmin))

      setIsEditDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error("[v0] Error updating product:", error)
      alert("Error al actualizar el producto. Por favor intenta de nuevo.")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const supabase = createBrowserClient()

        console.log("[v0] Deleting product:", id)

        const { error } = await supabase.from("products").delete().eq("id", id)

        if (error) {
          console.error("[v0] Error deleting product:", error)
          alert("Error al eliminar el producto. Por favor intenta de nuevo.")
          return
        }

        console.log("[v0] Product deleted successfully")

        // Recargar productos
        const updatedProducts = await getProducts()
        setProducts(updatedProducts.map(convertSupabaseToAdmin))
      } catch (error) {
        console.error("[v0] Error deleting product:", error)
        alert("Error al eliminar el producto. Por favor intenta de nuevo.")
      }
    }
  }

  const [uploadingVideo, setUploadingVideo] = useState(false)

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingVideo(true)

    try {
      const videoUrls: string[] = []

      for (const file of files) {
        // Validar tamaño del archivo (máximo 50MB)
        if (file.size > 50 * 1024 * 1024) {
          alert(`El video ${file.name} es demasiado grande. Máximo 50MB.`)
          continue
        }

        // Validar formato
        const validFormats = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]
        if (!validFormats.includes(file.type)) {
          alert(`El formato de ${file.name} no es válido. Usa MP4, WebM, MOV o AVI.`)
          continue
        }

        // Subir a Vercel Blob
        const blob = await put(`products/videos/${Date.now()}-${file.name}`, file, {
          access: "public",
        })

        videoUrls.push(blob.url)
      }

      setNewProduct((prev) => ({
        ...prev,
        videos: [...prev.videos, ...videoUrls],
      }))
    } catch (error) {
      console.error("[v0] Error uploading video:", error)
      alert("Error al subir el video. Por favor intenta de nuevo.")
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleRemoveVideo = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }))
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
                        type="text"
                        placeholder="Ej: 150.000"
                        value={newProduct.price}
                        onChange={(e) => {
                          const formatted = formatNumber(e.target.value)
                          setNewProduct((prev) => ({ ...prev, price: formatted }))
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="text"
                        placeholder="Ej: 10"
                        value={newProduct.stock}
                        onChange={(e) => {
                          const formatted = formatNumber(e.target.value)
                          setNewProduct((prev) => ({ ...prev, stock: formatted }))
                        }}
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
                          ${parseFormattedNumber(newProduct.price).toLocaleString("es-CO")} COP
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Precio con descuento</p>
                        <p className="text-lg font-bold text-accent">
                          $
                          {(
                            parseFormattedNumber(newProduct.price) *
                            (1 - Number.parseFloat(newProduct.discount) / 100)
                          ).toLocaleString("es-CO")}{" "}
                          COP
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ahorro: $
                          {(
                            parseFormattedNumber(newProduct.price) *
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

                  <div>
                    <Label>Videos del Producto</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos aceptados: MP4, WebM, MOV, AVI (máximo 50MB por video)
                    </p>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                          multiple
                          onChange={handleVideoUpload}
                          className="flex-1"
                          id="video-upload"
                          disabled={uploadingVideo}
                        />
                        <Label
                          htmlFor="video-upload"
                          className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${
                            uploadingVideo ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          {uploadingVideo ? "Subiendo..." : "Subir Videos"}
                        </Label>
                      </div>

                      {newProduct.videos.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          {newProduct.videos.map((videoUrl, index) => (
                            <div
                              key={index}
                              className="relative aspect-video rounded-lg overflow-hidden group bg-black"
                            >
                              <video
                                src={videoUrl}
                                controls
                                className="w-full h-full object-contain"
                                preload="metadata"
                              />
                              <button
                                onClick={() => handleRemoveVideo(index)}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
                  <Button onClick={handleAddProduct} className="w-full" disabled={uploadingVideo}>
                    {uploadingVideo ? "Subiendo videos..." : "Agregar Producto"}
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
                              price: Number.parseFloat(e.target.value) || 0,
                              originalPrice: prev.discount ? Number.parseFloat(e.target.value) || 0 : undefined,
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
                      setEditingProduct((prev) =>
                        prev ? { ...prev, stock: Number.parseInt(e.target.value) || 0 } : null,
                      )
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

              <div>
                <Label>Videos del Producto</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceptados: MP4, WebM, MOV, AVI (máximo 50MB por video)
                </p>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || [])
                        const newVideos: string[] = []

                        for (const file of files) {
                          try {
                            // Validar tamaño del archivo (máximo 50MB)
                            if (file.size > 50 * 1024 * 1024) {
                              alert(`El video ${file.name} es demasiado grande. Máximo 50MB.`)
                              continue
                            }

                            // Validar formato
                            const validFormats = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]
                            if (!validFormats.includes(file.type)) {
                              alert(`El formato de ${file.name} no es válido. Usa MP4, WebM, MOV o AVI.`)
                              continue
                            }

                            // Subir a Vercel Blob
                            const blob = await put(`products/videos/${Date.now()}-${file.name}`, file, {
                              access: "public",
                            })

                            newVideos.push(blob.url)
                          } catch (error) {
                            console.error("[v0] Error uploading video:", error)
                            alert("Error al subir el video. Por favor intenta de nuevo.")
                          }
                        }

                        setEditingProduct((prev) => (prev ? { ...prev, videos: [...prev.videos, ...newVideos] } : null))
                      }}
                      className="flex-1"
                      id="edit-video-upload"
                    />
                    <Label
                      htmlFor="edit-video-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Agregar
                    </Label>
                  </div>

                  {editingProduct.videos.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {editingProduct.videos.map((videoUrl, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group bg-black">
                          <video src={videoUrl} controls className="w-full h-full object-contain" preload="metadata" />
                          <button
                            onClick={() =>
                              setEditingProduct((prev) =>
                                prev ? { ...prev, videos: prev.videos.filter((_, i) => i !== index) } : null,
                              )
                            }
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
