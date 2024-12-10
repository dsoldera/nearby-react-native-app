import { Pressable, PressableProps, Text } from "react-native"

import { colors } from "@/styles/theme"
import { s } from "./styles"

import { categoriesIcons } from "@/utils/categories-icons"

type CategoryProps = PressableProps & {
  name: string
  iconId: string
  isSelected?: boolean
}

export const Category = (
  { name, iconId, isSelected = false, ...rest }: CategoryProps) => {
  const Icon = categoriesIcons[iconId]

  return (
    <Pressable
      style={[s.container, isSelected && s.containerSelected]}
      {...rest}
    >
      <Icon size={16} color={colors.gray[isSelected ? 100 : 400]} />
      <Text style={[s.name, isSelected && s.nameSelected]}>{name}</Text>
    </Pressable>
  )
}