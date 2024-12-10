import { Categories, CategoriesProps } from "@/components/categories";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([])
  const [category, setCategory] = useState("")
  //const [markets, setMarkets] = useState([])
  
  const fetchCategories = async ()  => {
    try {
      const { data } = await api.get("/categories")
      console.log('data', data)
      setCategories(data)
      setCategory(data[0].id)

    } catch (error) {
      console.log(error)
      Alert.alert("Categorias", "Não foi possível carregar as categorias.")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />
  </View>
  )
}