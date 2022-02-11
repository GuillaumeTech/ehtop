import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Step } from "./stepModel";

// create table if not exists steps(id integer primary key not null, name text, time integer, sequence_id text, FOREIGN KEY(sequence_id) REFERENCES sequences(id));`
@Entity("sequences")
export class Sequence {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  created_at: number;

  @OneToMany((type) => Step, (step) => step.sequence)
  steps: Step[];
}
