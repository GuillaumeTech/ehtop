import { StyleSheet } from "react-native";
import { VStack, Center, Heading, View, ScrollView } from "native-base";
import React from "react";
import { Button } from "native-base";
import { RootTabScreenProps } from "../types";

export default function Home({ navigation }: RootTabScreenProps<"Home">) {
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Heading textAlign="center" mb="10">
          VStack
        </Heading>
      </View>
      <ScrollView>
        <VStack space={4} alignItems="center">
          <Button
            w="64"
            h="20"
            bg="emerald.500"
            onPress={() => navigation.push("Run")}
            rounded="md"
            shadow={3}
          />
          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />
          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />
          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />

          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />
          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />
          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />
          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />
          <Button w="64" h="20" bg="emerald.500" rounded="md" shadow={3} />
        </VStack>
      </ScrollView>
      <View>
        <Heading textAlign="center" mb="10">
          <Button
            w="64"
            h="20"
            marginTop="3"
            bg="primary.500"
            onPress={() => navigation.push("Create")}
            rounded="md"
            shadow={3}
          />
        </Heading>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
