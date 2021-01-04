import { Model } from '@vuex-orm/core'

export default class ProductItems extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'product_items'

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields () {
        return {
            id: this.attr(null),
            name: this.attr(''),
            barcode: this.attr(''),
            customCode: this.attr(''),
            selected: this.boolean(false),
            categoryId: this.attr(''),
            image: this.attr(''),
            price: this.attr(''),
            type: this.attr(''),
            totalAmountCount: this.number(0),
            childs: this.attr(''),
        }
    }
}