import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator } from "react-native";
import { Connection, createConnection } from "typeorm";

import { Sequence } from "../../db/sequenceModel";
import { Step } from "../../db/stepModel";
import { StepOjb } from "../../types";

import { initDb1643253902447 } from "../../db/migrations/1643253902447-init-db";

// interface DatabaseConnectionContextData {
//   todosRepository: TodosRepository;
// }

export type StorageContext = {
  refreshSequences: () => void;
  sequences: [Sequence] | [];
  updateSequence: (id: string, sequence: Sequence) => void;
  deleteSequence: (id: string) => void;
  addSequence: (name: string, steps: StepOjb[]) => void;
  getSequence: (id: string) => Promise<Sequence | undefined>;
};

export const StorageContext = createContext<StorageContext>({
  sequences: [],
  updateSequence: () => undefined,
  deleteSequence: () => undefined,
  addSequence: () => undefined,
  refreshSequences: () => undefined,
  getSequence: () => undefined,
});

export const StorageContextProvider: React.FC = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [sequences, setSequences] = useState<[Sequence] | []>([]);

  const connect = useCallback(async () => {
    const createdConnection = await createConnection({
      type: "expo",
      database: "ehtop3.db",
      driver: require("expo-sqlite"),
      entities: [Step, Sequence],
      migrations: [initDb1643253902447],
      migrationsRun: true,
      synchronize: false,
      logging: ["query", "errors"],
    });

    setConnection(createdConnection);
  }, []);

  useEffect(() => {
    if (!connection) {
      connect();
    }
    if (connection) {
      refreshSequences;
    }
  }, [connect, connection]);

  if (!connection) {
    return <ActivityIndicator />;
  }

  const refreshSequences = async () => {
    const newSequences = (await getSequences()) || [];
    setSequences(newSequences);
  };

  async function getSequences() {
    try {
      // const entityManager = connection?.manager;

      const result = await connection
        ?.createQueryBuilder(Sequence, "sequence")
        .leftJoinAndSelect("sequence.steps", "step")
        .orderBy("sequence.created_at")
        .addOrderBy("step.position")
        .getMany();
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async function getSequence(id: string) {
    try {
      const entityManager = connection?.manager;
      return await entityManager?.findOne(Sequence, {
        where: { id: id },
        relations: ["steps"],
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteSequence(id: string) {
    try {
      const entityManager = connection?.manager;
      await entityManager?.delete(Sequence, { id: id });
      refreshSequences();
    } catch (e) {
      console.log(e);
    }
  }

  async function updateSequence(id: string) {
    try {
      throw new Error("not implemented");
      refreshSequences();
    } catch (e) {
      console.log(e);
    }
  }

  async function addSequence(name: string, steps: StepOjb[]) {
    try {
      const entityManager = connection?.manager;

      const stepsObjs = await Promise.all(
        steps.map(async (step, index) => {
          const stepObj = entityManager?.create(Step, {
            ...step,
            position: index,
          });
          await entityManager?.save(stepObj);
          return stepObj;
        })
      );

      const sequenceObj = entityManager?.create(Sequence, {
        name,
        steps: stepsObjs,
        created_at: Math.floor(Date.now() / 1000), // unix timestamp
      });
      await entityManager?.save(sequenceObj);
      refreshSequences();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <StorageContext.Provider
      value={{
        sequences,
        updateSequence,
        deleteSequence,
        addSequence,
        refreshSequences,
        getSequence,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};
