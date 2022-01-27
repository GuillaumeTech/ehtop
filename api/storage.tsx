import * as SQLite from "expo-sqlite";
import { v4 as uuidv4 } from "uuid";
import { Platform } from "react-native";
import {Step} from "../db/stepModel";
import {Sequence} from "../db/sequenceModel";
import {StepOjb} from '../types'
import {getManager} from "typeorm";

// function openDatabase() {
//     if (Platform.OS === "web") {
//       return {
//         transaction: () => {
//           return {
//             executeSql: () => {},
//           };
//         },
//       };
//     }

//   const db = SQLite.openDatabase("db.ehtop");
//   return db;
// }

// async function transactionWrapper(query: string, vars: Array<string>) {
//   return new Promise((resolve, reject) => {
//     db.transaction(
//       (tx) => {
//         tx.executeSql(query, vars, (_, { rows: { _array } }) => {
//           resolve(_array);
//         });
//       },
//       (e) => reject(e)
//     );
//   });
// }

// function initDB() {
//     db.transaction((tx) => {
//     //   tx.executeSql(
//     //     'drop table if exists sequences;'
//     //   );
//       tx.executeSql(
//         `create table if not exists sequences(id text primary key not null, name text);`
//       );
//       tx.executeSql(
//         `create table if not exists steps(id integer primary key not null, name text, time integer, sequence_id text, FOREIGN KEY(sequence_id) REFERENCES sequences(id));`
//       );
//     }, (e)=>console.log('wsh',e));
// }

// const db = openDatabase();
// initDB();

export async function getSequences() {
  try {
    const entityManager = getManager()
    return await entityManager.find(Sequence, { relations: ["steps"] });

    // return await transactionWrapper( `select sequences.name as name, sequences.id as id, SUM(steps.time) as total from sequences INNER JOIN steps 
    // ON sequences.id = steps.sequence_id GROUP BY sequences.id`, [])
  } catch (e) {
    console.log(e);
  }
}

export async function getSequence(id: string) {
  try {

    const entityManager = getManager()
    return await entityManager.find(Sequence, { where: { id: id}, relations: ["steps"] });
    // return  transactionWrapper( `select steps.name as name, sequences.name as sequence_name, steps.time as time from sequences INNER JOIN steps 
    // ON sequences.id = steps.sequence_id where steps.sequence_id = ?`, [id])
  } catch (e) {
    console.log(e);
  }
}


export async function deleteSequence(id: string) {
  try {
    return  transactionWrapper( `DELETE FROM sequences WHERE id = ?`, [id])
  } catch (e) {
    console.log(e);
  }
}

export async function  addSequence(name: string, steps: StepOjb[]) {
  try {

    const entityManager = getManager()
    
    const stepsObjs = await Promise.all(steps.map(async step => {
      const stepObj = entityManager.create(Step, step);
      await entityManager.save(stepObj);
      return stepObj
    }))


    const sequenceObj = entityManager.create(Sequence, {name, steps:stepsObjs});
    await entityManager.save(sequenceObj);

    // const sequence_id = uuidv4();
    // db.transaction(
    //   (tx) => {
    //     tx.executeSql( `INSERT INTO sequences (name, id)
    //     VALUES
    //         (?, ?);`, [
    //             name,
    //             sequence_id])
    //     tx.executeSql(`INSERT INTO steps (name, time, sequence_id)
    //     VALUES ${"(?,?,?), ".repeat(steps.length - 1)} (?,?,?);`, steps.reduce(
    //         (previous, step) => ([
    //             ...previous,
    //             step.name,
    //             step.time,
    //             sequence_id,
    //           ]),
    //         []))
    //   },
    //   (e) => console.log("mais", e)
    // );
  } catch (e) {
    console.log(e);
  }
}
