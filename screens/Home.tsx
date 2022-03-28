import { StyleSheet } from "react-native";
import {
  VStack,
  Center,
  Heading,
  View,
  ScrollView,
  Flex,
  Text,
  HStack,
  Pressable,
  Spacer,
} from "native-base";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "native-base";
import { RootTabScreenProps } from "../types";
// import { getSequences } from "../api/storage";
import { secsToTime } from "../lib/time";
import { useIsFocused } from "@react-navigation/native";
import { StorageContext } from "../components/contexts/StorageContext";
import { Step } from "../db/stepModel";
import AppLoading from "expo-app-loading";
import { chunk } from "lodash";
export default function Home({ navigation }: RootTabScreenProps<"Home">) {
  const { sequences, refreshSequences, ready } = useContext(StorageContext);
  const isFocused = useIsFocused(); //forces re-fetch when comming back to this page

  useEffect(() => {
    refreshSequences(); // maybe not that usefull to investigate later on
  }, [isFocused]);

  function getTotalTime(steps: [Step]) {
    // seems a bit painfull to do in sql with type orm as it would lose the object mapping i guess
    // update: actually it would not so this is a
    // TO-DO
    return steps.reduce((sum, step) => sum + step.time, 0);
  }
  if (!ready) {
    return <AppLoading />;
  }
  return (
    <View bg="light.400" style={{ flex: 1 }}>
      <View>
        <Heading color='purple.400'mx="7" my="5">
          KRONOMETERS
        </Heading>
      </View>
      <ScrollView style={{ flex: 0.9 }}>
        <VStack space={6} alignItems="center">
          {chunk(sequences, 2).map((sequencesChunk, index) => (
            <HStack space={6} justifyContent="center">
              {sequencesChunk.map((sequence, chunkIndex) => (
                <Pressable
                  w="150px"
                  h="100px"
                  bg="purple.400"
                  onPress={() =>
                    navigation.navigate("Run", {
                      sequenceName: sequence.name,
                      sequenceId: sequence.id,
                      sequenceIndex: index+chunkIndex,
                    })
                  }
                  key={sequence.name.replace(" ", "-")}
                  rounded="xl"
                  shadow={4}
                >
                  <Flex
                    //  bg="green.400"
                    justify="space-between"
                    direction="column"
                    mx="3"
                    my="3"
                    h="80px"
                  >
                    <Text bold color="light">
                      {sequence.name}
                    </Text>
                    <Flex direction="row">
                      <Spacer />
                      <Text bold color="accent.400">
                        {sequence.steps.length} steps
                      </Text>
                      <Text color="light">
                        {" "}
                        {secsToTime(getTotalTime(sequence.steps))}
                      </Text>
                    </Flex>
                  </Flex>
                </Pressable>
              ))}
            </HStack>
          ))}
        </VStack>
      </ScrollView>
      <Flex style={{ flex: 0.25 }} direction="row">
        <Spacer />
        <Button
          h="80px"
          w="80px"
          marginBottom="6"
          marginRight="6"
          colorScheme="accent"
          onPress={() => navigation.navigate("Create")}
          rounded="lg"
          variant="outline"
          _text={{ fontSize:"3xl"}}
        >
        +
        </Button>
      </Flex>
    </View>
  );
}
