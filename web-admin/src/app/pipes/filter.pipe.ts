import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(val => 
      val.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
      || val.category.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
      || val.description.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
    );
  }
}