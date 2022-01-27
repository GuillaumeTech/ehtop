
   
import { ManyToOne, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './sequenceModel';


@Entity('steps')
export class Step {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  time: number;

  @ManyToOne(() => Sequence, sequence => sequence.steps)
  sequence: Sequence;
}