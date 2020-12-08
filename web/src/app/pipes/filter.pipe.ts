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
  transform(items: any[], searchText: string) {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase(); 

    for (const el of items) {
      if (el.name && el.category && el.description) {
        return items.filter(val => 
          val.name.toLocaleLowerCase().indexOf(searchText) >= 0
          || val.category.toLocaleLowerCase().indexOf(searchText) >= 0
          || val.description.toLocaleLowerCase().indexOf(searchText) >= 0
        );
      } else if (el.name && el.category) {
        return items.filter(val => 
          val.name.toLocaleLowerCase().indexOf(searchText) >= 0
          || val.category.toLocaleLowerCase().indexOf(searchText) >= 0
        );
      } else if (el.name) {
        return items.filter(val => 
          val.name.toLocaleLowerCase().indexOf(searchText) >= 0
        );
      } 
    }
    
  }
}