import { StyleSheet } from "react-native";

import {
  VStack,
  Input,
  Text,
  Center,
  Modal,
  Heading,
  View,
  ScrollView,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Button, Box } from "native-base";
import { RootTabScreenProps } from "../types";
import { Formik } from "formik";
import { getSequence } from "../api/storage";


export default function Create({ navigation, route }: RootTabScreenProps<"Run">) {
  const [steps, setSteps] = useState<Array<any>>([]);
  const {sequenceName, sequenceId } = route.params


  useEffect(()=>{
    async function retreiveSequence() {
      const seq = await getSequence(sequenceId)
      console.log(seq)
      setSteps(seq)
    }    
    retreiveSequence()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Center>
          <Heading
            size="xl"
            w="64"
            marginTop="4"
            marginBottom="6"
          >
            {sequenceName}
          </Heading>
        </Center>
      </View>
      <ScrollView>
        <VStack space={3} alignItems="center">
          {steps.map((step) => (
            <Box
            key={`${step.step_name.replace(' ','_')}_${step.time}`}
              w="64"
              colorScheme="secondary"
              rounded="md"
              shadow={3}
            >{`${step.step_name} - ${step.time}`}</Box>
          ))}
        </VStack>
      </ScrollView>
      <View>
        <Heading textAlign="center" mb="10">
          <Button
            w="64"
            h="10"
            marginTop="3"
            onPress={() => {}}
            rounded="md"
            shadow={3}
          >
            Start
          </Button>
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
