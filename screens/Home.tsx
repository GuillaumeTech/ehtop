import { StyleSheet } from "react-native";
import { VStack, Center, Heading, View, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { Button } from "native-base";
import { RootTabScreenProps } from "../types";
import { getSequences } from "../api/storage";
import { useIsFocused } from "@react-navigation/native";
export default function Home({ navigation }: RootTabScreenProps<"Home">) {
  const [sequences, setSequences] = useState<Array<any>>([]);
  const isFocused = useIsFocused(); //forces re-fetch when comming back to this page
  useEffect(() => {
    async function retreiveSequences() {
      const seq = await getSequences();
      setSequences(seq);
    }
    retreiveSequences();
  }, [isFocused]);

  return (
    <Center style={{ flex: 1 }}>
      <View>
        <Heading mt="5" mb="5">
          Your sequences
        </Heading>
      </View>
      <ScrollView style={{ flex: 0.9 }}>
        <VStack space={4} alignItems="center">
          {sequences.map((sequence) => (
            <Button
              w="64"
              h="10"
              bg="emerald.500"
              onPress={() =>
                navigation.navigate("Run", {
                  sequenceName: sequence.name,
                  sequenceId: sequence.id,
                })
              }
              key={sequence.name.replace(" ", "-")}
              rounded="md"
              shadow={3}
            >
              {sequence.name}
            </Button>
          ))}
          
        </VStack>
      </ScrollView>
      <Button
        w="64"
        h="15"
        style={{ flex: 0.1 }}
        marginBottom="6"
        marginTop="3"
        bg="primary.500"
        onPress={() => navigation.navigate("Create")}
        rounded="md"
        shadow={3}
      >
        Add
      </Button>
    </Center>
  );
}

