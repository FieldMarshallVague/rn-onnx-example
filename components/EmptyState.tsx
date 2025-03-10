import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import { CustomButton } from "./CustomButton";

type EmptyStateProps = {
  title: string;
  subtitle: string;
};

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      <CustomButton
        onPress={() => router.push("/home")}
        className="w-full my-5"
      >
        <Text className={`text-primary font-psemibold text-lg`}>
          Back to Explore
        </Text>
      </CustomButton>
    </View>
  );
}
