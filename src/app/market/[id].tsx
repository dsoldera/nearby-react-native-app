import { Loading } from "@/components/loading";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Modal, ScrollView, StatusBar, View } from "react-native";

import { Button } from "@/components/button";
import { Coupon } from "@/components/market/coupon";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";
import { api } from "@/services/api";
import { CameraView, useCameraPermissions } from "expo-camera";

//import { MapContainer, TileLayer, useMap } from 'react-leaflet'

type DataProps = PropsDetails & {
  cover: string
}

export default function Market() {
  const [data, setData] = useState<DataProps>()
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)
  const [coupons, setCoupons] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [couponIsFetching, setCouponIsFetching] = useState(false)
  const [_, requestPermission] = useCameraPermissions()

  const qrLock = useRef(false)
  const params = useLocalSearchParams<{ id: string }>()

  const fetchMarket = async () => {
    try {
      const { data } = await api.get(`/markets/${params.id}`)
      setData(data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível carregar os dados", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ])
    }
  }

  const getCoupons = async (id: string) => {
    try {
      setCouponIsFetching(true)
      const { data } = await api.patch("/coupons/" + id)
      Alert.alert("Cupom", data.coupons)
      setCoupons(data.coupons)
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível utilizar o cupom")
    } finally {
      setCouponIsFetching(false)
    }
  }

  const handleUseCoupons = (id: string) => {
    setIsVisibleCameraModal(false)
    Alert.alert(
      "Cupom",
      "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupons(id) },
      ]
    )
  }


  const handleOpenCamera = async () =>{
    try {
      const { granted } = await requestPermission()
      if (!granted) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera")
      }
      qrLock.current = false
      setIsVisibleCameraModal(true)
    } catch (error) {
      console.log(error)
      Alert.alert("Câmera", "Não foi possível utilizar a câmera")
    }
  }


  useEffect(() => {
    fetchMarket()
  }, [params.id, coupons])
  
  if (isLoading) {
    return <Loading />
  }
  
  if (!data) {
    return <Redirect href="/home" />
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover uri={data.cover} />
        <Details data={data} />
        {coupons && <Coupon code={coupons} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            console.log('data', data);
            if (data && !qrLock.current) {
              qrLock.current = true
              setTimeout(() => handleUseCoupons(data), 500)
            }
          }}
        />

        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}