import { ITable } from './data';

export function formatTable(table: ITable): void {
  const numberOfColumns = table[0].length;

  for (const row of table) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (row[column] === undefined) row[column] = null;
    }
  }
}

export function addColumn(value: string, table: ITable): void {
  table[0].push(value);
}

export function addRow(value: string, table: ITable): void {
  table.push([value]);
}

export function isActivityInTable(activity: string, table: ITable): boolean {
  return table[0].indexOf(activity) !== -1;
}

export function isUserInTable(user: string, table: ITable): boolean {
  for (const [rowNumber, row] of table.entries()) {
    if (rowNumber !== 0) {
      if (row[0] === user) {
        return true;
      }
    }
  }
  return false;
}

export function getIndexActivity(activity: string, table: ITable): number {
  return table[0].indexOf(activity);
}

export function getIndexUser(user: string, table: ITable): number {
  for (const [rowNumber, row] of table.entries()) {
    if (rowNumber !== 0) {
      if (row[0] === user) {
        return rowNumber;
      }
    }
  }
  return -1;
}
