import { Button, Flex, Text, Heading, View, ScrollView } from "native-base";
import React, { useState } from "react";
import { secsToTime, timetoSec } from "../lib/time";
import TimeModal from "./TimeModal";
import { stepEntry } from "../types";

export default function Step({
  name,
  time,
  key,
  bg,
  allowEditMode = false,
  onDelete,
  onEdit,
}: {
  name: string;
  time: number;
  key?: string;
  bg?: string;
  allowEditMode?: boolean;
  onDelete: Function;

  onEdit: Function;
}) {
  const [editMode, setEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const onEditStep = ({ minutes, seconds, name }: stepEntry) => {
    const time = timetoSec(minutes, seconds);
    setEditMode(false);
    onEdit({ name, time });
  };

  const renderContent = () => {
    if (editMode) {
      return (
        <Flex
          w="230"
          alignContent="center"
          justifyContent="center"
          direction="row"
        >
          <Button
            marginX="2"
            onPress={() => setShowEditModal(true)}
            colorScheme="primary"
          >
            Edit
          </Button>
          {onDelete && (
            <Button marginX="2" colorScheme="danger" onPress={() => onDelete()}>
              Delete
            </Button>
          )}
          {onEdit && (
            <Button
              marginX="2"
              colorScheme="dark"
              onPress={() => setEditMode(false)}
            >
              Cancel
            </Button>
          )}
        </Flex>
      );
    }
    return (
      <Flex
        w="230"
        alignContent="center"
        justifyContent="space-between"
        direction="row"
      >
        <Text>{name}</Text>
        <Text>{secsToTime(time)}</Text>
      </Flex>
    );
  };

  return (
    <Button
      key={key}
      w="64"
      bg={name === "Pause" || editMode ? "muted.200" : "info.200"}
      rounded="md"
      shadow={editMode ? undefined : 3}
      isDisabled={name === "Pause"}
      onPress={() => {
        if (allowEditMode) setEditMode(true);
      }}
    >
      {renderContent()}
      <TimeModal
        title="Edit step"
        time={time}
        name={name}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={onEditStep}
      />
    </Button>
  );
}
