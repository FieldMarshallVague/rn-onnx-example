import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

type SearchInputProps = {
  initialQuery?: string;
  reload: () => void;
};

export function SearchInput({ initialQuery, reload }: SearchInputProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View
      className="
        flex flex-row items-center space-x-4
        w-full h-16 px-4 bg-black-100 rounded-2xl
        border-2 border-black-200 focus:border-secondary"
    >
      <TextInput
        className="
          text-base mt-0.5 py-4 -ml-4 pl-4 text-white flex-1 font-pregular
        "
        value={query}
        placeholder="Search for a game"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            return Alert.alert(
              "Missing Query",
              "Please enter the name of a game to search for"
            );
          }

          if (pathname.startsWith(`/search/${query}`)) {
            reload();
          } else if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
        className="p-4 -mr-4"
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
