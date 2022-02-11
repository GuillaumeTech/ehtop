import { MigrationInterface, QueryRunner } from "typeorm";

export class initDb1643253902447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `create table if not exists sequences(id integer primary key not null, name text, created_at integer);`
    );
    await queryRunner.query(
      `create table if not exists steps(id integer primary key not null, name text, time integer, position integer, sequenceId integer, FOREIGN KEY(sequenceId) REFERENCES sequences(id));`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table if exists steps;`);
    await queryRunner.query(`drop table if exists sequences;`);
  }
}
