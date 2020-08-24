import assert from 'assert';
import {
  addColumn,
  addRow,
  isActivityInTable,
  formatTable,
  isUserInTable,
  getIndexActivity,
  getIndexUser,
} from '../../src/utils/table';
import { ITable } from '../../src/utils/data';
describe('tests functions from table.ts', () => {
  describe('tests addColumn function', () => {
    it('tests if addColumn adds user if table is clear', () => {
      const element = 'element';
      const table: ITable = [[]];
      addColumn(element, table);

      assert.equal(table[0][0], element);
    });
    it('tests if addColumn adds user if there is already a element in the row', () => {
      const element = 'element';
      const table: ITable = [[null]];
      addColumn(element, table);

      assert.equal(table[0][1], element);
    });
  });
  describe('tests addRow function', () => {
    it('tests if addRow adds user if there is no element', () => {
      const element = 'element';
      const table: ITable = [];
      addRow(element, table);

      assert.equal(table[0][0], element);
    });
    it('tests if addRow adds user if there are already elements', () => {
      const element = 'element';
      const table: ITable = [[null], [null], [element], [null]];
      addRow(element, table);

      assert.equal(table[2][0], element);
    });
  });
  describe('tests formatTable function', () => {
    it('tests if it formats the table', () => {
      const element = 'element';
      const table: ITable = [[null, null, null, null, null], [], [], []];
      const expectedTable: ITable = [
        [null, null, null, null, null],
        ['element', null, null, null, null],
        [null, null, 'element', null, null],
        [null, null, null, null, 'element'],
      ];

      table[1][0] = element;
      table[2][2] = element;
      table[3][4] = element;

      formatTable(table);

      assert.deepEqual(table, expectedTable);
    });
  });
  describe('tests isActivityInTable function', () => {
    it('tests if the element:activity is in table', () => {
      const element = 'element';
      const table: ITable = [[null, null, element, null]];

      assert.equal(isActivityInTable(element, table), true);
    });
  });
  describe('tests isUserInTable function', () => {
    it('tests if the element:user is in table', () => {
      const element = 'element';
      const table: ITable = [[null], [null], [element], [null]];

      assert.equal(isUserInTable(element, table), true);
    });
  });
  describe('tests getIndexActivity function', () => {
    it('tests if it returns the index of the element:activity', () => {
      const element = 'element';
      const table: ITable = [[null, null, element, null]];

      assert.equal(getIndexActivity(element, table), 2);
    });
    it('tests if the element:activity is not in the table', () => {
      const element = 'element';
      const table: ITable = [[null, null, null, null]];

      assert.equal(getIndexActivity(element, table), -1);
    });
  });
  describe('tests getIndexUser function', () => {
    it('tests if it returns the index of the element:user', () => {
      const element = 'element';
      const table: ITable = [[null], [null], [element], [null]];

      assert.equal(getIndexUser(element, table), 2);
    });
    it('tests if the element:user is not in the table', () => {
      const element = 'element';
      const table: ITable = [[null], [null], [null], [null]];

      assert.equal(getIndexActivity(element, table), -1);
    });
  });
});
