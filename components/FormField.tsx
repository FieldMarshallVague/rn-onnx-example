import React, { forwardRef, useState } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

type FormFieldProps = {
  title: string;
  className: string;
} & TextInputProps;

export const FormField = forwardRef<TextInput, FormFieldProps>(
  (
    { title, className, ...props }: FormFieldProps,
    ref?: React.LegacyRef<TextInput>
  ) => {
    return (
      <View className={`space-y-2 ${className}`}>
        <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

        <View
          className="
            w-full h-16 px-4 bg-black-100 rounded-2xl
            border-2 border-black-200 focus:border-secondary
            flex flex-row items-center
          "
        >
          <TextInput
            ref={ref}
            className="flex-1 py-4 text-white font-psemibold text-base"
            placeholderTextColor="#7B7B8B"
            {...props}
          />
        </View>
      </View>
    );
  }
);
