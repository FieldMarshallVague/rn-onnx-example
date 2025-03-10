import { SafeAreaView, Text, View } from "react-native";
import React from "react";
import { Link, Redirect, router } from "expo-router";
import { CustomButton } from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalContext";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex justify-center items-center h-full px-4">
        <CustomButton
          onPress={() => {
            router.push("/isolated-test");
          }}
          className="w-full mt-7"
        >
          <Text className={`text-primary font-psemibold text-lg`}>
            Isolated Test
          </Text>
        </CustomButton>
        <CustomButton
          onPress={() => {
            router.push("/simple-onnx-test-js-thread");
          }}
          className="w-full mt-7"
        >
          <Text className={`text-primary font-psemibold text-lg`}>
            Simple ONNX Test (JS Thread)
          </Text>
        </CustomButton>
        <CustomButton
          onPress={() => {
            router.push("/simple-onnx-test-inline");
          }}
          className="w-full mt-7"
        >
          <Text className={`text-primary font-psemibold text-lg`}>
            Simple ONNX Test (Inline)
          </Text>
        </CustomButton>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
