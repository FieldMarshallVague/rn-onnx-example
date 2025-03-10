import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
  Text,
} from "react-native";

import { icons } from "../constants";

type DownloadButtonProps = TouchableOpacityProps;

export function DownloadButton({
  children,
  className,
  ...props
}: DownloadButtonProps) {
  return (
    <TouchableOpacity
      className={`
        flex flex-row items-center justify-between space-x-4
        w-full h-16 px-4 bg-primary rounded-2xl
        border-2 border-secondary
        ${className}
      `}
      {...props}
    >
      <Text className="text-white text-xl font-bold">Download</Text>
      <Image
        source={icons.upload}
        className="w-8 h-8 rotate-180"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
