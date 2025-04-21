import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNonZeroCounts'
})
export class FilterNonZeroCountsPipe implements PipeTransform {
  transform(items: any[] | null | undefined): any[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items.filter(item => {
      if (!item) return false;

      const subExpertiseCount = item?.subExpertiseCount || item?.count || 0;
      const totalSupplierCount = item?.totalSupplierCount || 0;
      const activeSupplierCount = item?.activeSupplierCount || 0;

      // Return true if at least one count is non-zero
      return subExpertiseCount > 0 || totalSupplierCount > 0 || activeSupplierCount > 0;
    });
  }
}
