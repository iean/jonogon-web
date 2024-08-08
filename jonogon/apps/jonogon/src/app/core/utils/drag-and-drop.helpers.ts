import { moveItemInArray } from '@angular/cdk/drag-drop';
import { WritableSignal } from '@angular/core';

export function moveItemInSignalArray(
  array: WritableSignal<unknown[]>,
  fromIndex: number,
  toIndex: number
) {
  const arrayValue = array();
  moveItemInArray(arrayValue, fromIndex, toIndex);
  array.update(() => [...arrayValue]);
}
