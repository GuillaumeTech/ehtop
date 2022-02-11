import { StyleSheet } from "react-native";
import {
  VStack,
  Center,
  Heading,
  View,
  ScrollView,
  Flex,
  Text,
} from "native-base";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "native-base";
import { RootTabScreenProps } from "../types";
// import { getSequences } from "../api/storage";
import { secsToTime } from "../lib/time";
import { useIsFocused } from "@react-navigation/native";
import { StorageContext } from "../components/contexts/StorageContext";
import { Step } from "../db/stepModel";

export default function Home({ navigation }: RootTabScreenProps<"Home">) {
  const { sequences, refreshSequences } = useContext(StorageContext);
  const isFocused = useIsFocused(); //forces re-fetch when comming back to this page

  useEffect(() => {
    refreshSequences(); // maybe not that usefull to investigate later on
  }, [isFocused]);

  function getTotalTime(steps: [Step]) {
    // seems a bit painfull to do in sql with type orm as it would lose the object mapping i guess
    return steps.reduce((sum, step) => sum + step.time, 0);
  }

  return (
    <Center style={{ flex: 1 }}>
      <View>
        <Heading mt="5" mb="5">
          Your sequences
        </Heading>
      </View>
      <ScrollView style={{ flex: 0.9 }}>
        <VStack space={4} alignItems="center">
          {sequences.map((sequence, index) => (
            <Button
              w="64"
              h="10"
              bg="emerald.500"
              onPress={() =>
                navigation.navigate("Run", {
                  sequenceName: sequence.name,
                  sequenceId: sequence.id,
                  sequenceIndex: index,
                })
              }
              key={sequence.name.replace(" ", "-")}
              rounded="md"
              shadow={3}
            >
              <Flex
                w="230"
                alignContent="center"
                justifyContent="space-between"
                direction="row"
              >
                <Text bold color="white">
                  {sequence.name}
                </Text>
                <Text color="white">
                  {" "}
                  {secsToTime(getTotalTime(sequence.steps))}
                </Text>
              </Flex>
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
